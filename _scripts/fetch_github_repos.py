#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import yaml
from github import Github
from dotenv import load_dotenv
from datetime import datetime

def fetch_github_repos():
    """
    Fetch repositories from GitHub for Joe Lannan and save to _data/repositories.yml.
    This script filters for repositories that are not forks and have a description.
    """
    # Load environment variables (including GITHUB_TOKEN)
    load_dotenv()
    
    # GitHub username
    username = "Joe-Lannan"
    
    # Initialize GitHub API client (use token if available, otherwise use public API with rate limits)
    token = os.getenv("GITHUB_TOKEN")
    if token:
        g = Github(token)
    else:
        g = Github()
    
    try:
        # Get the user
        user = g.get_user(username)
        
        # Get repositories
        repos = []
        for repo in user.get_repos():
            # Skip forks unless they have substantial contributions
            if repo.fork:
                continue
            
            # Skip repositories without descriptions
            if not repo.description:
                continue
            
            # Skip archived repositories
            if repo.archived:
                continue
            
            # Get languages
            try:
                languages = list(repo.get_languages().keys())
            except:
                languages = []
            
            # Get last update date
            updated_at = repo.updated_at.strftime("%Y-%m-%d")
            
            # Create repository object
            repo_data = {
                "name": repo.name,
                "full_name": repo.full_name,
                "description": repo.description,
                "html_url": repo.html_url,
                "homepage": repo.homepage if repo.homepage else None,
                "language": repo.language,
                "languages": languages,
                "stars": repo.stargazers_count,
                "forks": repo.forks_count,
                "updated_at": updated_at,
                "topics": repo.get_topics()
            }
            
            repos.append(repo_data)
        
        # Sort repositories by update date (most recent first)
        repos.sort(key=lambda x: x["updated_at"], reverse=True)
        
        # Create data directory if it doesn't exist
        os.makedirs("_data", exist_ok=True)
        
        # Save to YAML file
        with open("_data/repositories.yml", "w", encoding="utf-8") as f:
            yaml.dump({
                "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "username": username,
                "repositories": repos
            }, f, default_flow_style=False, allow_unicode=True)
        
        print(f"Successfully fetched {len(repos)} repositories for {username}")
        
    except Exception as e:
        print(f"Error fetching repositories: {e}")

if __name__ == "__main__":
    fetch_github_repos()