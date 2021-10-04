"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*
Create jsgraph annotations from an array
This method will put the original data in 'info' of the annotations
*/
define(['src/util/api'], function (API) {
  function create(data, variableName) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var _options$from = options.from,
        from = _options$from === void 0 ? function (datum) {
      return datum.from;
    } : _options$from,
        _options$to = options.to,
        to = _options$to === void 0 ? function (datum) {
      return datum.to;
    } : _options$to,
        _options$top = options.top,
        top = _options$top === void 0 ? '10px' : _options$top,
        _options$bottom = options.bottom,
        bottom = _options$bottom === void 0 ? '20px' : _options$bottom,
        _options$highlight = options.highlight,
        highlight = _options$highlight === void 0 ? function (datum) {
      return datum._highlight;
    } : _options$highlight,
        _options$fillColor = options.fillColor,
        fillColor = _options$fillColor === void 0 ? 'red' : _options$fillColor,
        _options$strokeColor = options.strokeColor,
        strokeColor = _options$strokeColor === void 0 ? 'red' : _options$strokeColor;
    var annotations = [];

    var _iterator = _createForOfIteratorHelper(data),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var datum = _step.value;
        annotations.push({
          position: [{
            x: typeof from === 'function' ? from(datum) : from,
            y: typeof top === 'function' ? top(datum) : top
          }, {
            x: typeof to === 'function' ? to(datum) : to,
            y: typeof bottom === 'function' ? bottom(datum) : bottom
          }],
          type: 'rect',
          fillColor: typeof fillColor === 'function' ? fillColor(datum) : fillColor,
          strokeColor: typeof strokeColor === 'function' ? strokeColor(datum) : strokeColor,
          _highlight: typeof highlight === 'function' ? highlight(datum) : highlight,
          info: datum
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    API.createData(variableName, annotations);
  }

  return create;
});