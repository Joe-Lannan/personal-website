---
layout: archive
title: "Blog"
permalink: /blog/
author_profile: true
---

{% include base_path %}
{% include d3js.html %}

<div class="blog-content">
  <h2>Posts and Knowledge Maps</h2>
  <p>Welcome to my blog where I share thoughts, ideas, and knowledge maps from my Obsidian vault. Here you'll find a collection of both traditional blog posts and interactive knowledge visualizations.</p>

  <h3>Recent Posts</h3>
  <div class="archive">
    {% for post in site.posts limit:5 %}
      {% include archive-single.html %}
    {% endfor %}
    {% if site.posts.size > 5 %}
      <a href="{{ base_path }}/year-archive/" class="btn btn--primary">View All Posts</a>
    {% endif %}
  </div>

  <h3>Knowledge Maps</h3>
  <div class="knowledge-maps">
    <p>Below are interactive knowledge maps exported from my Obsidian vault. These maps represent interconnected ideas, research notes, and concepts that I've developed over time.</p>
    
    <div class="knowledge-map-grid">
      {% assign maps = site.knowledgemap | sort: "date" | reverse %}
      {% if maps.size > 0 %}
        {% for map in maps %}
          <div class="knowledge-map-card">
            <h4><a href="{{ base_path }}{{ map.url }}">{{ map.title }}</a></h4>
            
            <div class="map-thumbnail">
              {% if map.thumbnail %}
                <img src="{{ base_path }}/images/knowledgemaps/{{ map.thumbnail }}" alt="{{ map.title }} thumbnail">
              {% else %}
                <div class="map-placeholder">
                  <i class="fa fa-sitemap" aria-hidden="true"></i>
                </div>
              {% endif %}
            </div>
            
            {% if map.excerpt %}
              <p class="map-excerpt">{{ map.excerpt | strip_html | truncate: 120 }}</p>
            {% endif %}
            
            <div class="map-metadata">
              {% if map.categories %}
                <div class="map-categories">
                  {% for category in map.categories %}
                    <span class="map-category">{{ category }}</span>
                  {% endfor %}
                </div>
              {% endif %}
              
              {% if map.date %}
                <div class="map-date">
                  <i class="fa fa-calendar" aria-hidden="true"></i> {{ map.date | date: "%B %d, %Y" }}
                </div>
              {% endif %}
            </div>
            
            <a href="{{ base_path }}{{ map.url }}" class="btn btn--small btn--primary">View Map</a>
          </div>
        {% endfor %}
      {% else %}
        <p class="notice--info">Knowledge maps coming soon! Check back for updates as I integrate my Obsidian vault with this website. You can add knowledge maps by creating markdown files in the _knowledgemap folder.</p>
      {% endif %}
    </div>
  </div>
</div>

<style>
  .knowledge-map-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 1.5em;
  }
  
  .knowledge-map-card {
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 1.5em;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }
  
  .knowledge-map-card:hover {
    transform: translateY(-5px);
  }
  
  .map-thumbnail {
    height: 150px;
    background-color: #eee;
    margin: 1em 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 4px;
  }
  
  .map-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .map-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 3em;
    color: #999;
  }
  
  .map-excerpt {
    color: #666;
    margin-bottom: 1em;
  }
  
  .map-metadata {
    display: flex;
    justify-content: space-between;
    margin: 1em 0;
    font-size: 0.9em;
  }
  
  .map-categories {
    display: flex;
    flex-wrap: wrap;
  }
  
  .map-category {
    background-color: #e9ecef;
    padding: 0.2em 0.6em;
    border-radius: 3px;
    margin-right: 0.5em;
    margin-bottom: 0.5em;
    font-size: 0.8em;
  }
  
  .map-date {
    color: #666;
  }
  
  .notice--info {
    background-color: #d9edf7;
    border: 1px solid #bce8f1;
    border-radius: 4px;
    padding: 15px;
    color: #31708f;
    margin: 1em 0;
  }
</style>

<script src="{{ base_path }}/assets/js/knowledge-map.js"></script>