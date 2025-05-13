// Knowledge Graph Visualization
// This script renders an interactive visualization of connections between blog posts

class KnowledgeGraph {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    // Default options
    this.options = {
      width: this.container.clientWidth,
      height: 600,
      nodeRadius: 8,
      linkStrength: -300,
      linkDistance: 100,
      highlightDuration: 300,
      dataUrl: '/assets/js/knowledge-graph-data.json',
      ...options
    };

    this.svg = null;
    this.simulation = null;
    this.nodes = [];
    this.links = [];
    this.searchIndex = {};
    this.categories = new Set();

    this.highlightedNode = null;
    this.selectedNode = null;

    // Initialize the visualization
    this.init();
  }

  init() {
    this.createSvg();
    this.loadData();
    this.setupEventListeners();
  }

  createSvg() {
    // Create SVG container
    this.svg = d3.select(`#${this.containerId}`)
      .append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height)
      .attr('class', 'knowledge-graph-svg');

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        this.graphGroup.attr('transform', event.transform);
      });

    // Add zoom to SVG
    this.svg.call(zoom);

    // Create a group for all graph elements
    this.graphGroup = this.svg.append('g')
      .attr('class', 'graph-group');
  }

  loadData() {
    d3.json(this.options.dataUrl)
      .then(data => {
        if (!data || !data.nodes || !data.links) {
          throw new Error('Invalid data format');
        }
        this.processData(data);
        this.renderGraph();
      })
      .catch(error => {
        console.error('Error loading graph data:', error);
        this.showError(`Failed to load knowledge graph: ${error.message}`);
      });
  }

  processData(data) {
    this.nodes = data.nodes;
    this.links = data.links;

    // Build search index
    this.nodes.forEach(node => {
      this.searchIndex[node.id.toLowerCase()] = node;
      if (node.tags) {
        node.tags.forEach(tag => this.categories.add(tag));
      }
    });
  }

  renderGraph() {
    // Create the links
    this.linkElements = this.graphGroup.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke-width', d => Math.sqrt(d.value) * 0.5)
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6);

    // Create the nodes
    this.nodeElements = this.graphGroup.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .call(d3.drag()
        .on('start', (event, d) => this.dragStarted(event, d))
        .on('drag', (event, d) => this.dragging(event, d))
        .on('end', (event, d) => this.dragEnded(event, d)))
      .on('mouseover', (event, d) => this.highlightNode(d))
      .on('mouseout', () => this.unhighlightNode())
      .on('click', (event, d) => this.selectNode(d, event));

    // Add circles to nodes
    this.nodeElements.append('circle')
      .attr('r', d => Math.min(Math.max(d.size * 0.8, 5), 20))
      .attr('fill', d => d.color || '#69b3a2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    // Add labels to nodes
    this.nodeElements.append('text')
      .text(d => this.truncateLabel(d.label, 20))
      .attr('dx', 12)
      .attr('dy', '.35em')
      .attr('font-size', '10px')
      .attr('fill', '#333')
      .style('pointer-events', 'none');

    // Add tooltips
    this.nodeElements.append('title')
      .text(d => `${d.label}\nTags: ${d.tags ? d.tags.join(', ') : 'none'}`);

    // Create the simulation
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links).id(d => d.id).distance(this.options.linkDistance))
      .force('charge', d3.forceManyBody().strength(this.options.linkStrength))
      .force('center', d3.forceCenter(this.options.width / 2, this.options.height / 2))
      .force('collide', d3.forceCollide().radius(d => Math.min(Math.max(d.size * 1.2, 10), 30)))
      .on('tick', () => this.ticked());

    // Position nodes in clusters based on tags if available
    this.applyTagClustering();

    // Generate category filter UI
    if (this.categories.size > 0) {
      this.createCategoryFilters();
    }
  }

  ticked() {
    // Update link positions
    this.linkElements
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    // Update node positions
    this.nodeElements.attr('transform', d => `translate(${d.x}, ${d.y})`);
  }

  dragStarted(event, d) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragging(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  dragEnded(event, d) {
    if (!event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  highlightNode(node) {
    if (this.selectedNode) return;
    this.highlightedNode = node;

    // Find connected nodes
    const connectedNodeIds = new Set();
    this.links.forEach(link => {
      if (link.source.id === node.id) connectedNodeIds.add(link.target.id);
      if (link.target.id === node.id) connectedNodeIds.add(link.source.id);
    });

    // Highlight the node and its connections
    this.nodeElements.selectAll('circle')
      .attr('opacity', d => {
        return d.id === node.id || connectedNodeIds.has(d.id) ? 1 : 0.3;
      });

    this.linkElements
      .attr('opacity', link => {
        return link.source.id === node.id || link.target.id === node.id ? 1 : 0.1;
      })
      .attr('stroke-width', link => {
        return link.source.id === node.id || link.target.id === node.id 
          ? Math.sqrt(link.value) * 1 
          : Math.sqrt(link.value) * 0.5;
      });
  }

  unhighlightNode() {
    if (this.selectedNode) return;
    this.highlightedNode = null;

    // Reset all nodes and links
    this.nodeElements.selectAll('circle')
      .attr('opacity', 1);

    this.linkElements
      .attr('opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value) * 0.5);
  }

  selectNode(node, event) {
    if (event.defaultPrevented) return;
    
    if (this.selectedNode === node) {
      // Deselect if clicking the same node
      this.selectedNode = null;
      this.unhighlightNode();
      this.hideNodeInfo();
    } else {
      // Select new node
      this.selectedNode = node;
      this.highlightNode(node);
      this.showNodeInfo(node);
      
      // Prevent event from bubbling to the SVG
      event.stopPropagation();
    }
  }

  showNodeInfo(node) {
    // Check if info panel already exists
    let infoPanel = document.getElementById('node-info-panel');
    if (!infoPanel) {
      // Create info panel
      infoPanel = document.createElement('div');
      infoPanel.id = 'node-info-panel';
      infoPanel.className = 'node-info-panel';
      this.container.appendChild(infoPanel);
    }

    // Populate with node information
    const tags = node.tags ? node.tags.join(', ') : 'none';
    
    let html = `
      <div class="info-header" style="background-color: ${node.color || '#69b3a2'}">
        <h3>${node.label}</h3>
        <button class="close-button">&times;</button>
      </div>
      <div class="info-body">
        <p><strong>Tags:</strong> ${tags}</p>
    `;
    
    // Add link to the actual blog post if available
    if (node.path) {
      html += `<a href="${node.path}" class="view-post-btn">View Post</a>`;
    }
    
    html += `</div>`;
    infoPanel.innerHTML = html;
    
    // Add close button event listener
    const closeButton = infoPanel.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      this.selectedNode = null;
      this.unhighlightNode();
      this.hideNodeInfo();
    });
  }

  hideNodeInfo() {
    const infoPanel = document.getElementById('node-info-panel');
    if (infoPanel) {
      infoPanel.remove();
    }
  }

  truncateLabel(label, maxLength) {
    if (!label) return '';
    return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
  }

  setupEventListeners() {
    // Click outside to deselect nodes
    this.svg.on('click', () => {
      if (this.selectedNode) {
        this.selectedNode = null;
        this.unhighlightNode();
        this.hideNodeInfo();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    const newWidth = this.container.clientWidth;
    this.options.width = newWidth;
    
    this.svg.attr('width', newWidth);
    
    // Update center force
    this.simulation.force('center', d3.forceCenter(newWidth / 2, this.options.height / 2));
    this.simulation.alpha(0.3).restart();
  }

  applyTagClustering() {
    // Group nodes by their primary tag
    const tagGroups = {};
    
    this.nodes.forEach(node => {
      if (node.tags && node.tags.length > 0) {
        const primaryTag = node.tags[0];
        if (!tagGroups[primaryTag]) {
          tagGroups[primaryTag] = [];
        }
        tagGroups[primaryTag].push(node);
      }
    });
    
    // Position nodes in clusters
    const centerX = this.options.width / 2;
    const centerY = this.options.height / 2;
    const radius = Math.min(this.options.width, this.options.height) * 0.4;
    
    let i = 0;
    const totalGroups = Object.keys(tagGroups).length;
    
    for (const tag in tagGroups) {
      const angle = (i / totalGroups) * 2 * Math.PI;
      const groupX = centerX + Math.cos(angle) * radius;
      const groupY = centerY + Math.sin(angle) * radius;
      
      // Position nodes in this group
      const nodes = tagGroups[tag];
      nodes.forEach(node => {
        // Add some randomness to avoid perfect overlap
        node.x = groupX + (Math.random() - 0.5) * 50;
        node.y = groupY + (Math.random() - 0.5) * 50;
      });
      
      i++;
    }
    
    // Reheat the simulation
    this.simulation.alpha(1).restart();
  }
  
  createCategoryFilters() {
    // Create filter container
    const filterContainer = document.createElement('div');
    filterContainer.className = 'graph-filter-container';
    
    // Add heading
    const heading = document.createElement('h4');
    heading.textContent = 'Filter by Tag:';
    filterContainer.appendChild(heading);
    
    // Create filter buttons
    const filterButtons = document.createElement('div');
    filterButtons.className = 'filter-buttons';
    
    // Add "All" button
    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.className = 'filter-button active';
    allButton.addEventListener('click', () => this.filterByTag(null, allButton));
    filterButtons.appendChild(allButton);
    
    // Add tag buttons
    this.categories.forEach(tag => {
      const button = document.createElement('button');
      button.textContent = tag;
      button.className = 'filter-button';
      button.addEventListener('click', () => this.filterByTag(tag, button));
      filterButtons.appendChild(button);
    });
    
    filterContainer.appendChild(filterButtons);
    
    // Add filter container before the SVG
    this.container.insertBefore(filterContainer, this.container.firstChild);
  }
  
  filterByTag(tag, clickedButton) {
    // Update button states
    const buttons = document.querySelectorAll('.filter-button');
    buttons.forEach(button => button.classList.remove('active'));
    clickedButton.classList.add('active');
    
    // Reset any selection
    this.selectedNode = null;
    this.hideNodeInfo();
    
    if (!tag) {
      // Show all nodes and links
      this.nodeElements.style('display', null);
      this.linkElements.style('display', null);
      return;
    }
    
    // Filter nodes by tag
    const relevantNodeIds = new Set();
    this.nodes.forEach(node => {
      const hasTag = node.tags && node.tags.includes(tag);
      relevantNodeIds.add(node.id);
    });
    
    // Show/hide nodes
    this.nodeElements.style('display', d => {
      const hasTag = d.tags && d.tags.includes(tag);
      return hasTag ? null : 'none';
    });
    
    // Show/hide links
    this.linkElements.style('display', d => {
      const sourceHasTag = d.source.tags && d.source.tags.includes(tag);
      const targetHasTag = d.target.tags && d.target.tags.includes(tag);
      return (sourceHasTag && targetHasTag) ? null : 'none';
    });
    
    // Reheat the simulation
    this.simulation.alpha(0.3).restart();
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    this.container.appendChild(errorDiv);
  }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
  const graphContainer = document.getElementById('knowledge-graph-container');
  if (graphContainer) {
    const graph = new KnowledgeGraph('knowledge-graph-container');
  }
});