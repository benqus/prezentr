var prezentr = {};

if (root.prezentr) {
  prezentr._prezentr = root.prezentr;
}

root.prezentr = prezentr;

var _slice = Array.prototype.slice;

var _isFunction = function (arg) {
  return (typeof arg === 'function');
};

var _isDefined = function (arg) {
  return (typeof arg !== 'undefined' && arg !== null);
};

var _isUndefined = function (arg) {
  return (typeof arg === 'undefined');
};

var _isString = function (arg) {
  return (typeof arg === 'string');
};

var _isNumber = function (arg) {
  return (typeof arg === 'number' && !isNaN(arg) && isFinite(arg));
};
