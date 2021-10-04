"use strict";

define(["module", "src/util/api", "./trackMove", "./recalculateCharts", "src/util/color"], function (module, _api, _trackMove, _recalculateCharts, _color) {
  var _api2 = _interopRequireDefault(_api);

  var _trackMove2 = _interopRequireDefault(_trackMove);

  var _recalculateCharts2 = _interopRequireDefault(_recalculateCharts);

  var _color2 = _interopRequireDefault(_color);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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

  var nbColors = 8;

  var colors = _color2["default"].getDistinctColorsAsString(nbColors);

  function processActions(_x) {
    return _processActions.apply(this, arguments);
  }

  function _processActions() {
    _processActions = _asyncToGenerator(regeneratorRuntime.mark(function _callee(action) {
      var jcampInfo, analysesManager, selectedSpectra, _result, result;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(!action || !action.name)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              _context.t0 = action.name;
              _context.next = _context.t0 === 'trackMove' ? 5 : _context.t0 === 'recalculateCharts' ? 7 : _context.t0 === 'spectrumInfo' ? 9 : _context.t0 === 'removeSpectrum' ? 15 : _context.t0 === 'setSpectrum' ? 17 : _context.t0 === 'addSample' ? 26 : _context.t0 === 'addSpectrum' ? 30 : _context.t0 === 'hideSpectra' ? 35 : _context.t0 === 'hideAllSpectra' ? 37 : _context.t0 === 'removeAllSpectra' ? 39 : _context.t0 === 'showOnlySpectra' ? 41 : _context.t0 === 'showSpectra' ? 43 : _context.t0 === 'showAllSpectra' ? 45 : 47;
              break;

            case 5:
              (0, _trackMove2["default"])(action);
              return _context.abrupt("break", 47);

            case 7:
              (0, _recalculateCharts2["default"])();
              return _context.abrupt("break", 47);

            case 9:
              _context.next = 11;
              return _api2["default"].require('vh/eln/util/jcampInfo');

            case 11:
              jcampInfo = _context.sent;
              console.log(action.value);
              jcampInfo(action.value);
              return _context.abrupt("break", 47);

            case 15:
              removeSpectrum(action);
              return _context.abrupt("break", 47);

            case 17:
              analysesManager = _api2["default"].cache('analysesManager');
              selectedSpectra = _api2["default"].getData('selectedSpectra');
              analysesManager.analyses.splice(0);
              selectedSpectra.length = 0;
              _context.next = 23;
              return addSpectrum(action, {});

            case 23:
              _result = _context.sent;

              _api2["default"].getData('selectedSpectra').triggerChange();

              return _context.abrupt("return", _result);

            case 26:
              _context.next = 28;
              return addSample(action);

            case 28:
              _api2["default"].getData('selectedSpectra').triggerChange();

              return _context.abrupt("break", 47);

            case 30:
              _context.next = 32;
              return addSpectrum(action, {});

            case 32:
              result = _context.sent;

              _api2["default"].getData('selectedSpectra').triggerChange();

              return _context.abrupt("return", result);

            case 35:
              hideSpectra();
              return _context.abrupt("break", 47);

            case 37:
              hideAllSpectra();
              return _context.abrupt("break", 47);

            case 39:
              removeAllSpectra();
              return _context.abrupt("break", 47);

            case 41:
              showOnlySpectra();
              return _context.abrupt("break", 47);

            case 43:
              showSpectra();
              return _context.abrupt("break", 47);

            case 45:
              showAllSpectra();
              return _context.abrupt("break", 47);

            case 47:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _processActions.apply(this, arguments);
  }

  function getSampleID(entry) {
    while (entry = entry.__parent) {
      if (entry.$id) return entry.$id.join(' ');
      if (entry.value && entry.value.$id) return entry.value.$id.join(' ');
    }

    return '';
  }

  function addSample(_x2) {
    return _addSample.apply(this, arguments);
  }

  function _addSample() {
    _addSample = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(action) {
      var entryID, sample, analysesManager, target, i, spectrum;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              entryID = action.value.id;
              _context2.next = 3;
              return _api2["default"].cache('roc').document(entryID);

            case 3:
              sample = _context2.sent;
              analysesManager = _api2["default"].cache('analysesManager');
              target = analysesManager.target;

              if (!(!target || !sample.$content.spectra || !sample.$content.spectra[target])) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return");

            case 8:
              i = 0;

            case 9:
              if (!(i < sample.$content.spectra[target].length)) {
                _context2.next = 16;
                break;
              }

              spectrum = sample.$content.spectra[target][i];
              _context2.next = 13;
              return addSpectrum({
                value: _objectSpread({
                  __name: i
                }, spectrum)
              }, {
                sampleID: sample.$id.join(' '),
                sampleUUID: sample._id,
                spectrumUUID: sample._id + '_' + i
              });

            case 13:
              i++;
              _context2.next = 9;
              break;

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _addSample.apply(this, arguments);
  }

  function addSpectrum(_x3) {
    return _addSpectrum.apply(this, arguments);
  }

  function _addSpectrum() {
    _addSpectrum = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(action) {
      var options,
          ExtendedCommonSpectrum,
          selectedSpectra,
          analysesManager,
          sampleID,
          sampleUUID,
          spectrumUUID,
          spectrumID,
          jcamp,
          spectrum,
          index,
          _args3 = arguments;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
              ExtendedCommonSpectrum = _api2["default"].cache('ExtendedCommonSpectrum');
              selectedSpectra = _api2["default"].getData('selectedSpectra');
              analysesManager = _api2["default"].cache('analysesManager');
              sampleID = options.sampleID || getSampleID(action.value);
              sampleUUID = options.sampleUUID || getSampleUUID(action.value);
              spectrumUUID = options.spectrumUUID || getSpectrumUUID(action.value);
              spectrumID = sampleID + ' ' + action.value.__name;
              console.log({
                spectrumID: spectrumID,
                spectrumUUID: spectrumUUID
              });
              jcamp = '';

              if (!(action.value.jcamp && action.value.jcamp.filename)) {
                _context3.next = 15;
                break;
              }

              _context3.t0 = jcamp;
              _context3.next = 14;
              return _api2["default"].cache('roc').getAttachment({
                _id: sampleUUID
              }, action.value.jcamp.filename);

            case 14:
              jcamp = _context3.t0 += _context3.sent;

            case 15:
              if (jcamp) {
                _context3.next = 27;
                break;
              }

              if (!(action.value.jcampTemperature && action.value.jcampTemperature.filename)) {
                _context3.next = 21;
                break;
              }

              _context3.t1 = jcamp;
              _context3.next = 20;
              return _api2["default"].cache('roc').getAttachment({
                _id: sampleUUID
              }, action.value.jcampTemperature.filename);

            case 20:
              jcamp = _context3.t1 += _context3.sent;

            case 21:
              if (!(action.value.jcampTime && action.value.jcampTime.filename)) {
                _context3.next = 27;
                break;
              }

              _context3.t2 = jcamp;
              _context3.next = 25;
              return _api2["default"].cache('roc').getAttachment({
                _id: sampleUUID
              }, action.value.jcampTime.filename);

            case 25:
              _context3.t3 = _context3.sent;
              jcamp = _context3.t2 += '\n' + _context3.t3;

            case 27:
              if (!jcamp) {
                _context3.next = 33;
                break;
              }

              spectrum = ExtendedCommonSpectrum.fromJcamp(jcamp, {
                id: spectrumUUID,
                label: spectrumID
              });
              analysesManager.addAnalysis(spectrum);
              index = analysesManager.getAnalysisIndex(spectrumUUID);
              selectedSpectra[index] = {
                id: spectrumUUID,
                code: sampleID,
                label: spectrumID,
                index: action.value.__name + '',
                spectrum: JSON.parse(JSON.stringify(action.value)),
                color: colors[index % nbColors],
                display: true,
                toc: JSON.parse(JSON.stringify(_api2["default"].getData('currentSampleTOC')))
              };
              return _context3.abrupt("return", spectrum);

            case 33:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _addSpectrum.apply(this, arguments);
  }

  function getSampleUUID(entry) {
    while (entry = entry.__parent) {
      if (entry._id) return entry._id;
      if (entry.value && entry.value._id) return entry.value._id;
    }

    return '';
  }

  function getSpectrumUUID(entry) {
    return getSampleUUID(entry) + '_' + entry.__name;
  }

  function showAllSpectra() {
    var selectedSpectra = _api2["default"].getData('selectedSpectra');

    var _iterator = _createForOfIteratorHelper(selectedSpectra),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var spectrum = _step.value;
        spectrum.display = true;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    _api2["default"].getData('selectedSpectra').triggerChange();
  }

  function hideAllSpectra() {
    var selectedSpectra = _api2["default"].getData('selectedSpectra');

    var _iterator2 = _createForOfIteratorHelper(selectedSpectra),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var spectrum = _step2.value;
        spectrum.display = false;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    _api2["default"].getData('selectedSpectra').triggerChange();
  }

  function removeAllSpectra() {
    var analysesManager = _api2["default"].cache('analysesManager');

    analysesManager.removeAllAnalyses();

    var selectedSpectra = _api2["default"].getData('selectedSpectra');

    selectedSpectra.length = 0;
    selectedSpectra.triggerChange();
  }

  function removeSpectrum(action) {
    var analysesManager = _api2["default"].cache('analysesManager');

    var selectedSpectra = _api2["default"].getData('selectedSpectra');

    var spectrumUUID = String(action.value.id);
    analysesManager.removeAnalysis(spectrumUUID);

    for (var i = 0; i < selectedSpectra.length; i++) {
      if (String(selectedSpectra[i].id) === spectrumUUID) {
        selectedSpectra.splice(i, 1);
        break;
      }
    }

    selectedSpectra.triggerChange();
  }

  function showSpectra() {
    var selectedSpectra = _api2["default"].getData('selectedSpectra');

    var currentlySelectedSpectra = _api2["default"].getData('currentlySelectedSpectra');

    var _iterator3 = _createForOfIteratorHelper(currentlySelectedSpectra),
        _step3;

    try {
      var _loop = function _loop() {
        var currentlySelectedSpectrum = _step3.value;
        var spectrum = selectedSpectra.filter(function (spectrum) {
          return String(spectrum.id) === String(currentlySelectedSpectrum.id);
        })[0];
        spectrum.display = true;
      };

      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    _api2["default"].getData('selectedSpectra').triggerChange();
  }

  function showOnlySpectra() {
    var selectedSpectra = _api2["default"].getData('selectedSpectra');

    if (!Array.isArray(selectedSpectra)) return;

    var _iterator4 = _createForOfIteratorHelper(selectedSpectra),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var spectrum = _step4.value;
        spectrum.display = false;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    var currentlySelectedSpectra = _api2["default"].getData('currentlySelectedSpectra');

    var _iterator5 = _createForOfIteratorHelper(currentlySelectedSpectra),
        _step5;

    try {
      var _loop2 = function _loop2() {
        var currentlySelectedSpectrum = _step5.value;
        var spectrum = selectedSpectra.filter(function (spectrum) {
          return String(spectrum.id) === String(currentlySelectedSpectrum.id);
        })[0];
        spectrum.display = true;
      };

      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        _loop2();
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }

    _api2["default"].getData('selectedSpectra').triggerChange();
  }

  function hideSpectra() {
    var selectedSpectra = _api2["default"].getData('selectedSpectra');

    var currentlySelectedSpectra = _api2["default"].getData('currentlySelectedSpectra');

    var _iterator6 = _createForOfIteratorHelper(currentlySelectedSpectra),
        _step6;

    try {
      var _loop3 = function _loop3() {
        var currentlySelectedSpectrum = _step6.value;
        var spectrum = selectedSpectra.filter(function (spectrum) {
          return String(spectrum.id) === String(currentlySelectedSpectrum.id);
        })[0];
        spectrum.display = false;
      };

      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        _loop3();
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }

    _api2["default"].getData('selectedSpectra').triggerChange();
  }

  module.exports = processActions;
});