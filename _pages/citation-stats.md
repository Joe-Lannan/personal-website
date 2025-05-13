---
layout: archive
title: "Citation Statistics"
permalink: /citation-stats/
author_profile: true
---

{% include base_path %}

<div class="citation-stats">
  <p>Below are my citation statistics from Google Scholar.</p>
  
  <!-- Container for dynamically loaded Google Scholar stats -->
  <div id="scholar-stats-container">
    <!-- Scholar stats will be loaded here -->
  </div>
</div>

<style>
  .scholar-stats {
    margin-top: 20px;
  }
  
  .scholar-stats-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-block {
    flex: 1 1 220px;
    background: #f9f9f9;
    border: 1px solid #eee;
    padding: 15px;
    border-radius: 4px;
  }
  
  .stat-title {
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
    margin-bottom: 15px;
  }
  
  .scholar-link i {
    margin-right: 5px;
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

<!-- Load the Google Scholar stats script -->
<script src="{{ base_path }}/assets/js/scholar-stats.js"></script>