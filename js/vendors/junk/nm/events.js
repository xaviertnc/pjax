//-----------
// F1.Events
//-----------
F1.Events = function (rootElement) {
  this.$root = $(rootElement || document);
};


F1.Events.prototype.addQueue = function(eventsQueue) {
  if (eventsQueue && eventsQueue.length) {
    for (var i=0, n=eventsQueue.length; i < n; i++) {
      this.on(eventsQueue[i].event, eventsQueue[i].handler);
    }
  }
};

  
F1.Events.prototype.on = function(eventName, eventHandler) {
  return this.$root.on(eventName, eventHandler);
};

  
F1.Events.prototype.trigger = function(eventName) {
  return this.$root.triggerHandler(eventName);
};


F1.Events.prototype.stopEvent = function (event)
{
  if (event)
  {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.cancelBubble = true;
  }
  return false;
};
  
  
F1.Events.prototype.stopEnterKeyEvents = function(event)
{
  var keyCode = ('which' in event) ? event.which : event.keyCode;
  if (keyCode == 13) { return this.stopEvent(event); }
}

// End: F1.Events