// GitHub Contribution Heatmap
// This script fetches the GitHub contribution data and renders a calendar heatmap
// Similar to the one shown on GitHub profiles

document.addEventListener('DOMContentLoaded', function() {
  const username = 'Joe-Lannan'; // Your GitHub username
  const container = document.getElementById('github-heatmap-container');
  
  if (!container) return;
  
  const loadingElement = document.createElement('p');
  loadingElement.textContent = 'Loading GitHub contribution data...';
  container.appendChild(loadingElement);
  
  fetchContributionData(username)
    .then(renderHeatmap)
    .catch(handleError);
  
  async function fetchContributionData(username) {
    // GitHub doesn't provide an official API for contribution data
    // We'll use a proxy or scrape the SVG data from the GitHub profile page
    try {
      // Using the GitHub contribution calendar endpoint
      const response = await fetch(`https://github-contributions-api.joelpurra.com/v2/`+
                                  `${username}/count/day`);
      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub contributions: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching contribution data:", error);
      throw error;
    }
  }
  
  function renderHeatmap(data) {
    // Remove loading message
    container.removeChild(loadingElement);
    
    // Create heatmap container
    const heatmapContainer = document.createElement('div');
    heatmapContainer.className = 'github-heatmap';
    container.appendChild(heatmapContainer);
    
    // Add a header with statistics
    const header = document.createElement('div');
    header.className = 'heatmap-header';
    
    let totalContributions = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let currentStreakDays = 0;
    let longestStreakDays = 0;
    
    if (data.years) {
      // Calculate statistics if we have the data
      const contributions = data.years.reduce((acc, year) => {
        return acc + (year.total || 0);
      }, 0);
      totalContributions = contributions;
      
      // You would need to calculate streaks from the data
      // This is simplified and would need proper implementation
      currentStreak = calculateCurrentStreak(data);
      longestStreak = calculateLongestStreak(data);
    }
    
    header.innerHTML = `
      <h3>GitHub Contributions</h3>
      <div class="heatmap-stats">
        <div class="stat">
          <span class="stat-value">${totalContributions}</span>
          <span class="stat-label">Total Contributions</span>
        </div>
        <div class="stat">
          <span class="stat-value">${currentStreak}</span>
          <span class="stat-label">Current Streak</span>
        </div>
        <div class="stat">
          <span class="stat-value">${longestStreak}</span>
          <span class="stat-label">Longest Streak</span>
        </div>
      </div>
    `;
    heatmapContainer.appendChild(header);
    
    // Create calendar visualization
    const calendar = document.createElement('div');
    calendar.className = 'contribution-calendar';
    
    // If we have a contributions API response with years data
    if (data.years) {
      // Generate calendar grid
      // For a proper implementation, we'd need to create a full year calendar view
      // with appropriate coloring based on contribution count
      
      // For now, we'll create a simplified version or embed the GitHub calendar
      const currentYear = new Date().getFullYear();
      const yearData = data.years.find(y => y.year === currentYear) || data.years[0];
      
      if (yearData) {
        calendar.innerHTML = `
          <div class="calendar-heading">
            <h4>${yearData.year} - ${yearData.total} contributions</h4>
          </div>
          <div class="calendar-wrapper">
            <iframe 
              src="https://ghchart.rshah.org/${username}" 
              width="100%" 
              height="120" 
              frameborder="0"
              scrolling="no">
            </iframe>
          </div>
        `;
      }
    } else {
      // Fallback to using a third-party service to display the heatmap
      calendar.innerHTML = `
        <div class="calendar-wrapper">
          <iframe 
            src="https://ghchart.rshah.org/${username}" 
            width="100%" 
            height="120" 
            frameborder="0"
            scrolling="no">
          </iframe>
        </div>
      `;
    }
    
    heatmapContainer.appendChild(calendar);
    
    // Add last updated information
    const lastUpdated = document.createElement('p');
    lastUpdated.className = 'last-updated';
    lastUpdated.textContent = `Last updated: ${new Date().toLocaleDateString()}`;
    heatmapContainer.appendChild(lastUpdated);
  }
  
  function calculateCurrentStreak(data) {
    // Simplified implementation - would need proper date handling
    return 0; // Placeholder
  }
  
  function calculateLongestStreak(data) {
    // Simplified implementation - would need proper date handling
    return 0; // Placeholder
  }
  
  function handleError(error) {
    container.removeChild(loadingElement);
    
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.textContent = `Error loading GitHub contribution data: ${error.message}`;
    container.appendChild(errorMessage);
    
    console.error('Error loading GitHub contribution data:', error);
  }
});

// Add CSS for the heatmap
const style = document.createElement('style');
style.textContent = `
.github-heatmap {
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  margin: 20px 0;
  padding: 20px;
}

.heatmap-header {
  margin-bottom: 20px;
}

.heatmap-stats {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.8em;
  font-weight: bold;
  color: #0366d6;
}

.stat-label {
  font-size: 0.9em;
  color: #586069;
}

.calendar-wrapper {
  overflow: hidden;
  margin: 10px 0;
}

.calendar-heading {
  margin-bottom: 10px;
}

.calendar-square {
  width: 10px;
  height: 10px;
  margin: 1px;
  display: inline-block;
}

.contribution-level-0 { background-color: #ebedf0; }
.contribution-level-1 { background-color: #9be9a8; }
.contribution-level-2 { background-color: #40c463; }
.contribution-level-3 { background-color: #30a14e; }
.contribution-level-4 { background-color: #216e39; }

.last-updated {
  font-style: italic;
  color: #666;
  font-size: 0.8em;
  margin-top: 10px;
  text-align: right;
}

.error-message {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin-top: 15px;
}
`;

document.head.appendChild(style);