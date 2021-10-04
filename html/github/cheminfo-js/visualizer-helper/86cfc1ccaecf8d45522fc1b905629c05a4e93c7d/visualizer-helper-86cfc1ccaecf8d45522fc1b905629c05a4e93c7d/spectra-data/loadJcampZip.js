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
          filterOptions,
          JSZip,
          superagent,
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
          jcamp,
          spectrum,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              filterOptions = options.filterOptions;
              _context.next = 4;
              return API.require('jszip');

            case 4:
              JSZip = _context.sent;
              _context.next = 7;
              return API.require('superagent');

            case 7:
              superagent = _context.sent;
              _context.next = 10;
              return API.require('SD');

            case 10:
              SD = _context.sent;
              jszip = new JSZip();
              spectraDataSet = [];
              _iterator = _createForOfIteratorHelper(zipURLs);
              _context.prev = 14;

              _iterator.s();

            case 16:
              if ((_step = _iterator.n()).done) {
                _context.next = 49;
                break;
              }

              zipURL = _step.value;
              _context.next = 20;
              return superagent.get(zipURL).withCredentials().responseType('blob');

            case 20:
              zipFiles = _context.sent;
              _context.next = 23;
              return jszip.loadAsync(zipFiles.body);

            case 23:
              zip = _context.sent;
              filesToProcess = Object.keys(zip.files).filter(function (filename) {
                return filename.match(/jdx$/);
              });
              _iterator2 = _createForOfIteratorHelper(filesToProcess);
              _context.prev = 26;

              _iterator2.s();

            case 28:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 39;
                break;
              }

              filename = _step2.value;
              _context.next = 32;
              return zip.files[filename].async('string');

            case 32:
              jcamp = _context.sent;
              spectrum = SD.NMR.fromJcamp(jcamp, {});
              spectrum.sd.filename = filename.replace(/[0-9 a-z A-Z]+\//, '').replace(/.jdx$/, '');
              if (options.filter) options.filter(spectrum, filterOptions);
              spectraDataSet.push(spectrum);

            case 37:
              _context.next = 28;
              break;

            case 39:
              _context.next = 44;
              break;

            case 41:
              _context.prev = 41;
              _context.t0 = _context["catch"](26);

              _iterator2.e(_context.t0);

            case 44:
              _context.prev = 44;

              _iterator2.f();

              return _context.finish(44);

            case 47:
              _context.next = 16;
              break;

            case 49:
              _context.next = 54;
              break;

            case 51:
              _context.prev = 51;
              _context.t1 = _context["catch"](14);

              _iterator.e(_context.t1);

            case 54:
              _context.prev = 54;

              _iterator.f();

              return _context.finish(54);

            case 57:
              return _context.abrupt("return", spectraDataSet);

            case 58:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[14, 51, 54, 57], [26, 41, 44, 47]]);
    }));

    function loadZips(_x) {
      return _loadZips.apply(this, arguments);
    }

    return loadZips;
  }();
});