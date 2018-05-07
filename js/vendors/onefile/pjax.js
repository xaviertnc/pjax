window.F1 = window.F1 || { afterPageLoadScripts: [] };


/**
 * OneFile files are stand-alone libs that only require jQuery to work.
 * Dependancies and custom behaviours can be added via the 'options' param.
 *
 * F1.Pjax - Replace variable sections of a page using Ajax and the current URL / PATH
 *
 * @auth:  C. Moller <xavier.tnc@gmail.com>
 * @date:  14 April 2018
 *
 * @prop: {array}  viewports   Array of Viewport objects. One per viewport to be updated after a page loads.
 * @prop: {string} siteName    Used to add after page titles. e.g. PageTitle = "PageName - SiteName"
 * @prop: {string} csrfToken   <head><meta name="?" content="KDX5ad302f3a5711"> Csrf meta tag name
 * @prop: {string} history     window.history
 * @prop: {string} baseUri     Protocol + Hostname + Port + basePath
 * @prop: {string} faviconUrl
 * @prop: {string} busyImageUrl
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
 *     viewports: ['#top-navbar', '#main-content'],
 *     mainContentSelector: '#main-content',
 *     baseUri: 'http://www.example.com/',
 *     csrfTokenMetaName: 'x-csrf-token',
 *     busyImageUrl: 'loading.ico'
 *   }
 */
F1.Pjax = function (options)
{
  options = options || {};

  if (options.baseUri) {
    this.baseUri = options.baseUri;
    delete options.baseUri;
  }
  else {
    this.baseUri = this.getBaseUri();
  }

  this.setupViewports(options.viewports);
  delete options.viewports;

  if (options.busyImageUrl) {
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


/**
 * @param {Array} viewportDefinitions
 *
 * {String|Object} viewportDefinition
 *     viewportDefinition == String: Provide only the viewport's DOM selector string e.g. "#someElementId", ".someElementClassName", ...
 *     viewportDefinition == Object: { selector: "e.g. #mainview", option1: "opt1Value", ..., option(n): "opt(n)Value" }
 */
F1.Pjax.prototype.setupViewports = function(viewportDefinitions)
{
  this.viewports = [];
  if (viewportDefinitions)
  {
    var i, n, vewDefinition, viewportSelector, viewportOptions = {};
    for (var i=0, n=viewportDefinitions.length; i < n; i++)
    {
      viewportDefinition = viewportDefinitions[i];
      if (viewportDefinition.selector)
      {
        viewportSelector = viewportDefinition.selector;
        viewportOptions = viewportDefinition;
      }
      else
      {
        viewportSelector = viewportDefinition;
      }
      this.viewports[i] = new F1.Pjax.Viewport(viewportSelector, viewportOptions);
    }
  }
  else
  {
    this.viewports.push(new F1.Pjax.Viewport());
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


F1.Pjax.prototype.getBaseUri = function()
{
  var baseUri = document.head.baseURI;
  if ( ! baseUri) {
    baseUri = window.location.protocol + '//' + window.location.host + '/';
  }
  return baseUri;
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
  console.log('Pjax.showBusyIndication(), busyImageUrl:', this.busyImageUrl,
    ', $favicon:', this.$favicon);
  if (this.busyImageUrl && this.$favicon) {
    this.$favicon.attr('href', this.busyImageUrl);
  }
  document.body.classList.add('busy');
  this.$busyIndicator.removeClass('hidden');
};


F1.Pjax.prototype.removeBusyIndication = function()
{
  this.$busyIndicator.addClass('hidden');
  document.body.classList.remove('busy');
  if (this.busyImageUrl && this.$favicon) {
    this.$favicon.attr('href', this.faviconUrl || 'favicon.ico');
  }
};


F1.Pjax.prototype.pushState = function(url, title)
{
  if ( ! this.history) {
    console.error('Pjax.pushState(), Error: Missing history service!');
    return false;
  }
  if (this.beforePushState && this.beforePushState(url, this.history) === 'abort') { return false; }
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
  if (this.beforePopState && this.beforePopState(url, this.history) === 'abort')
  {
    var state = { 'url': this.currentLocation, 'title': '' };
    this.history.pushState(state, state.title, state.url); // Undo popState
    return false;
  }
  if ( ! this.isCurrentLocation(url))
  {
    if (this.beforePageLoad && this.beforePageLoad(options) === 'abort') { return false; };
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
    if (pjax.beforePageLoad && pjax.beforePageLoad(options) === 'abort') { return false; };
    pjax.showBusyIndication($link);
    pjax.setPageTitleUsingLink($link);
    pjax.pushState(linkUrl);
    pjax.loadPage({ url: linkUrl });
  }
};


F1.Pjax.prototype.bindPageLinks = function (pageLinkClickHandler)
{
  var i, n, _pjax = this, viewports = _pjax.viewports;
  pageLinkClickHandler = pageLinkClickHandler || this.pageLinkClickHandler;
  console.log('Bind pagelinks - viewports:', viewports);
  for (i=0, n=viewports.length; i < n; i++) {
    viewports[i].$elm.find('.pagelink').each(function() {
      var $link = $(this);
      console.log('Binding link:', $link);
      $(this).on('click', _pjax, pageLinkClickHandler);
    });
  }
};


// Override me!
F1.Pjax.prototype.updatePage = function ($loadedHtml, jqXHR)
{
  var i, viewports = this.viewports, n = viewports.length;
  for (i=0; i < n; i++) {
    viewports[i].beforeUpdate($loadedHtml);
  }

  for (i=0; i < n; i++) {
    viewports[i].update($loadedHtml);
  }

  for (i=0; i < n; i++) {
    viewports[i].afterUpdate($loadedHtml);
  }
};


/**
 * If we requested a protected page without authorisation,
 * we typically get redirected away to a safe / public location.
 *
 * @param {mixed} options  JSON string or options object.
 *    e.g. { 'url': '/some/page', 'pjax': 'true' }
 *    e.g. { 'redirect': '/some/page', 'pjax': 'true' }
 *
 * TODO:
 *  - Also allow HEADER METAS like: X-PJAX-REDIRECT, X-REDIRECT-TO
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
  if (this.onPageLoadSuccess && this.onPageLoadSuccess(jqXHR) === 'abort') { return; }
  if (jqXHR.status === 202) { return this.handleRedirect(resp); }
  var $loadedHtml = $('<response></response>').html(resp); // Parse response
  this.updatePage($loadedHtml);
  this.bindPageLinks();
  if (this.afterPageLoadSuccess) { this.afterPageLoadSuccess($loadedHtml, jqXHR); }
};


F1.Pjax.prototype.loadFailedHandler = function (jqXHR)
{
  console.error('Pjax.loadFailedHandler(), jqXHR =', jqXHR);
  var mainContentSelector = this.mainContentSelector || this.viewports[0].selector || 'body';
  var $errors = $('<div></div>').append(jqXHR.responseText).find('.server-error');
  if (this.onPageLoadFail && this.onPageLoadFail($errors, jqXHR) === 'abort') { return; }
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