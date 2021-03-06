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