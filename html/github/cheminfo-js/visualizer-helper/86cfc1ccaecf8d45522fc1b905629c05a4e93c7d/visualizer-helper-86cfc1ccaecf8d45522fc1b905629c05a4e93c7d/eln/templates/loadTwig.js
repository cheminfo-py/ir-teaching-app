"use strict";

define(["module", "src/util/api", "./load"], function (module, _api, _load) {
  var _api2 = _interopRequireDefault(_api);

  var _load2 = _interopRequireDefault(_load);

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

  module.exports = function () {
    var _loadTwig = _asyncToGenerator(regeneratorRuntime.mark(function _callee(category) {
      var options,
          _options$variableName,
          variableName,
          templates,
          twigTemplate,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              _options$variableName = options.variableName, variableName = _options$variableName === void 0 ? 'twigTemplate' : _options$variableName;
              _context.prev = 2;
              _context.t0 = DataObject;
              _context.next = 6;
              return (0, _load2["default"])(category);

            case 6:
              _context.t1 = _context.sent;
              templates = (0, _context.t0)(_context.t1);
              _context.next = 10;
              return templates.getChild(['0', 'document', '$content', 'twig']);

            case 10:
              twigTemplate = _context.sent;
              if (variableName) _api2["default"].createData(variableName, twigTemplate);
              return _context.abrupt("return", twigTemplate);

            case 15:
              _context.prev = 15;
              _context.t2 = _context["catch"](2);
              // eslint-disable-next-line no-console
              console.log("No twig format found for ".concat(category));
              return _context.abrupt("return", '');

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 15]]);
    }));

    function loadTwig(_x) {
      return _loadTwig.apply(this, arguments);
    }

    return loadTwig;
  }();
});