"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(['src/util/util', './printServerFactory', './printProcessors', '../../libs/MolecularFormula'], function (Util, printServerFactory, processors, MolecularFormula) {
  var Printer = /*#__PURE__*/function () {
    function Printer(printer, printServer, opts) {
      _classCallCheck(this, Printer);

      this.url = String(printServer.url);
      this.id = String(printer.id);
      this.printServer = printServerFactory(printServer, opts);
    }

    _createClass(Printer, [{
      key: "print",
      value: function () {
        var _print = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(printFormat, data) {
          var printData;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return getPrintData(printFormat, data);

                case 2:
                  printData = _context.sent;

                  if (!(printData === null)) {
                    _context.next = 5;
                    break;
                  }

                  return _context.abrupt("return", null);

                case 5:
                  return _context.abrupt("return", this.printServer.print(this.id, printData));

                case 6:
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

    return Printer;
  }();

  function getPrintData(_x3, _x4) {
    return _getPrintData.apply(this, arguments);
  }

  function _getPrintData() {
    _getPrintData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(printFormat, data) {
      var options,
          _args2 = arguments;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};

              if (processors[printFormat.processor]) {
                _context2.next = 3;
                break;
              }

              throw new Error('processor does not exist');

            case 3:
              data = processData(printFormat, data);
              return _context2.abrupt("return", processors[String(printFormat.processor)].call(null, printFormat, data, options));

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _getPrintData.apply(this, arguments);
  }

  function processData(printFormat, data) {
    switch (printFormat.type) {
      case 'sample':
        {
          var result = JSON.parse(JSON.stringify(data));

          if (result.$content) {
            result.entry = result.$content;

            if (result._id) {
              result.uuidShort = result._id.substring(0, 12);
              result.b64Short = Util.hexToBase64(result.uuidShort);
            }

            if (result.$id) {
              result.id = result.$id;
            }

            if (result.$content.general) {
              if (result.$content.general.mf) {
                var mf = new MolecularFormula["default"].MF("".concat(result.$content.general.mf));
                result.mfCanonic = mf.toMF();
                console.log(result.mfCanonic);
              }

              if (result.$content.general.description) {
                result.line1 = result.$content.general.description.substring(0, 60);
                result.line2 = result.$content.general.description.substring(60, 120);
              } else {
                result.line1 = '';
                result.line2 = '';
              }

              if (result.$content.general.molfile) {
                result.molfile = result.$content.general.molfile;
              }
            }
          }

          return result;
        }

      case 'location':
        return data;

      default:
        return data;
    }
  }

  Printer.processData = processData;
  Printer.getPrintData = getPrintData;
  return Printer;
});