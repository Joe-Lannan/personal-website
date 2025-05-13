---
layout: archive
title: "Publications"
permalink: /publications-auto/
author_profile: true
---

{% include base_path %}

<div class="publications">
  <p>Below are my publications and preprints, automatically updated from Google Scholar and other sources.</p>
  
  {% if site.data.publications %}
    <h2>Publications</h2>
    {% if site.data.publications.publications and site.data.publications.publications.size > 0 %}
      <ul class="publication-list">
        {% for pub in site.data.publications.publications %}
          <li class="publication-item">
            <div class="publication-title">
              {% if pub.url %}
                <a href="{{ pub.url }}">{{ pub.title }}</a>
              {% else %}
                {{ pub.title }}
              {% endif %}
            </div>
            
            <div class="publication-authors">{{ pub.authors }}</div>
            
            <div class="publication-venue">
              <em>{{ pub.venue }}</em>, {{ pub.year }}
              {% if pub.citations %}
                <span class="publication-citations">
                  <i class="fa fa-quote-right" aria-hidden="true"></i> {{ pub.citations }}
                </span>
              {% endif %}
            </div>
            
            <div class="publication-links">
              {% if pub.doi %}
                <a href="https://doi.org/{{ pub.doi }}" class="publication-link">
                  <i class="fa fa-external-link" aria-hidden="true"></i> DOI
                </a>
              {% endif %}
              
              {% if pub.url %}
                <a href="{{ pub.url }}" class="publication-link">
                  <i class="fa fa-file-text" aria-hidden="true"></i> Paper
                </a>
              {% endif %}
            </div>
          </li>
        {% endfor %}
      </ul>
    {% else %}
      <p>No published papers found.</p>
    {% endif %}
    
    <h2>Preprints</h2>
    {% if site.data.publications.preprints and site.data.publications.preprints.size > 0 %}
      <ul class="publication-list">
        {% for pub in site.data.publications.preprints %}
          <li class="publication-item">
            <div class="publication-title">
              {% if pub.url %}
                <a href="{{ pub.url }}">{{ pub.title }}</a>
              {% else %}
                {{ pub.title }}
              {% endif %}
            </div>
            
            <div class="publication-authors">{{ pub.authors }}</div>
            
            <div class="publication-venue">
              <em>{{ pub.venue }}</em>, {{ pub.year }}
            </div>
            
            <div class="publication-links">
              {% if pub.doi %}
                <a href="https://doi.org/{{ pub.doi }}" class="publication-link">
                  <i class="fa fa-external-link" aria-hidden="true"></i> DOI
                </a>
              {% endif %}
              
              {% if pub.url %}
                <a href="{{ pub.url }}" class="publication-link">
                  <i class="fa fa-file-text" aria-hidden="true"></i> Preprint
                </a>
              {% endif %}
            </div>
          </li>
        {% endfor %}
      </ul>
    {% else %}
      <p>No preprints found.</p>
    {% endif %}
    
    <p class="last-updated">Last updated: {{ site.data.publications.last_updated }}</p>
  {% else %}
    <p>No publication data found. Please check back later.</p>
  {% endif %}
</div>

<style>
  .publication-list {
    list-style: none;
    padding-left: 0;
  }
  
  .publication-item {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .publication-title {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .publication-authors {
    margin-bottom: 5px;
  }
  
  .publication-venue {
    color: #666;
    margin-bottom: 8px;
  }
  
  .publication-citations {
    margin-left: 10px;
    color: #2079c7;
    font-weight: bold;
  }
  
  .publication-link {
    margin-right: 15px;
    font-size: 0.9em;
  }
  
  .last-updated {
    font-style: italic;
    color: #666;
    font-size: 0.8em;
    margin-top: 30px;
  }
</style>