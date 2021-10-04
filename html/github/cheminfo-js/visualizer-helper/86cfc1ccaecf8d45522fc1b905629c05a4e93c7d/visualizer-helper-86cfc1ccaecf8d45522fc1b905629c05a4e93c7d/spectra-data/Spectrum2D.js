"use strict";

define(["exports", "../eln/libs/jcampconverter", "./conrec"], function (exports, _jcampconverter, _conrec) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Spectrum2D = undefined;
  exports.fromJcamp = fromJcamp;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var Spectrum2D = exports.Spectrum2D = function () {
    function Spectrum2D(minMax) {
      _classCallCheck(this, Spectrum2D);

      this.currentLevelPositive = 10;
      this.currentLevelNegative = 10;
      var xs = getRange(minMax.minX, minMax.maxX, minMax.z[0].length);
      var ys = getRange(minMax.minY, minMax.maxY, minMax.z.length);
      this.conrec = new _conrec.Conrec(minMax.z, {
        xs: xs,
        ys: ys,
        swapAxes: false
      });
      this.median = minMax.noise;
      this.minMax = minMax;
    }

    _createClass(Spectrum2D, [{
      key: "wheel",
      value: function wheel(value) {
        var sign = Math.sign(value);

        if (this.currentLevelPositive > 0 && sign === -1 || this.currentLevelPositive < 21 && sign === 1) {
          this.currentLevelPositive += sign;
        }

        if (this.currentLevelNegative > 0 && sign === -1 || this.currentLevelNegative < 21 && sign === 1) {
          this.currentLevelNegative += sign;
        }
      }
    }, {
      key: "shiftWheel",
      value: function shiftWheel(value) {
        var sign = Math.sign(value);

        if (this.currentLevelNegative === 0 && sign === -1 || this.currentLevelNegative > 20 && sign === 1) {
          return;
        }

        this.currentLevelNegative += sign;
      }
    }, {
      key: "createContours",
      value: function createContours() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _options$timeout = options.timeout,
            timeout = _options$timeout === void 0 ? 1000 : _options$timeout,
            _options$nbPositiveLe = options.nbPositiveLevels,
            nbPositiveLevels = _options$nbPositiveLe === void 0 ? 10 : _options$nbPositiveLe,
            _options$nbNegativeLe = options.nbNegativeLevels,
            nbNegativeLevels = _options$nbNegativeLe === void 0 ? 10 : _options$nbNegativeLe;
        var zoomPositive = this.currentLevelPositive / 2 + 1;
        var zoomNegative = this.currentLevelNegative / 2 + 1;
        var chart = {
          data: [{
            type: 'contour',
            contourLines: this.getContours(zoomPositive, {
              negative: false,
              timeout: timeout,
              nbLevels: nbPositiveLevels
            })
          }, {
            type: 'contour',
            contourLines: this.getContours(zoomNegative, {
              negative: true,
              timeout: timeout,
              nbLevels: nbNegativeLevels
            })
          }]
        };
        return chart;
      }
    }, {
      key: "getContours",
      value: function getContours(zoomLevel) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var _options$negative = options.negative,
            negative = _options$negative === void 0 ? false : _options$negative,
            _options$timeout2 = options.timeout,
            timeout = _options$timeout2 === void 0 ? 1000 : _options$timeout2,
            _options$nbLevels = options.nbLevels,
            nbLevels = _options$nbLevels === void 0 ? 10 : _options$nbLevels;
        var max = Math.max(Math.abs(this.minMax.maxZ), Math.abs(this.minMax.minZ));
        var range = getRange(this.median * 3 * Math.pow(2, zoomLevel), max, nbLevels, 2);

        if (negative) {
          range = range.map(function (value) {
            return -value;
          });
        }

        var contours = this.conrec.drawContour({
          levels: range,
          timeout: timeout
        });
        return {
          minX: this.minMax.minX,
          maxX: this.minMax.maxX,
          minY: this.minMax.minY,
          maxY: this.minMax.maxY,
          segments: contours
        };
      }
    }]);

    return Spectrum2D;
  }();

  function fromJcamp(_x) {
    return _fromJcamp.apply(this, arguments);
  }

  function _fromJcamp() {
    _fromJcamp = _asyncToGenerator(regeneratorRuntime.mark(function _callee(jcamp) {
      var parsed;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _jcampconverter.convert)(jcamp, {
                noContour: true
              }).flatten[0];

            case 2:
              parsed = _context.sent;
              return _context.abrupt("return", new Spectrum2D(parsed.minMax));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _fromJcamp.apply(this, arguments);
  }

  function getRange(min, max, length, exp) {
    if (exp) {
      var factors = [];
      factors[0] = 0;

      for (var i = 1; i <= length; i++) {
        factors[i] = factors[i - 1] + (exp - 1) / Math.pow(exp, i);
      }

      var lastFactor = factors[length];
      var result = new Array(length);

      for (var _i = 0; _i < length; _i++) {
        result[_i] = (max - min) * (1 - factors[_i + 1] / lastFactor) + min;
      }

      return result;
    } else {
      var step = (max - min) / (length - 1);
      return range(min, max + step / 2, step);
    }
  }

  function range(from, to, step) {
    var result = [];

    for (var i = from; i < to; i += step) {
      result.push(i);
    }

    return result;
  }
});