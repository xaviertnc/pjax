<?php

class UiClass {
  
  public $app;
  
  
  public function __construct($app)
  {
    $this->app = $app;
  }
  
  
  public function blockIndent($text, $indent)
  {
    return implode("\n" . $indent, explode("\n", trim($text)));
  }
  
  
  public function menuItem($url, $label = null) {
    return '<li' . ($this->app->request->pageref == $url ? ' class="active">' : '>') .
      '<a href="' . $url . '" class="pagelink">' . ($label ?: $url) . '</a></li>' . PHP_EOL;
  }
  
  
  // NOTE: We need some view-cache solution here...
  public function styles($page, $indent = null)
  {
    $tabspace = null; 
    $file = $page->dir . '/style.css';
    if (file_exists($file)) { $stylesContent = file_get_contents($file); } else { return; }
    if ($indent)
    {
      $tabspace = '  ';
      $stylesContent = $this->blockIndent($stylesContent, $indent . $tabspace);
    }
    $html  = '<style data-rel="page">' . PHP_EOL;
    $html .= $indent . $tabspace . $stylesContent . PHP_EOL;
    $html .= $indent . '</style>' . PHP_EOL;
    return $html;
  }
  
  
  // NOTE: We need some view-cache solution here...
  public function script($page, $indent = null)
  {
    $tabspace = null; 
    $file = $page->dir . '/script.js';
    if (file_exists($file)) { $scriptContent = file_get_contents($file); } else { return; }
    if ($indent)
    {
      $tabspace = '  ';
      $scriptContent = $this->blockIndent($scriptContent, $indent . $tabspace);
    }
    $html  = '<script>' . PHP_EOL;
    $html .= $indent . $tabspace . $scriptContent . PHP_EOL;
    $html .= $indent . '</script>' . PHP_EOL;
    return $html;
  }
  
}

$ui = new UiClass($app);