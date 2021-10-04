"use strict";

define(["exports", "src/util/api", "lodash"], function (exports, _api, _lodash) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = trackMove;

  var _api2 = _interopRequireDefault(_api);

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

  var trackThrottle;

  function trackMove(action) {
    if (!trackThrottle) {
      trackThrottle = _lodash2["default"].throttle(function (action) {
        generateTrackAnnotations(action);
      }, 100);
    }

    trackThrottle(action);
  }

  function generateTrackAnnotations(action) {
    var trackMove = action.value.data;

    var preferences = _api2["default"].getData('preferences').resurrect();

    if (!preferences.display || !preferences.display.trackingInfo || !trackMove || Object.keys(trackMove).length === 0) {
      _api2["default"].createData('trackAnnotations', []);

      return;
    }

    var selectedSpectra = _api2["default"].getData('selectedSpectra');

    var ids = selectedSpectra.filter(function (entry) {
      return DataObject.resurrect(entry.display);
    }).map(function (entry) {
      return String(entry.id);
    });
    var colors = selectedSpectra.filter(function (entry) {
      return DataObject.resurrect(entry.display);
    }).map(function (entry) {
      return String(entry.color);
    });

    var spectra = _api2["default"].cache('analysesManager').getAnalyses({
      ids: ids
    }); // we will get the index for all the charts


    var keys = Object.keys(trackMove);
    var data = new Array(keys.length);

    for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
      var key = _keys[_i];
      var index = Number(key.replace(/chart-?/, '') || 0);
      data[index] = {
        x: trackMove[key].xClosest,
        y: trackMove[key].yClosest,
        color: colors[index],
        spectrum: spectra[index]
      };
    }

    var trackAnnotations = getTrackAnnotations(data);

    _api2["default"].createData('trackAnnotations', trackAnnotations);

    function getTrackAnnotations(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _options$showSpectrum = options.showSpectrumID,
          showSpectrumID = _options$showSpectrum === void 0 ? true : _options$showSpectrum,
          _options$startX = options.startX,
          startX = _options$startX === void 0 ? 300 : _options$startX;
      var annotations = [];
      var line = 0;
      if (isNaN(data[0].x)) return;
      annotations.push({
        type: 'line',
        position: [{
          x: "".concat(startX, "px"),
          y: "".concat(15 + 15 * line, "px")
        }, {
          x: "".concat(startX + 15, "px"),
          y: "".concat(15 + 15 * line, "px")
        }],
        strokeWidth: 0.0000001,
        label: {
          size: 16,
          text: "x: ".concat(data[0].x.toPrecision(6)),
          position: {
            x: "".concat(startX + 60, "px"),
            y: "".concat(20 + 15 * line, "px")
          }
        }
      });
      line++;

      var _iterator = _createForOfIteratorHelper(data),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var datum = _step.value;
          if (isNaN(datum.y)) continue;
          annotations.push({
            type: 'line',
            position: [{
              x: "".concat(startX, "px"),
              y: "".concat(15 + 15 * line, "px")
            }, {
              x: "".concat(startX + 15, "px"),
              y: "".concat(15 + 15 * line, "px")
            }],
            strokeColor: datum.color,
            strokeWidth: 2,
            label: {
              text: "".concat(datum.y.toPrecision(4)).concat(showSpectrumID ? " - ".concat(datum.spectrum.label) : ''),
              position: {
                x: "".concat(startX + 20, "px"),
                y: "".concat(20 + 15 * line, "px")
              }
            }
          });
          line++;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return annotations;
    }
  }
});