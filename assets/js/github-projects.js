// GitHub Repository Loader
// This script fetches and displays repositories from GitHub API
// Place this in assets/js/github-projects.js

document.addEventListener('DOMContentLoaded', function() {
  const username = 'Joe-Lannan'; // Your GitHub username
  const container = document.getElementById('github-projects-container');
  const loadingElement = document.createElement('p');
  loadingElement.textContent = 'Loading GitHub repositories...';
  
  if (!container) return;
  
  container.appendChild(loadingElement);
  
  fetchRepositories(username)
    .then(displayRepositories)
    .catch(handleError);
  
  function fetchRepositories(username) {
    return fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }
        return response.json();
      });
  }
  
  function displayRepositories(repos) {
    // Remove loading message
    container.removeChild(loadingElement);
    
    if (!repos || repos.length === 0) {
      const noReposMessage = document.createElement('p');
      noReposMessage.textContent = 'No repositories found.';
      container.appendChild(noReposMessage);
      return;
    }
    
    // Create grid wrapper
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'grid__wrapper';
    container.appendChild(gridWrapper);
    
    // Display repositories
    repos.forEach(repo => {
      if (repo.fork) return; // Skip forked repositories
      
      const repoElement = createRepoElement(repo);
      gridWrapper.appendChild(repoElement);
    });
    
    // Add last updated information
    const lastUpdated = document.createElement('p');
    lastUpdated.className = 'last-updated';
    lastUpdated.textContent = `Last updated: ${new Date().toLocaleDateString()}`;
    container.appendChild(lastUpdated);
  }
  
  function createRepoElement(repo) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid__item';
    
    const archiveItem = document.createElement('div');
    archiveItem.className = 'archive__item';
    gridItem.appendChild(archiveItem);
    
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
      description.textContent = repo.description;
      excerpt.appendChild(description);
    }
    
    // Language
    if (repo.language) {
      const language = document.createElement('p');
      language.innerHTML = `<strong>Language:</strong> ${repo.language}`;
      excerpt.appendChild(language);
    }
    
    // Stats
    const stats = document.createElement('p');
    stats.innerHTML = `
      <span class="repo-stat"><i class="fa fa-star" aria-hidden="true"></i> ${repo.stargazers_count}</span>
      <span class="repo-stat"><i class="fa fa-code-fork" aria-hidden="true"></i> ${repo.forks_count}</span>
      <span class="repo-stat"><i class="fa fa-calendar" aria-hidden="true"></i> Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
    `;
    excerpt.appendChild(stats);
    
    // Topics
    if (repo.topics && repo.topics.length > 0) {
      const topicsContainer = document.createElement('p');
      topicsContainer.className = 'repo-topics';
      
      repo.topics.forEach(topic => {
        const topicSpan = document.createElement('span');
        topicSpan.className = 'repo-topic';
        topicSpan.textContent = topic;
        topicsContainer.appendChild(topicSpan);
      });
      
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