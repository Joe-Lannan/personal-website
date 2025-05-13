---
layout: archive
title: "Publications"
permalink: /publications-auto/
author_profile: true
---

{% include base_path %}

<div class="publications">
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