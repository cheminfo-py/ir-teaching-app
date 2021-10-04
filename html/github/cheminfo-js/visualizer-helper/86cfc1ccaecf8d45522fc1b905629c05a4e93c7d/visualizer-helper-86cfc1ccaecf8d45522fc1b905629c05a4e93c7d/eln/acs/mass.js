"use strict";

define(["exports", "../libs/MolecularFormula"], function (exports, _MolecularFormula) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toHTML;

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

  function toHTML(value) {
    var results = [];
    var exactMass = formatExactMass(value);
    if (exactMass) results.push(exactMass);
    var peaks = formatPeaks(value);
    if (peaks) results.push(peaks);
    return results.join(', ');
  }

  function getCharge(charge) {
    if (!charge) charge = 1;
    if (charge > 0) charge = "+".concat(charge);
    if (charge === '+1') charge = '+';
    if (charge === -1) charge = '-';
    return "<sup>".concat(charge, "</sup>");
  }

  function formatPeaks(value) {
    if (!value.peak || !value.peak.length > 0) return '';
    value = DataObject.resurrect(value);
    var experiment = [];
    experiment.push('MS');
    var inParenthesis = [];
    if (value.ionisation) inParenthesis.push(value.ionisation);
    if (value.analyzer) inParenthesis.push(value.analyzer);
    if (inParenthesis.length > 0) experiment.push("(".concat(inParenthesis.join('/'), ")"));
    experiment.push('m/z:');
    var peaks = [];
    var maxIntensity = 0;
    value.peak.forEach(function (peak) {
      if (peak.intensity > maxIntensity) maxIntensity = peak.intensity;
    });
    var factor = 100 / maxIntensity;

    var _iterator = _createForOfIteratorHelper(value.peak),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var peak = _step.value;

        var _value = peak.mass.toFixed(0);

        if (peak.intensity && maxIntensity) {
          _value += " (".concat(Math.round(peak.intensity * factor), ")");
        }

        peaks.push(_value);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return "".concat(experiment.join(' '), " ").concat(peaks.join(', '));
  }

  function formatExactMass(value) {
    if (!value.accurate || !value.accurate.mf || !String(value.accurate.mf)) {
      return '';
    }

    var accurate = value.accurate;
    var mfInfo = new _MolecularFormula2["default"].MF("".concat(accurate.mf, "(").concat(accurate.modification, ")")).getInfo();
    var modificationInfo = new _MolecularFormula2["default"].MF(String(accurate.modification)).getInfo();
    var result = [];
    var experiment = [];
    experiment.push('HRMS');
    var inParenthesis = [];
    if (value.ionisation) inParenthesis.push(value.ionisation);
    if (value.analyzer) inParenthesis.push(value.analyzer);
    if (inParenthesis.length > 0) experiment.push("(".concat(inParenthesis.join('/'), ")"));
    experiment.push('m/z:');
    result.push(experiment.join(' '));
    var modificationMF = new _MolecularFormula2["default"].MF(modificationInfo.mf.replace(/\(.*/, '')).toHtml();

    if (modificationMF) {
      result.push("[M + ".concat(modificationMF, "]").concat(getCharge(modificationInfo.charge)));
    } else {
      result.push("[M]".concat(getCharge(modificationInfo.charge)));
    }

    result.push('Calcd for');
    var mf = mfInfo.mf.replace(/\(.*/, '').replace(/([^+-])([0-9]+)/g, '$1<sub>$2</sub>');
    result.push(mf + getCharge(mfInfo.charge));
    result.push("".concat(mfInfo.observedMonoisotopicMass.toFixed(4), ";"));
    result.push('Found');
    result.push(Number(accurate.value).toFixed(4));
    return "".concat(result.join(' '), ".");
  }
});