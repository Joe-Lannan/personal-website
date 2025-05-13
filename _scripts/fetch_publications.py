#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import yaml
import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime

def fetch_publications():
    """
    Fetch publications from Google Scholar for Joe Lannan and save to _data/publications.yml.
    
    This script uses requests and BeautifulSoup to scrape the Google Scholar page
    since the scholarly library can be unstable with CAPTCHAs. We search for papers
    with a specific author ID.
    """
    
    # Google Scholar ID for Joe Lannan
    author_id = "XIiV4nwAAAAJ"  # Replace with your actual Google Scholar ID
    
    # URL for the author's Google Scholar page
    url = f"https://scholar.google.com/citations?user={author_id}&hl=en"
    
    try:
        # Use a realistic user agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        
        # Make the request
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find publication entries
        publication_entries = soup.select('tr.gsc_a_tr')
        
        publications = []
        
        for entry in publication_entries:
            # Extract title and link
            title_element = entry.select_one('td.gsc_a_t a')
            title = title_element.text.strip() if title_element else "Unknown Title"
            paper_url = f"https://scholar.google.com{title_element['href']}" if title_element and 'href' in title_element.attrs else None
            
            # Extract authors and venue
            authors_venue = entry.select('div.gs_gray')
            authors = authors_venue[0].text.strip() if len(authors_venue) > 0 else ""
            venue = authors_venue[1].text.strip() if len(authors_venue) > 1 else ""
            
            # Extract year
            year_element = entry.select_one('td.gsc_a_y span')
            year = year_element.text.strip() if year_element else "Unknown Year"
            
            # Extract citation count
            citations_element = entry.select_one('td.gsc_a_c a')
            citations = int(citations_element.text.strip()) if citations_element and citations_element.text.strip().isdigit() else 0
            
            # Create publication object
            publication = {
                "title": title,
                "authors": authors,
                "venue": venue,
                "year": year,
                "citations": citations,
                "url": paper_url
            }
            
            # Try to extract DOI if available in the venue field
            if "doi:" in venue.lower() or "doi.org" in venue.lower():
                doi_parts = [p for p in venue.split() if "doi:" in p.lower() or "doi.org" in p.lower()]
                if doi_parts:
                    doi = doi_parts[0].replace("DOI:", "").replace("doi:", "").strip()
                    publication["doi"] = doi
            
            publications.append(publication)
        
        # Sort publications by year (most recent first)
        publications.sort(key=lambda x: x.get("year", "0"), reverse=True)
        
        # Also check for preprints (biorxiv/arxiv)
        # This is a placeholder - for a real implementation, you would need to search biorxiv and arxiv APIs
        # Here we'll just create a structure for manual additions
        
        # Create data directory if it doesn't exist
        os.makedirs("_data", exist_ok=True)
        
        # Save to YAML file
        with open("_data/publications.yml", "w", encoding="utf-8") as f:
            yaml.dump({
                "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "author_id": author_id,
                "publications": publications,
                "preprints": []  # Placeholder for manually added preprints
            }, f, default_flow_style=False, allow_unicode=True)
        
        print(f"Successfully fetched {len(publications)} publications")
        
    except Exception as e:
        print(f"Error fetching publications: {e}")
        
        # If the script fails, create an empty or template file
        if not os.path.exists("_data/publications.yml"):
            with open("_data/publications.yml", "w", encoding="utf-8") as f:
                yaml.dump({
                    "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "author_id": author_id,
                    "publications": [],
                    "preprints": [
                        {
                            "title": "Fishnet mesh of centrin-Sfi1 drives ultrafast calcium-activated contraction of the giant cell Spirostomum ambiguum",
                            "authors": "Joseph Lannan, Carlos Floyd, L. X. Xu, Connie Yan, Wallace F. Marshall, Surirayanarayanan Vaikuntanathan, Aaron R. Dinner, Jerry E. Honts, Saad Bhamla, and Mary Williard Elting",
                            "venue": "Biorxiv",
                            "year": "2025",
                            "url": "https://doi.org/10.1101/2024.11.07.622534",
                            "doi": "10.1101/2024.11.07.622534"
                        },
                        {
                            "title": "Culture and imaging techniques for the study of the ultrafast giant cell Spirostomum ambiguum",
                            "authors": "Joseph Lannan et al.",
                            "venue": "In progress",
                            "year": "2025",
                            "url": ""
                        }
                    ]
                }, f, default_flow_style=False, allow_unicode=True)
            print("Created template publications file")

if __name__ == "__main__":
    fetch_publications()