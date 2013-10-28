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