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