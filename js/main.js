// MAIN

F1.confirm = function(elm, event, message)
{ 
  var $elm = $(elm);
  if ($elm.is('.confirmed')) { $elm.removeClass('confirmed'); }
  else {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (confirm(message || 'Are you sure?')) {
      $elm.addClass('confirmed');
      setTimeout(function () { $elm.click(); }, 100);
    }
  }
};


F1.runScripts = function (scriptQueue)
{
  var i, result;
  if ( ! scriptQueue || ! scriptQueue.length) { return; }
  for (i = 0; i < scriptQueue.length; i++)
  {
    result = scriptQueue[i](); // run script
    if (typeof result !== 'undefined') { return result; } // abort queue if we have a result!
  }
};


$(document).ready(function() {
  
  console.log('*** DOCUMENT READY ***');

  F1.back2Top = new F1.Back2Top('#back-to-top');
  
  F1.alerts = new F1.Alerts('#alerts');
  
  F1.modal = new F1.Modal();
  
  F1.pjax = new F1.Pjax({
    siteName: 'PJAX Demo',
    busyImageUrl: 'loading.ico',
    csrfTokenMetaName: 'X-CSRF-TOKEN',
    viewports: ['#page-header', '#page-content'],
    afterPageLoadSuccess: function () {
      console.log('Pjax.afterPageLoadSuccess()');
      F1.runScripts(F1.afterPageLoadScripts); 
      F1.afterPageLoadScripts = [];
      F1.pjax.bindViewports();
      F1.alerts.bind();
    }
  });
  
  F1.runScripts(F1.afterPageLoadScripts);
  F1.afterPageLoadScripts = [];
  F1.pjax.bindViewports();
  F1.alerts.bind();
  
});