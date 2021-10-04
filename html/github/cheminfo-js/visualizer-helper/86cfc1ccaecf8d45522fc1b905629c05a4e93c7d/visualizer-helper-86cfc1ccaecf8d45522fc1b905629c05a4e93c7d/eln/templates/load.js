"use strict";

define(["module", "src/util/api"], function (module, _api) {
  var _api2 = _interopRequireDefault(_api);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
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

  /**
   * (string|array) [categories='']:  categories
   * (object) [options]
   * (string) [options.variableName='templates']
   */
  module.exports = function () {
    var _load = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(categories) {
      var options,
          _options$variableName,
          variableName,
          roc,
          templates,
          _args3 = arguments;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
              _options$variableName = options.variableName, variableName = _options$variableName === void 0 ? 'templates' : _options$variableName;

              if (typeof categories === 'string') {
                categories = [categories];
              } // we check if roc is already defined, in this case
              // we will check if the templates database exists


              roc = _api2["default"].cache('roc');

              if (!roc) {
                _context3.next = 9;
                break;
              }

              _context3.next = 7;
              return fetch("".concat(roc.url, "/db/templates/_query/template?key=abcdef")).then(function () {
                var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(result) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!(result.status === 200)) {
                            _context.next = 10;
                            break;
                          }

                          _context.next = 3;
                          return fetchAndLink("".concat(roc.url), categories);

                        case 3:
                          templates = _context.sent;

                          if (!(!templates || templates.length === 0)) {
                            _context.next = 8;
                            break;
                          }

                          _context.next = 7;
                          return fetchPublicAndLink(categories);

                        case 7:
                          templates = _context.sent;

                        case 8:
                          _context.next = 13;
                          break;

                        case 10:
                          _context.next = 12;
                          return fetchPublicAndLink(categories);

                        case 12:
                          templates = _context.sent;

                        case 13:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x2) {
                  return _ref.apply(this, arguments);
                };
              }())["catch"](_asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return fetchPublicAndLink(categories);

                      case 2:
                        templates = _context2.sent;

                      case 3:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              })));

            case 7:
              _context3.next = 12;
              break;

            case 9:
              _context3.next = 11;
              return fetchPublicAndLink(categories);

            case 11:
              templates = _context3.sent;

            case 12:
              templates.sort(function (a, b) {
                if (a.value.title < b.value.title) return -1;
                if (a.value.title > b.value.title) return 1;
                return 0;
              }); // could be improved to remember the last selected format

              if (!variableName) {
                _context3.next = 16;
                break;
              }

              _context3.next = 16;
              return _api2["default"].createData(variableName, templates);

            case 16:
              return _context3.abrupt("return", templates);

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function load(_x) {
      return _load.apply(this, arguments);
    }

    return load;
  }(); // https://www.cheminfo.org/couch/templates-public/_design/customApp/_view/template?reduce=false&startkey=%5B%22admin@cheminfo.org%22%2C%22org.cheminfo%22%5D&endkey=%5B%22admin@cheminfo.org%22%2C%22org.cheminfo.default%22%5D


  function fetchPublicAndLink(_x3) {
    return _fetchPublicAndLink.apply(this, arguments);
  }

  function _fetchPublicAndLink() {
    _fetchPublicAndLink = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(categories) {
      var templates, _iterator, _step, _loop;

      return regeneratorRuntime.wrap(function _callee4$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!Array.isArray(categories)) categories = [categories];
              templates = [];
              _iterator = _createForOfIteratorHelper(categories);
              _context5.prev = 3;
              _loop = regeneratorRuntime.mark(function _loop() {
                var category, startkey, endkey, baseUrl, url, response, results;
                return regeneratorRuntime.wrap(function _loop$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        category = _step.value;
                        startkey = escape(JSON.stringify(['admin@cheminfo.org', category]));
                        endkey = escape(JSON.stringify(['admin@cheminfo.org', "".concat(category, "\uFFFF")]));
                        baseUrl = require.s.contexts._.config.baseUrl;
                        url = "".concat(baseUrl, "../../templates-public/_design/customApp/_view/template?reduce=false&startkey=").concat(startkey, "&endkey=").concat(endkey);
                        _context4.next = 7;
                        return fetch(url);

                      case 7:
                        response = _context4.sent;
                        _context4.next = 10;
                        return response.json();

                      case 10:
                        results = _context4.sent.rows;
                        results.forEach(function (result) {
                          result.document = {
                            type: 'object',
                            url: "".concat(baseUrl, "../../templates-public/").concat(result.id)
                          };
                        });
                        templates.push.apply(templates, _toConsumableArray(results));

                      case 13:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _loop);
              });

              _iterator.s();

            case 6:
              if ((_step = _iterator.n()).done) {
                _context5.next = 10;
                break;
              }

              return _context5.delegateYield(_loop(), "t0", 8);

            case 8:
              _context5.next = 6;
              break;

            case 10:
              _context5.next = 15;
              break;

            case 12:
              _context5.prev = 12;
              _context5.t1 = _context5["catch"](3);

              _iterator.e(_context5.t1);

            case 15:
              _context5.prev = 15;

              _iterator.f();

              return _context5.finish(15);

            case 18:
              return _context5.abrupt("return", templates);

            case 19:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee4, null, [[3, 12, 15, 18]]);
    }));
    return _fetchPublicAndLink.apply(this, arguments);
  }

  function fetchAndLink() {
    return _fetchAndLink.apply(this, arguments);
  }

  function _fetchAndLink() {
    _fetchAndLink = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
      var url,
          categories,
          templates,
          _iterator2,
          _step2,
          category,
          startkey,
          endkey,
          response,
          results,
          _args6 = arguments;

      return regeneratorRuntime.wrap(function _callee5$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              url = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : 'https://mydb.cheminfo.org';
              categories = _args6.length > 1 ? _args6[1] : undefined;
              templates = [];
              _iterator2 = _createForOfIteratorHelper(categories);
              _context6.prev = 4;

              _iterator2.s();

            case 6:
              if ((_step2 = _iterator2.n()).done) {
                _context6.next = 20;
                break;
              }

              category = _step2.value;
              startkey = category;
              endkey = "".concat(category, "\uFFFF");
              _context6.next = 12;
              return fetch("".concat(url, "/db/templates/_query/template?startkey=").concat(startkey, "&endkey=").concat(endkey));

            case 12:
              response = _context6.sent;
              _context6.next = 15;
              return response.json();

            case 15:
              results = _context6.sent;
              results.forEach(function (result) {
                result.document = {
                  type: 'object',
                  url: "".concat(url, "/db/templates/entry/").concat(result.id)
                };
              });
              templates.push.apply(templates, _toConsumableArray(results));

            case 18:
              _context6.next = 6;
              break;

            case 20:
              _context6.next = 25;
              break;

            case 22:
              _context6.prev = 22;
              _context6.t0 = _context6["catch"](4);

              _iterator2.e(_context6.t0);

            case 25:
              _context6.prev = 25;

              _iterator2.f();

              return _context6.finish(25);

            case 28:
              return _context6.abrupt("return", templates);

            case 29:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee5, null, [[4, 22, 25, 28]]);
    }));
    return _fetchAndLink.apply(this, arguments);
  }
});