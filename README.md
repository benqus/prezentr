prezentr
========

Backbone-like presentation framework for front-ends.

Based on my experience - so far -, a good and scalable **front-end** framework/environment is like a *punchbag*.
Provides enough features for a massively *event-driven* application but it doesn't get afraid of having no data or
back-end to sync with. No matter what - no model, no connection or scumbag user -, the app must stand. And stand well.
Ant to take those nasty punches... ^_^

***Prezentr*** is designed to give your app a **presentation structure** without specifying your domain-model.
Data can be anything for a presentation, you might even end up having multiple domain-model to query and display attributes from.

The closest architectural pattern - if we really must specify one - would be **MVP** by taking the focus off of the **M** and putting it on the **P**.

# Main classes

A short description of classes/mixins and their intended roles.

> **Headz up:** upcoming PresenterGroup class...

## Component

Generic base class. Provides lifecycle API/behaviour to any derived class.

Inherited prototype properties:

 - `initialize`
 - `pause`
 - `resume`
 - `destroy`

Inherited static methods:

 - `extend` - resolves inheritance in Backbone-style
 - `mixes` - creates a mixin level from the class invoked on for later extension
 - `implement` - the mixin on the prototype of the class which the method was invoked on

## Block

> **extends** `Component`

Blocks are meant to provide one - or more - root for the presentation inside a page by wrapping around the specified DOM Element.

Presentation hierarchies should be able to align and adapt to different roots - these should be different Blocks.

    var MyPresentation = prezentr.Presenter.extend({ ... });

    var MyBlock = prezentr.Block({
        main: MyPresentation
    });

    var block = new Block(document.body);
    block.initialize();

## Presenter

> **extends** `Component`

Presenter instances give the structure and the main logic of the presentation.

Each Presenter should have a `View` derivative instance, specified by the Presenter.prototype.View property.

    var MyView = prezentr.View.extend({ ... });

    var MyPresenter = prezentr.Presenter.extend({
        viewClass: MyView,
        ...
    });

## View

> **extends** `Component`

View is *intentionally* kept as empty and simple as it can be by specifying a very basic API only to interact with the DOM.

View follows the concept of Passive Views and has no knowledge of any model and should be controlled completely by a Presenter.

You should extend and override the necessary methods for custom behaviour. For example: using templates, UI event subscriptions, etc.

## ActiveView

> **extends** `View`

ActiveView instances have reference to a model and therefore can subscribe to model events.
