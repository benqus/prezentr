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
   * Removes the children but doesn't destroy them.
   * @returns {PresenterGroup}
   */
  empty: function () {
    var children = this._children_;
    var name;

    if (children.hasOwnProperty(name)) {
      children[name].remove();
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
   * @param [options] {Object}
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