"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(['superagent', 'uri/URI'], function (superagent, URI) {
  var PrintServer = /*#__PURE__*/function () {
    function PrintServer(server, opts) {
      _classCallCheck(this, PrintServer);

      opts = opts || {};

      if (opts.proxy) {
        this.url = new URI(opts.proxy).addSearch('mac', String(server.macAddress)).normalize().href();
      } else {
        this.url = new URI(String(server.url)).normalize().href();
      }
    }

    _createClass(PrintServer, [{
      key: "getDeviceIds",
      value: function getDeviceIds() {
        var url = new URI(this.url).segment('devices/id').href();
        return getData(url);
      }
    }, {
      key: "print",
      value: function () {
        var _print = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id, printData) {
          var url;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  url = new URI(this.url).segment('send').segmentCoded(id).normalize().href();
                  return _context.abrupt("return", superagent.post(url).set('Content-Type', typeof printData === 'string' ? 'text/plain' : 'application/octet-stream').send(printData));

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function print(_x, _x2) {
          return _print.apply(this, arguments);
        }

        return print;
      }()
    }]);

    return PrintServer;
  }();

  function getData(_x3) {
    return _getData.apply(this, arguments);
  }

  function _getData() {
    _getData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return superagent.get(url);

            case 2:
              return _context2.abrupt("return", _context2.sent.body);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _getData.apply(this, arguments);
  }

  return PrintServer;
});