window.F1 = window.F1 || { afterPageLoadQueue: [] };


/**
 * OneFile files are stand-alone libs that only require jQuery to work.
 * Dependancies and custom behaviours can be added via the 'options' param.
 *
 * F1.Pjax - Replace variable sections of a page using Ajax and the current URL / PATH
 * 
 * @auth:  C. Moller <xavier.tnc@gmail.com>
 * @date:  14 April 2018
 *
 * @prop: {array}  views       Array of View objects. One per view to be updated after a page loads.
 * @prop: {string} siteName    Used to add after page titles. e.g. PageTitle = "PageName - SiteName"
 * @prop: {string} csrfToken   <head><meta name="?" content="KDX5ad302f3a5711"> Csrf meta tag name
 * @prop: {string} history     window.history
 * @prop: {string} baseUri     Protocol + Hostname + Port + basePath
 * @prop: {string} faviconUrl
 * @prop: {string} busyFaviconUrl 
 * @prop: {string} mainContentSelector     
 * @prop: {string} currentLocation
 *
 * @param: {object} options    Insert dependancies, state and behaviour via this object.
 *   e.g. options = { 
 *     siteName: 'Pjax Demo', 
 *     beforePageLoad: customFn(url), 
 *     onPageLoadFail: customFn(jqXHR),
 *     onPageLoadSuccess: customFn(jqXHR),
 *     afterPageLoadSuccess: customFn($loadedHtml, jqXHR), 
 *     updatePage: customFn($loadedHtml, jqXHR),
 *     beforePushState: customFn(url, history), 
 *     beforePopState: customFn(url, history), 
 *     afterPushState: customFn(url, history), 
 *     afterPopState: customFn(url, history),  
 *     redirect: customFn(url, redirectOptions),
 *     views: ['#top-navbar', '#main-content'],
 *     mainContentSelector: '#main-content', 
 *     baseUri: 'http://www.example.com/',
 *     csrfTokenMetaName: 'x-csrf-token',
 *     busyFaviconUrl: 'loading.ico'
 *   }
 */
F1.Pjax = function (options)
{
  options = options || {};

  if ( ! options.baseUri) { 
    this.baseUri = document.head.baseURI;
    if ( ! this.baseUri) {
      this.baseUri = this.getCurrentLocation().origin || ''
      if ( ! this.baseUri) { 
        this.baseUri = window.location.protocol + '//' + window.location.host;
      }
      this.baseUri += '/';
    }
    delete options.baseUri;
  }

  this.setViews(options.views);
  delete options.views;
  
  if (options.busyFaviconUrl) {
    this.$favicon = $(options.faviconSelector || '#favicon');
  }
  
  if (options.csrfTokenMetaName) {
    this.$csrfMeta = $(document.head).find('meta[name=' + options.csrfTokenMetaName + ']');
  }

  this.$busyIndicator = $(this.busySelector || '#busy-indicator');

  this.history = this.history || window.history;
  this.currentLocation = this.getCurrentLocation();
  window.onpopstate = this.popStateHandler.bind(this);

  $.extend(this, options);
  
  console.log('F1 PJAX Initialized:', this);  
};


F1.Pjax.prototype.stopEvent = function(event)
{ 
  if (event) { 
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.cancelBubble = true;
  }
  return false;
};


F1.Pjax.prototype.runScriptQueue = function (scriptQueue)
{
  var i, result;
  if ( ! scriptQueue || ! scriptQueue.length) { return; }
  for (i = 0; i < scriptQueue.length; i++)
  {
    result = scriptQueue[i](); // run script
    if (typeof(result) !== 'undefined') { return result; }
  }
};


F1.Pjax.prototype.setViews = function(viewDefinitions)
{ 
  this.views = [];
  if (viewDefinitions)
  {
    var i, n, vewDefinition, viewSelector, viewOptions = {};
    for (var i=0, n=viewDefinitions.length; i < n; i++)
    {
      viewDefinition = viewDefinitions[i];
      if (viewDefinition.selector)
      {
        viewSelector = viewDefinition.selector;
        viewOptions = viewDefinition;
      }
      else
      {
        viewSelector = viewDefinition;
      }        
      this.views[i] = new F1.Pjax.View(viewSelector, viewOptions);
    }  
  }
  else
  {
    this.views.push(new F1.Pjax.View());
  }
};

F1.Pjax.prototype.getLocation = function()
{ 
  return (this.history && this.history.emulate) ? this.history.location : window.location; 
};


F1.Pjax.prototype.getCurrentLocation = function()
{
  var winLocation = this.getLocation();
  return winLocation.href ? winLocation.href : winLocation.toString();
};


F1.Pjax.prototype.getCurrentPath = function()
{
  var currentPath = this.currentLocation.substring(this.baseUri.length);
  console.log('Pjax.getCurrentPath(), this.currentLocation:', this.currentLocation, 
    ', this.baseUri:', this.baseUri, ', path:', currentPath);
  return currentPath;
};


F1.Pjax.prototype.isCurrentLocation = function(testUrl)
{
  var currentLocation = this.currentLocation;
  if (testUrl.length === currentLocation.length && testUrl === currentLocation) { return true; }
  if (currentLocation.length > testUrl.length) { currentLocation = this.getCurrentPath(); }
  var result = (testUrl === currentLocation);
  console.log('Pjax.isCurrentLocation(), testUrl:', testUrl, 
    ', currentLocation:', currentLocation, ', result:', result);
  return result;
};


F1.Pjax.prototype.showBusyIndication = function($link)
{
  console.log('Pjax.showBusyIndication(), busyFaviconUrl:', this.busyFaviconUrl, 
    ', $favicon:', this.$favicon);
  if (this.busyFaviconUrl && this.$favicon) {
    this.$favicon.attr('href', this.busyFaviconUrl);
  }
  document.body.classList.add('busy');
  this.$busyIndicator.removeClass('hidden');
};


F1.Pjax.prototype.removeBusyIndication = function()
{
  this.$busyIndicator.addClass('hidden');
  document.body.classList.remove('busy');
  if (this.busyFaviconUrl && this.$favicon) { 
    this.$favicon.attr('href', this.faviconUrl || 'favicon.ico');
  }
};


F1.Pjax.prototype.pushState = function(url, title)
{
  if ( ! this.history) { 
    console.error('Pjax.pushState(), Error: Missing history service!');
    return false;
  }
  if (this.beforePushState && this.beforePushState(url, this.history) === false) { return false; }
  var state = { 'url': url, 'title': title || '' }; // Note: 'title' not supported in most browsers!
  this.history.pushState(state, state.title, state.url);
  if (this.afterPushState) { this.afterPushState(url, this.history); }
  return true;
};


F1.Pjax.prototype.popStateHandler = function(event)
{
  console.log('Pjax.popState() - Start - event.state:', event.state);
  if ( ! this.history) { 
    console.error('Pjax.popState(), Error: Missing history service!');
    return false;
  } 
  var url = event.state ? event.state.url : '';
  console.log('Pjax.popState() - beforePopState:', this.beforePopState, ', url:', url);
  if (this.beforePopState && this.beforePopState(url, this.history) === false)
  {
    var state = { 'url': this.currentLocation, 'title': '' };
    this.history.pushState(state, state.title, state.url); // Undo popState
    return false;
  }
  if ( ! this.isCurrentLocation(url))
  {
    if (this.beforePageLoad && this.beforePageLoad(options) === false) { return false; };
    this.showBusyIndication();
    this.loadPage({ url: url });
  }
  if (this.afterPopState) { this.afterPopState(url, this.history); }
};


F1.Pjax.prototype.revertState = function(url)
{
  // Goto last known good page... ? 
  return;
};


F1.Pjax.prototype.setPageTitle = function(newPageTitle)
{
  if (this.siteName) { newPageTitle = newPageTitle + ' - ' + this.siteName; }
  document.title = newPageTitle;
};


F1.Pjax.prototype.setPageTitleUsingLink = function($link)
{
  var newTitle
  if ( ! $link) { return false; }
  newPageTitle = $link.data('page-title');
  if ( ! newPageTitle) {
    newPageTitle = $link.find('span').first().text() || $link.text();
  }
  this.setPageTitle(newPageTitle);
};


F1.Pjax.prototype.pageLinkClickHandler = function (event)
{
  var $link = $(this),
      linkUrl = $link.attr('href'),
      pjax = event.data;
 
  console.log('F1.Pjax.pageLinkClickHandler(), this:', this) //, ', event:', event);

  pjax.stopEvent(event);

  if ( ! pjax.isCurrentLocation(linkUrl))
  {
    if (pjax.beforePageLoad && pjax.beforePageLoad(options) === false) { return false; };
    pjax.showBusyIndication($link);
    pjax.setPageTitleUsingLink($link);
    pjax.pushState(linkUrl);
    pjax.loadPage({ url: linkUrl });
  }
};


F1.Pjax.prototype.bindPageLinks = function (pageLinkClickHandler)
{
  var i, n, _pjax = this, views = _pjax.views;
  pageLinkClickHandler = pageLinkClickHandler || this.pageLinkClickHandler;
  console.log('Bind pagelinks - views:', views);
  for (i=0, n=views.length; i < n; i++) {
    views[i].$elm.find('.pagelink').each(function() {
      var $link = $(this); 
      console.log('Binding link:', $link);
      $(this).on('click', _pjax, pageLinkClickHandler);
    });
  }
};    
  
  
// Override me!
F1.Pjax.prototype.updatePage = function ($loadedHtml, jqXHR)
{
  var i, views = this.views, n = views.length;
  for (i=0; i < n; i++) {
    views[i].beforeUpdate($loadedHtml);
  }

  for (i=0; i < n; i++) {
    views[i].update($loadedHtml);
  }

  for (i=0; i < n; i++) {
    views[i].afterUpdate($loadedHtml);
  }
};


/** 
 * If we requested a protected page without authorisation, 
 * we typically get redirected away to a safe / public location.
 *
 * @param {mixed} options  JSON string or options object.
 *    e.g. { 'url': '/some/page', 'pjax': 'true' }
 *    e.g. { 'redirect': '/some/page', 'pjax': 'true' }
 */
F1.Pjax.prototype.handleRedirect = function (options) {
    if (typeof(options) === 'string') { options = JSON_Parse(options); }
    var redirectUrl = options.redirect || options.url;
    if (options.pjax && ! this.isCurrentLocation(redirectUrl))
    {
      this.pushState(redirectUrl);
      this.loadPage({ url: redirectUrl });
    }
    else {    
      window.location.href = redirectUrl;
    }
};


F1.Pjax.prototype.loadSuccessHandler = function (resp, statusText, jqXHR)
{
  console.log('F1.Pjax.loadSuccessHandler(), jqXHR:', jqXHR);
  if (this.onPageLoadSuccess && this.onPageLoadSuccess(jqXHR) === false) { return; }
  if (jqXHR.status === 202) { return this.handleRedirect(resp); }
  // Only change the current location here to still have access to the current location
  // in an event handler like: onPopState where we only have the popped url.
  var $loadedHtml = $('<response></response>').html(resp); // Parse response
  this.updatePage($loadedHtml);
  this.bindPageLinks();
  if (this.afterPageLoadSuccess) { this.afterPageLoadSuccess($loadedHtml, jqXHR); }
};


F1.Pjax.prototype.loadFailedHandler = function (jqXHR)
{
  console.error('Pjax.loadFailedHandler(), jqXHR =', jqXHR);
  var mainContentSelector = this.mainContentSelector || this.views[0].selector || 'body';
  var $errors = $('<div></div>').append(jqXHR.responseText).find('.server-error');
  if (this.onPageLoadFail && this.onPageLoadFail($errors, jqXHR) === false) { return; }
  if ($errors.length) { $(mainContentSelector).html('').append($errors); }
  else {
    var errorHtml =
      '<div class="error pjax-error">' +
        '<h3>Oops, something went wrong!</h3>' +
        '<p>' +
          'Error ' + jqXHR.status + ' - ' + jqXHR.statusText + '<br>' +
          '<small>Pjax.loadPage()- Failed!</small>' +
        '</p>' +
      '</div>';

    $(mainContentSelector).html(errorHtml);
  }
};


// Override me!
F1.Pjax.prototype.alwaysAfterLoadHandler = function (pageHtml, statusText, jqXHR)
{
  this.currentLocation = this.getCurrentLocation();  
  this.removeBusyIndication();
};


F1.Pjax.prototype.loadPage = function (options)
{
  options = options || {};
  options.dataType = options.dataType || 'html';  
  options.method = 'GET';
  options.cache = false;
  console.log('Pjax.loadPage(), options:', options);
  return $.ajax(options)
    .done(this.loadSuccessHandler.bind(this))
    .fail(this.loadFailedHandler.bind(this))
    .always(this.alwaysAfterLoadHandler.bind(this))
};


F1.Pjax.prototype.goBack = function(event, distance)
{
  this.stopEvent(event);
  distance = distance ? (-1 * distance) : -1;
  if (this.history) { this.history.go(distance); }
  return false;
};

// End: F1.Pjax