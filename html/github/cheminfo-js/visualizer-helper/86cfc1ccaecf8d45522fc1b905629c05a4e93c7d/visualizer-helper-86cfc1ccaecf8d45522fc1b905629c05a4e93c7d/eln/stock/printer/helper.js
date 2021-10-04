"use strict";

define(["module", "src/util/ui", "src/util/api"], function (module, _ui, _api) {
  var _ui2 = _interopRequireDefault(_ui);

  var _api2 = _interopRequireDefault(_api);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
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

  module.exports = {
    setup: function setup(printer, types) {
      return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var varFormats, printers, _loop, i, j, _j;

        return regeneratorRuntime.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _api2["default"].cache('printer', printer);

                varFormats = types.map(function () {
                  return [];
                });
                _context2.next = 4;
                return printer.getPrinters();

              case 4:
                printers = _context2.sent;
                _loop = regeneratorRuntime.mark(function _loop(i) {
                  var _j2, sFormats;

                  return regeneratorRuntime.wrap(function _loop$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _j2 = 0;

                        case 1:
                          if (!(_j2 < types.length)) {
                            _context.next = 9;
                            break;
                          }

                          _context.next = 4;
                          return printer.getFormats(printers[i], types[_j2]);

                        case 4:
                          sFormats = _context.sent.map(function (f) {
                            return {
                              printer: printers[i],
                              format: f
                            };
                          });
                          varFormats[_j2] = varFormats[_j2].concat(sFormats);

                        case 6:
                          _j2++;
                          _context.next = 1;
                          break;

                        case 9:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _loop);
                });
                i = 0;

              case 7:
                if (!(i < printers.length)) {
                  _context2.next = 12;
                  break;
                }

                return _context2.delegateYield(_loop(i), "t0", 9);

              case 9:
                i++;
                _context2.next = 7;
                break;

              case 12:
                for (j = 0; j < types.length; j++) {
                  _api2["default"].cache("".concat(types[j], "Formats"), varFormats[j]);
                }

                _j = 0;

              case 14:
                if (!(_j < types.length)) {
                  _context2.next = 20;
                  break;
                }

                _context2.next = 17;
                return _api2["default"].createData("".concat(types[_j], "Formats"), varFormats[_j]);

              case 17:
                _j++;
                _context2.next = 14;
                break;

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee);
      }))();
    },
    askPrintEntry: function askPrintEntry(entry, type) {
      return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var info;
        return regeneratorRuntime.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return module.exports.askFormat(type);

              case 2:
                info = _context3.sent;

                if (!info) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", module.exports.printEntry(entry, info));

              case 5:
                return _context3.abrupt("return", null);

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2);
      }))();
    },
    printEntry: function printEntry(entry, info) {
      return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var printer;
        return regeneratorRuntime.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                printer = _api2["default"].cache('printer');

                if (printer) {
                  _context4.next = 3;
                  break;
                }

                throw new Error('Printer not setup');

              case 3:
                if (!(typeof info === 'string')) {
                  _context4.next = 12;
                  break;
                }

                info = info.split(';');

                if (!(info.length < 2)) {
                  _context4.next = 9;
                  break;
                }

                throw new Error('Print entry: bad arguments');

              case 9:
                info = {
                  printer: info[0],
                  format: info[1]
                };

              case 10:
                _context4.next = 14;
                break;

              case 12:
                if (!(_typeof(info) !== 'object')) {
                  _context4.next = 14;
                  break;
                }

                throw new Error('Print entry: bad arguments');

              case 14:
                if (!(!info.printer || !info.format)) {
                  _context4.next = 16;
                  break;
                }

                throw new Error('Print entry: bad arguments');

              case 16:
                if (!(info.printer === 'none')) {
                  _context4.next = 18;
                  break;
                }

                return _context4.abrupt("return");

              case 18:
                _context4.next = 20;
                return printer.print(info.printer, info.format, entry);

              case 20:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee3);
      }))();
    },
    getFormats: function getFormats(type) {
      return _api2["default"].getData("".concat(type, "Formats")).resurrect();
    },
    askFormat: function askFormat(type) {
      return _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var f, formats, lastPrinterFormat;
        return regeneratorRuntime.wrap(function _callee4$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                f = {};
                formats = _api2["default"].getData("".concat(type, "Formats")).resurrect();

                if (formats) {
                  _context5.next = 4;
                  break;
                }

                throw new Error('No printer formats available');

              case 4:
                lastPrinterFormat = localStorage.getItem('lastPrinterFormat');
                formats.forEach(function (format) {
                  format.id = "".concat(format.printer._id, ";").concat(format.format._id);
                });
                _context5.next = 8;
                return _ui2["default"].form("\n            <div>\n                <form>\n                <table>\n                    <tr>\n                        <td>Printer</td>\n                        <td>\n                            <select name=\"printer\">\n                                {% for format in formats %}\n                                    <option {{ (format.id==lastPrinterFormat) ? 'selected' : '' }} value=\"{{ format.id }}\">{{ format.printer[\"$content\"].name }} - {{ format.format[\"$content\"].name }}</option>\n                                {% endfor %}\n                             </select>\n                        </td>\n                    </tr>\n                </table>\n                <input type=\"submit\"/>\n                </form>\n            </div>\n    ", f, {
                  twig: {
                    formats: formats,
                    lastPrinterFormat: lastPrinterFormat
                  }
                });

              case 8:
                if (f.printer) {
                  _context5.next = 10;
                  break;
                }

                return _context5.abrupt("return", f.printer);

              case 10:
                localStorage.setItem('lastPrinterFormat', f.printer);
                return _context5.abrupt("return", String(f.printer));

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee4);
      }))();
    }
  };
});