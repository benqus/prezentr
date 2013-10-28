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