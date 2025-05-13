# Knowledge Maps for Your Personal Website

This folder contains knowledge maps exported from your Obsidian vault that are displayed in the Blog section of your personal website. These maps visually represent the connections between concepts, ideas, and research topics.

## How to Add Knowledge Maps

You can add knowledge maps in two ways:

### 1. Manual Creation

Create a new Markdown file in this `_knowledgemap` directory with the following YAML frontmatter:

```yaml
---
title: "Your Knowledge Map Title"
date: YYYY-MM-DD
excerpt: "A brief description of this knowledge map"
collection: knowledgemap
categories: 
  - category1
  - category2
tags:
  - tag1
  - tag2
interactive_map: true
thumbnail: "optional-thumbnail-image.jpg"
map_data:
  nodes:
    - id: "node1"
      display: "Node 1 Label"
      size: 12
      color: "#4285f4"
      tooltip: "Info about this node"
    - id: "node2"
      display: "Node 2 Label"
      size: 10
      color: "#ea4335"
      tooltip: "Info about this node"
  edges:
    - fromNode: "node1"
      toNode: "node2"
      weight: 3
---

Content of your knowledge map page goes here.
```

### 2. Automated Import from Obsidian

You can use the provided Python script to automatically convert Obsidian notes to knowledge maps:

1. Navigate to the `_scripts` directory
2. Run the conversion script:

```bash
cd personal-website/_scripts
python obsidian_to_jekyll.py --vault /path/to/your/obsidian/vault --output ../personal-website/_knowledgemap
```

This will:
- Process all Markdown files in your Obsidian vault
- Extract links between notes to create graph data
- Copy images to the appropriate directory
- Generate thumbnails for each map
- Create properly formatted markdown files in this directory

## Knowledge Map Display

Each knowledge map will:
- Appear in the Blog page's Knowledge Maps section
- Have its own dedicated page with interactive visualization
- Show connections between concepts based on the graph data

## Customizing Map Visualization

You can customize the appearance of your knowledge maps by:

1. Adding a thumbnail image in the `images/knowledgemaps` directory
2. Customizing node colors, sizes, and tooltips in the frontmatter
3. Adjusting the map display by editing the `_layouts/knowledgemap.html` file

## Requirements

The knowledge map visualization requires D3.js, which is automatically included when the maps are displayed.

## Example

See `biophysics-concepts.md` for an example of a knowledge map with proper formatting.