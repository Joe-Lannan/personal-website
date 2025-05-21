// Test script for repository loading
document.addEventListener('DOMContentLoaded', function() {
  // Create a status container
  const statusContainer = document.createElement('div');
  statusContainer.id = 'repo-test-status';
  statusContainer.style.cssText = 'position: fixed; bottom: 10px; left: 10px; background: #f8f9fa; border: 1px solid #ddd; padding: 10px; max-width: 80%; z-index: 9999; font-size: 14px; box-shadow: 0 3px 10px rgba(0,0,0,0.2); max-height: 400px; overflow-y: auto;';
  document.body.appendChild(statusContainer);
  
  // Function to add a status message
  function addStatus(message, isError = false) {
    const msgEl = document.createElement('div');
    msgEl.style.cssText = `margin-bottom: 5px; padding: 3px; ${isError ? 'color: #721c24; background-color: #f8d7da;' : ''}`;
    msgEl.textContent = message;
    statusContainer.appendChild(msgEl);
    console.log(message);
  }
  
  addStatus('Repository loading test initialized');
  
  // Check if the container exists
  const container = document.getElementById('github-projects-container');
  if (container) {
    addStatus(`✅ Container found: #github-projects-container`);
  } else {
    addStatus(`❌ Container not found: #github-projects-container`, true);
  }
  
  // Try loading the repositories file
  const paths = [
    'assets/data/github-repos.json',
    '/assets/data/github-repos.json',
    '../assets/data/github-repos.json',
    '/personal-website/assets/data/github-repos.json'
  ];
  
  addStatus(`Testing ${paths.length} possible paths to repository data...`);
  
  // Try each path
  paths.forEach((path, index) => {
    fetch(path)
      .then(response => {
        if (!response.ok) {
          addStatus(`❌ Path ${index+1}: ${path} - ${response.status} ${response.statusText}`, true);
          return null;
        }
        addStatus(`✅ Path ${index+1}: ${path} - ${response.status} OK!`);
        return response.json();
      })
      .then(data => {
        if (data) {
          addStatus(`✅ Data loaded from ${path}: ${data.length} repositories`);
          // Show first repo
          if (data.length > 0) {
            addStatus(`First repository: ${data[0].name} (${data[0].size}KB)`);
          }
          
          // Create a test display
          const testEl = document.createElement('div');
          testEl.style.padding = '5px';
          testEl.style.margin = '5px 0';
          testEl.style.backgroundColor = '#e6f7ff';
          testEl.innerHTML = `
            <p><strong>Test display of repository ${data[0].name}</strong></p>
            <p>${data[0].description || 'No description'}</p>
            <p>Size: ${data[0].size}KB | Language: ${data[0].language || 'Not specified'}</p>
          `;
          statusContainer.appendChild(testEl);
        }
      })
      .catch(error => {
        addStatus(`❌ Error with ${path}: ${error.message}`, true);
      });
  });
  
  // Check if the main script is loaded
  const scripts = document.querySelectorAll('script');
  let mainScriptFound = false;
  
  scripts.forEach(script => {
    if (script.src.includes('github-projects.js')) {
      mainScriptFound = true;
      addStatus(`✅ Main script found: ${script.src}`);
    }
  });
  
  if (!mainScriptFound) {
    addStatus('❌ Main repository script not found!', true);
  }
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.cssText = 'padding: 5px 10px; margin-top: 10px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer;';
  closeBtn.onclick = function() {
    document.body.removeChild(statusContainer);
  };
  statusContainer.appendChild(closeBtn);
});