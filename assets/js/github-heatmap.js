// GitHub Contribution Heatmap
// This script fetches the GitHub contribution data and renders a calendar heatmap
// Similar to the one shown on GitHub profiles

document.addEventListener("DOMContentLoaded", function () {
  const username = "joe-lannan"; // Your GitHub username (lowercase for better compatibility)
  const container = document.getElementById("github-heatmap-container");

  if (!container) return;

  const loadingElement = document.createElement("p");
  loadingElement.textContent = "Loading GitHub contribution data...";
  container.appendChild(loadingElement);

  // Set a timeout to ensure rendering happens even if something goes wrong
  setTimeout(() => {
    if (container.contains(loadingElement)) {
      // If loading element is still there after 5 seconds, force render
      renderHeatmap();
    }
  }, 5000);

  // Try to render immediately
  renderHeatmap();

  async function fetchContributionData(username) {
    // This function is kept for future reference but not used currently
    // GitHub doesn't provide an official API for contribution data
    try {
      const response = await fetch(
        `https://github-contribution-api.deno.dev/${username}`,
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch GitHub contributions: ${response.status}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching contribution data:", error);
      throw error;
    }
  }

  function renderHeatmap() {
    // Remove loading message if it exists
    if (container.contains(loadingElement)) {
      container.removeChild(loadingElement);
    }

    // Create heatmap container
    const heatmapContainer = document.createElement("div");
    heatmapContainer.className = "github-heatmap";
    container.appendChild(heatmapContainer);

    // Add a header with title
    const header = document.createElement("div");
    header.className = "heatmap-header";

    header.innerHTML = `
      <h3>My GitHub Contribution Activity</h3>
      <p class="heatmap-subtitle">This calendar shows my coding activity and open source contributions.</p>
    `;
    heatmapContainer.appendChild(header);

    // Create calendar visualization
    const calendar = document.createElement("div");
    calendar.className = "contribution-calendar";

    // Use GitHub skyline API for a better visualization
    calendar.innerHTML = `
      <div class="calendar-wrapper">
        <iframe
          src="https://github-readme-streak-stats.herokuapp.com/?user=joe-lannan&theme=default&hide_border=true"
          width="100%"
          height="180"
          frameborder="0"
          scrolling="no"
          loading="lazy"
          class="stats-iframe"
          onerror="this.style.display='none'">
        </iframe>

        <iframe
          src="https://github-readme-stats.vercel.app/api?username=joe-lannan&show_icons=true&count_private=true&include_all_commits=true&hide_border=true"
          width="100%"
          height="180"
          frameborder="0"
          scrolling="no"
          loading="lazy"
          class="stats-iframe"
          onerror="this.style.display='none'">
        </iframe>

        <iframe
          src="https://ghchart.rshah.org/joe-lannan"
          width="100%"
          height="120"
          frameborder="0"
          scrolling="no"
          loading="lazy"
          class="chart-iframe"
          style="margin-top: 20px;"
          onerror="this.style.display='none'">
        </iframe>
      </div>
    `;

    heatmapContainer.appendChild(calendar);

    // Add last updated information
    const lastUpdated = document.createElement("p");
    lastUpdated.className = "last-updated";
    lastUpdated.textContent = `Last updated: ${new Date().toLocaleDateString()}`;
    heatmapContainer.appendChild(lastUpdated);
  }

  // These functions are no longer used - we're now using GitHub services to fetch stats

  function handleError(error) {
    if (container.contains(loadingElement)) {
      container.removeChild(loadingElement);
    }

    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message";
    errorMessage.textContent = `Error loading GitHub contribution data: ${error.message}`;
    container.appendChild(errorMessage);

    console.error("Error loading GitHub contribution data:", error);

    // Still attempt to render the heatmap with default content
    renderHeatmap();
  }
});

// Add CSS for the heatmap
const style = document.createElement("style");
style.textContent = `
.github-heatmap {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin: 30px auto;
  padding: 25px;
  text-align: center;
  max-width: 900px;
  width: 100%;
}

.heatmap-header {
  margin-bottom: 25px;
  text-align: center;
}

.heatmap-header h3 {
  margin-bottom: 8px;
  color: #24292e;
  font-size: 1.8em;
}

.heatmap-subtitle {
  color: #586069;
  margin-bottom: 15px;
}

.calendar-wrapper {
  overflow: hidden;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.calendar-heading {
  margin-bottom: 15px;
  font-size: 1.2em;
  color: #24292e;
}

.contribution-calendar {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.last-updated {
  font-style: italic;
  color: #666;
  font-size: 0.8em;
  margin-top: 15px;
  text-align: right;
}

.error-message {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 12px;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .github-heatmap {
    padding: 15px;
    margin: 20px 0;
  }

  .calendar-wrapper iframe {
    height: auto;
    width: 100%;
    min-height: 120px;
  }
}
`;

document.head.appendChild(style);
