"use strict";

define(["exports", "../libs/MolecularFormula"], function (exports, _MolecularFormula) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toHtml;

  var _MolecularFormula2 = _interopRequireDefault(_MolecularFormula);

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

  function toHtml(value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var mf = options.mf,
        _options$elements = options.elements,
        elements = _options$elements === void 0 ? ['C', 'H', 'N', 'S'] : _options$elements;

    if (!mf) {
      return 'Missing theoretical MF';
    }

    var theoretical = [];
    var found = [];
    var mfObject = new _MolecularFormula2["default"].MF(String(options.mf));
    mfObject.canonize();
    var ea = mfObject.getEA();

    if (Array.isArray(value)) {
      value = findBest(value, ea);
    }

    var _iterator = _createForOfIteratorHelper(elements),
        _step;

    try {
      var _loop = function _loop() {
        var element = _step.value;
        var field = element.toLowerCase();

        if (value[field]) {
          var oneTheoretical = ea.filter(function (ea) {
            return ea.element === element;
          });
          var th = oneTheoretical.length ? oneTheoretical[0].ratio * 100 : 0;
          theoretical.push("".concat(element.toUpperCase(), ", ").concat(th.toFixed(2)));
          found.push("".concat(element.toUpperCase(), ", ").concat((value[field] * 100).toFixed(2)));
        }
      };

      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var result = "Anal. Calcd for ".concat(mfObject.toHtml(), ": ");
    result += theoretical.join('; ');
    result += '. Found: ';
    result += found.join('; ');
    result += '.';
    return result;
  }

  function findBest(eas, theoretical) {
    var bestError = Number.MAX_VALUE;
    var bestEA;

    var _iterator2 = _createForOfIteratorHelper(eas),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var ea = _step2.value;
        var error = 0;

        var _iterator3 = _createForOfIteratorHelper(theoretical),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var th = _step3.value;
            var key = th.element.toLowerCase();

            if (ea[key]) {
              error += Math.abs(ea[key] - th.ratio);
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        if (error < bestError) {
          bestError = error;
          bestEA = ea;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return bestEA;
  }
});