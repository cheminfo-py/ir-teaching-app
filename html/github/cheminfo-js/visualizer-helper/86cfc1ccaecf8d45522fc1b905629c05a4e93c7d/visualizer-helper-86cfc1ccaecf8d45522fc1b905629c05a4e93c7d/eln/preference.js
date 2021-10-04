"use strict";

define(["exports", "src/util/api", "../rest-on-couch/Roc"], function (exports, _api, _Roc) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Preference = undefined;
  exports.preferencesFactory = preferencesFactory;

  var _api2 = _interopRequireDefault(_api);

  var _Roc2 = _interopRequireDefault(_Roc);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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

  function preferencesFactory(_x, _x2) {
    return _preferencesFactory.apply(this, arguments);
  }

  function _preferencesFactory() {
    _preferencesFactory = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(id, options) {
      var _options$name, name, _options$url, url, _options$database, database, _options$initial, initial, kind, roc, user, existing, preferenceRoc, rocOptions, created, viewPreferences;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _options$name = options.name, name = _options$name === void 0 ? 'viewPreferences' : _options$name, _options$url = options.url, url = _options$url === void 0 ? undefined : _options$url, _options$database = options.database, database = _options$database === void 0 ? 'eln' : _options$database, _options$initial = options.initial, initial = _options$initial === void 0 ? [] : _options$initial;
              kind = 'viewPreferences';
              roc = new _Roc2["default"]({
                url: url,
                database: database,
                kind: kind
              });
              _context2.next = 5;
              return roc.getUser();

            case 5:
              user = _context2.sent;
              id += "_".concat(user.username);
              _context2.next = 9;
              return roc.view('entryByKindAndId', {
                key: [kind, id]
              });

            case 9:
              existing = _context2.sent[0];
              rocOptions = {
                varName: name,
                track: true
              };

              if (!existing) {
                _context2.next = 17;
                break;
              }

              _context2.next = 14;
              return roc.document(existing._id, rocOptions);

            case 14:
              preferenceRoc = _context2.sent;
              _context2.next = 23;
              break;

            case 17:
              _context2.next = 19;
              return roc.create({
                $id: id,
                $content: initial,
                $kind: kind
              });

            case 19:
              created = _context2.sent;
              _context2.next = 22;
              return roc.document(created._id, rocOptions);

            case 22:
              preferenceRoc = _context2.sent;

            case 23:
              viewPreferences = new Preference(roc, preferenceRoc);
              _context2.next = 26;
              return _api2["default"].cache(name, viewPreferences);

            case 26:
              return _context2.abrupt("return", viewPreferences);

            case 27:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _preferencesFactory.apply(this, arguments);
  }

  var Preference = exports.Preference = function () {
    function Preference(roc, preferenceRoc) {
      _classCallCheck(this, Preference);

      this.roc = roc;
      this.preference = preferenceRoc;
    }

    _createClass(Preference, [{
      key: "save",
      value: function () {
        var _save = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.roc.update(this.preference);

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function save() {
          return _save.apply(this, arguments);
        }

        return save;
      }()
    }]);

    return Preference;
  }();
});