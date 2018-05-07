window.F1 = window.F1 || { afterPageLoadScripts: [] };

/**
 * OneFile files are stand-alone libs that only require jQuery to work.
 *
 * F1.Modal - Modal behaviour methods
 * 
 * @auth:  C. Moller <xavier.tnc@gmail.com>
 * @date:  14 April 2018
 *
 * @prop: {string} title          Modal title
 *
 * @param: {object} options       Insert dependancies, state and behaviour via this object.
 *   e.g. options = { 
 *     option: 'val', 
 *   }
 */

F1.Modal = function (options)
{
  options = options || {};
  $.extend(this, options);
};


F1.Modal.prototype.dismiss = function(elm, event)
{ 
  event.preventDefault();
  $(elm).parents('.modal:first').toggle('hidden');
  return false;
};


// end: F1.Modal