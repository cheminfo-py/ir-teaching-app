"use strict";

define(["module", "src/util/api", "src/util/versioning", "uri/URI", "openchemlib/openchemlib-core"], function (module, _api, _versioning, _URI, _openchemlibCore) {
  var _api2 = _interopRequireDefault(_api);

  var _versioning2 = _interopRequireDefault(_versioning);

  var _URI2 = _interopRequireDefault(_URI);

  var _openchemlibCore2 = _interopRequireDefault(_openchemlibCore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
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

  function track() {
    return _track.apply(this, arguments);
  }

  function _track() {
    _track = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var sample, uri, search, data, molecule, _molecule;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              sample = JSON.parse(window.localStorage.getItem('external_cache') || '{}');

              _api2["default"].createData('nmr', []);

              _api2["default"].createData('mass', []);

              _api2["default"].createData('ir', []);

              uri = new _URI2["default"](document.location.href);
              search = uri.search(true);

              if (search.smiles) {
                sample.smiles = search.smiles;
                sample.molfile = '';
              }

              data = _versioning2["default"].getData();
              data.onChange(function (evt) {
                if (evt.jpath.length === 1 && evt.jpath[0] === 'molfile') {
                  localStorage.setItem('molfile', evt.target.get());
                }
              });

              if (sample.molfile) {
                molecule = _openchemlibCore2["default"].Molecule.fromMolfile(sample.molfile);

                _api2["default"].createData('molfile', molecule.toMolfile());
              } else if (sample.smiles) {
                _molecule = _openchemlibCore2["default"].Molecule.fromSmiles(sample.smiles);
                sample.molfile = _molecule.toMolfile();

                _api2["default"].createData('molfile', sample.molfile);
              } else {
                sample.molfile = window.localStorage.getItem('molfile');

                if (sample.molfile) {
                  _api2["default"].createData('molfile', sample.molfile);
                } else {
                  _api2["default"].createData('molfile', '');
                }
              }

              return _context.abrupt("return", Promise.resolve(sample));

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _track.apply(this, arguments);
  }

  module.exports = track();
});