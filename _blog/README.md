# Blog and Knowledge Map System

This directory contains your blog posts from Obsidian, organized by topic directories. The system automatically generates a knowledge map visualization showing connections between your notes.

## Directory Structure

Posts are organized by topic directories:
- `_blog/biophysics/` - Posts related to biophysics research
- `_blog/programming/` - Posts about programming topics
- `_blog/companies/` - Content about your companies and entrepreneurship
- etc.

You can create as many subdirectories as needed to organize your content.

## How to Add Blog Posts

### Option 1: Automated Import from Obsidian

The recommended approach is to use the Python script to automatically import your Obsidian vault:

1. Navigate to the `_scripts` directory
2. Run:
```bash
python obsidian_to_website.py --vault /path/to/your/obsidian/vault --output ../personal-website/_blog
```

This will:
- Import all markdown files from your Obsidian vault
- Preserve directory structure
- Process wiki-links between notes
- Extract tags for categorization
- Handle images and other attachments
- Generate the knowledge graph data

### Option 2: Manual Creation

You can also create posts manually by adding markdown files to the appropriate directory with proper frontmatter:

```yaml
---
title: "Your Post Title"
date: YYYY-MM-DD
excerpt: "Brief description of the post"
collection: blog
tags:
  - tag1
  - tag2
---

Your content goes here...
```

## Knowledge Map Visualization

The knowledge map visualization on the blog page shows connections between your notes based on wiki-links in the Obsidian files. The map:

- Shows each note as a node
- Displays connections between linked notes
- Color-codes notes by primary tag
- Sizes nodes based on connection count

When you click on a node in the knowledge map, you'll see:
- The note title
- Associated tags
- A link to the full post

## The Knowledge Graph Data

The knowledge graph data is stored in `assets/js/knowledge-graph-data.json` and is automatically updated when you run the import script. You don't need to edit this file manually.

## Images and Attachments

Images referenced in your Obsidian notes will be:
1. Copied to `images/blog/` directory
2. Properly linked in the imported markdown
3. Displayed in your blog posts

## Tips for Best Results

1. **Use wiki-links in Obsidian**: The more connections between notes, the richer your knowledge map will be
2. **Add tags to your notes**: Tags help with categorization and color-coding in the visualization
3. **Organize with directories**: Keep related topics in directories for better organization
4. **Add frontmatter**: Including title, date, and excerpt in your Obsidian notes will improve the presentation
5. **Use meaningful filenames**: These will be used for URLs if no title is specified