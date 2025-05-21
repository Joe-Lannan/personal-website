// GitHub Repository Loader
// This script loads repositories from a static JSON file generated at build time
// Place this in assets/js/github-projects.js
// Shows all repositories sorted by size

document.addEventListener('DOMContentLoaded', function() {
  console.log("GitHub Projects script loaded");
  const container = document.getElementById('github-projects-container');
  console.log("Container found:", container);
  const maxRepos = 100; // Show many repositories
  // Custom logos for repositories (repo name -> logo file path)
  const repoLogos = {
    'koinslot': '/images/koinslot-logo.png',
    'kywy': '/images/koinslot-logo.png'
  };
  const loadingElement = document.createElement('p');
  loadingElement.textContent = 'Loading GitHub repositories...';
  
  if (!container) {
    console.error("GitHub projects container not found");
    return;
  }
  
  container.appendChild(loadingElement);
  
  console.log("Loading repositories from static JSON file");
  loadRepositoriesFromStaticFile()
    .then(repos => {
      console.log("Repositories loaded:", repos.length);
      displayRepositories(repos, null, maxRepos, repoLogos);
    })
    .catch(handleError);
  
  function loadRepositoriesFromStaticFile() {
    console.log("Fetching repositories from static file");
    return fetch('/assets/data/github-repos.json')
      .then(response => {
        console.log("Static JSON response:", response.status, response.statusText);
        
        if (!response.ok) {
          console.error(`Error loading static JSON file: ${response.status}`);
          throw new Error(`Failed to load repository data (${response.status})`);
        }
        return response.json().then(data => {
          console.log(`Loaded ${data.length} repositories from static file`);
          
          // Add source information to each repo
          data = data.map(repo => {
            // Add a source property to help identify which account each repo belongs to
            if (repo.owner && repo.owner.login) {
              repo.source = repo.owner.login;
            }
            return repo;
          });
          
          return data;
        });
      })
      .catch(error => {
        console.error(`Error loading static repository data:`, error);
        throw error;
      });
  }
  
  function displayRepositories(repos, featuredRepos, maxRepos, repoLogos) {
    console.log("Displaying repositories:", repos);
    
    // Hide error div if it was showing
    const errorDiv = document.getElementById('github-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
    
    // Remove loading message
    if (container.contains(loadingElement)) {
      container.removeChild(loadingElement);
    }
    
    // Try to fetch and display the last updated time
    fetch('/assets/data/repos-updated.json')
      .then(response => response.json())
      .then(data => {
        if (data.updated_at) {
          const updatedDate = new Date(data.updated_at);
          const updatedMsg = document.createElement('p');
          updatedMsg.className = 'repos-last-updated';
          updatedMsg.style.textAlign = 'right';
          updatedMsg.style.fontSize = '0.8em';
          updatedMsg.style.fontStyle = 'italic';
          updatedMsg.style.color = '#666';
          updatedMsg.style.margin = '0 0 20px 0';
          updatedMsg.textContent = `Repository data last updated: ${updatedDate.toLocaleDateString()} ${updatedDate.toLocaleTimeString()}`;
          container.appendChild(updatedMsg);
        }
      })
      .catch(err => console.log('Could not fetch update timestamp', err));
    
    if (!repos || repos.length === 0) {
      console.warn("No repositories found to display");
      const noReposMessage = document.createElement('p');
      noReposMessage.textContent = 'No repositories found. GitHub API may be rate limited or encountering issues.';
      container.appendChild(noReposMessage);
      
      // Add retry button
      const retryButton = document.createElement('button');
      retryButton.textContent = 'Retry Loading Repositories';
      retryButton.className = 'btn btn--primary';
      retryButton.style.marginTop = '15px';
      retryButton.onclick = function() {
        container.innerHTML = '';
        container.appendChild(loadingElement);
        fetchAllRepositories(['joe-lannan', 'koinslot-inc'])
          .then(repos => displayRepositories(repos, null, maxRepos, repoLogos))
          .catch(handleError);
      };
      container.appendChild(retryButton);
      return;
    }

    console.log("Sorting repositories by size");
    // Sort repos by size (largest first)
    const sortedRepos = repos.filter(repo => repo && repo.size !== undefined).sort((a, b) => b.size - a.size);
    
    // Include all repos but limit to maxRepos
    const filteredRepos = sortedRepos.slice(0, maxRepos);
    console.log("Filtered repositories:", filteredRepos.length);
    
    // Create grid wrapper
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'grid__wrapper';
    container.appendChild(gridWrapper);
    
    // Display repositories
    filteredRepos.forEach(repo => {
      const repoElement = createRepoElement(repo, repoLogos);
      gridWrapper.appendChild(repoElement);
    });

    // Add "View more on GitHub" buttons for each account
    const viewMoreContainer = document.createElement('div');
    viewMoreContainer.className = 'view-more-container';
    
    // Add buttons for joe-lannan and koinslot-inc
    ['joe-lannan', 'koinslot-inc'].forEach(username => {
      const viewMoreBtn = document.createElement('a');
      viewMoreBtn.href = `https://github.com/${username}?tab=repositories`;
      viewMoreBtn.className = 'btn btn--primary view-more-btn';
      viewMoreBtn.textContent = `View more from ${username}`;
      viewMoreBtn.style.margin = '0 10px';
      viewMoreContainer.appendChild(viewMoreBtn);
    });
    
    container.appendChild(viewMoreContainer);
    
    // Add information about the current display
    const displayInfo = document.createElement('p');
    displayInfo.className = 'repos-display-info';
    displayInfo.textContent = `Showing ${filteredRepos.length} repositories`;
    displayInfo.style.textAlign = 'right';
    displayInfo.style.fontSize = '0.8em';
    displayInfo.style.color = '#666';
    displayInfo.style.margin = '20px 0 0 0';
    container.appendChild(displayInfo);
    
    console.log("Repository display completed");
  }
  
  function sortRepositories(repos) {
    // Simply sort by size (largest first)
    console.log("Sorting repositories by size");
    return repos.sort((a, b) => b.size - a.size);
  }
  
  function createRepoElement(repo, repoLogos) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid__item';
    
    // Add source as data attribute
    if (repo.source) {
      gridItem.dataset.source = repo.source;
    } else if (repo.owner && repo.owner.login) {
      gridItem.dataset.source = repo.owner.login;
    }
    
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
      img.src = '/images/favicon-192x192.png'; // Default fallback
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
    
    // Add updated date and size (separate from stats for square layout)
    const updatedDate = document.createElement('div');
    updatedDate.className = 'repo-updated';
    updatedDate.innerHTML = `
      <i class="fa fa-calendar" aria-hidden="true"></i> ${new Date(repo.updated_at).toLocaleDateString()} 
      <i class="fa fa-database" aria-hidden="true"></i> ${formatRepoSize(repo.size)}
    `;
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
  
  // Helper function to format repository size
  function formatRepoSize(sizeInKB) {
    if (sizeInKB < 1000) {
      return `${sizeInKB} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(1)} MB`;
    }
  }

  function handleError(error) {
    console.error('Error loading GitHub repositories:', error);
    
    if (container.contains(loadingElement)) {
      container.removeChild(loadingElement);
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Show error message in container
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.textContent = `Error loading GitHub repositories: ${error.message}`;
    container.appendChild(errorMessage);
    
    // Show the error div in the HTML
    const errorDiv = document.getElementById('github-error');
    if (errorDiv) {
      errorDiv.style.display = 'block';
    }
    
    // Add retry button in container
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Retry Loading Repositories';
    retryButton.className = 'btn btn--primary';
    retryButton.style.marginTop = '15px';
    retryButton.onclick = function() {
      // Hide error div again
      if (errorDiv) {
        errorDiv.style.display = 'none';
      }
      
      // Clear container and show loading message
      container.innerHTML = '';
      container.appendChild(loadingElement);
      
      // Try loading again
      loadRepositoriesFromStaticFile()
        .then(repos => {
          if (repos && repos.length > 0) {
            displayRepositories(repos, null, maxRepos, repoLogos);
          } else {
            handleError(new Error("No repositories found"));
          }
        })
        .catch(handleError);
    };
    container.appendChild(retryButton);
    
    // Try with local fallback data
    console.log("Loading fallback repository data");
    
    // Create some placeholder repositories in case the static file failed to load
    const placeholderRepos = [
      {
        name: "personal-website",
        html_url: "https://github.com/joe-lannan/personal-website",
        description: "Personal website repository (static data failed to load)",
        size: 5000,
        stargazers_count: 3,
        forks_count: 1,
        language: "JavaScript",
        updated_at: new Date().toISOString(),
        topics: ["website", "portfolio"],
        owner: {
          login: "joe-lannan",
          avatar_url: "/images/favicon-192x192.png"
        }
      },
      {
        name: "koinslot",
        html_url: "https://github.com/koinslot-inc/koinslot",
        description: "Koinslot repository (static data failed to load)",
        size: 8000,
        stargazers_count: 5,
        forks_count: 2,
        language: "Python",
        updated_at: new Date().toISOString(),
        topics: ["koinslot", "platform"],
        owner: {
          login: "koinslot-inc",
          avatar_url: "/images/koinslot-logo.png"
        }
      }
    ];
    
    // Display the placeholder repos
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    displayRepositories(placeholderRepos, null, maxRepos, repoLogos);

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
      flex-wrap: wrap;
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