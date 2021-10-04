"use strict";

define(["exports", "./ExtSample"], function (exports, _ExtSample) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.extSample = extSample;

  var _ExtSample2 = _interopRequireDefault(_ExtSample);

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

  function extSample() {
    return _extSample.apply(this, arguments);
  }

  function _extSample() {
    _extSample = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var options,
          sample,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
              sample = new _ExtSample2["default"]({}, options);
              _context.next = 4;
              return sample._initialized;

            case 4:
              return _context.abrupt("return", sample);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _extSample.apply(this, arguments);
  }
});