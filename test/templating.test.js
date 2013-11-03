(function (global, p, H) {
  var app;
  var View = p.View;
  var Presenter = p.Presenter;
  var PresenterGroup = p.PresenterGroup;

  //Views
  var ChildView = View.extend({
    tagName: 'article'
  });

  var ParentView = View.extend({
    tagName: 'section',
    template: H.compile(
      '<div class="wrapper"></div>' +
      '<div class="container">{{name}}</div>'
    ),
    /**
     * @override
     */
    render: function (attributes) {
      this.getElement().innerHTML = this.template(attributes);
      return View.prototype.render.apply(this, arguments);
    }
  });

  //Presenters
  var Child = Presenter.extend({
    viewClass: ChildView
  });

  var Parent = PresenterGroup.extend({
    viewClass: ParentView,

    renderMappings: {
      'child1': '.container',
      'child2': '.wrapper'
    },

    renderMethods: {
      'child1': 'before',
      'child2': 'after'
    },

    /**
     * @override
     */
    constructor: function () {
      PresenterGroup.apply(this, arguments);

      new Child()
        .addTo(this, 'child1');

      new Child()
        .addTo(this, 'child2');
    }
  });

  //Block
  var MyBlock = p.Block.extend({
    mainClass: Parent
  });


  window.onload = function () {
    app = new MyBlock(document.querySelector('#app'));
    app
      .initialize()
      .render({
        "name": "Timon & Pumba"
      });
  };

})(function () {
  return this;
}(), prezentr, Handlebars);