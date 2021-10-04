"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/util/api'], function (API) {
  function track(_x, _x2) {
    return _track.apply(this, arguments);
  }

  function _track() {
    _track = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(localName, defaultValue) {
      var options,
          varName,
          annotationName,
          localValue,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
              varName = options.varName || localName;
              annotationName = "".concat(varName, "Annotations");
              localValue = [];
              _context.prev = 4;
              localValue = JSON.parse(window.localStorage.getItem(localName)) || [];

              if (Array.isArray(localValue)) {
                _context.next = 8;
                break;
              }

              throw new Error('TrackRanges expected an array in local storage');

            case 8:
              _context.next = 13;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](4);
              return _context.abrupt("return", Promise.reject(_context.t0));

            case 13:
              return _context.abrupt("return", API.createData(varName, localValue).then(function (data) {
                createAnnotations(data, annotationName);
                data.onChange(function () {
                  ensureHighlight(data);
                  createAnnotations(data, annotationName);
                  localStorage.setItem(localName, JSON.stringify(data));
                });
                return data;
              }));

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 10]]);
    }));
    return _track.apply(this, arguments);
  }

  return track;

  function ensureHighlight(data) {
    var shouldUpdate = false;

    var _iterator = _createForOfIteratorHelper(data),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var datum = _step.value;

        if (!datum._highlight) {
          shouldUpdate = true;
          datum._highlight = Math.random();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (shouldUpdate) data.triggerChange();
  }

  function createAnnotations(data, annotationName) {
    var annotations = [];
    data = data.resurrect();

    var _iterator2 = _createForOfIteratorHelper(data),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var datum = _step2.value;
        var color = 'red';
        if (!datum.active) color = 'pink';
        annotations.push({
          position: [{
            x: datum.from,
            y: 0,
            dy: '2px'
          }, {
            x: datum.to,
            y: 0,
            dy: '-2px'
          }],
          type: 'rect',
          fillColor: color,
          strokeColor: color,
          _highlight: datum._highlight,
          info: datum
        });
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    API.createData(annotationName, annotations);
  }
});