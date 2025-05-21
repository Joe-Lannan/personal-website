---
layout: archive
title: "GitHub Projects"
permalink: /github-projects/
author_profile: true
---

{% include base_path %}

<div class="github-projects">
  <p>Below are my featured GitHub repositories, automatically fetched from my GitHub profile.</p>
  <p>These repositories showcase my work in biophysics research, software development, and hardware projects related to Koinslot.</p>

  <!-- Container for dynamically loaded GitHub repositories -->
  <div id="github-projects-container">
    <!-- GitHub repositories will be loaded here -->
  </div>
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
  .error-message {
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 10px;
    margin-top: 15px;
  }
  .grid__wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  .grid__item {
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }
  .grid__item:hover {
    transform: translateY(-5px);
  }
</style>

<!-- Load the GitHub repository fetcher script -->
<script src="{{ base_path }}/assets/js/github-projects.js"></script>
