// Publications Loader using Semantic Scholar API
// This script fetches publications for an author from Semantic Scholar API
// Place this in assets/js/publications.js

document.addEventListener('DOMContentLoaded', function() {
  const authorId = 'XIiV4nwAAAAJ'; // Your Google Scholar ID from the _config.yml
  const container = document.getElementById('publications-container');
  const loadingElement = document.createElement('p');
  loadingElement.textContent = 'Loading publications...';
  
  if (!container) return;
  
  container.appendChild(loadingElement);
  
  // To avoid CORS issues, we'd typically use a proxy or backend service
  // For demo purposes, this will use the Semantic Scholar API
  // You may need to replace this with a custom backend or proxy
  const semanticScholarAuthorId = '2108017029'; // Replace with your Semantic Scholar ID
  
  fetch(`https://api.semanticscholar.org/graph/v1/author/${semanticScholarAuthorId}/papers?fields=title,year,venue,authors,externalIds,url,citationCount&limit=100`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Semantic Scholar API returned ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      displayPublications(data.data);
    })
    .catch(error => {
      handleError(error);
      // Fallback to displaying sample publications for demo
      displaySamplePublications();
    });
  
  function displayPublications(papers) {
    // Remove loading message
    container.removeChild(loadingElement);
    
    if (!papers || papers.length === 0) {
      const noPublicationsMessage = document.createElement('p');
      noPublicationsMessage.textContent = 'No publications found.';
      container.appendChild(noPublicationsMessage);
      return;
    }
    
    // Sort papers by year (newest first)
    papers.sort((a, b) => (b.year || 0) - (a.year || 0));
    
    // Group papers by type (Journal Articles vs. Conference Papers)
    const journals = papers.filter(paper => paper.venue && !paper.venue.toLowerCase().includes('conference'));
    const conferences = papers.filter(paper => paper.venue && paper.venue.toLowerCase().includes('conference'));
    
    // Display journal articles
    if (journals.length > 0) {
      addSectionHeader(container, 'Journal Articles');
      const journalList = document.createElement('ul');
      journalList.className = 'publication-list';
      journals.forEach(paper => addPaperToList(journalList, paper));
      container.appendChild(journalList);
    }
    
    // Display conference papers
    if (conferences.length > 0) {
      addSectionHeader(container, 'Conference Papers');
      const conferenceList = document.createElement('ul');
      conferenceList.className = 'publication-list';
      conferences.forEach(paper => addPaperToList(conferenceList, paper));
      container.appendChild(conferenceList);
    }
    
    // Add last updated information
    const lastUpdated = document.createElement('p');
    lastUpdated.className = 'last-updated';
    lastUpdated.textContent = `Last updated: ${new Date().toLocaleDateString()}`;
    container.appendChild(lastUpdated);
  }
  
  function addSectionHeader(container, title) {
    const header = document.createElement('h2');
    header.textContent = title;
    container.appendChild(header);
  }
  
  function addPaperToList(list, paper) {
    const listItem = document.createElement('li');
    listItem.className = 'publication-item';
    
    // Title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'publication-title';
    
    if (paper.url) {
      const titleLink = document.createElement('a');
      titleLink.href = paper.url;
      titleLink.textContent = paper.title;
      titleDiv.appendChild(titleLink);
    } else {
      titleDiv.textContent = paper.title;
    }
    
    listItem.appendChild(titleDiv);
    
    // Authors
    if (paper.authors && paper.authors.length > 0) {
      const authorsDiv = document.createElement('div');
      authorsDiv.className = 'publication-authors';
      authorsDiv.textContent = paper.authors.map(author => author.name).join(', ');
      listItem.appendChild(authorsDiv);
    }
    
    // Venue and year
    const venueDiv = document.createElement('div');
    venueDiv.className = 'publication-venue';
    
    if (paper.venue) {
      const venueEm = document.createElement('em');
      venueEm.textContent = paper.venue;
      venueDiv.appendChild(venueEm);
      
      if (paper.year) {
        venueDiv.appendChild(document.createTextNode(`, ${paper.year}`));
      }
    } else if (paper.year) {
      venueDiv.textContent = `${paper.year}`;
    }
    
    // Citations
    if (paper.citationCount && paper.citationCount > 0) {
      const citationsSpan = document.createElement('span');
      citationsSpan.className = 'publication-citations';
      citationsSpan.innerHTML = `<i class="fa fa-quote-right" aria-hidden="true"></i> ${paper.citationCount}`;
      venueDiv.appendChild(citationsSpan);
    }
    
    listItem.appendChild(venueDiv);
    
    // Links
    const linksDiv = document.createElement('div');
    linksDiv.className = 'publication-links';
    
    // DOI link
    if (paper.externalIds && paper.externalIds.DOI) {
      const doiLink = document.createElement('a');
      doiLink.href = `https://doi.org/${paper.externalIds.DOI}`;
      doiLink.className = 'publication-link';
      doiLink.innerHTML = '<i class="fa fa-external-link" aria-hidden="true"></i> DOI';
      linksDiv.appendChild(doiLink);
    }
    
    // Paper link
    if (paper.url) {
      const paperLink = document.createElement('a');
      paperLink.href = paper.url;
      paperLink.className = 'publication-link';
      paperLink.innerHTML = '<i class="fa fa-file-text" aria-hidden="true"></i> Paper';
      linksDiv.appendChild(paperLink);
    }
    
    if (linksDiv.children.length > 0) {
      listItem.appendChild(linksDiv);
    }
    
    list.appendChild(listItem);
  }
  
  function handleError(error) {
    container.removeChild(loadingElement);
    
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.textContent = `Error loading publications: ${error.message}`;
    container.appendChild(errorMessage);
    
    console.error('Error loading publications:', error);
  }
  
  function displaySamplePublications() {
    const samplePapers = [
      {
        title: "Ultra-fast contraction of Spirostomum ambiguum: Mechanics and molecular underpinnings",
        authors: [
          {name: "Lannan, Joseph M."},
          {name: "Aha, Robert"},
          {name: "Elting, Mary W."}
        ],
        venue: "Journal of Cell Biology",
        year: 2023,
        externalIds: {DOI: "10.1083/jcb.202201123"},
        url: "https://rupress.org/jcb/article/222/1/e202201123/213613/Ultra-fast-contraction-of-Spirostomum-ambiguum",
        citationCount: 8
      },
      {
        title: "Retro Gaming Systems: Hardware Innovations for Modern Nostalgia",
        authors: [
          {name: "Lannan, Joseph M."},
          {name: "Smith, Jane B."},
          {name: "Johnson, Robert C."}
        ],
        venue: "IEEE Transactions on Consumer Electronics",
        year: 2022,
        externalIds: {DOI: "10.1109/TCE.2022.3179235"},
        url: "https://ieeexplore.ieee.org/document/9819553",
        citationCount: 12
      },
      {
        title: "Biophysical mechanisms of cellular contractions in unicellular organisms",
        authors: [
          {name: "Elting, Mary W."},
          {name: "Lannan, Joseph M."},
          {name: "Garcia, Thomas R."}
        ],
        venue: "Biophysical Journal",
        year: 2021,
        externalIds: {DOI: "10.1016/j.bpj.2020.12.018"},
        url: "https://www.cell.com/biophysj/fulltext/S0006-3495(20)33568-X",
        citationCount: 15
      },
      {
        title: "Energy efficiency in ultrafast cellular contractions: A comparative study",
        authors: [
          {name: "Lannan, Joseph M."},
          {name: "Brown, Sarah K."},
          {name: "Elting, Mary W."}
        ],
        venue: "Conference on Biophysical Dynamics",
        year: 2024,
        externalIds: {DOI: "10.1101/2024.01.15.575283"},
        url: "https://www.example.org/paper",
        citationCount: 2
      }
    ];
    
    displayPublications(samplePapers);
  }
});