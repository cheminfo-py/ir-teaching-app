"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/util/api'], function (API) {
  return /*#__PURE__*/function () {
    var _loadZips = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(zipURLs) {
      var options,
          JSZip,
          superagent,
          xyParser,
          SD,
          jszip,
          spectraDataSet,
          _iterator,
          _step,
          zipURL,
          zipFiles,
          zip,
          filesToProcess,
          _iterator2,
          _step2,
          filename,
          fileData,
          result,
          spectrum,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              _context.next = 3;
              return API.require('jszip');

            case 3:
              JSZip = _context.sent;
              _context.next = 6;
              return API.require('superagent');

            case 6:
              superagent = _context.sent;
              _context.next = 9;
              return API.require('https://www.lactame.com/lib/xy-parser/1.3.0/xy-parser.min.js');

            case 9:
              xyParser = _context.sent;
              _context.next = 12;
              return API.require('https://www.lactame.com/lib/spectra-data/3.0.7/spectra-data.min.js');

            case 12:
              SD = _context.sent;
              jszip = new JSZip();
              spectraDataSet = [];
              _iterator = _createForOfIteratorHelper(zipURLs);
              _context.prev = 16;

              _iterator.s();

            case 18:
              if ((_step = _iterator.n()).done) {
                _context.next = 53;
                break;
              }

              zipURL = _step.value;
              _context.next = 22;
              return superagent.get(zipURL).withCredentials().responseType('blob');

            case 22:
              zipFiles = _context.sent;
              _context.next = 25;
              return jszip.loadAsync(zipFiles.body);

            case 25:
              zip = _context.sent;
              filesToProcess = Object.keys(zip.files).filter(function (filename) {
                return filename.match(/\.[0-9]+$/);
              });
              _iterator2 = _createForOfIteratorHelper(filesToProcess);
              _context.prev = 28;

              _iterator2.s();

            case 30:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 43;
                break;
              }

              filename = _step2.value;
              _context.next = 34;
              return zip.files[filename].async('string');

            case 34:
              fileData = _context.sent;
              result = xyParser(fileData, {
                arrayType: 'xxyy'
              });
              spectrum = SD.NMR.fromXY(result[0], result[1], {
                dataType: 'IR',
                xUnit: 'waveNumber',
                yUnit: ''
              });
              if (options.filter) options.filter(spectrum.sd);
              spectrum.sd.info = {};
              spectrum.sd.filename = filename.replace(/[0-9 a-z A-Z]+\//, '');
              spectraDataSet.push(spectrum);

            case 41:
              _context.next = 30;
              break;

            case 43:
              _context.next = 48;
              break;

            case 45:
              _context.prev = 45;
              _context.t0 = _context["catch"](28);

              _iterator2.e(_context.t0);

            case 48:
              _context.prev = 48;

              _iterator2.f();

              return _context.finish(48);

            case 51:
              _context.next = 18;
              break;

            case 53:
              _context.next = 58;
              break;

            case 55:
              _context.prev = 55;
              _context.t1 = _context["catch"](16);

              _iterator.e(_context.t1);

            case 58:
              _context.prev = 58;

              _iterator.f();

              return _context.finish(58);

            case 61:
              return _context.abrupt("return", spectraDataSet);

            case 62:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[16, 55, 58, 61], [28, 45, 48, 51]]);
    }));

    function loadZips(_x) {
      return _loadZips.apply(this, arguments);
    }

    return loadZips;
  }();
});