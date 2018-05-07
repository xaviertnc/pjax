<!DOCTYPE html>
<html>
  <head>
    <title><?=$page->title?> - <?=$app->siteName?></title>
    <base href="<?=$request->urlBase?>">
    <meta name="x-csrf-token" content="<?=$page->csrfToken?>">
    <link id="favicon" href="favicon.ico" rel="shortcut icon">
    <link href="css/style.css" rel="stylesheet">
  </head>
  
  <body>
    
    <noscript>This page will not display correctly without Javascript enabled.</noscript>
    
    <div id="busy-indicator" class="hidden">
      <div class="busy-indicator-inner">
        Please wait...
      </div>
    </div>
    
    <div id="back-to-top" class="hidden">
      <a onclick="$('html,body').animate({scrollTop:0},'slow'); return false;" rel="nofollow">^TOP</a>
    </div>

    <div id="main-modal" class="modal hidden">
      <div class="modal-inner">
        <header>
          <a class="modal-close" href="#" onclick="F1.modal.dismiss(this, event)">Close X</a>
          Modal header...
        </header>
        <div class="modal-content">
          Modal content goes here...
        </div>
        <footer class="hidden">
          Modal footer...
        </footer>
      </div>
    </div>
  
    <div class="container">
      
      <header id="main-header">
        <div class="titlebar">
          PJAX and Happy2JS demo - <?=$page->title?>
        </div>
        <?php include 'topnav.php' ?>
      </header>
            
      <section id="alerts"></section>
      
      <section id="main-content">
