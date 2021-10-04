"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/util/api', 'src/util/ui'], function (API, UI) {
  function spectraInDatasetModifications() {
    return _spectraInDatasetModifications.apply(this, arguments);
  }

  function _spectraInDatasetModifications() {
    _spectraInDatasetModifications = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var spectraProcessor, roc, spectraInDataset, preferences, currentIDs, promises, _iterator, _step, _loop, _ret, hasFrom, hasTo, prefs, minMaxX, previousMemoryInfo, memoryInfo;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              spectraProcessor = API.cache('spectraProcessor');
              roc = API.cache('roc');
              spectraInDataset = API.getData('spectraInDataset');
              preferences = JSON.parse(JSON.stringify(API.getData('preferences')));
              currentIDs = spectraInDataset.map(function (spectrum) {
                return String(spectrum.id);
              });
              spectraProcessor.removeSpectraNotIn(currentIDs);
              _context.prev = 6;
              spectraProcessor.setNormalization(preferences.normalization);
              _context.next = 14;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](6);
              UI.showNotification(_context.t0);
              return _context.abrupt("return");

            case 14:
              promises = [];
              _iterator = _createForOfIteratorHelper(spectraInDataset);
              _context.prev = 16;

              _loop = function _loop() {
                var spectrum = _step.value;
                var id = String(spectrum.id);

                if (spectraProcessor.contains(id)) {
                  var processorSpectrum = spectraProcessor.getSpectrum(id);
                  processorSpectrum.meta.color = DataObject.resurrect(spectrum.color);
                  processorSpectrum.meta.selected = DataObject.resurrect(spectrum.selected);
                  processorSpectrum.meta.category = DataObject.resurrect(spectrum.category);
                  return "continue";
                }

                if (spectrum.jcamp) {
                  promises.push(roc.getAttachment({
                    _id: spectrum.sampleID
                  }, spectrum.jcamp.filename).then(function (jcamp) {
                    spectraProcessor.addFromJcamp(jcamp, {
                      id: id,
                      meta: {
                        info: DataObject.resurrect(spectrum.toc),
                        color: DataObject.resurrect(spectrum.color),
                        selected: DataObject.resurrect(spectrum.selected),
                        category: DataObject.resurrect(spectrum.category)
                      }
                    });
                  }));
                } else if (spectrum.data) {
                  spectraProcessor.addFromData(DataObject.resurrect(spectrum.data), {
                    id: id,
                    meta: _objectSpread(_objectSpread({}, DataObject.resurrect(spectrum.toc)), {}, {
                      color: DataObject.resurrect(spectrum.color),
                      selected: DataObject.resurrect(spectrum.selected),
                      category: DataObject.resurrect(spectrum.category)
                    })
                  });
                }
              };

              _iterator.s();

            case 19:
              if ((_step = _iterator.n()).done) {
                _context.next = 25;
                break;
              }

              _ret = _loop();

              if (!(_ret === "continue")) {
                _context.next = 23;
                break;
              }

              return _context.abrupt("continue", 23);

            case 23:
              _context.next = 19;
              break;

            case 25:
              _context.next = 30;
              break;

            case 27:
              _context.prev = 27;
              _context.t1 = _context["catch"](16);

              _iterator.e(_context.t1);

            case 30:
              _context.prev = 30;

              _iterator.f();

              return _context.finish(30);

            case 33:
              if (promises.length) API.createData('chart', {});
              _context.next = 36;
              return Promise.all(promises);

            case 36:
              // we need to check if there is a from / to
              hasFrom = Number.isFinite(preferences.normalization.from);
              hasTo = Number.isFinite(preferences.normalization.to);

              if (!hasFrom || !hasTo) {
                prefs = API.getData('preferences');
                minMaxX = spectraProcessor.getMinMaxX();

                if (minMaxX.min < minMaxX.max) {
                  if (!hasFrom) prefs.normalization.from = minMaxX.min;
                  if (!hasTo) prefs.normalization.to = minMaxX.max;
                  prefs.triggerChange();
                }
              }

              previousMemoryInfo = DataObject.resurrect(API.getData('memoryInfo')) || {};
              memoryInfo = spectraProcessor.getMemoryInfo();

              if (!API.getData('keepOriginal') || memoryInfo.keepOriginal !== previousMemoryInfo.keepOriginal) {
                API.createData('keepOriginal', memoryInfo.keepOriginal);
              }

              API.createData('memoryInfo', memoryInfo); // force an update of the chart taking into account the autorefresh

              API.doAction('UpdateChart');

            case 44:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[6, 10], [16, 27, 30, 33]]);
    }));
    return _spectraInDatasetModifications.apply(this, arguments);
  }

  return spectraInDatasetModifications;
});