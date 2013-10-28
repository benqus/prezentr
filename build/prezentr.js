/**
 * prezentr - 0.1.0
 */
(function (root) {

var prezentr = {};

if (root.prezentr) {
  prezentr._prezentr = root.prezentr;
}

root.prezentr = prezentr;

var _slice = Array.prototype.slice;

var _isFunction = function (arg) {
  return (typeof arg === 'function');
};

var _isDefined = function (arg) {
  return (typeof arg !== 'undefined' && arg !== null);
};

var _isUndefined = function (arg) {
  return (typeof arg === 'undefined');
};

var _isString = function (arg) {
  return (typeof arg === 'string');
};

var _isNumber = function (arg) {
  return (typeof arg === 'number' && !isNaN(arg) && isFinite(arg));
};


var merge = (function () {
  var _merge = function (objects) {
    var root = objects[0];
    var object, i, p;

    if (objects.length > 0) {
      for (i in objects) {
        if (objects.hasOwnProperty(i)) {
          object = objects[i];

          if (object) {
            for (p in object) {
              if (object.hasOwnProperty(p)) {
                root[p] = object[p];
              }
            }
          }
        }
      }
    }

    return root;
  };

  return {
    left: function () {
      var args = _slice.call(arguments);
      return _merge(args);
    },
    create: function () {
      var args = _slice.call(arguments);
      args.unshift({});
      return _merge(args);
    },
    right: function () {
      var args = _slice.call(arguments).reverse();
      return _merge(args);
    }
  };
}());

/**
 * @class Component
 * @description Generic base class.
 */
var Component = prezentr.Component = function () {};

/**
 *
 * @param proto {Object}
 * @param statik {Object}
 * @returns {Function}
 */
Component.extend = function (proto, statik) {
    var Surrogate = function () {};
    var Super = this;
    var Class;

    if (proto.hasOwnProperty('constructor')) {
        Class = proto.constructor;
    } else {
        Class = function () {
            return Super.apply(this, arguments);
        };
    }

    Surrogate.prototype = Super.prototype;
    Class.prototype = merge.left(new Surrogate(), proto, {
        constructor: Class
    });

    merge.left(Class, statik, {
        mixes: Super.mixes,
        extend: Super.extend,
        implement: Super.implement
    });

    return Class;
};

Component.mixes = function () {
    var args = _slice.call(arguments);
    var behaviours = [];
    var surrogate, b;

    while (args.length > 0) {
        b = args.shift();
        behaviours.push(_isFunction(b) ? b.prototype : b);
    }

    surrogate = merge.create.apply(merge, behaviours);

    return this.extend(surrogate);
};

Component.implement = function () {
    var args = _slice.call(arguments);
    args.unshift(this.prototype);

    merge.left.apply(merge, args);

    return this;
};

Component.prototype = {
    constructor: Component,

    initialize: function () {
        return this;
    },

    extend: function () {
        var args = _slice.call(arguments);
        args.unshift(this);

        merge.left.apply(merge, args);

        return this;
    },

    pause: function () {
        return this;
    },

    resume: function () {
        return this;
    },


    destroy: function () {
        return this;
    }
};

var EventHub = prezentr.EventHub = {
  /**
   * @type {Object}
   */
  events: {},

  /**
   * @type {Number}
   */
  eventId: 0,

  on: function (type, callback, context, once) {
    var events = this.events;
    var id;

    if (_isString(type) && _isFunction(callback)) {
      if (!events.hasOwnProperty(type)) {
        events[type] = {};
      }

      id = this.eventId++;
      events[type][id] = {
        id: id,
        once: (once === true),
        context: (context || root),
        callback: callback
      };
    }

    return this;
  },

  once: function (type, callback, context) {
    this.on(type, callback, context, true);
    return this;
  },

  off: function (type, callback, context) {
    var events = this.events;
    var types, i, j;

    if (_isString(type)) {
      types = events[type];

      for (i in types) {
        if (types.hasOwnProperty(i)) {
          this.offListener(types, types[i], callback, context);
        }
      }
    } else if (_isFunction(callback) || _isDefined(context)) {
      for (i in events) {
        if (events.hasOwnProperty(i)) {
          types = events[i];

          for (j in types) {
            if (types.hasOwnProperty(j)) {
              this.offListener(types, types[j], callback, context);
            }
          }
        }
      }
    } else {
      this.events = {};
    }

    return this;
  },

  trigger: function (type) {
    var args = _slice.call(arguments, 1);
    var types = this.events[type];
    var listener, i;

    if (types instanceof Array) {
      for (i in types) {
        if (types.hasOwnProperty(i)) {
          listener = types[i];
          listener.callback.apply(listener.context, args);

          if (listener.once === true) {
            delete types[listener.id];
          }
        }
      }
    }

    return this;
  },

  offListener: function (types, listener, callback, context) {
    if (listener.callback === callback || !_isFunction(callback)) {
      //remove only when context is not defined or
      //when context matches listener's context
      if (listener.context === context || !_isDefined(context)) {
        delete types[listener.id];
      }
    }
  }
};

/**
 * @type {Object}
 */
var AnimationQueue = prezentr.AnimationQueue = {
  /**
   * @type {Object}
   */
  namespaces: {},

  /**
   * Registers the given second parameter for the specified animation
   * namespace and for all the registered animations array.
   * @param name {String}
   * @param arg {Object} animation
   * @returns {AnimationQueue}
   */
  register: function (name, arg) {
    var namespaces = this.namespaces;

    if (_isString(name) && _isDefined(arg)) {
      //create namespace if it doesn't exist yet
      if (!namespaces.hasOwnProperty(name)) {
        namespaces[name] = [];
      }

      //register animation
      namespaces[name].push(arg);
    }

    return this;
  },

  /**
   * Removes the given second parameter from the specified animation
   * namespace and from all the registered animations array.
   * @param name {String}
   * @param arg {Object}
   * @returns {AnimationQueue}
   */
  remove: function (name, arg) {
    var namespaces = this.namespaces;
    var namespace = namespaces[name];
    var i;

    if (_isString(name) && namespace && _isDefined(arg)) {
      i = 0;

      for (; i < namespace.length; i++) {
        if (arg === namespace[i]) {
          namespace.splice(i, 1);
          return this;
        }
      }
    }

    return this;
  },

  /**
   * Resets/cleans up the AnimationQueue.
   * @returns {AnimationQueue}
   */
  reset: function () {
    this.namespaces = {};
    return this;
  },

  /**
   * Determines whether there is a animation going on on the specified namespace.
   * If namespace is omitted, it will check whether there are any animations in the queue.
   * @param name {String}
   * @returns {Boolean}
   */
  isAnimating: function (name) {
    return ((this.namespaces[name] || []).length > 0);
  }
};

/**
 * @class View
 * @extends {Component}
 * @description Passive View class tp maintain a DOM presentation for Presenter instances.
 */
var View = prezentr.View = Component.extend({
  /**
   *
   * @type {String}
   */
  tagName: 'div',

  /**
   * @constructor
   * @param presenter {Presenter}
   * @param element {undefined|String|Element}
   */
  constructor: function (presenter, element) {
    var _element;

    Component.apply(this, arguments);

    if (_isString(element)) {
      _element = View.selectElement(element);
    } else if (_isUndefined(element)) {
      _element = document.createElement(this.tagName);
    } else if (element instanceof Element) {
      _element = element;
    }

    /**
     * The containing Presenter instance.
     * @type {Presenter}
     */
    this.presenter = presenter;

    /**
     * View's root DOM Element
     * @type {Element}
     */
    this.element = _element;
  },

  /**
   * Searches for the specified element by the provided selector.
   * @param selector {String}
   * @returns {Node}
   */
  find: function (selector) {
    return this.element.querySelector(selector);
  },

  /**
   * Removes and renders the View again.
   * @returns {View}
   */
  reRender: function () {
    return this.remove().render();
  },

  /**
   * Renders the View, invoked by the containing Presenter.
   * @returns {View}
   */
  render: function () {
    return this.element;
  },

  /**
   * Appends the View's DOM Element to the specified parent DOM Element.
   * @param parent {Element}
   * @returns {View}
   */
  appendTo: function (parent) {
    var element = this.element;

    if (element && parent instanceof Element) {
      parent.appendChild(element);
    }

    return this;
  },

  /**
   * Removes the View's root DOM Element form the UI.
   * @returns {View}
   */
  remove: function () {
    var element = this.element;
    var parent = element.parentNode;

    if (parent) {
      parent.removeChild(element);
    }

    return this;
  },

  /**
   * Destroys the View by removing it.
   * @returns {Presenter}
   */
  destroy: function () {
    this.remove();
    return Component.prototype.destroy.apply(this, arguments);
  }
}, {
  /**
   * Override this method if you want custom DOM selection.
   * @param descriptor {String}
   * @returns {Node}
   */
  selectElement: function (descriptor) {
    return document.querySelector(descriptor);
  }
});

/**
 * @class ActiveView
 * @extends View
 * @description ActiveView instances have a reference to a model
 *              and are allowed to subscribe to any events on it.
 */
var ActiveView = prezentr.ActiveView = View.extend({
  /**
   * @constructor
   * @param presenter {Presenter}
   * @param model {Object|Emitter}
   * @param element {Element}
   */
  constructor: function (presenter, model, element) {
    View.call(this, presenter, element);
    this.model = model;
  }
});

/**
 * @class Presenter
 * @extends {Component}
 */
var Presenter = prezentr.Presenter = Component.extend({
  /**
   * @type {Function}
   */
  viewClass: View,

  /**
   * @type {AnimationQueue}
   */
  animationQueue: AnimationQueue,

  /**
   * @type {EventHub}
   */
  eventHub: EventHub,

  /**
   * @constructor
   */
  constructor: function () {
    Component.apply(this, arguments);
    this.view = new this.viewClass();
  },

  /**
   * Initializes the Presenter and the contained Vie instance.
   * @returns {Presenter}
   */
  initialize: function () {
    var view = this.view;

    view.initialize.apply(view, arguments);

    return Component.prototype.initialize.apply(this, arguments);
  },

  /**
   * Returns the view instance referenced by the Presenter.
   * @returns {View}
   */
  getView: function () {
    return this.view;
  },

  /**
   * Updates the Presenter.
   * @returns {Presenter}
   */
  update: function () {
    this.view.reRender();
    return this;
  },

  /**
   * Removes the Presenter form the presentation structure.
   * @returns {Presenter}
   */
  remove: function () {
    this.view.remove();
    return this;
  },

  /**
   * Displays the Presenter by rendering it's View.
   * @returns {Presenter}
   */
  render: function () {
    this.view.render();
    return this;
  },

  /**
   * @override
   * @returns {Component}
   */
  destroy: function () {
    this.view.destroy();
    return Component.prototype.destroy.apply(this, arguments);
  }
});


/**
 * @class Block
 * @extends {Component}
 */
var Block = prezentr.Block = Component.extend({
  /**
   * @type {Presenter|undefined}
   */
  mainClass: undefined,

  /**
   * @constructor
   * @param element {Element}
   */
  constructor: function (element) {
    if (!(element instanceof Element)) {
      throw new Error('Must... Specify... DOM root... (Please provide an Element to constructor the Block)');
    }

    var Main = this.mainClass;
    var root;

    Component.apply(this, arguments);

    if (_isDefined(Main)) {
      root = new Main();
    }

    this.initialized = false;
    this.element = element;
    this.root = root;
  },

  /**
   * @override
   */
  initialize: function () {
    var root = this.root;

    if (root && !this.initialized) {
      root
        .initialize.apply(root, arguments)
        .getView()
          .appendTo(this.element);

      this.initialized = true;
    }

    return Component.prototype.initialize.apply(this, arguments);
  },

  /**
   * @override
   */
  destroy: function () {
    var root = this.root;

    if (root) {
      root.destroy();
    }

    this.initialized = false;

    return Component.prototype.destroy.apply(this, arguments);
  }
});

})((function () {
    return this;
})());