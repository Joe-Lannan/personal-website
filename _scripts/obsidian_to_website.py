#!/usr/bin/env python3
"""
Obsidian Vault to Website Converter

This script:
1. Imports markdown files from an Obsidian vault to the _blog directory
2. Preserves directory structure from the vault
3. Extracts links between notes to create a knowledge map visualization
4. Generates JSON data for D3.js visualization of the knowledge graph

Usage:
    python obsidian_to_website.py --vault /path/to/obsidian/vault --output ../personal-website/_blog
"""

import os
import sys
import re
import json
import yaml
import shutil
import argparse
from datetime import datetime
from pathlib import Path
from collections import defaultdict
import hashlib

# Regular expressions
YAML_PATTERN = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)
WIKILINK_PATTERN = re.compile(r'\[\[(.*?)(\|(.*?))?\]\]')
IMAGE_PATTERN = re.compile(r'!\[(.*?)\]\((.*?)\)')
TAG_PATTERN = re.compile(r'#([a-zA-Z0-9_-]+)')

def parse_args():
    parser = argparse.ArgumentParser(description='Convert Obsidian vault to website with knowledge map visualization.')
    parser.add_argument('--vault', required=True, help='Path to Obsidian vault directory')
    parser.add_argument('--output', required=True, help='Output directory for blog files (_blog)')
    parser.add_argument('--image-dir', default='../images/blog', help='Directory for storing images')
    parser.add_argument('--exclude', default='.obsidian,templates', help='Comma-separated list of directories to exclude')
    parser.add_argument('--graph-output', default='../assets/js/knowledge-graph-data.json', help='Output file for knowledge graph data')
    return parser.parse_args()

def extract_frontmatter(content):
    """Extract YAML frontmatter from markdown content"""
    match = YAML_PATTERN.match(content)
    if match:
        frontmatter_text = match.group(1)
        try:
            frontmatter = yaml.safe_load(frontmatter_text)
            remaining_content = content[match.end():]
        except yaml.YAMLError:
            frontmatter = {}
            remaining_content = content
    else:
        frontmatter = {}
        remaining_content = content
    
    return frontmatter, remaining_content

def extract_links(content):
    """Extract wiki-style links from markdown content"""
    links = []
    for match in WIKILINK_PATTERN.finditer(content):
        target = match.group(1)
        display = match.group(3) if match.group(3) else target
        links.append({'target': target, 'display': display})
    return links

def extract_tags(content):
    """Extract hashtags from markdown content"""
    tags = []
    for match in TAG_PATTERN.finditer(content):
        tags.append(match.group(1))
    return list(set(tags))

def process_images(content, source_vault, image_dir, relative_dir=None):
    """Extract image references and copy images to the output directory"""
    modified_content = content
    for match in IMAGE_PATTERN.finditer(content):
        alt_text = match.group(1)
        image_path = match.group(2)
        
        # Handle relative paths in Obsidian
        if not image_path.startswith(('http://', 'https://')):
            # Remove any URL parameters
            clean_path = image_path.split('#')[0].split('?')[0]
            
            # Try different approaches to find the image
            possible_paths = [
                os.path.join(source_vault, clean_path),  # Absolute path
            ]
            
            # Add path relative to the current file
            if relative_dir:
                possible_paths.append(os.path.join(source_vault, relative_dir, clean_path))
            
            # Find the first existing image
            source_image = None
            for path in possible_paths:
                if os.path.exists(path):
                    source_image = path
                    break
            
            if source_image:
                # Generate a unique filename to avoid collisions
                filename = os.path.basename(clean_path)
                name, ext = os.path.splitext(filename)
                hashed = hashlib.md5(image_path.encode()).hexdigest()[:8]
                unique_filename = f"{name}-{hashed}{ext}"
                
                # Copy the image to the output directory
                os.makedirs(image_dir, exist_ok=True)
                destination = os.path.join(image_dir, unique_filename)
                shutil.copy2(source_image, destination)
                
                # Update path to be relative to Jekyll
                jekyll_path = f"/images/blog/{unique_filename}"
                
                # Replace the old path with the new one in the content
                old_img_ref = f"![{alt_text}]({image_path})"
                new_img_ref = f"![{alt_text}]({jekyll_path})"
                modified_content = modified_content.replace(old_img_ref, new_img_ref)
    
    return modified_content

def slugify(text):
    """Convert text to slug format"""
    return re.sub(r'[^a-zA-Z0-9_-]', '-', text.lower()).strip('-')

def process_markdown_file(file_path, vault_path, output_dir, image_dir, link_graph):
    """Process a single markdown file and update the link graph"""
    try:
        # Determine relative path from vault root
        rel_path = os.path.relpath(file_path, vault_path)
        rel_dir = os.path.dirname(rel_path)
        
        # Generate unique file ID based on path
        file_id = rel_path.replace('\\', '/').replace('.md', '')
        
        # Extract filename without extension for the title
        filename = os.path.basename(file_path)
        name_without_ext = os.path.splitext(filename)[0]
        
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Extract frontmatter and content
        frontmatter, md_content = extract_frontmatter(content)
        
        # Extract links and tags
        links = extract_links(md_content)
        tags = extract_tags(md_content) + (frontmatter.get('tags', []) or [])
        
        # Process images and update content
        md_content = process_images(md_content, vault_path, image_dir, rel_dir)
        
        # Update the link graph
        if file_id not in link_graph['nodes']:
            link_graph['nodes'][file_id] = {
                'id': file_id,
                'label': frontmatter.get('title', name_without_ext),
                'tags': tags,
                'path': f"/blog/{rel_dir}/{slugify(name_without_ext)}/" if rel_dir else f"/blog/{slugify(name_without_ext)}/",
                'size': 5,  # Default size
                'color': get_color_for_tags(tags)
            }
        
        # Add links to the graph
        for link in links:
            target_id = link['target']
            
            # Clean up the target ID
            target_id = target_id.split('#')[0]  # Remove any section references
            
            # Skip self-references
            if target_id == file_id:
                continue
            
            # Add link to the graph
            link_key = f"{file_id}--{target_id}"
            if link_key not in link_graph['links']:
                link_graph['links'][link_key] = {
                    'source': file_id,
                    'target': target_id,
                    'value': 1  # Default weight
                }
            else:
                # Increase weight for repeated links
                link_graph['links'][link_key]['value'] += 1
        
        # Create Jekyll frontmatter
        jekyll_frontmatter = {
            'title': frontmatter.get('title', name_without_ext),
            'date': frontmatter.get('date', datetime.now().strftime('%Y-%m-%d')),
            'collection': 'blog',
            'excerpt': frontmatter.get('excerpt', ''),
            'categories': frontmatter.get('categories', []),
            'tags': tags,
            'original_path': rel_path,
            'layout': 'single'
        }
        
        # Convert wikilinks to Jekyll links
        for link in links:
            target = link['target']
            display = link['display']
            
            # Clean up the target
            clean_target = target.split('#')[0]  # Remove any section references
            
            # Create the replacement link
            jekyll_link = f"[{display}](/blog/{clean_target.replace(' ', '-').lower()})"
            
            # Replace in content
            old_link = f"[[{target}]]" if target == display else f"[[{target}|{display}]]"
            md_content = md_content.replace(old_link, jekyll_link)
        
        # Create Jekyll file content
        jekyll_content = f"---\n{yaml.dump(jekyll_frontmatter)}---\n\n{md_content}"
        
        # Create output directory structure
        if rel_dir:
            output_subdir = os.path.join(output_dir, rel_dir)
            os.makedirs(output_subdir, exist_ok=True)
            output_file = os.path.join(output_subdir, filename)
        else:
            output_file = os.path.join(output_dir, filename)
        
        # Write output file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(jekyll_content)
        
        return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def get_color_for_tags(tags):
    """Assign colors based on tags"""
    # Color palette for different categories
    colors = {
        'research': '#4285f4',
        'biophysics': '#ea4335',
        'project': '#fbbc05',
        'note': '#34a853',
        'idea': '#8b3fff',
        'reference': '#ff6d01',
        'personal': '#46bdc6',
        'review': '#fa5387'
    }
    
    # Check if any tags match our predefined categories
    for tag in tags:
        tag_lower = tag.lower()
        for category, color in colors.items():
            if category in tag_lower:
                return color
    
    # Default color
    return '#808080'

def finalize_graph_data(link_graph):
    """Convert the graph data dictionaries to lists for D3.js"""
    # Convert nodes dictionary to list
    nodes_list = list(link_graph['nodes'].values())
    
    # Scale node sizes based on connection count
    connection_counts = defaultdict(int)
    for link in link_graph['links'].values():
        connection_counts[link['source']] += 1
        connection_counts[link['target']] += 1
    
    # Update node sizes
    for node in nodes_list:
        count = connection_counts.get(node['id'], 0)
        node['size'] = 5 + (count * 2)  # Base size + bonus for connections
    
    # Convert links dictionary to list
    links_list = list(link_graph['links'].values())
    
    return {
        'nodes': nodes_list,
        'links': links_list
    }

def process_vault(args):
    """Process the entire Obsidian vault"""
    vault_path = os.path.abspath(args.vault)
    output_dir = os.path.abspath(args.output)
    image_dir = os.path.abspath(args.image_dir)
    graph_output = os.path.abspath(args.graph_output)
    
    # Create output directories if they don't exist
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(image_dir, exist_ok=True)
    os.makedirs(os.path.dirname(graph_output), exist_ok=True)
    
    # Get exclude directories
    exclude_dirs = [d.strip() for d in args.exclude.split(',')]
    
    # Initialize link graph
    link_graph = {
        'nodes': {},
        'links': {}
    }
    
    # Find all markdown files in the vault
    markdown_files = []
    for root, dirs, files in os.walk(vault_path):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file.endswith(('.md', '.markdown')):
                markdown_files.append(os.path.join(root, file))
    
    print(f"Found {len(markdown_files)} markdown files in the vault")
    
    # Process each file
    successful = 0
    for file_path in markdown_files:
        rel_path = os.path.relpath(file_path, vault_path)
        print(f"Processing {rel_path}...", end='', flush=True)
        result = process_markdown_file(file_path, vault_path, output_dir, image_dir, link_graph)
        print(" ✅ Done" if result else " ❌ Failed")
        if result:
            successful += 1
    
    print(f"Processed {successful}/{len(markdown_files)} files successfully")
    
    # Finalize and save the graph data
    final_graph = finalize_graph_data(link_graph)
    with open(graph_output, 'w', encoding='utf-8') as f:
        json.dump(final_graph, f, indent=2)
    
    print(f"Knowledge graph data saved to {graph_output}")
    print(f"Graph contains {len(final_graph['nodes'])} nodes and {len(final_graph['links'])} links")

if __name__ == "__main__":
    args = parse_args()
    process_vault(args)