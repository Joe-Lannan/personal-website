---
layout: archive
title: "Publications"
permalink: /publications-auto/
author_profile: true
---

{% include base_path %}

<div class="citation-stats">
  <h2>Citation Statistics</h2>
  <p>Academic impact metrics automatically fetched from Google Scholar.</p>
  <div id="scholar-stats-container">
    <!-- Scholar stats will be loaded here by scholar-stats.js -->
    <p class="loading">Loading citation statistics...</p>
  </div>
</div>

<style>
  .stat-card {
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .stat-heading {
    font-size: 1.5em;
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
  }
  
  .stat-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .stat-table th, .stat-table td {
    padding: 8px;
    text-align: center;
  }
  
  .stat-table th {
    border-bottom: 1px solid #ddd;
  }
  
  .scholar-link {
    display: inline-block;
    margin-top: 15px;
    text-decoration: none;
    padding: 8px 15px;
    background-color: #4285f4;
    color: white;
    border-radius: 4px;
  }
  
  .scholar-link:hover {
    background-color: #3367d6;
  }
  
  .error-message {
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 10px;
    margin-top: 15px;
  }
</style>

<div class="publications">
  <h2>Published Papers</h2>
  <p>Below are my publications and research work, automatically fetched from scholarly databases like Semantic Scholar and Google Scholar.</p>
  <p>My research focuses on biophysics, particularly the ultrafast contraction mechanisms in unicellular organisms like <em>Spirostomum ambiguum</em>. I also publish work related to hardware engineering through my company, Koinslot.</p>
  
  <!-- Container for dynamically loaded publications -->
  <div id="publications-container">
    <!-- Publications will be loaded here -->
  </div>
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
    transition: transform 0.3s ease;
  }
  
  .publication-item:hover {
    transform: translateX(5px);
    background-color: #f9f9f9;
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
    display: inline-flex;
    align-items: center;
  }
  
  .publication-citations i {
    margin-right: 5px;
  }
  
  .publication-link {
    display: inline-block;
    margin-right: 15px;
    margin-bottom: 5px;
    font-size: 0.9em;
    padding: 3px 8px;
    border-radius: 3px;
    background-color: #f5f5f5;
    transition: background-color 0.3s;
  }
  
  .publication-link:hover {
    background-color: #e0e0e0;
    text-decoration: none;
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
</style>

<!-- Load the publications fetcher script -->
<script src="{{ base_path }}/assets/js/publications.js"></script>
<!-- Load the Google Scholar stats script -->
<script src="{{ base_path }}/assets/js/scholar-stats.js"></script>