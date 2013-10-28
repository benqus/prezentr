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
      throw new Error('Must... Specify... DOM root... (Please provide an Element to constructor the Block)');
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
      root
        .initialize.apply(root, arguments)
        .getView()
          .appendTo(this.element);

      this.initialized = true;
    }

    return Component.prototype.initialize.apply(this, arguments);
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