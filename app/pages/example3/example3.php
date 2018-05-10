<?php
  $page = new stdClass();
  $page->title = 'Example 3';
  $page->id = $app->currentPage;
  $page->dir = $app->controllerPath;  
  $page->state = array_get($app->state, $page->id, []);
  $page->lastCsrfToken = array_get($page->state, 'csrfToken');
  $page->basename = substr(__FILE__, 0, strlen(__FILE__)-4);
  $page->model = $page->basename . '.model.php'; 
  $page->viewFile = $page->basename . '.view.php'; 
  $page->csrfToken = md5(uniqid(rand(), true)); //time();
  
  include $app->partialsPath . '/head.view.php';
  include $page->viewFile;
  include $app->partialsPath . '/foot.view.php';
  
  $page->state = [ 'csrfToken' => $page->csrfToken ];
  $app->state[$page->id] = $page->state;