"use strict";

define(["module", "openchemlib/openchemlib-core"], function (module, _openchemlibCore) {
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

  function Structure(roc) {
    return {
      refresh: function refresh(type) {
        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var options;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  options = {
                    key: 'structure',
                    varName: 'structures'
                  };

                  if (type) {
                    options.filter = function (entry) {
                      return entry.$id[1] === type;
                    };
                  }

                  return _context.abrupt("return", roc.view('entryByKind', options));

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))();
      },
      create: function create(molfile, type) {
        var _this = this;

        return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
          var ocl;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  ocl = getOcl(molfile, true);
                  return _context2.abrupt("return", _this._createFromOcl(ocl, type));

                case 2:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }))();
      },
      _createFromOcl: function _createFromOcl(ocl, type, rocOptions) {
        return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
          var prefix, newEntry;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  rocOptions = rocOptions || {};
                  prefix = 'X';

                  if (type === 'internal') {
                    prefix = 'ACI';
                  } else if (type === 'commercial') {
                    prefix = 'S';
                  }

                  _context3.t0 = [ocl.idCode, type];
                  _context3.t1 = ['structureRW', 'structureR'];
                  _context3.next = 7;
                  return getNextId(roc, 'structureId', prefix);

                case 7:
                  _context3.t2 = _context3.sent;
                  _context3.t3 = ocl.coordinates;
                  _context3.t4 = {
                    structureId: _context3.t2,
                    coordinates: _context3.t3
                  };
                  newEntry = {
                    $id: _context3.t0,
                    $kind: 'structure',
                    $owners: _context3.t1,
                    $content: _context3.t4
                  };
                  _context3.next = 13;
                  return roc.create(newEntry, Object.assign({
                    messages: {
                      409: 'Conflict: this structure already exists'
                    }
                  }, rocOptions));

                case 13:
                  return _context3.abrupt("return", newEntry);

                case 14:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }))();
      },
      createAndGetId: function createAndGetId(molfile, type) {
        var _this2 = this;

        return _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
          var ocl, entry, result;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  ocl = getOcl(molfile, true);
                  _context4.prev = 1;
                  _context4.next = 4;
                  return _this2._createFromOcl(ocl, type, {
                    disableNotification: true
                  });

                case 4:
                  entry = _context4.sent;
                  return _context4.abrupt("return", entry);

                case 8:
                  _context4.prev = 8;
                  _context4.t0 = _context4["catch"](1);

                  if (!(_context4.t0.message === 'Conflict')) {
                    _context4.next = 19;
                    break;
                  }

                  _context4.next = 13;
                  return roc.view('entryById', {
                    key: [ocl.idCode, type]
                  });

                case 13:
                  result = _context4.sent;

                  if (!result.length) {
                    _context4.next = 18;
                    break;
                  }

                  return _context4.abrupt("return", result[0]);

                case 18:
                  throw new Error('Unexpected error creating structure');

                case 19:
                  return _context4.abrupt("return", null);

                case 20:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, null, [[1, 8]]);
        }))();
      }
    };
  }

  function getOcl(molfile, throwIfEmpty) {
    molfile = String(molfile);

    var ocl = _openchemlibCore2["default"].Molecule.fromMolfile(molfile);

    if (throwIfEmpty && !ocl.getAtoms()) {
      throw new Error('Empty molfile');
    }

    return ocl.getIDCodeAndCoordinates();
  }

  function getNextId(_x, _x2, _x3) {
    return _getNextId.apply(this, arguments);
  }

  function _getNextId() {
    _getNextId = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(roc, viewName, type) {
      var v, id, current, nextID, nextIDStr;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return roc.view(viewName, {
                reduce: true
              });

            case 2:
              v = _context5.sent;

              if (!(!v.length || !v[0].value || !v[0].value[type])) {
                _context5.next = 5;
                break;
              }

              return _context5.abrupt("return", "".concat(type, "-1"));

            case 5:
              id = v[0].value[type];
              current = Number(id);
              nextID = current + 1;
              nextIDStr = String(nextID);
              return _context5.abrupt("return", "".concat(type, "-").concat(nextIDStr));

            case 10:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _getNextId.apply(this, arguments);
  }

  module.exports = Structure;
});