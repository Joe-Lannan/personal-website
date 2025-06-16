---
layout: archive
title: "Blog"
permalink: /blog/
author_profile: true
---

{% include base_path %}

<div class="blog-content">
  <p>Welcome to my blog where I share insights, research findings, and thoughts on biophysics and cellular mechanics.</p>

  {% if site.posts.size > 0 %}
    <!-- Recent Posts Section -->
    <div class="recent-posts-section">
      <h3>Recent Posts</h3>
      <div class="blog-posts-grid">
        {% assign recent_posts = site.posts | sort: 'date' | reverse | limit: 6 %}
        {% for post in recent_posts %}
          <div class="blog-card">
            <h4><a href="{{ base_path }}{{ post.url }}">{{ post.title }}</a></h4>
            {% if post.excerpt %}
              <p class="blog-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
            {% endif %}
            
            <div class="blog-metadata">
              {% if post.tags.size > 0 %}
                <div class="blog-tags">
                  {% for tag in post.tags limit:3 %}
                    <span class="blog-tag">{{ tag | replace: "-", " " }}</span>
                  {% endfor %}
                  {% if post.tags.size > 3 %}
                    <span class="blog-tag">+{{ post.tags.size | minus: 3 }}</span>
                  {% endif %}
                </div>
              {% endif %}
              
              {% if post.date %}
                <div class="blog-date">
                  <i class="fa fa-calendar" aria-hidden="true"></i> {{ post.date | date: "%b %d, %Y" }}
                </div>
              {% endif %}
            </div>
          </div>
        {% endfor %}
      </div>
    </div>

    <!-- Posts by Tag Section -->
    <div class="tags-section">
      <h3>Browse by Tag</h3>
      {% comment %}Get all tags from posts{% endcomment %}
      {% assign all_tags = "" | split: "" %}
      {% for post in site.posts %}
        {% for tag in post.tags %}
          {% unless all_tags contains tag %}
            {% assign all_tags = all_tags | push: tag %}
          {% endunless %}
        {% endfor %}
      {% endfor %}
      {% assign sorted_tags = all_tags | sort %}

      {% for tag in sorted_tags %}
        {% assign tag_posts = site.posts | where_exp: "item", "item.tags contains tag" | sort: 'date' | reverse %}
        {% if tag_posts.size > 0 %}
          <div class="tag-section">
            <h4 id="{{ tag | slugify }}">{{ tag | replace: "-", " " | capitalize }}</h4>
            <div class="tag-posts-list">
              {% for post in tag_posts %}
                <div class="tag-post-item">
                  <a href="{{ base_path }}{{ post.url }}">{{ post.title }}</a>
                  <span class="post-date">{{ post.date | date: "%b %d, %Y" }}</span>
                </div>
              {% endfor %}
            </div>
          </div>
        {% endif %}
      {% endfor %}
    </div>

    <!-- Tag Index -->
    <div class="tag-index">
      <h3>All Tags</h3>
      <div class="tag-cloud">
        {% for tag in sorted_tags %}
          {% assign tag_posts = site.posts | where_exp: "item", "item.tags contains tag" %}
          {% if tag_posts.size > 0 %}
            <a href="#{{ tag | slugify }}" class="tag-link">{{ tag | replace: "-", " " }} ({{ tag_posts.size }})</a>
          {% endif %}
        {% endfor %}
      </div>
    </div>
  {% else %}
    <p>No blog posts available yet. Check back soon for updates!</p>
  {% endif %}
</div>

<style>
  /* Use site's existing CSS custom properties for theme consistency */
  .blog-content {
    color: var(--global-text-color);
    background-color: var(--global-bg-color);
  }

  .blog-content h2,
  .blog-content h3,
  .blog-content h4 {
    color: var(--global-text-color);
  }

  .blog-content p {
    color: var(--global-text-color-light);
  }

  .blog-posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
    margin: 1em 0 2em 0;
  }
  
  .blog-card {
    background-color: var(--global-bg-color);
    border: 1px solid var(--global-border-color);
    border-radius: 6px;
    padding: 1.2em;
    transition: all 0.3s ease;
  }
  
  .blog-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: var(--global-link-color);
  }

  .blog-card h4 {
    margin-top: 0;
    margin-bottom: 0.8em;
  }

  .blog-card h4 a {
    color: var(--global-link-color);
    text-decoration: none;
    font-size: 1em;
    line-height: 1.3;
  }

  .blog-card h4 a:hover {
    color: var(--global-link-color-hover);
    text-decoration: underline;
  }
  
  .blog-excerpt {
    color: var(--global-text-color-light);
    margin: 0.6em 0;
    font-size: 0.85em;
    line-height: 1.4;
  }
  
  .blog-metadata {
    display: flex;
    justify-content: space-between;
    margin-top: 1em;
    font-size: 0.75em;
    flex-wrap: wrap;
    gap: 0.5em;
  }
  
  .blog-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3em;
  }
  
  .blog-tag {
    background-color: var(--global-footer-bg-color);
    color: var(--global-text-color-light);
    padding: 0.2em 0.5em;
    border-radius: 3px;
    font-size: 0.8em;
    border: 1px solid var(--global-border-color);
  }
  
  .blog-date {
    color: var(--global-text-color-light);
    white-space: nowrap;
    font-size: 0.8em;
  }
  
  .recent-posts-section,
  .tags-section {
    margin-bottom: 3em;
  }
  
  .recent-posts-section h3,
  .tags-section h3 {
    margin-bottom: 1em;
    padding-bottom: 0.5em;
    border-bottom: 2px solid var(--global-link-color);
    color: var(--global-text-color);
  }

  .tag-section {
    margin-bottom: 2em;
  }

  .tag-section h4 {
    color: var(--global-link-color);
    margin-bottom: 0.8em;
    font-size: 1.1em;
    border-bottom: 1px solid var(--global-border-color);
    padding-bottom: 0.3em;
  }

  .tag-posts-list {
    display: grid;
    gap: 0.5em;
  }

  .tag-post-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em 0.8em;
    background-color: var(--global-bg-color);
    border-radius: 4px;
    border: 1px solid var(--global-border-color);
    transition: all 0.2s ease;
  }

  .tag-post-item:hover {
    background-color: var(--global-footer-bg-color);
    border-color: var(--global-link-color);
  }

  .tag-post-item a {
    color: var(--global-text-color);
    text-decoration: none;
    flex: 1;
    margin-right: 1em;
  }

  .tag-post-item a:hover {
    color: var(--global-link-color);
    text-decoration: underline;
  }

  .tag-post-item .post-date {
    color: var(--global-text-color-light);
    font-size: 0.85em;
    white-space: nowrap;
  }
  
  .tag-index {
    background-color: var(--global-footer-bg-color);
    border: 1px solid var(--global-border-color);
    border-radius: 6px;
    padding: 1.5em;
    margin-top: 2em;
  }

  .tag-index h3 {
    color: var(--global-text-color);
    margin-top: 0;
    margin-bottom: 1em;
  }
  
  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
  }
  
  .tag-link {
    background-color: var(--global-bg-color);
    color: var(--global-text-color-light);
    padding: 0.4em 0.8em;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.9em;
    border: 1px solid var(--global-border-color);
    transition: all 0.2s ease;
  }
  
  .tag-link:hover {
    background-color: var(--global-link-color);
    color: #fff;
    border-color: var(--global-link-color);
    text-decoration: none;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .blog-posts-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    
    .blog-card {
      padding: 1em;
    }
    
    .tag-cloud {
      gap: 0.3em;
    }
    
    .tag-link {
      font-size: 0.8em;
      padding: 0.3em 0.6em;
    }
  }

  /* Dark theme specific shadow adjustments */
  html[data-theme="dark"] .blog-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
</style>
