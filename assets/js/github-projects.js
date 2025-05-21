// GitHub Repository Loader
// This script fetches and displays repositories from GitHub API
// Place this in assets/js/github-projects.js
// Improved version with better organization and styling

document.addEventListener('DOMContentLoaded', function() {
  const username = 'Joe-Lannan'; // Your GitHub username
  const container = document.getElementById('github-projects-container');
  const maxRepos = 9; // Maximum number of repositories to show
  const featuredRepos = ['koinslot', 'PyOpenMV', 'ardoino', 'Command-Line-Slide-Deck', 'jwlcms']; // Featured repositories
  // Custom logos for repositories (repo name -> logo file path)
  const repoLogos = {
    'koinslot': '/images/koinslot-logo.png',
    'PyOpenMV': '/images/site-logo.png',
    'ardoino': '/images/site-logo.png',
    'jwlcms': '/images/site-logo.png'
  };
  const loadingElement = document.createElement('p');
  loadingElement.textContent = 'Loading GitHub repositories...';
  
  if (!container) return;
  
  container.appendChild(loadingElement);
  
  fetchRepositories(username)
    .then(repos => displayRepositories(repos, featuredRepos, maxRepos, repoLogos))
    .catch(handleError);
  
  function fetchRepositories(username) {
    return fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }
        return response.json();
      });
  }
  
  function displayRepositories(repos, featuredRepos, maxRepos, repoLogos) {
    // Remove loading message
    container.removeChild(loadingElement);
    
    if (!repos || repos.length === 0) {
      const noReposMessage = document.createElement('p');
      noReposMessage.textContent = 'No repositories found.';
      container.appendChild(noReposMessage);
      return;
    }

    // Sort repos by priority: featured first, then by stars/updated date
    const sortedRepos = sortRepositories(repos, featuredRepos);
    
    // Filter out forked repos and limit to maxRepos
    const filteredRepos = sortedRepos
      .filter(repo => !repo.fork)
      .slice(0, maxRepos);
    
    // Create grid wrapper
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'grid__wrapper';
    container.appendChild(gridWrapper);
    
    // Display repositories
    filteredRepos.forEach(repo => {
      const repoElement = createRepoElement(repo, repoLogos);
      gridWrapper.appendChild(repoElement);
    });

    // Add "View more on GitHub" button if there are more repos
    if (sortedRepos.filter(repo => !repo.fork).length > maxRepos) {
      const viewMoreLink = document.createElement('div');
      viewMoreLink.className = 'view-more-container';
      viewMoreLink.innerHTML = `<a href="https://github.com/${username}?tab=repositories" 
        class="btn btn--primary view-more-btn">View more on GitHub</a>`;
      container.appendChild(viewMoreLink);
    }
    
    // Add last updated information
    const lastUpdated = document.createElement('p');
    lastUpdated.className = 'last-updated';
    lastUpdated.textContent = `Last updated: ${new Date().toLocaleDateString()}`;
    container.appendChild(lastUpdated);
  }
  
  function sortRepositories(repos, featuredRepos) {
    // First prioritize featured repos, then sort by stars and update date
    return repos.sort((a, b) => {
      // Check if either repo is in featured list
      const aIsFeatured = featuredRepos.includes(a.name);
      const bIsFeatured = featuredRepos.includes(b.name);
      
      // If one is featured and the other isn't, the featured one comes first
      if (aIsFeatured && !bIsFeatured) return -1;
      if (!aIsFeatured && bIsFeatured) return 1;
      
      // If both are featured/non-featured, compare stars
      if (a.stargazers_count !== b.stargazers_count) {
        return b.stargazers_count - a.stargazers_count; // More stars first
      }
      
      // If stars are the same, sort by update date
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
  }
  
  function createRepoElement(repo, repoLogos) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid__item';
    
    const archiveItem = document.createElement('div');
    archiveItem.className = 'archive__item';
    gridItem.appendChild(archiveItem);
    
    // Add thumbnail/image if available
    const imageContainer = document.createElement('div');
    imageContainer.className = 'archive__item-teaser';
    
    // Try to use custom logo if available, fallback to owner avatar
    const img = document.createElement('img');
    if (repoLogos && repoLogos[repo.name]) {
      img.src = repoLogos[repo.name];
      img.className = 'custom-repo-logo';
    } else if (repo.owner && repo.owner.avatar_url) {
      img.src = repo.owner.avatar_url;
    } else {
      img.src = '/images/site-logo.png'; // Default fallback
    }
    img.alt = `${repo.name} thumbnail`;
    imageContainer.appendChild(img);
    archiveItem.appendChild(imageContainer);
    
    const archiveItemBody = document.createElement('div');
    archiveItemBody.className = 'archive__item-body';
    archiveItem.appendChild(archiveItemBody);
    
    // Title
    const title = document.createElement('h2');
    title.className = 'archive__item-title';
    const titleLink = document.createElement('a');
    titleLink.href = repo.html_url;
    titleLink.textContent = repo.name;
    title.appendChild(titleLink);
    archiveItemBody.appendChild(title);
    
    // Content container
    const excerpt = document.createElement('div');
    excerpt.className = 'archive__item-excerpt';
    archiveItemBody.appendChild(excerpt);
    
    // Description
    if (repo.description) {
      const description = document.createElement('p');
      description.className = 'repo-description';
      description.textContent = repo.description;
      
      // Truncate description for square layout
      const maxLength = 60;
      if (repo.description.length > maxLength) {
        description.textContent = repo.description.substring(0, maxLength) + '...';
        description.title = repo.description; // Show full description on hover
      }
      
      excerpt.appendChild(description);
    }
    
    // Language with colored indicator
    if (repo.language) {
      const language = document.createElement('p');
      language.className = 'repo-language';
      language.innerHTML = `<span class="language-indicator ${repo.language.toLowerCase()}"></span> ${repo.language}`;
      excerpt.appendChild(language);
    }
    
    // Stats
    const stats = document.createElement('div');
    stats.className = 'repo-stats';
    stats.innerHTML = `
      <span class="repo-stat"><i class="fa fa-star" aria-hidden="true"></i> ${repo.stargazers_count}</span>
      <span class="repo-stat"><i class="fa fa-code-fork" aria-hidden="true"></i> ${repo.forks_count}</span>
    `;
    excerpt.appendChild(stats);
    
    // Updated date (separate from stats for square layout)
    const updatedDate = document.createElement('div');
    updatedDate.className = 'repo-updated';
    updatedDate.innerHTML = `<i class="fa fa-calendar" aria-hidden="true"></i> ${new Date(repo.updated_at).toLocaleDateString()}`;
    excerpt.appendChild(updatedDate);
    
    // Topics
    if (repo.topics && repo.topics.length > 0) {
      const topicsContainer = document.createElement('div');
      topicsContainer.className = 'repo-topics';
      
      // Limit to first 3 topics for square layout
      const displayTopics = repo.topics.slice(0, 3);
      
      displayTopics.forEach(topic => {
        const topicSpan = document.createElement('span');
        topicSpan.className = 'repo-topic';
        topicSpan.textContent = topic;
        topicsContainer.appendChild(topicSpan);
      });
      
      // Show count of remaining topics if any
      if (repo.topics.length > 3) {
        const moreTopics = document.createElement('span');
        moreTopics.className = 'repo-topic more-topics';
        moreTopics.textContent = `+${repo.topics.length - 3} more`;
        topicsContainer.appendChild(moreTopics);
      }
      
      excerpt.appendChild(topicsContainer);
    }
    
    // Links
    const links = document.createElement('div');
    links.className = 'repo-links';
    
    const githubLink = document.createElement('a');
    githubLink.href = repo.html_url;
    githubLink.className = 'btn btn--primary';
    githubLink.textContent = 'View on GitHub';
    links.appendChild(githubLink);
    
    if (repo.homepage) {
      const homepageLink = document.createElement('a');
      homepageLink.href = repo.homepage;
      homepageLink.className = 'btn btn--secondary';
      homepageLink.textContent = 'Project Website';
      links.appendChild(homepageLink);
    }
    
    excerpt.appendChild(links);
    
    return gridItem;
  }
  
  function handleError(error) {
    container.removeChild(loadingElement);
    
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.textContent = `Error loading GitHub repositories: ${error.message}`;
    container.appendChild(errorMessage);
    
    console.error('Error loading GitHub repositories:', error);
  }
});

// Add CSS for better styling
const style = document.createElement('style');
style.textContent = `
  #github-projects-container {
    margin-bottom: 40px;
  }
  
  .grid__wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: 1fr;
    grid-gap: 20px;
    margin-bottom: 20px;
  }
  
  .grid__item {
    background-color: #ffffff;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    overflow: hidden;
    aspect-ratio: 1/1;
    display: flex;
    flex-direction: column;
  }
  
  .grid__item:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    transform: translateY(-5px);
  }
  
  .archive__item {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .archive__item-teaser {
    height: 100px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f6f8fa;
  }
  
  .archive__item-teaser img {
    height: 70%;
    width: 70%;
    object-fit: contain;
    padding: 5px;
  }
  
  .custom-repo-logo {
    max-width: 80%;
    max-height: 80%;
    margin: auto;
  }
  
  .archive__item-body {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .archive__item-title {
    margin-top: 0;
    font-size: 1.1em;
    margin-bottom: 8px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .archive__item-excerpt {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: calc(100% - 50px);
  }
  
  .repo-stats {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 10px 0;
  }
  
  .repo-stat {
    margin-right: 15px;
    color: #586069;
    font-size: 0.9em;
  }
  
  .repo-updated {
    margin-top: 5px;
    font-size: 0.8em;
    color: #6a737d;
  }
  
  .repo-language {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .language-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 5px;
    display: inline-block;
  }
  
  /* Common language colors */
  .language-indicator.javascript { background-color: #f1e05a; }
  .language-indicator.python { background-color: #3572A5; }
  .language-indicator.html { background-color: #e34c26; }
  .language-indicator.css { background-color: #563d7c; }
  .language-indicator.c\\+\\+ { background-color: #f34b7d; }
  .language-indicator.java { background-color: #b07219; }
  .language-indicator.go { background-color: #00ADD8; }
  .language-indicator.ruby { background-color: #701516; }
  .language-indicator.typescript { background-color: #2b7489; }
  .language-indicator.php { background-color: #4F5D95; }
  .language-indicator.c\\# { background-color: #178600; }
  .language-indicator.shell { background-color: #89e051; }
  .language-indicator.swift { background-color: #ffac45; }
  
  .repo-topics {
    display: flex;
    flex-wrap: wrap;
    margin: 5px 0;
  }
  
  .repo-topic {
    background-color: #f1f8ff;
    border-radius: 3px;
    color: #0366d6;
    font-size: 11px;
    margin: 0 3px 3px 0;
    padding: 2px 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
  
  .more-topics {
    background-color: #e1e4e8;
    color: #586069;
  }
  
  .repo-links {
    display: flex;
    margin-top: auto;
    padding-top: 8px;
  }
  
  .repo-links a {
    margin-right: 5px;
    font-size: 0.85em;
    padding: 4px 8px;
  }
  
  .view-more-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  
  .view-more-btn {
    padding: 10px 20px;
  }
  
  .last-updated {
    text-align: right;
    font-style: italic;
    color: #6a737d;
    margin-top: 10px;
    font-size: 0.8em;
  }
`;

document.head.appendChild(style);