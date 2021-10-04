"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/util/api', './PrinterInstance', './printProcessors', './printServerFactory', '../../../rest-on-couch/Roc'], function (API, Printer, processors, printServerFactory, Roc) {
  var SECOND = 1000;
  var MINUTE = 60 * SECOND;
  var LIMIT = 11 * MINUTE;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(opts) {
      var printerRoc, formatsRoc, printServerRoc, printers, printFormats, printServers, allIds, onlineServers, onlinePrinters, exports;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              exports = {
                getDBPrinters: function getDBPrinters() {
                  return printers;
                },
                refresh: function refresh() {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                    var printerModels;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            allIds = new Set();
                            printerRoc = new Roc(opts);
                            formatsRoc = new Roc(opts);
                            printServerRoc = new Roc(opts);
                            _context.next = 6;
                            return printerRoc.view('entryByKind', {
                              key: 'printer',
                              varName: 'labelPrinters',
                              sort: function sort(a, b) {
                                return b.$modificationDate - a.$modificationDate;
                              }
                            });

                          case 6:
                            printers = _context.sent;
                            _context.next = 9;
                            return formatsRoc.view('entryByKind', {
                              key: 'printFormat',
                              varName: 'labelPrintFormats',
                              sort: function sort(a, b) {
                                return b.$modificationDate - a.$modificationDate;
                              }
                            });

                          case 9:
                            printFormats = _context.sent;
                            _context.next = 12;
                            return printServerRoc.view('printServerByMacAddress', {
                              varName: 'printServers',
                              sort: function sort(a, b) {
                                return b.$modificationDate - a.$modificationDate;
                              }
                            });

                          case 12:
                            printServers = _context.sent;
                            onlineServers = printServers.filter(function (ps) {
                              return ps.$content.isOnline !== false && Date.now() - ps.$modificationDate < LIMIT;
                            });
                            onlinePrinters = printers.filter(function (p) {
                              return onlineServers.find(function (ps) {
                                return ps.$content.macAddress === p.$content.macAddress;
                              });
                            });
                            _context.next = 17;
                            return Promise.all(onlineServers.map(function (ps) {
                              return exports.getConnectedPrinters(ps.$content).then(function (ids) {
                                ps.ids = ids;
                                ids.forEach(function (id) {
                                  return allIds.add(id);
                                });
                                ps.responds = true;
                                ps.color = 'lightgreen';
                              })["catch"](function () {
                                ps.ids = [];
                                ps.responds = false;
                                ps.color = 'pink';
                              }).then(function () {
                                ps.triggerChange();
                              });
                            }));

                          case 17:
                            API.createData('allIds', Array.from(allIds));
                            printerModels = new Set();
                            printers.forEach(function (p) {
                              return printerModels.add(String(p.$content.model));
                            });
                            API.createData('printerModels', Array.from(printerModels));

                          case 21:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }))();
                },
                getConnectedPrinters: function getConnectedPrinters(s) {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                    var printServer;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            printServer = printServerFactory(s, opts);
                            return _context2.abrupt("return", printServer.getDeviceIds());

                          case 2:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }))();
                },
                // printerFormat: uuid of the printer format or printer format document
                print: function print(printer, printFormat, data) {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                    var printServer, p;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return printerRoc.get(printer);

                          case 2:
                            printer = _context3.sent;

                            if (printFormat.resurrect) {
                              printFormat = printFormat.resurrect();
                            }

                            if (!(typeof printFormat === 'string')) {
                              _context3.next = 8;
                              break;
                            }

                            _context3.next = 7;
                            return formatsRoc.get(printFormat);

                          case 7:
                            printFormat = _context3.sent;

                          case 8:
                            printServer = printServers.find(function (ps) {
                              return String(ps.$content.macAddress) === String(printer.$content.macAddress);
                            });
                            p = new Printer(printer.$content, printServer.$content, opts);
                            _context3.next = 12;
                            return p.print(printFormat.$content, data);

                          case 12:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }))();
                },
                createPrinter: function createPrinter(printer) {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            printer.$kind = 'printer';
                            _context4.next = 3;
                            return printerRoc.create(printer);

                          case 3:
                            _context4.next = 5;
                            return exports.refresh();

                          case 5:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }))();
                },
                createFormat: function createFormat(format) {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            format.$kind = 'printFormat';
                            _context5.next = 3;
                            return formatsRoc.create(format);

                          case 3:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }))();
                },
                updateFormat: function updateFormat(format) {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            _context6.next = 2;
                            return formatsRoc.update(format);

                          case 2:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }))();
                },
                updatePrinter: function updatePrinter(printer) {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            _context7.next = 2;
                            return printerRoc.update(printer);

                          case 2:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7);
                  }))();
                },
                deletePrinter: function deletePrinter(printer) {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            _context8.next = 2;
                            return printerRoc["delete"](printer);

                          case 2:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee8);
                  }))();
                },
                deleteFormat: function deleteFormat(format) {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            _context9.next = 2;
                            return formatsRoc["delete"](format);

                          case 2:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9);
                  }))();
                },
                deletePrintServer: function deletePrintServer(printServer) {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                    return regeneratorRuntime.wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            _context10.next = 2;
                            return printServerRoc["delete"](printServer);

                          case 2:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee10);
                  }))();
                },
                // get online printers that can print a given format
                getPrinters: function getPrinters(format) {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                    var onlineMacAdresses;
                    return regeneratorRuntime.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            if (format) {
                              _context11.next = 2;
                              break;
                            }

                            return _context11.abrupt("return", onlinePrinters);

                          case 2:
                            _context11.next = 4;
                            return formatsRoc.get(format);

                          case 4:
                            format = _context11.sent;
                            onlineMacAdresses = onlinePrinters.map(function (ps) {
                              return ps.$content.macAddress;
                            });
                            return _context11.abrupt("return", printers.filter(function (p) {
                              return onlineMacAdresses.includes(p.$content.macAddress);
                            }).filter(function (p) {
                              return format.$content.models.filter(function (m) {
                                return String(m.name) === String(p.$content.model);
                              }).length > 0;
                            }));

                          case 7:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11);
                  }))();
                },
                getFormats: function getFormats(printer, type) {
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                    var formats;
                    return regeneratorRuntime.wrap(function _callee12$(_context12) {
                      while (1) {
                        switch (_context12.prev = _context12.next) {
                          case 0:
                            if (printer) {
                              _context12.next = 4;
                              break;
                            }

                            formats = printFormats.filter(function (f) {
                              return onlinePrinters.some(function (printer) {
                                return f.$content.models.some(function (m) {
                                  return String(m.name) === String(printer.$content.model);
                                });
                              });
                            });
                            _context12.next = 8;
                            break;

                          case 4:
                            _context12.next = 6;
                            return printerRoc.get(printer);

                          case 6:
                            printer = _context12.sent;
                            formats = printFormats.filter(function (f) {
                              return f.$content.models.some(function (m) {
                                return String(m.name) === String(printer.$content.model);
                              });
                            });

                          case 8:
                            if (type) {
                              formats = formats.filter(function (f) {
                                return String(f.$content.type) === type;
                              });
                            }

                            return _context12.abrupt("return", formats);

                          case 10:
                          case "end":
                            return _context12.stop();
                        }
                      }
                    }, _callee12);
                  }))();
                },
                getProcessors: function getProcessors() {
                  return Object.keys(processors);
                },
                getTypes: function getTypes() {
                  var _arguments = arguments;
                  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                    var _len, args, _key, formats, s, _iterator, _step, format;

                    return regeneratorRuntime.wrap(function _callee13$(_context13) {
                      while (1) {
                        switch (_context13.prev = _context13.next) {
                          case 0:
                            for (_len = _arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                              args[_key] = _arguments[_key];
                            }

                            _context13.next = 3;
                            return exports.getFormats.apply(null, args);

                          case 3:
                            formats = _context13.sent;
                            s = new Set();
                            _iterator = _createForOfIteratorHelper(formats);

                            try {
                              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                                format = _step.value;
                                s.add(String(format.$content.type));
                              }
                            } catch (err) {
                              _iterator.e(err);
                            } finally {
                              _iterator.f();
                            }

                            return _context13.abrupt("return", Array.from(s));

                          case 8:
                          case "end":
                            return _context13.stop();
                        }
                      }
                    }, _callee13);
                  }))();
                }
              };
              _context14.next = 3;
              return exports.refresh();

            case 3:
              return _context14.abrupt("return", exports);

            case 4:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
});