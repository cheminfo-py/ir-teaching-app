"use strict";

define(["module", "src/util/ui"], function (module, _ui) {
  var _ui2 = _interopRequireDefault(_ui);

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

  var pubchemURL = 'https://pubchem.cheminfo.org/molecules/mf?mf=';

  function getMolecules(_x) {
    return _getMolecules.apply(this, arguments);
  }

  function _getMolecules() {
    _getMolecules = _asyncToGenerator(regeneratorRuntime.mark(function _callee(mf) {
      var response, results;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch("".concat(pubchemURL).concat(mf));

            case 2:
              response = _context.sent;
              _context.next = 5;
              return response.json();

            case 5:
              results = _context.sent.result;
              return _context.abrupt("return", new Promise(function (resolve) {
                resolve(results);
              }));

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getMolecules.apply(this, arguments);
  }

  module.exports = {
    choose: function choose(mf) {
      var promise = getMolecules(mf);
      return _ui2["default"].choose([{
        promise: promise
      }], {
        autoSelect: false,
        asynchronous: true,
        noConfirmation: true,
        returnRow: false,
        dialog: {
          width: 1000,
          height: 800
        },
        columns: [{
          id: 'iupac',
          name: 'Name',
          jpath: [],
          rendererOptions: {
            forceType: 'object',
            twig: "\n                {{iupac}}\n              "
          }
        }, {
          id: 'structure',
          name: 'Structure',
          jpath: ['ocl', 'id'],
          rendererOptions: {
            forceType: 'oclID'
          },
          maxWidth: 500
        }, {
          id: 'url',
          name: 'Pubchem',
          jpath: [],
          rendererOptions: {
            forceType: 'object',
            twig: "\n                <a href=\"https://pubchem.ncbi.nlm.nih.gov/compound/{{_id}}\" onclick=\"event.stopPropagation()\" target=\"_blank\">&#x2B08;</a>\n              "
          },
          maxWidth: 70
        }],
        idField: 'id',
        slick: {
          rowHeight: 140
        }
      })["catch"](function (e) {
        console.error(e); // eslint-disable-line no-console

        _ui2["default"].showNotification('search failed', 'error');
      });
    }
  };
});