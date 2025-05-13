---
layout: archive
title: "Blog"
permalink: /blog/
author_profile: true
---

{% include base_path %}
{% include d3js.html %}

<div class="blog-content">
  <h2>Knowledge Map</h2>
  <p>This interactive map shows connections between my notes, research, and thoughts. The visualization demonstrates how different topics relate to each other within my knowledge base.</p>
  
  <div id="knowledge-graph-container" class="knowledge-graph-container">
    <!-- Knowledge graph will be loaded here -->
    <div class="loading">Loading knowledge graph...</div>
  </div>
  
  <h2>Blog Posts</h2>
  <p>Welcome to my blog where I share thoughts, ideas, and concepts from my Obsidian vault. Here you'll find a collection of posts organized by topic.</p>

  <div class="directory-explorer">
    {% comment %}Get all directories in the blog collection{% endcomment %}
    {% assign blog_dirs = "" | split: "" %}
    {% if site.blog.size > 0 %}
      {% for blog in site.blog %}
        {% assign path_parts = blog.path | split: "/" %}
        {% if path_parts.size > 2 %}
          {% assign dir = path_parts[1] %}
          {% unless blog_dirs contains dir %}
            {% assign blog_dirs = blog_dirs | push: dir %}
          {% endunless %}
        {% endif %}
      {% endfor %}
    {% endif %}
    
    {% if blog_dirs.size > 0 %}
      <div class="directory-sections">
        {% for dir in blog_dirs %}
          <div class="directory-section">
            <h3>{{ dir | capitalize }}</h3>
            <div class="blog-posts-grid">
              {% assign dir_posts = site.blog | where_exp: "item", "item.path contains dir" %}
              {% for post in dir_posts %}
                <div class="blog-card">
                  <h4><a href="{{ base_path }}{{ post.url }}">{{ post.title }}</a></h4>
                  {% if post.excerpt %}
                    <p class="blog-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
                  {% endif %}
                  
                  <div class="blog-metadata">
                    {% if post.tags.size > 0 %}
                      <div class="blog-tags">
                        {% for tag in post.tags limit:3 %}
                          <span class="blog-tag">{{ tag }}</span>
                        {% endfor %}
                        {% if post.tags.size > 3 %}
                          <span class="blog-tag">+{{ post.tags.size | minus: 3 }}</span>
                        {% endif %}
                      </div>
                    {% endif %}
                    
                    {% if post.date %}
                      <div class="blog-date">
                        <i class="fa fa-calendar" aria-hidden="true"></i> {{ post.date | date: "%B %d, %Y" }}
                      </div>
                    {% endif %}
                  </div>
                </div>
              {% endfor %}
            </div>
          </div>
        {% endfor %}
      </div>
      
      <!-- Root level posts -->
      {% if site.blog.size > 0 %}
        {% assign root_posts = site.blog | where_exp: "item", "item.path contains '_blog/'" | where_exp: "item", "item.path | split: '/' | size <= 3" %}
        {% if root_posts.size > 0 %}
        <div class="directory-section">
          <h3>Other Posts</h3>
          <div class="blog-posts-grid">
            {% for post in root_posts %}
              <div class="blog-card">
                <h4><a href="{{ base_path }}{{ post.url }}">{{ post.title }}</a></h4>
                {% if post.excerpt %}
                  <p class="blog-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
                {% endif %}
                
                <div class="blog-metadata">
                  {% if post.tags.size > 0 %}
                    <div class="blog-tags">
                      {% for tag in post.tags limit:3 %}
                        <span class="blog-tag">{{ tag }}</span>
                      {% endfor %}
                      {% if post.tags.size > 3 %}
                        <span class="blog-tag">+{{ post.tags.size | minus: 3 }}</span>
                      {% endif %}
                    </div>
                  {% endif %}
                  
                  {% if post.date %}
                    <div class="blog-date">
                      <i class="fa fa-calendar" aria-hidden="true"></i> {{ post.date | date: "%B %d, %Y" }}
                    </div>
                  {% endif %}
                </div>
              </div>
            {% endfor %}
          </div>
        </div>
      {% endif %}
      {% endif %}
    {% endif %}
    
    {% if blog_dirs.size == 0 and site.blog.size == 0 %}
      <p class="notice--info">Blog content coming soon! You can add blog posts by importing your Obsidian vault using the Python script in _scripts/obsidian_to_website.py</p>
    {% endif %}
  </div>
</div>

<style>
  .knowledge-graph-container {
    width: 100%;
    height: 600px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin: 1em 0 3em 0;
    position: relative;
    background: #f9f9f9;
  }
  
  .blog-posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin: 1em 0 2em 0;
  }
  
  .blog-card {
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 1.5em;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }
  
  .blog-card:hover {
    transform: translateY(-5px);
  }
  
  .blog-excerpt {
    color: #666;
    margin: 0.8em 0;
    font-size: 0.9em;
  }
  
  .blog-metadata {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5em;
    font-size: 0.8em;
    flex-wrap: wrap;
  }
  
  .blog-tags {
    display: flex;
    flex-wrap: wrap;
  }
  
  .blog-tag {
    background-color: #e9ecef;
    padding: 0.2em 0.6em;
    border-radius: 3px;
    margin-right: 0.5em;
    margin-bottom: 0.5em;
  }
  
  .blog-date {
    color: #666;
    white-space: nowrap;
  }
  
  .directory-section {
    margin-bottom: 2em;
  }
  
  .directory-section h3 {
    margin-bottom: 0.5em;
    padding-bottom: 0.5em;
    border-bottom: 1px solid #eee;
  }
  
  .notice--info {
    background-color: #d9edf7;
    border: 1px solid #bce8f1;
    border-radius: 4px;
    padding: 15px;
    color: #31708f;
    margin: 1em 0;
  }
  
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #666;
    font-style: italic;
  }
  
  .graph-filter-container {
    margin: 1em 0;
  }
  
  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 0.5em;
  }
  
  .filter-button {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 0.3em 0.8em;
    font-size: 0.85em;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .filter-button:hover {
    background-color: #e0e0e0;
  }
  
  .filter-button.active {
    background-color: #4285f4;
    color: white;
    border-color: #3367d6;
  }
  
  .node-info-panel {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 250px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 100;
    overflow: hidden;
  }
  
  .info-header {
    padding: 10px;
    color: white;
    position: relative;
  }
  
  .info-header h3 {
    margin: 0;
    padding-right: 30px;
  }
  
  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .info-body {
    padding: 15px;
  }
  
  .view-post-btn {
    display: inline-block;
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #4285f4;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.9em;
    transition: background-color 0.2s;
  }
  
  .view-post-btn:hover {
    background-color: #3367d6;
    text-decoration: none;
  }
</style>

<script src="{{ base_path }}/assets/js/knowledge-graph.js"></script>