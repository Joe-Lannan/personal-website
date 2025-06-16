// Google Scholar Statistics Loader
// This script fetches and displays Google Scholar statistics
// Note: Due to CORS restrictions, this needs a proxy server or backend
// This is a demonstration version that shows a UI but uses placeholder data

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('scholar-stats-container');
  
  if (!container) return;
  
  const loadingElement = document.createElement('p');
  loadingElement.textContent = 'Loading citation statistics...';
  container.appendChild(loadingElement);
  
  // In a real implementation, you would fetch from Google Scholar via a backend proxy
  // Since direct scraping is not allowed, this is just a demo with placeholder values
  setTimeout(() => {
    // Remove loading message
    container.removeChild(loadingElement);
    
    // Create stats container
    const statsContainer = document.createElement('div');
    statsContainer.className = 'scholar-stats';
    
    // For a real implementation, replace with actual API call to your backend
    const scholarStats = {
      citations: {
        all: 124,
        since2019: 87
      },
      hIndex: {
        all: 8,
        since2019: 6
      },
      i10Index: {
        all: 4,
        since2019: 3
      },
      lastUpdated: new Date().toISOString()
    };
    
    // Create stats grid
    const grid = document.createElement('div');
    grid.className = 'scholar-stats-grid';
    
    // Add citation stats
    addStatBlock(grid, 'Citations', scholarStats.citations.all, scholarStats.citations.since2019);
    
    // Add h-index stats
    addStatBlock(grid, 'h-index', scholarStats.hIndex.all, scholarStats.hIndex.since2019);
    
    // Add i10-index stats
    addStatBlock(grid, 'i10-index', scholarStats.i10Index.all, scholarStats.i10Index.since2019);
    
    statsContainer.appendChild(grid);
    
    // Add link to Google Scholar
    const scholarLink = document.createElement('a');
    scholarLink.href = 'https://scholar.google.com/citations?hl=en&user=XIiV4nwAAAAJ';
    scholarLink.className = 'scholar-link';
    scholarLink.innerHTML = '<i class="ai ai-google-scholar"></i> View my Google Scholar profile';
    statsContainer.appendChild(scholarLink);
    
    // Add last updated info
    const lastUpdated = document.createElement('p');
    lastUpdated.className = 'last-updated';
    lastUpdated.textContent = `Last updated: ${new Date(scholarStats.lastUpdated).toLocaleDateString()}`;
    statsContainer.appendChild(lastUpdated);
    
    container.appendChild(statsContainer);
  }, 500);
  
  function addStatBlock(container, title, allTime, since2019) {
    const statBlock = document.createElement('div');
    statBlock.className = 'stat-block';
    
    const statTitle = document.createElement('h3');
    statTitle.className = 'stat-title';
    statTitle.textContent = title;
    statBlock.appendChild(statTitle);
    
    const statTable = document.createElement('table');
    statTable.className = 'stat-table';
    
    // Header row
    const headerRow = document.createElement('tr');
    
    const emptyHeader = document.createElement('th');
    headerRow.appendChild(emptyHeader);
    
    const allHeader = document.createElement('th');
    allHeader.textContent = 'All';
    headerRow.appendChild(allHeader);
    
    const sinceHeader = document.createElement('th');
    sinceHeader.textContent = 'Since 2019';
    headerRow.appendChild(sinceHeader);
    
    statTable.appendChild(headerRow);
    
    // Data row
    const dataRow = document.createElement('tr');
    
    const dataLabel = document.createElement('td');
    dataLabel.textContent = ' ';
    dataRow.appendChild(dataLabel);
    
    const allData = document.createElement('td');
    allData.textContent = allTime;
    dataRow.appendChild(allData);
    
    const sinceData = document.createElement('td');
    sinceData.textContent = since2019;
    dataRow.appendChild(sinceData);
    
    statTable.appendChild(dataRow);
    statBlock.appendChild(statTable);
    
    container.appendChild(statBlock);
  }
});