---
layout: archive
title: "GitHub Projects"
permalink: /github-projects/
author_profile: true
---

{% include base_path %}

<div class="github-projects">
  <p>Below are my featured GitHub repositories, automatically updated from my GitHub profile.</p>
  
  {% if site.data.repositories.repositories %}
    {% assign repos = site.data.repositories.repositories %}
    
    <div class="grid__wrapper">
      {% for repo in repos %}
        <div class="grid__item">
          <div class="archive__item">
            <div class="archive__item-body">
              <h2 class="archive__item-title">
                <a href="{{ repo.html_url }}">{{ repo.name }}</a>
              </h2>
              
              <div class="archive__item-excerpt">
                <p>{{ repo.description }}</p>
                
                {% if repo.language %}
                <p><strong>Language:</strong> {{ repo.language }}</p>
                {% endif %}
                
                <p>
                  <span class="repo-stat"><i class="fa fa-star" aria-hidden="true"></i> {{ repo.stars }}</span>
                  <span class="repo-stat"><i class="fa fa-code-fork" aria-hidden="true"></i> {{ repo.forks }}</span>
                  <span class="repo-stat"><i class="fa fa-calendar" aria-hidden="true"></i> Updated: {{ repo.updated_at }}</span>
                </p>
                
                {% if repo.topics and repo.topics.size > 0 %}
                <p class="repo-topics">
                  {% for topic in repo.topics %}
                  <span class="repo-topic">{{ topic }}</span>
                  {% endfor %}
                </p>
                {% endif %}
                
                <div class="repo-links">
                  <a href="{{ repo.html_url }}" class="btn btn--primary">View on GitHub</a>
                  {% if repo.homepage %}
                  <a href="{{ repo.homepage }}" class="btn btn--secondary">Project Website</a>
                  {% endif %}
                </div>
              </div>
            </div>
          </div>
        </div>
      {% endfor %}
    </div>
    
    <p class="last-updated">Last updated: {{ site.data.repositories.last_updated }}</p>
  {% else %}
    <p>No GitHub repositories found. Please check back later.</p>
  {% endif %}
</div>

<style>
  .repo-stat {
    margin-right: 15px;
    color: #666;
  }
  .repo-topics {
    margin: 10px 0;
  }
  .repo-topic {
    display: inline-block;
    background: #f1f8ff;
    border: 1px solid #c8e1ff;
    border-radius: 3px;
    padding: 2px 8px;
    margin-right: 5px;
    margin-bottom: 5px;
    font-size: 0.8em;
  }
  .repo-links {
    margin-top: 15px;
  }
  .last-updated {
    font-style: italic;
    color: #666;
    font-size: 0.8em;
    margin-top: 30px;
  }
</style>