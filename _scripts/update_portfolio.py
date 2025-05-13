#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import yaml
from datetime import datetime
import re
import shutil

def clean_filename(name):
    """Convert a string to a valid filename by removing special characters"""
    return re.sub(r'[^\w\s-]', '', name).strip().lower().replace(' ', '-')

def update_portfolio_from_github():
    """
    Create portfolio files based on GitHub repositories from _data/repositories.yml
    """
    try:
        # Check if repositories.yml exists
        if not os.path.exists("_data/repositories.yml"):
            print("repositories.yml not found. Skipping portfolio update.")
            return False
            
        # Load repositories data
        with open("_data/repositories.yml", "r", encoding="utf-8") as f:
            repos_data = yaml.safe_load(f)
        
        # Create portfolio directory if it doesn't exist
        os.makedirs("_portfolio", exist_ok=True)
        
        # Process up to 10 featured repositories
        count = 0
        for repo in repos_data.get("repositories", []):
            # Skip repositories without descriptions
            if not repo.get("description"):
                continue
                
            # Only include non-forked repositories with content
            if count >= 10:
                break
                
            # Create a unique filename based on the repository name
            filename = clean_filename(repo["name"])
            filepath = f"_portfolio/github-{filename}.md"
            
            # Create the portfolio file
            with open(filepath, "w", encoding="utf-8") as f:
                f.write("---\n")
                f.write(f"title: \"{repo['name']}\"\n")
                f.write("excerpt: \"GitHub Repository<br/>\"\n")
                f.write("collection: portfolio\n")
                f.write("date: " + repo.get("updated_at", datetime.now().strftime("%Y-%m-%d")) + "\n")
                
                # Add language as tag if available
                if repo.get("language"):
                    f.write(f"tags: [{repo['language'].lower()}]\n")
                elif repo.get("languages") and len(repo.get("languages")) > 0:
                    tags = [lang.lower() for lang in repo["languages"][:3]]
                    f.write(f"tags: [{', '.join(tags)}]\n")
                    
                # Add repository type as category
                categories = []
                for topic in repo.get("topics", []):
                    if topic in ["research", "project", "tool", "education", "library", "demo"]:
                        categories.append(topic)
                if not categories and "physics" in repo["name"].lower():
                    categories.append("research")
                elif not categories:
                    categories.append("project")
                
                f.write(f"categories: [{', '.join(categories)}]\n")
                f.write("---\n\n")
                
                # Write repository description
                f.write(f"# {repo['name']}\n\n")
                f.write(f"{repo['description']}\n\n")
                
                # Add GitHub link
                f.write(f"[View on GitHub]({repo['html_url']})\n\n")
                
                # Add homepage link if available
                if repo.get("homepage"):
                    f.write(f"[Project Website]({repo['homepage']})\n\n")
                
                # Add repository stats
                f.write("## Repository Stats\n\n")
                f.write(f"- **Stars**: {repo['stars']}\n")
                f.write(f"- **Forks**: {repo['forks']}\n")
                f.write(f"- **Primary Language**: {repo.get('language', 'Not specified')}\n")
                
                # Add languages if available
                if repo.get("languages") and len(repo["languages"]) > 1:
                    f.write("- **Languages**: " + ", ".join(repo["languages"]) + "\n")
                
                # Add last updated date
                f.write(f"- **Last Updated**: {repo['updated_at']}\n\n")
                
                # Add topics if available
                if repo.get("topics") and len(repo["topics"]) > 0:
                    f.write("## Topics\n\n")
                    for topic in repo["topics"]:
                        f.write(f"- {topic}\n")
            
            count += 1
            
        print(f"Successfully created {count} portfolio items from GitHub repositories")
        return True
        
    except Exception as e:
        print(f"Error updating portfolio from GitHub: {e}")
        return False

def update_portfolio_from_publications():
    """
    Create portfolio files based on publications from _data/publications.yml
    """
    try:
        # Check if publications.yml exists
        if not os.path.exists("_data/publications.yml"):
            print("publications.yml not found. Skipping portfolio update.")
            return False
            
        # Load publications data
        with open("_data/publications.yml", "r", encoding="utf-8") as f:
            pubs_data = yaml.safe_load(f)
        
        # Create portfolio directory if it doesn't exist
        os.makedirs("_portfolio", exist_ok=True)
        
        # Process publications
        count = 0
        for pub in pubs_data.get("publications", []):
            # Create a unique filename based on the publication title
            filename = clean_filename(pub["title"])[:50]  # Limit length to avoid overly long filenames
            filepath = f"_portfolio/publication-{filename}.md"
            
            # Create the portfolio file
            with open(filepath, "w", encoding="utf-8") as f:
                f.write("---\n")
                f.write(f"title: \"{pub['title']}\"\n")
                f.write(f"excerpt: \"Published in {pub['venue']}<br/>\"\n")
                f.write("collection: portfolio\n")
                f.write(f"date: {pub.get('year', 'Unknown')}-01-01\n")
                f.write("tags: [publication, research]\n")
                f.write("categories: [research]\n")
                f.write("---\n\n")
                
                # Write publication details
                f.write(f"# {pub['title']}\n\n")
                f.write(f"**Authors**: {pub['authors']}\n\n")
                f.write(f"**Published in**: {pub['venue']}\n\n")
                f.write(f"**Year**: {pub.get('year', 'Unknown')}\n\n")
                
                # Add citation count if available
                if pub.get("citations"):
                    f.write(f"**Citations**: {pub['citations']}\n\n")
                
                # Add DOI link if available
                if pub.get("doi"):
                    doi_url = f"https://doi.org/{pub['doi']}" if "doi.org" not in pub['doi'] else pub['doi']
                    f.write(f"**DOI**: [{pub['doi']}]({doi_url})\n\n")
                
                # Add URL if available
                if pub.get("url"):
                    f.write(f"[View Publication]({pub['url']})\n\n")
            
            count += 1
        
        # Process preprints
        for pub in pubs_data.get("preprints", []):
            # Create a unique filename based on the preprint title
            filename = clean_filename(pub["title"])[:50]  # Limit length to avoid overly long filenames
            filepath = f"_portfolio/preprint-{filename}.md"
            
            # Create the portfolio file
            with open(filepath, "w", encoding="utf-8") as f:
                f.write("---\n")
                f.write(f"title: \"{pub['title']}\"\n")
                f.write(f"excerpt: \"Preprint in {pub['venue']}<br/>\"\n")
                f.write("collection: portfolio\n")
                f.write(f"date: {pub.get('year', 'Unknown')}-01-01\n")
                f.write("tags: [preprint, research]\n")
                f.write("categories: [research]\n")
                f.write("---\n\n")
                
                # Write publication details
                f.write(f"# {pub['title']}\n\n")
                f.write(f"**Authors**: {pub['authors']}\n\n")
                f.write(f"**Venue**: {pub['venue']}\n\n")
                f.write(f"**Year**: {pub.get('year', 'Unknown')}\n\n")
                
                # Add DOI link if available
                if pub.get("doi"):
                    doi_url = f"https://doi.org/{pub['doi']}" if "doi.org" not in pub['doi'] else pub['doi']
                    f.write(f"**DOI**: [{pub['doi']}]({doi_url})\n\n")
                
                # Add URL if available
                if pub.get("url"):
                    f.write(f"[View Preprint]({pub['url']})\n\n")
            
            count += 1
            
        print(f"Successfully created {count} portfolio items from publications")
        return True
        
    except Exception as e:
        print(f"Error updating portfolio from publications: {e}")
        return False

if __name__ == "__main__":
    # Create backup of existing portfolio items
    if os.path.exists("_portfolio"):
        backup_dir = f"_portfolio_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        shutil.copytree("_portfolio", backup_dir)
        print(f"Created backup of portfolio items in {backup_dir}")
    
    # Update portfolio from GitHub repositories
    github_updated = update_portfolio_from_github()
    
    # Update portfolio from publications
    pubs_updated = update_portfolio_from_publications()
    
    if github_updated or pubs_updated:
        print("Portfolio items successfully updated")
    else:
        print("No portfolio items were updated")