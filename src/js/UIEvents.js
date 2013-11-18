/*global: prezentr, Component*/
var isCoolBrowser = (typeof document.addEventListener === 'function');

var addEvent = (isCoolBrowser ? 'addEventListener' : 'attachEvent');
var removeEvent = (isCoolBrowser ? 'removeEventListener' : 'detachEvent');
var triggerEvent = (isCoolBrowser ? 'dispatchEvent' : 'fireEvent');


var mouseEvents = 'click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout'.split(',');
var touchEvents = 'touchstart,touchmove,touchend,touchcancel,touchleave'.split(',');
var keyEvents = 'keydown,keypress,keyup'.split(',');
var allEvents = keyEvents.concat(touchEvents, mouseEvents);

var UIEvents = /* prezentr.UIEvents = */ {
  
  map: {},
  
  listener: function (listener, namespace, event) {
    /**
     * @type {NodeList}
     */
    var elems = document.querySelectorAll(namespace);
    var i = 0;
    var elem;
    
    // ??? need to dispatch an event for each namespaced
    // ??? item to start a bubbling sequence again???
    
    if (elems.length > 0) {
      while (i < elems.length) {
        elem = elems.item(i++);
        
        if (event.target === elem) {
          return listener.call(elem, event);
        }
      }
    }
  },
  
  on: function (type) {
    var args = Array.prototype.slice.call(arguments, 1);
    var namespace = (typeof args[0] === 'string' ? args.shift() : undefined);
    var listener = (typeof args[0] === 'function' ? args.shift() : undefined);
    var map = UIEvents.map;
    var callback;

    if (listener && allEvents.indexOf(type) > -1) {
      callback = function (event) {
        return UIEvents.listener.call(this, listener, namespace, event);
      };
      
      if (!map.hasOwnProperty(type)) {
        map[type] = [];
      }
      
      map[type].push({
        'namespace': namespace,
        'listener': listener
      });
      
      document[addEvent](type, callback, false);
    }
    
    return this;
  }
  
};

window.onload = function () {
  UIEvents
    .on('click', 'li', function (evt) {
      console.log(evt.type, evt.target);
    })
    .on('click', 'ul', function (evt) {
      console.log('ul', evt.target);
    });
};
