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