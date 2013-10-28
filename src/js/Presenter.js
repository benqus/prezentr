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
