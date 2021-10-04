"use strict";

define(["exports", "src/util/couchdbAttachments", "../eln/libs/OCLE"], function (exports, _couchdbAttachments, _OCLE) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.fetchData = undefined;

  var _couchdbAttachments2 = _interopRequireDefault(_couchdbAttachments);

  var _OCLE2 = _interopRequireDefault(_OCLE);

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

  function fetchData() {
    return _fetchData.apply(this, arguments);
  }

  function _fetchData() {
    _fetchData = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var query,
          url,
          ca,
          files,
          data,
          _iterator,
          _step,
          file,
          datum,
          molfile,
          molecule,
          results,
          _i,
          _Object$keys,
          key,
          counter,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = _args.length > 0 && _args[0] !== undefined ? _args[0] : undefined;
              url = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'https://couch.cheminfo.org/cheminfo-public/668677b6432fb3fde76305cfe706856d';
              ca = new _couchdbAttachments2["default"](url);
              _context.next = 5;
              return ca.fetchList();

            case 5:
              files = _context.sent;
              files = files.filter(function (a) {
                return a.filename.match('upload');
              });
              files = files.map(function (a) {
                var filename = a.filename.replace('upload/', '');
                var parts;

                if (filename.match(/.*\.mol/)) {
                  parts = [filename.replace(/\..*/, ''), 'mol'];
                } else {
                  filename = filename.replace(/\..+?$/, '');
                  parts = filename.split('_');
                }

                return {
                  filename: filename,
                  rn: parts[0],
                  kind: parts[1],
                  experiment: parts[2],
                  url: a.url
                };
              });
              files = files.filter(function (a) {
                return !query || query[a.rn];
              }); // we combine the files based on some filters

              data = {};
              _iterator = _createForOfIteratorHelper(files);
              _context.prev = 11;

              _iterator.s();

            case 13:
              if ((_step = _iterator.n()).done) {
                _context.next = 69;
                break;
              }

              file = _step.value;

              if (!data[file.rn]) {
                data[file.rn] = {
                  rn: file.rn,
                  myResult: ''
                };
              }

              datum = data[file.rn];
              _context.t0 = file.kind;
              _context.next = _context.t0 === 'mol' ? 20 : _context.t0 === 'mass' ? 37 : _context.t0 === 'ir' ? 40 : _context.t0 === 'nmr' ? 43 : 66;
              break;

            case 20:
              datum.mol = {
                type: 'mol2d',
                url: file.url
              };
              _context.next = 23;
              return fetch(file.url);

            case 23:
              _context.next = 25;
              return _context.sent.text();

            case 25:
              molfile = _context.sent;
              molecule = _OCLE2["default"].Molecule.fromMolfile(molfile);
              datum.oclCode = molecule.getIDCode();
              datum.id = datum.rn;
              datum.result = datum.oclCode;
              datum.mf = molecule.getMolecularFormula().formula;
              molecule.addImplicitHydrogens();
              datum.nbDiaH = molecule.getGroupedDiastereotopicAtomIDs({
                atomLabel: 'H'
              }).length;
              datum.nbDiaC = molecule.getGroupedDiastereotopicAtomIDs({
                atomLabel: 'C'
              }).length;
              datum.nbH = Number(datum.mf.replace(/.*H([0-9]+).*/, '$1'));
              datum.nbC = Number(datum.mf.replace(/.*C([0-9]+).*/, '$1'));
              return _context.abrupt("break", 67);

            case 37:
              datum.mass = {
                type: 'jcamp',
                url: file.url
              };
              datum.isMass = true;
              return _context.abrupt("break", 67);

            case 40:
              datum.ir = {
                type: 'jcamp',
                url: file.url
              };
              datum.isIr = true;
              return _context.abrupt("break", 67);

            case 43:
              _context.t1 = file.experiment;
              _context.next = _context.t1 === '1h' ? 46 : _context.t1 === 'cosy' ? 49 : _context.t1 === 'hsqc' ? 52 : _context.t1 === 'hmbc' ? 55 : _context.t1 === '13cDec' ? 58 : _context.t1 === '13c' ? 61 : 64;
              break;

            case 46:
              datum.h1 = {
                type: 'jcamp',
                url: file.url
              };
              datum.isH1 = true;
              return _context.abrupt("break", 65);

            case 49:
              datum.cosy = {
                type: 'jcamp',
                url: file.url
              };
              datum.isCosy = true;
              return _context.abrupt("break", 65);

            case 52:
              datum.hsqc = {
                type: 'jcamp',
                url: file.url
              };
              datum.isHsqc = true;
              return _context.abrupt("break", 65);

            case 55:
              datum.hmbc = {
                type: 'jcamp',
                url: file.url
              };
              datum.isHmbc = true;
              return _context.abrupt("break", 65);

            case 58:
              datum.c13dec = {
                type: 'jcamp',
                url: file.url
              };
              datum.isC13dec = true;
              return _context.abrupt("break", 65);

            case 61:
              datum.c13 = {
                type: 'jcamp',
                url: file.url
              };
              datum.isC13 = true;
              return _context.abrupt("break", 65);

            case 64:
              return _context.abrupt("break", 65);

            case 65:
              return _context.abrupt("break", 67);

            case 66:
              return _context.abrupt("break", 67);

            case 67:
              _context.next = 13;
              break;

            case 69:
              _context.next = 74;
              break;

            case 71:
              _context.prev = 71;
              _context.t2 = _context["catch"](11);

              _iterator.e(_context.t2);

            case 74:
              _context.prev = 74;

              _iterator.f();

              return _context.finish(74);

            case 77:
              results = [];

              for (_i = 0, _Object$keys = Object.keys(data); _i < _Object$keys.length; _i++) {
                key = _Object$keys[_i];
                results.push(data[key]);
              }

              counter = 1;
              results.forEach(function (a) {
                a.number = counter++;
              });
              return _context.abrupt("return", results);

            case 82:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[11, 71, 74, 77]]);
    }));
    return _fetchData.apply(this, arguments);
  }

  exports.fetchData = fetchData;
});