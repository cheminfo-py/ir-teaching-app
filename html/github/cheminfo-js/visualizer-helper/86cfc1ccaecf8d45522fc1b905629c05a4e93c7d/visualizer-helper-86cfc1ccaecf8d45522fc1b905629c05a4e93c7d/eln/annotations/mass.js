"use strict";

define(["module"], function (module) {
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function F() {};

        return {
          s: F,
          n: function n() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function e(_e) {
            throw _e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function s() {
        it = o[Symbol.iterator]();
      },
      n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function e(_e2) {
        didErr = true;
        err = _e2;
      },
      f: function f() {
        try {
          if (!normalCompletion && it["return"] != null) it["return"]();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function toAnnotations(peaks) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$fillColor = options.fillColor,
        fillColor = _options$fillColor === void 0 ? 'green' : _options$fillColor,
        _options$strokeColor = options.strokeColor,
        strokeColor = _options$strokeColor === void 0 ? 'red' : _options$strokeColor,
        _options$yPosition = options.yPosition,
        yPosition = _options$yPosition === void 0 ? undefined : _options$yPosition;
    if (!peaks) return [];
    var shouldRefresh = false;
    var annotations = [];

    var _iterator = _createForOfIteratorHelper(peaks),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var peak = _step.value;

        if (!peak._highlight) {
          Object.defineProperty(peak, '_highlight', {
            enumerable: false,
            writable: true
          });
          peak._highlight = Math.random();
          shouldRefresh = true;
        }

        var annotation = {
          line: 1,
          _highlight: [peak._highlight],
          type: 'rect',
          strokeColor: strokeColor,
          strokeWidth: 0,
          fillColor: fillColor
        };
        annotation.label = [{
          text: Number(peak.mass).toFixed(1),
          size: '18px',
          anchor: 'middle',
          color: 'red',
          position: {
            x: peak.mass,
            y: yPosition === undefined ? peak.intensity : yPosition,
            dy: '-22px'
          }
        }];
        annotation.position = [{
          x: peak.mass - 1,
          y: yPosition === undefined ? peak.intensity : yPosition,
          dy: '-20px'
        }, {
          x: peak.mass + 1,
          y: yPosition === undefined ? peak.intensity : yPosition,
          dy: '-10px'
        }];

        if (peak.assignment) {
          annotation.label.push({
            text: peak.assignment,
            size: '18px',
            anchor: 'left',
            color: 'green',
            position: {
              x: peak.mass,
              y: yPosition === undefined ? peak.intensity : yPosition,
              dy: '2px'
            }
          });
        }

        annotations.push(annotation);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (shouldRefresh) {
      peaks.triggerChange();
    }

    return annotations;
  }

  module.exports = toAnnotations;
});