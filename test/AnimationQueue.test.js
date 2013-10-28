(function () {
  var animationQueue = prezentr.AnimationQueue;

  module("AnimationQueue", {
    teardown: function () {
      animationQueue.reset();
    }
  });

  test("Register animation", function () {
    var a = {};
    var aa = {};
    var b = {};

    animationQueue.register("a", a);
    animationQueue.register("a", aa);
    animationQueue.register("b", b);

    equal(a, animationQueue.namespaces.a[0]);
    equal(aa, animationQueue.namespaces.a[1]);
    equal(b, animationQueue.namespaces.b[0]);
  });

  test("Determining whether there is an animation in the 'a' and the 'b' namespace", function () {
    animationQueue.register("a", {});

    ok(animationQueue.isAnimating("a"));
    equal(animationQueue.isAnimating("b"), false);
  });

  test("", function () {
    var a = {a: 1};
    var aa = {aa: 2};
    var b = {b: 3};

    animationQueue.register("a", a);
    animationQueue.register("a", aa);
    animationQueue.register("b", b);

    ok(animationQueue.isAnimating("a"));
    ok(animationQueue.isAnimating("b"));

    animationQueue.remove("a", a);
    animationQueue.remove("a", aa);
    animationQueue.remove("b", b);

    equal(animationQueue.isAnimating("a"), false);
    equal(animationQueue.isAnimating("b"), false);
  });

})();