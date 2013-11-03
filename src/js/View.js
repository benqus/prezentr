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