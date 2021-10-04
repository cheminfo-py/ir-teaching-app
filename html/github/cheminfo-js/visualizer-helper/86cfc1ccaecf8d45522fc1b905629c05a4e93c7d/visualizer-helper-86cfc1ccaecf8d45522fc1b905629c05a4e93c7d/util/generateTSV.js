"use strict";

define(["exports", "lodash"], function (exports, _lodash) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = generateTSV;

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  /*
  Example:
  const array=API.getData('fragments').resurrect().filter( fragment => fragment.display);
  
  let options={
      Type: 'modification',
      MF: 'mf',
      Adduct: 'ionization.mf',
      'MF mass': 'em',
      'm/z': 'ms.em',
      'Δ ppm': 'ms.ppm',
      'z': 'ms.charge',
      'Intensity': 'ms.target.similariy',
      'Similarity': 'ms.similarity.value',
      '%': 'ms.similarity.quantity',
      'Group': 'group.count',
      msEM: 'ms.em',
  }
  */

  /**
   * Generates a TSV from an array and options (jpath)
   * @param {*} array
   * @param {*} options
   */
  function generateTSV(array, options) {
    var targets = [];

    for (var key in options) {
      targets.push({
        header: key,
        target: options[key],
        callback: _lodash2["default"].property(options[key] || key)
      });
    }

    var lines = [targets.map(function (entry) {
      return entry.header;
    }).join('\t')];

    var _iterator = _createForOfIteratorHelper(array),
        _step;

    try {
      var _loop = function _loop() {
        var item = _step.value;
        lines.push(targets.map(function (target) {
          return target.callback(item);
        }).join('\t'));
      };

      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return lines.join('\n');
  }
});