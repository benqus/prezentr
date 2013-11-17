/**
 * prezentr - 0.2.0
 */
(function (root) {

/*global: root*/
var prezentr = {};

if (root.prezentr) {
  prezentr._prezentr = root.prezentr;
}

root.prezentr = prezentr;

var _slice = Array.prototype.slice;

var RENDER_METHODS = prezentr.renderMethods = {
  APPEND: 'append',
  PREPEND: 'prepend',
  BEFORE: 'before',
  AFTER: 'after'
};

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

var _isArray = function (arg) {
  return (arg instanceof Array);
};

var _isObject = function (arg) {
  return (arg && arg instanceof Object && !_isArray(arg) && _isFunction(arg));
};

var _getElement = function (arg, parent) {
  var result;

  if (typeof arg === 'string') {
    result = ((parent || document).querySelector(arg) || parent);
  } else if (arg instanceof Element) {
    result = arg;
  } else if (arg instanceof View) {
    result = arg.element;
  }

  return result;
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
 * @class Component
 * @description Generic base class.
 */
var Component = prezentr.Component = function () {};

/**
 * Backbone-like inheritance helper.
 * @param proto {Object}
 * @param statik {Object}
 * @returns {Function}
 */
Component.extend = function (proto, statik) {
  var Surrogate = function () {
  };
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

/**
 * Creates a mixin level before extending it.
 * @returns {Function}
 */
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

/**
 * Implements the provided objects on the prototype
 * @returns {Function}
 */
Component.implement = function () {
  var args = _slice.call(arguments);
  args.unshift(this.prototype);

  merge.left.apply(merge, args);

  return this;
};

Component.prototype = {
  constructor: Component,

  /**
   * @type {EventHub}
   */
  eventHub: EventHub,

  /**
   * Lifecycle method
   * @returns {Component}
   */
  initialize: function () {
    return this;
  },

  /**
   * Mixes the provided objects to the Component instance.
   * @returns {Component}
   */
  extend: function () {
    var args = _slice.call(arguments);
    args.unshift(this);

    merge.left.apply(merge, args);

    return this;
  },

  /**
   * Lifecycle method
   * @returns {Component}
   */
  pause: function () {
    return this;
  },

  /**
   * Lifecycle method
   * @returns {Component}
   */
  resume: function () {
    return this;
  },

  /**
   * Lifecycle method
   * @returns {Component}
   */
  destroy: function () {
    return this;
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
    var _tagName = this.tagName;
    var _element;

    Component.apply(this, arguments);

    if (_isString(element)) {
      _element = View.selectElement(element);
    } else if (_isUndefined(element) && _tagName) {
      _element = document.createElement(_tagName);
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
   * Renders the View, invoked by the containing Presenter.
   * @returns {View}
   */
  render: function () {
    return this.element;
  },

  /**
   * Returns the element of the provided View or the context.
   * @param arg {View}
   * @returns {Element}
   */
  getElement: function (arg) {
    var element = this.element;

    if (arg instanceof View) {
      element = arg.element;
    } else if (arg instanceof Element) {
      element = arg;
    }

    return element;
  },

  /**
   * Appends the View's DOM Element to the specified parent DOM Element.
   * @param parent {View|Element}
   * @returns {View}
   */
  appendTo: function (parent) {
    var element = this.element;
    var _parent = this.getElement(parent);

    if (element && _parent instanceof Element) {
      _parent.appendChild(element);
    }

    return this;
  },

  /**
   * Appends the given Element to the View's Element or the one specified by the selector.
   * @param arg {View|Element}
   * @param selector {String}
   * @returns {View}
   */
  append: function (arg, selector) {
    var root = (this.find(selector) || this.element);
    var element = this.getElement(arg);

    root.appendChild(element);

    return this;
  },

  /**
   * Appends the Element as a first child to the one specified by the provided selector.
   * If the container Element is empty, it will append it to it.
   * @param arg {View|Element}
   * @param selector {String}
   * @returns {View}
   */
  prepend: function (arg, selector) {
    var first = (this.find(selector) || this.element).firstChild;
    var element = this.getElement(arg);

    if (first && element) {
      first.insertBefore(element);
    } else {
      this.append(arg, selector);
    }

    return this;
  },

  /**
   *
   * Appends the element before the one specified by the selector.
   * @param arg {View|Element}
   * @param selector {String}
   * @returns {View}
   */
  before: function (arg, selector) {
    var before = this.find(selector);
    var element = this.getElement(arg);

    if (before && before.parentNode) {
      before.parentNode.insertBefore(element, before);
    }

    return this;
  },

  /**
   * Appends the element after the one specified by the selector.
   * @param arg {View|Element}
   * @param selector {String}
   * @returns {View}
   */
  after: function (arg, selector) {
    var after = this.find(selector);
    var before = (after || {}).nextSibling;
    var element = this.getElement(arg);

    if (before && before.parentNode) {
      before.parentNode.insertBefore(element, before);
    } else if (after && after.parentNode) { //selector points to last child
      after.parentNode.appendChild(element);
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
  },

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
   * @constructor
   */
  constructor: function () {
    var View = this.viewClass;
    var _view;

    Component.apply(this, arguments);

    if (_isFunction(View)) {
      _view = new View(this);
    }

    this.view = _view;
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
   * Adds the Presenter instance to a PresenterGroup instance.
   * @param parent {PresenterGroup}
   * @param name {String}
   */
  addTo: function (parent, name) {
    if (name && parent instanceof PresenterGroup) {
      parent.add(name, this);
    }

    return this;
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
   * Rerenders the Presenter;
   * @returns {Presenter}
   */
  reRender: function () {
    this.remove().render();
    return this;
  },

  /**
   * Displays the Presenter by rendering it's View.
   * @returns {View}
   */
  render: function (attributes) {
    this.view.render(attributes);
    return this.view;
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
 * @class PresenterGroup
 * @extends {Presenter}
 */
var PresenterGroup = prezentr.PresenterGroup = Presenter.extend({
  /**
   * @type {Object}
   */
  renderMappings: {},

  /**
   * @type {Object}
   */
  renderMethods: {},

  /**
   * @type {Object}
   */
  renderOrder: [],

  /**
   * @override
   * @constructor
   */
  constructor: function () {
    Presenter.apply(this, arguments);

    /**
     * @type {Object}
     */
    this._children_ = {};
  },

  reconstruct: function () {
    this.destroy();

    PresenterGroup.apply(this, arguments);

    return this;
  },

  /**
   * @override
   */
  initialize: function () {
    var children = this._children_;
    var child, i;

    for (i in children) {
      if (children.hasOwnProperty(i)) {
        child = children[i];
        child.initialize.apply(child, arguments);
      }
    }

    return Presenter.prototype.initialize.apply(this, arguments);
  },

  /**
   * Adds a child Presenter to the PresenterGroup
   * @param name {String}
   * @param child {Presenter}
   * @returns {PresenterGroup}
   */
  add: function (name, child) {
    var children = this._children_;

    if (_isString(name) && child instanceof Presenter && !children.hasOwnProperty(name)) {
      children[name] = child;
    }

    return this;
  },

  /**
   * Removes the children from the presentation tree but doesn't destroy them.
   * @returns {PresenterGroup}
   */
  empty: function () {
    var children = this._children_;
    var i;

    for (i in children) {
      if (children.hasOwnProperty(i)) {
        children[i].remove();
      }
    }

    return this;
  },

  /**
   * Removes the child Presenter specified by it's name.
   * @param name {String}
   * @returns {PresenterGroup}
   */
  remove: function (name) {
    var children = this._children_;
    var child = children[name];

    if (child) {
      child.destroy();
      delete children[name];
    }

    return this;
  },

  /**
   * Removes all children
   * @returns {PresenterGroup}
   */
  removeAll: function () {
    var children = this._children_;
    var i;

    for (i in children) {
      if (children.hasOwnProperty(i)) {
        this.remove(i);
      }
    }

    return this;
  },

  /**
   * Removes and re-renders all the children
   * @param [attributes] {Object}
   * @param [options] {Object}
   * @returns {PresenterGroup}
   */
  reRender: function (attributes, options) {
    this.empty();

    Presenter.prototype.reRender.apply(this, arguments);

    this.renderChildren(attributes, options);

    return this;
  },

  /**
   * @override
   * @returns {Element}
   */
  render: function (attributes, options) {
    var ret = Presenter.prototype.render.apply(this, arguments);

    this.renderChildren.apply(this, arguments);

    return ret;
  },

  /**
   * Renders all of the children
   * @param attributes {Object}
   * @param options {Object}
   * @returns {PresenterGroup}
   */
  renderChildren: function (attributes, options) {
    var _options = (options || {});
    var children = this._children_;
    var rendered = {};
    var rMappings = (_options.renderMappings || this.renderMappings);
    var rMethods = (_options.renderMethods || this.renderMethods);
    var rOrder = (_options.renderOrder || this.renderOrder);
    var method, child, name, i;

    if (rOrder && rOrder.length) {
      for (i = 0; i < rOrder.length; i++) {
        if (children.hasOwnProperty(name = rOrder[i])) {
          rendered[name] = true;
          method = (rMethods[name] || rMethods['*'] || RENDER_METHODS.APPEND);
          this.renderChild(name, method, rMappings[i], (attributes || {}));
        }
      }
    }

    for (i in children) {
      if (children.hasOwnProperty(i) && !rendered[i]) {
        method = (rMethods[i] || rMethods['*'] || RENDER_METHODS.APPEND);
        this.renderChild(i, method, rMappings[i], (attributes || {}));
      }
    }

    return this;
  },

  /**
   * Renders a mapped child.
   * @param name {String}
   * @param method {String}
   * @param [selector] {String}
   * @param [attributes] {Object}
   * @returns {PresenterGroup}
   */
  renderChild: function (name, method, selector, attributes) {
    var child = this._children_[name];
    var childView;

    if (child) {
      childView = child.render(attributes);
      this.view[method](childView, selector);
    }

    return this;
  },

  /**
   * @override
   * @returns {PresenterGroup}
   */
  destroy: function () {
    this.removeAll.apply(this, arguments);
    return Presenter.prototype.destroy.apply(this, arguments);
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
      throw new Error('Must... Specify... DOM root... (Please provide an Element for the constructor of the Block)');
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
      root.initialize.apply(root, arguments);
      this.initialized = true;
    }

    return Component.prototype.initialize.apply(this, arguments);
  },

  /**
   * Renders the presentation structure.
   * @param attributes {Object}
   * @returns {Block}
   */
  render: function (attributes) {
    var root = this.root;

    if (root) {
      root.render.apply(root, arguments)
        .appendTo(this.element);
    }

    return this;
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