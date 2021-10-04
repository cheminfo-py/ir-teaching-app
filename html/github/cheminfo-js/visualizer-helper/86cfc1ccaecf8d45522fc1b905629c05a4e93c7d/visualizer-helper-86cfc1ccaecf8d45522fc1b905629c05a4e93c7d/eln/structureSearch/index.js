"use strict";

define(["module", "src/util/api", "../libs/OCLUtils"], function (module, _api, _OCLUtils) {
  var _api2 = _interopRequireDefault(_api);

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

  function waitImmediate() {
    return new Promise(function (resolve) {
      setImmediate(resolve);
    });
  }

  module.exports = {
    buildDatabase: function buildDatabase(tocData) {
      var _arguments = arguments;
      return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var options, moleculesDB, date, i, entry, idCode, moleculeInfo;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : {};
                moleculesDB = new _OCLUtils.OCLUtils.MoleculesDB(_OCLUtils.OCL, {
                  computeProperties: options.calculateProperties
                });
                date = Date.now();
                i = 0;

              case 4:
                if (!(i < tocData.length)) {
                  _context.next = 19;
                  break;
                }

                if (!options.showLoading) {
                  _context.next = 10;
                  break;
                }

                if (!(i % 100 === 0 && Date.now() - date > 500)) {
                  _context.next = 10;
                  break;
                }

                _context.next = 9;
                return waitImmediate();

              case 9:
                _api2["default"].loading('mol', "Loading molecules (".concat(i + 1, "/").concat(tocData.length, ")"));

              case 10:
                entry = tocData[i];
                idCode = entry.value.ocl && entry.value.ocl.value;

                if (idCode) {
                  _context.next = 14;
                  break;
                }

                return _context.abrupt("continue", 16);

              case 14:
                moleculeInfo = {
                  idCode: idCode,
                  index: entry.value.ocl.index
                };
                moleculesDB.pushMoleculeInfo(moleculeInfo, entry);

              case 16:
                i++;
                _context.next = 4;
                break;

              case 19:
                if (options.showLoading) {
                  _api2["default"].stopLoading('mol');
                }

                return _context.abrupt("return", moleculesDB);

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    }
  };
});