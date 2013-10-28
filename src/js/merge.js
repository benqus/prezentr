var merge = (function () {
  var _merge = function (objects) {
    var root = objects[0];
    var object, i, p;

    if (objects.length > 0) {
      for (i in objects) {
        if (objects.hasOwnProperty(i)) {
          object = objects[i];

          if (object) {
            for (p in object) {
              if (object.hasOwnProperty(p)) {
                root[p] = object[p];
              }
            }
          }
        }
      }
    }

    return root;
  };

  return {
    left: function () {
      var args = _slice.call(arguments);
      return _merge(args);
    },
    create: function () {
      var args = _slice.call(arguments);
      args.unshift({});
      return _merge(args);
    },
    right: function () {
      var args = _slice.call(arguments).reverse();
      return _merge(args);
    }
  };
}());