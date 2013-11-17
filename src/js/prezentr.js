/*global: root*/
var prezentr = {};

if (root.prezentr) {
  prezentr._prezentr = root.prezentr;
}

root.prezentr = prezentr;

var _slice = Array.prototype.slice;

var RENDER_METHODS = prezentr.renderMethods = {
  APPEND: 'append',
  PREPEND: 'prepend',
  BEFORE: 'before',
  AFTER: 'after'
};

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

var _isArray = function (arg) {
  return (arg instanceof Array);
};

var _isObject = function (arg) {
  return (arg && arg instanceof Object && !_isArray(arg) && _isFunction(arg));
};

var _getElement = function (arg, parent) {
  var result;

  if (typeof arg === 'string') {
    result = ((parent || document).querySelector(arg) || parent);
  } else if (arg instanceof Element) {
    result = arg;
  } else if (arg instanceof View) {
    result = arg.element;
  }

  return result;
};