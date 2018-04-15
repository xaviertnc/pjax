<?php
  $page = new stdClass();
  $page->title = 'Example 2';
  $page->id = $app->currentPage;
  $page->state = array_get($app->state, $page->id, []);
  $page->lastCsrfToken = array_get($page->state, 'csrfToken');
  $page->view = substr(__FILE__, 0, strlen(__FILE__)-4) . '.view.php';
  $page->csrfToken = time();
  
  include $app->partialsPath . '/head.php';
  include $page->view;
  include $app->partialsPath . '/foot.php';
  
  $page->state = [ 'csrfToken' => $page->csrfToken ];
  $app->state[$page->id] = $page->state;