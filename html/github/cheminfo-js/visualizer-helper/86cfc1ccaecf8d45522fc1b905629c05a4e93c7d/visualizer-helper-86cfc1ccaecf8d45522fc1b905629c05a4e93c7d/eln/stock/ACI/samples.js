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

  module.exports = function (roc) {
    return {
      getNextCommercialBatch: function getNextCommercialBatch(structureId) {
        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var result, batchNumbers;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  structureId = String(structureId);
                  _context.next = 3;
                  return roc.view('entryById', {
                    startkey: [structureId],
                    endkey: [structureId, "\uFFF0"]
                  });

                case 3:
                  result = _context.sent;

                  if (result.length) {
                    _context.next = 8;
                    break;
                  }

                  return _context.abrupt("return", 1);

                case 8:
                  batchNumbers = result.map(function (r) {
                    return Number(r.$id[1]);
                  }).filter(function (batch) {
                    return !Number.isNaN(batch);
                  }).sort(descending);
                  return _context.abrupt("return", ++batchNumbers[0]);

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))();
      },
      getNextInternalBatch: function getNextInternalBatch(structureId, salt) {
        return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
          var result, batchNumbers;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  structureId = String(structureId);
                  salt = String(salt);
                  _context2.next = 4;
                  return roc.view('entryById', {
                    startkey: [structureId, salt],
                    endkey: [structureId, salt, "\uFFF0"]
                  });

                case 4:
                  result = _context2.sent;

                  if (result.length) {
                    _context2.next = 9;
                    break;
                  }

                  return _context2.abrupt("return", 1);

                case 9:
                  batchNumbers = result.map(function (r) {
                    return Number(r.$id[2]);
                  }).filter(function (batch) {
                    return !Number.isNaN(batch);
                  }).sort(descending);
                  return _context2.abrupt("return", ++batchNumbers[0]);

                case 11:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }))();
      }
    };
  };

  function descending(a, b) {
    if (a < b) return 1;else if (b < a) return -1;else return 0;
  }
});