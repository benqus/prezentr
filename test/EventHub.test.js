(function () {
  var eventHub = prezentr.EventHub;

  module("EventHub", {
    teardown: function () {
      eventHub.events = {};
    }
  });

  test("Subscriptions", function () {
    var f1 = function () {};
    var f2 = function () {};
    var f3 = function () {};
    var ctx = {};

    eventHub.on("a", f1, ctx);
    eventHub.on("a", f2, ctx);
    eventHub.on("b", f3, ctx);

    ok(eventHub.events.a);
    ok(eventHub.events.b);

    equal(eventHub.events.a["0"].callback, f1);
    equal(eventHub.events.a["1"].callback, f2);
    equal(eventHub.events.b["2"].callback, f3);
  });


})();