/**
 * Knowledge Map Visualization
 * This script handles the visualization of Obsidian knowledge maps using D3.js
 */

// Wait for D3.js to be loaded
function initializeKnowledgeMap(containerId, graphData) {
  if (!window.d3) {
    console.error("D3.js is required for knowledge map visualization");
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '<div class="error-message">D3.js library is required for visualization but was not found.</div>';
    }
    return;
  }

  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container not found:", containerId);
    return;
  }

  // Get container dimensions
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Clear any existing content
  container.innerHTML = '';

  // Create SVG container
  const svg = d3.select(`#${containerId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create the simulation
  const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(60));

  // Create the links
  const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graphData.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke-width", d => Math.sqrt(d.value || 1))
    .attr("stroke", d => d.color || "#999");

  // Create the nodes
  const nodeGroup = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(graphData.nodes)
    .enter()
    .append("g")
    .call(d3.drag()
      .on("start", dragStarted)
      .on("drag", dragging)
      .on("end", dragEnded));

  // Add circles to the node groups
  nodeGroup.append("circle")
    .attr("class", "node")
    .attr("r", d => d.size || 10)
    .attr("fill", d => d.color || "#69b3a2")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5);

  // Add labels to the node groups
  nodeGroup.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(d => d.label || d.id)
    .attr("font-size", "10px")
    .attr("fill", "#333");

  // Add tooltips
  nodeGroup.append("title")
    .text(d => d.tooltip || d.label || d.id);

  // Add zoom functionality
  const zoom = d3.zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", zoomed);

  svg.call(zoom);

  function zoomed(event) {
    link.attr("transform", event.transform);
    nodeGroup.attr("transform", event.transform);
  }

  // Update positions on each tick of the simulation
  simulation.nodes(graphData.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graphData.links);

  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeGroup
      .attr("transform", d => `translate(${d.x}, ${d.y})`);
  }

  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragging(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return {
    updateData: function(newData) {
      // Update the visualization with new data
      simulation.nodes(newData.nodes);
      simulation.force("link").links(newData.links);
      simulation.alpha(1).restart();
      
      // Update the links
      link = link.data(newData.links);
      link.exit().remove();
      link = link.enter().append("line")
        .attr("class", "link")
        .merge(link);
        
      // Update the nodes
      nodeGroup = nodeGroup.data(newData.nodes, d => d.id);
      nodeGroup.exit().remove();
      
      const newNodes = nodeGroup.enter().append("g");
      newNodes.append("circle")
        .attr("class", "node")
        .attr("r", d => d.size || 10)
        .attr("fill", d => d.color || "#69b3a2");
        
      newNodes.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(d => d.label || d.id);
        
      nodeGroup = newNodes.merge(nodeGroup);
    }
  };
}

// Utility function to convert Obsidian graph data to D3 format
function convertObsidianToD3Graph(obsidianData) {
  if (!obsidianData || !obsidianData.nodes || !obsidianData.edges) {
    console.error("Invalid Obsidian graph data format");
    return { nodes: [], links: [] };
  }

  // Map nodes
  const nodes = obsidianData.nodes.map(node => ({
    id: node.id,
    label: node.display || node.id,
    color: node.color || "#69b3a2",
    size: node.size || 5,
    tooltip: node.tooltip || node.display || node.id
  }));

  // Map edges/links
  const links = obsidianData.edges.map(edge => ({
    source: edge.fromNode,
    target: edge.toNode,
    value: edge.weight || 1,
    color: edge.color || "#999"
  }));

  return { nodes, links };
}

// Function to load Obsidian JSON data from a file
function loadObsidianGraph(filePath, containerId) {
  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(obsidianData => {
      const graphData = convertObsidianToD3Graph(obsidianData);
      initializeKnowledgeMap(containerId, graphData);
    })
    .catch(error => {
      console.error("Error loading knowledge map data:", error);
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `<div class="error-message">Failed to load knowledge map: ${error.message}</div>`;
      }
    });
}