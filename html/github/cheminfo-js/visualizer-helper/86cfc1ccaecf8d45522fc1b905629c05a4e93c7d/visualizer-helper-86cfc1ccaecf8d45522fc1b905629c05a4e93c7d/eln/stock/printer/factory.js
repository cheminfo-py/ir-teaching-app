"use strict";

define(["module", "./printer"], function (module, _printer) {
  var _printer2 = _interopRequireDefault(_printer);

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

  module.exports = function (opts, cb) {
    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }

    if (typeof IframeBridge !== 'undefined') {
      self.IframeBridge.onMessage(function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(data) {
          var optsCopy, options, p;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(data.type === 'tab.data')) {
                    _context.next = 9;
                    break;
                  }

                  optsCopy = Object.assign({}, opts);

                  if (!(data.message.printer && data.message.printer.couchDB)) {
                    _context.next = 9;
                    break;
                  }

                  optsCopy.proxy = data.message.printer.proxy;
                  options = Object.assign({}, data.message.printer.couchDB, optsCopy);
                  _context.next = 7;
                  return (0, _printer2["default"])(options);

                case 7:
                  p = _context.sent;
                  cb(p, data.message.printer);

                case 9:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    } else {
      cb(null);
    }
  };
});