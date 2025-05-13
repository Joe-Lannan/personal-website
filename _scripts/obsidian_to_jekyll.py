#!/usr/bin/env python3
"""
Obsidian to Jekyll Converter for Knowledge Maps

This script processes Obsidian markdown files and extracts:
1. The markdown content
2. YAML frontmatter
3. Links between notes to create a graph visualization
4. Image references

It then generates Jekyll-compatible markdown files for the _knowledgemap collection
and prepares graph data for visualization.

Usage:
    python obsidian_to_jekyll.py --vault /path/to/obsidian/vault --output ../personal-website/_knowledgemap
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
import networkx as nx
from PIL import Image, ImageDraw

# Regular expressions
YAML_PATTERN = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)
WIKILINK_PATTERN = re.compile(r'\[\[(.*?)(\|(.*?))?\]\]')
IMAGE_PATTERN = re.compile(r'!\[(.*?)\]\((.*?)\)')
TAG_PATTERN = re.compile(r'#([a-zA-Z0-9_-]+)')

def parse_args():
    parser = argparse.ArgumentParser(description='Convert Obsidian vault to Jekyll website format.')
    parser.add_argument('--vault', required=True, help='Path to Obsidian vault directory')
    parser.add_argument('--output', required=True, help='Output directory for Jekyll files')
    parser.add_argument('--image-dir', default='../images/knowledgemaps', help='Directory for storing images')
    parser.add_argument('--filter', default='', help='Only process files containing this string')
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
    return tags

def extract_images(content, source_vault, image_dir):
    """Extract image references and copy images to the output directory"""
    images = []
    for match in IMAGE_PATTERN.finditer(content):
        alt_text = match.group(1)
        image_path = match.group(2)
        
        # Handle relative paths in Obsidian
        if not image_path.startswith(('http://', 'https://')):
            # Remove any URL parameters
            clean_path = image_path.split('#')[0].split('?')[0]
            
            # Find the image in the vault
            source_image = os.path.join(source_vault, clean_path)
            if os.path.exists(source_image):
                # Generate a filename based on original name
                filename = os.path.basename(clean_path)
                
                # Copy the image to the output directory
                os.makedirs(image_dir, exist_ok=True)
                destination = os.path.join(image_dir, filename)
                shutil.copy2(source_image, destination)
                
                # Update path to be relative to Jekyll
                jekyll_path = f"/images/knowledgemaps/{filename}"
                images.append({
                    'alt': alt_text,
                    'src': jekyll_path,
                    'original': image_path
                })
    
    return images

def create_thumbnail(graph_data, output_path, size=(300, 200)):
    """Generate a thumbnail visualization of the knowledge graph"""
    try:
        G = nx.Graph()
        
        # Add nodes and edges
        for node in graph_data['nodes']:
            G.add_node(node['id'], color=node.get('color', '#69b3a2'))
            
        for edge in graph_data['edges']:
            G.add_edge(edge['fromNode'], edge['toNode'])
        
        # Create basic visualization
        img = Image.new('RGB', size, color='white')
        draw = ImageDraw.Draw(img)
        
        # Position nodes (very simple layout)
        positions = {}
        nodes = list(G.nodes())
        width, height = size
        center_x, center_y = width // 2, height // 2
        radius = min(width, height) // 3
        
        for i, node in enumerate(nodes):
            angle = (i / len(nodes)) * 2 * 3.14159
            x = center_x + radius * math.cos(angle)
            y = center_y + radius * math.sin(angle)
            positions[node] = (x, y)
            
            # Draw node
            node_color = G.nodes[node].get('color', '#69b3a2')
            draw.ellipse((x-5, y-5, x+5, y+5), fill=node_color)
        
        # Draw edges
        for u, v in G.edges():
            draw.line([positions[u][0], positions[u][1], positions[v][0], positions[v][1]], 
                     fill='#999999', width=1)
        
        # Save the image
        img.save(output_path)
        return True
    except Exception as e:
        print(f"Failed to create thumbnail: {e}")
        return False

def slugify(text):
    """Convert text to slug format"""
    return re.sub(r'[^a-zA-Z0-9_-]', '-', text.lower()).strip('-')

def process_markdown_file(file_path, vault_path, output_dir, image_dir):
    """Process a single markdown file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Extract frontmatter and content
        frontmatter, md_content = extract_frontmatter(content)
        
        # Extract links, tags, and images
        links = extract_links(md_content)
        tags = extract_tags(md_content)
        images = extract_images(md_content, vault_path, image_dir)
        
        # Generate a slug from the filename
        filename = os.path.basename(file_path)
        name_without_ext = os.path.splitext(filename)[0]
        slug = slugify(name_without_ext)
        
        # Create Jekyll frontmatter
        jekyll_frontmatter = {
            'title': frontmatter.get('title', name_without_ext),
            'date': frontmatter.get('date', datetime.now().strftime('%Y-%m-%d')),
            'collection': 'knowledgemap',
            'excerpt': frontmatter.get('description', ''),
            'categories': frontmatter.get('category', []),
            'tags': list(set(tags + frontmatter.get('tags', []))),
            'interactive_map': True,
        }
        
        # Create graph data for visualization
        nodes = []
        edges = []
        
        # Add the current document as central node
        nodes.append({
            'id': slug,
            'display': jekyll_frontmatter['title'],
            'size': 12,
            'color': '#4285f4',
            'tooltip': jekyll_frontmatter['title']
        })
        
        # Add linked documents as nodes
        for i, link in enumerate(links):
            link_id = slugify(link['target'])
            nodes.append({
                'id': link_id,
                'display': link['display'],
                'size': 8,
                'color': '#69b3a2',
                'tooltip': link['display']
            })
            
            # Add edge between current doc and linked doc
            edges.append({
                'fromNode': slug,
                'toNode': link_id,
                'weight': 2
            })
        
        jekyll_frontmatter['map_data'] = {
            'nodes': nodes,
            'edges': edges
        }
        
        # Generate thumbnail for the knowledge map
        thumbnail_name = f"{slug}-thumb.jpg"
        thumbnail_path = os.path.join(image_dir, thumbnail_name)
        thumbnail_success = create_thumbnail(jekyll_frontmatter['map_data'], thumbnail_path)
        
        if thumbnail_success:
            jekyll_frontmatter['thumbnail'] = thumbnail_name
        
        # Create Jekyll file content
        jekyll_content = f"---\n{yaml.dump(jekyll_frontmatter)}---\n\n{md_content}"
        
        # Fix wikilinks to use Jekyll links
        jekyll_content = WIKILINK_PATTERN.sub(
            lambda m: f"[{m.group(3) if m.group(3) else m.group(1)}](/knowledgemap/{slugify(m.group(1))})", 
            jekyll_content
        )
        
        # Fix image paths
        for image in images:
            jekyll_content = jekyll_content.replace(
                f"![]({image['original']})", 
                f"![{image['alt']}]({image['src']})"
            )
        
        # Write output file
        output_file = os.path.join(output_dir, f"{slug}.md")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(jekyll_content)
        
        return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def process_vault(args):
    """Process the entire Obsidian vault"""
    vault_path = os.path.abspath(args.vault)
    output_dir = os.path.abspath(args.output)
    image_dir = os.path.abspath(args.image_dir)
    
    # Create output directories if they don't exist
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(image_dir, exist_ok=True)
    
    # Find all markdown files in the vault
    markdown_files = []
    for root, _, files in os.walk(vault_path):
        for file in files:
            if file.endswith(('.md', '.markdown')) and (not args.filter or args.filter in file):
                markdown_files.append(os.path.join(root, file))
    
    print(f"Found {len(markdown_files)} markdown files in the vault")
    
    # Process each file
    successful = 0
    for file_path in markdown_files:
        rel_path = os.path.relpath(file_path, vault_path)
        print(f"Processing {rel_path}...", end='')
        result = process_markdown_file(file_path, vault_path, output_dir, image_dir)
        print(" ✅ Done" if result else " ❌ Failed")
        if result:
            successful += 1
    
    print(f"Processed {successful}/{len(markdown_files)} files successfully")

if __name__ == "__main__":
    args = parse_args()
    process_vault(args)