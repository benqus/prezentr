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
   * @returns {Presenter}
   */
  render: function (attributes) {
    this.view.render(attributes);
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
