//-------------------------------------
// F1.Pjax.Viewport - Requires F1.Pjax
//-------------------------------------

F1.Pjax.Viewport = function (viewElementSelector, options)
{
  this.selector = viewElementSelector || 'body';
  this.$elm = $(this.selector);
  options = options || {};
  $.extend(this, options);
  if ( ! this.updateMethod) { this.updateMethod = 'innerHTML'; }
}


F1.Pjax.Viewport.prototype.beforeUpdate = function ($loadedHtml)
{
  // check if update is allowed...?
  return;
};


F1.Pjax.Viewport.prototype.update = function ($loadedHtml)
{
  var newContent;
  switch (this.updateMethod) {
    case 'innerHTML':
    default:
      newContent = $loadedHtml.find(this.selector).first().html();
      return this.$elm.html(newContent);
  }
};


F1.Pjax.Viewport.prototype.afterUpdate = function ($loadedHtml)
{
  // link events here ...
  // run custom code against view here...
  return;
};

// End: F1.Pjax.Viewport