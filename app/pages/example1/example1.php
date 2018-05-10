<?php
  $page = new stdClass();
  $page->title = 'Example 1';
  $page->id = $app->currentPage;
  $page->dir = $app->controllerPath;
  $page->state = array_get($app->state, $page->id, []);
  $page->lastCsrfToken = array_get($page->state, 'csrfToken');
  $page->viewFile = substr(__FILE__, 0, strlen(__FILE__)-4) . '.view.php';
  $page->csrfToken = md5(uniqid(rand(), true)); //time();
  
    
  // ----------------------
  // -------- POST --------
  // ----------------------
  if ($request->method == 'POST')
  {
    do {  
    
    // Handle submit data here...
      
    } while (0);
    
    $response->redirectTo = $request->back ?: $request->uri;
  }

  
  // ----------------------
  // -------- GET ---------
  // ----------------------  
  else {
    
    include $app->partialsPath . '/head.view.php';
    include $page->viewFile;
    include $app->partialsPath . '/foot.view.php';
    
    $page->state = [ 'csrfToken' => $page->csrfToken ];
    $app->state[$page->id] = $page->state;
    
  }
