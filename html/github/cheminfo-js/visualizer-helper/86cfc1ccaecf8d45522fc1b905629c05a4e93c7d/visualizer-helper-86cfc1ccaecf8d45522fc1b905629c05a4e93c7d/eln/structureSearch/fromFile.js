"use strict";

define(["module", "src/util/api", "../libs/OCLUtils"], function (module, _api, _OCLUtils) {
  var _api2 = _interopRequireDefault(_api);

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
    buildDatabase: function buildDatabase(dropped) {
      var _arguments = arguments;
      return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var options, moleculesDB, date, onStep;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : {};
                moleculesDB = new _OCLUtils.OCLUtils.MoleculesDB(_OCLUtils.OCL, {
                  computeProperties: options.computeProperties
                });
                date = Date.now();

                if (options.showLoading) {
                  onStep = function () {
                    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(i, total) {
                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              if (!(i % 100 === 0 && Date.now() - date > 500)) {
                                _context.next = 4;
                                break;
                              }

                              _context.next = 3;
                              return waitImmediate();

                            case 3:
                              _api2["default"].loading('mol', "Loading molecules (".concat(i + 1, "/").concat(total, ")"));

                            case 4:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    }));

                    return function onStep(_x, _x2) {
                      return _ref.apply(this, arguments);
                    };
                  }();
                } // sdf or smiles ?


                if (!dropped.includes('$$$$')) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 7;
                return moleculesDB.appendSDF(dropped, _objectSpread({
                  onStep: onStep
                }, options));

              case 7:
                _context2.next = 16;
                break;

              case 9:
                if (!dropped.includes('\t')) {
                  _context2.next = 14;
                  break;
                }

                _context2.next = 12;
                return moleculesDB.appendCSV(dropped, _objectSpread({
                  onStep: onStep
                }, options));

              case 12:
                _context2.next = 16;
                break;

              case 14:
                _context2.next = 16;
                return moleculesDB.appendSmilesList(dropped, _objectSpread({
                  onStep: onStep
                }, options));

              case 16:
                if (options.showLoading) {
                  _api2["default"].stopLoading('mol');
                }

                return _context2.abrupt("return", moleculesDB);

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    }
  };
});