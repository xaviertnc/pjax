/**
 * OneFile files are stand-alone libs that only require jQuery to work.
 * Dependancies and custom behaviours can be added via the 'options' param.
 *
 * F1.Url - Parse the current window location and unpack the resulting info into Url
 * 
 * @auth:  C. Moller <xavier.tnc@gmail.com>
 * @date:  13 April 2018
 *
 * @prop: {string} queryString    Part after the '?'
 * @prop: {object} queryParams    { qparam1: val1, ..., qparam(n): val(n) }
 * @prop: {string} pageref        Full Url without the query string
 * @prop: {array}  segments       Array of pageref segment strings
 * @prop: {string} base           Protocol + Hostname + Port + basePath
 *
 * @param: {object} options       Insert dependancies, state and behaviour via this object.
 *   e.g. options = { 
 *     base: 'http://www.example.com/kd', 
 *   }
 */
 
F1.Url = function (currentLocation, options)
{
  var url_info = this.parse(currentLocation);
  $.extend(this, url_info);
  this.base = document.head.baseURI; // Override in options.
  options = options || {};
  $.extend(this, options);
};


F1.Url.prototype.normalize = function(url)
{
  return url || this.url;
};


F1.Url.prototype.match = function(url)
{
  var currentLocation = this.url;
  if (url.length > currentLocation.length) { return false; }
  if (currentLocation.length > url.length) { currentLocation = this.pageref; }
  if (currentLocation.length > url.length) { currentLocation = this.getCurrentPath(); }
  return (url === currentLocation);
};


F1.Url.prototype.parse = function(url)
{
  var url_info = {};
  var refHalves, queryParamStrings, paramInfo, popstateHandler;
  refHalves = url.split('?');
  url_info.url = url;
  url_info.queryString = '';  
  url_info.queryParams = {};
  url_info.pageref = refHalves[0];
  url_info.segments = url_info.pageref.split('/');
  if (refHalves.length > 1)
  {
    url_info.queryString = refHalves[1];
    queryParamStrings = url_info.queryString.split('&');
    $.each(queryParamStrings, function parseQueryParam(index, value) {
      paramInfo = value.split('=');
      if (paramInfo.length > 1) {
        url_info.queryParams[paramInfo[0]] = paramInfo[1];
      }
      else {
        url_info.queryParams[pair[0]] = true;
      }
    });
  }
  return url_info;
};
  
  
F1.Url.prototype.eoncodeParamNames = function(params)
{
  if ( ! params) { return params; }
  var paramName, results = {}, resultIndex;
  for (paramName in params) {
    if (params.hasOwnProperty(paramName)) {
      resultIndex = paramName.replace('[', '%5B').replace(']', '%5D');
      results[resultIndex] = params[paramName];
    }
  }
  return results;
};


F1.Url.prototype.make = function(queryParamsToSet, currentParamsToKeep, currentParamsToRemove, encodeKeys)
{
  var url, currentQueryParams, paramName, paramSets = [], i = 0;
  currentQueryParams = encodeKeys ? this.eoncodeParamNames(this.queryParams) : this.queryParams;
  queryParamsToSet = encodeKeys ? this.eoncodeParamNames(queryParamsToSet) : queryParamsToSet;
  for (paramName in currentQueryParams) {
    if (currentParamsToKeep && currentParamsToKeep.indexOf(paramName) < 0) { continue; }
    if (currentParamsToRemove && currentParamsToRemove.indexOf(paramName) < 0)
    {
      if ( ! queryParamsToSet.hasOwnProperty(paramName)) {
        paramSets[i] = paramName + '=' + currentQueryParams[paramName];
        i++;
      }
    }
  }
  for (paramName in queryParamsToSet) {
    if (queryParamsToSet.hasOwnProperty(paramName)) {
      paramSets[i] = paramName + '=' + queryParamsToSet[paramName];
      i++;
    }
  }
  url = F1.Url.pageref + (paramSets.length ? '?' + paramSets.join('&') : '');  
  return url;
};

// end: F1.Url