//---------------------------------
// F1.Pjax.View - Requires F1.Pjax
//---------------------------------

F1.Pjax.View = function (viewElementSelector, options)
{
  this.selector = viewElementSelector || 'body';
  this.$elm = $(this.selector);
  options = options || {};
  $.extend(this, options);
  if ( ! this.updateMethod) { this.updateMethod = 'innerHTML'; }
}


F1.Pjax.View.prototype.beforeUpdate = function ($loadedHtml)
{
  // check if update is allowed...?
  return;
};


F1.Pjax.View.prototype.update = function ($loadedHtml)
{
  var newContent;
  switch (this.updateMethod) {
    case 'innerHTML':
    default:
      newContent = $loadedHtml.find(this.selector).first().html();
      return this.$elm.html(newContent);
  }
};


F1.Pjax.View.prototype.afterUpdate = function ($loadedHtml)
{
  // link events here ...
  // run custom code against view here...
  return;
};

// End: F1.Pjax.View