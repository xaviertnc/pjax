<?php

class UiClass {
  
  public $app;
  
  public function __construct($app)
  {
    $this->app = $app;
  }
  
  public function menuItem($url, $label = null) {
    return '<li' . ($this->app->request->pageref == $url ? ' class="active">' : '>') .
      '<a href="' . $url . '" class="pagelink">' . ($label ?: $url) . '</a></li>' . PHP_EOL;
  }
  
}

$ui = new UiClass($app);