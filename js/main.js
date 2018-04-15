// MAIN
$(document).ready(function() {
  
  console.log('*** DOCUMENT READY ***');
  
  F1.modal = new F1.Modal();
  
  F1.pjax = new F1.Pjax({
    siteName: 'Happy2 JS',
    busyFaviconUrl: 'loading.ico',
    csrfTokenMetaName: 'x-csrf-token',
    views: ['#main-header', '#main-content'],
    afterPageLoadSuccess: function () {
      console.log('Pjax.afterPageLoadSuccess()');
      this.runScriptQueue(F1.afterPageLoadQueue); 
      F1.afterPageLoadQueue = []; 
    }
  });
  
  F1.pjax.bindPageLinks();
  F1.pjax.runScriptQueue(F1.afterPageLoadQueue);
  F1.afterPageLoadQueue = [];

  // When the user scrolls down 20px from the top of the document, show the button
  F1.$backToTop = $('#back-to-top');
  F1.scrollHandler = function() {
    var display = F1.$backToTop[0].style.display; 
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      if ( ! display || display === 'none' ) { F1.$backToTop.show(); } 
    } else {
      if (display === 'block') { F1.$backToTop.hide(); }
    }
  }
  window.onscroll = F1.scrollHandler;
  
});