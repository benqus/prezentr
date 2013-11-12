prezentr
========

Backbone-like presentation framework for front-ends.

A good and scalable **front-end** framework/environment is like a *punchbag*.
Provides enough features for a massively *event-driven* application but it doesn't get afraid of having no data or
back-end to sync with. No matter what - no model, no connection or scumbag user -, the app must stand. And stand well.
Ant to take those nasty punches... ^_^

***Prezentr*** is designed to give your app a **presentation structure** without specifying your domain-model.
Data can be anything for a presentation, you might even end up having multiple domain-model to query and display attributes from.

Read more about the concept here: [Prezentr - presentation framework](http://benqus.tumblr.com/post/66477840976/prezentr-presentation-framework "Prezentr - presentation framework")

# Main classes

A short description of classes/mixins and their intended roles.

## Component

Generic base class. Provides lifecycle API/behaviour and an EventHub to any derived class.

Inherited (prototype) lifecycle property methods:

 - `initialize`
 - `pause`
 - `resume`
 - `destroy`

And an additional sugar for event-driven apps:

 - `eventHub {prezentr.EventHub}` - `on`, `once`, `off`, `trigger` as in Backbone

Inherited static methods:

 - `extend` - resolves inheritance in Backbone-style
 - `mixes` - creates a mixin level from the class invoked on for later extension
 - `implement` - the mixin on the prototype of the class which the method was invoked on

## Block

> **extends** `Component`

Blocks are meant to provide one - or more - root for the dynamically built presentation hierarchy inside a page by wrapping around the specified **empty** DOM Element.

Presentation hierarchies should be able to align and adapt to different roots - these should be different Blocks.

    var MyPresentation = prezentr.Presenter.extend({ ... });

    var MyBlock = prezentr.Block({
        mainClass: MyPresentation
    });

    var block = new Block(document.body);
    block.initialize();

## Presenter

> **extends** `Component`

Presenter instances give the structure and the main logic of the presentation.

Each Presenter should have a `View` derivative instance, specified by the Presenter.prototype.View property.

Presenters also benefit from an AnimationQueue to register on-going animations. This can be extremely powerful when nesting Presenters under the same animation namespace.

    var MyView = prezentr.View.extend({ ... });

    var MyPresenter = prezentr.Presenter.extend({
        viewClass: MyView,

        startAnimation: function () {
            this.animationQueue
                .register("myAnimation", this);
        },

        ...
    });

## PresenterGroup

PresenterGroups maintain child Presenter/Group instances.

Your presentation structure should be defined in the constructor.

    var MyGroup = prezentr.PresenterGroup.extend({
        ...
        constructor: function () {
            prezentr.PresenterGroup.apply(this, arguments);

            this
              .add("child1", new Child())
              .add("child2", new Child());
        },
        ...
    });

Check the [test](https://github.com/benqus/prezentr/blob/master/test/templating.test.js)

## View

> **extends** `Component`

View is *intentionally* kept as empty and simple as it can be by specifying a very basic API only to interact with the DOM.

View follows the concept of Passive Views and has no knowledge of any model and should be controlled completely by a Presenter.

You should extend and override the necessary methods for custom behaviour. For example: using templates, UI event subscriptions, etc.
