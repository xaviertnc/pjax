<?php
  $page = new stdClass();
  $page->title = 'Example 3';
  $page->id = $app->currentPage;
  $page->state = array_get($app->state, $page->id, []);
  $page->lastCsrfToken = array_get($page->state, 'csrfToken');
  $page->basename = substr(__FILE__, 0, strlen(__FILE__)-4);
  $page->model = $page->basename . '.model.php'; 
  $page->view = $page->basename . '.view.php'; 
  $page->csrfToken = time();
  
  include $page->view;
  
  $page->state = [ 'csrfToken' => $page->csrfToken ];
  $app->state[$page->id] = $page->state;