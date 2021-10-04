"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(['superagent', 'uri/URI'], function (superagent, URI) {
  var ZebraPrintServer = /*#__PURE__*/function () {
    function ZebraPrintServer(server, opts) {
      _classCallCheck(this, ZebraPrintServer);

      this.server = server;
      opts = opts || {};

      if (opts.proxy) {
        this.url = new URI(opts.proxy).addSearch('mac', String(server.macAddress)).normalize().href();
      } else {
        throw new Error('zebra printers need a proxy');
      }
    }

    _createClass(ZebraPrintServer, [{
      key: "getDeviceIds",
      value: function getDeviceIds() {
        return Promise.resolve([this.server.macAddress]);
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
                  url = new URI(this.url).segment('pstprnt').normalize().href();
                  return _context.abrupt("return", superagent.post(url).set('Content-Type', 'text/plain').send(printData));

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

    return ZebraPrintServer;
  }();

  return ZebraPrintServer;
});