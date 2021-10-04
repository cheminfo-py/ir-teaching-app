"use strict";

define(["module"], function (module) {
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
    getNextId: function getNextId(roc, viewName, type) {
      return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var v, id, current, nextID;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return roc.view(viewName, {
                  reduce: true
                });

              case 2:
                v = _context.sent;

                if (!(!v.length || !v[0].value || !v[0].value[type])) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", "".concat(type, "-000001-").concat(getCheckDigit(1)));

              case 5:
                id = v[0].value[type];
                current = Number(id);
                nextID = current + 1;
                return _context.abrupt("return", numberToId(nextID, type));

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    numberToId: numberToId
  };

  function numberToId(num, type) {
    var check = getCheckDigit(num);
    var numStr = String(num);
    return "".concat(type, "-").concat('0'.repeat(6 - numStr.length)).concat(numStr, "-").concat(check);
  }

  function getCheckDigit(number) {
    var str = number.toString();
    var strlen = str.length;
    var idx = 1;
    var total = 0;

    for (var i = strlen - 1; i >= 0; i--) {
      var el = +str.charAt(i);
      total += el * idx++;
    }

    var checkDigit = total % 10;
    return checkDigit;
  }
});