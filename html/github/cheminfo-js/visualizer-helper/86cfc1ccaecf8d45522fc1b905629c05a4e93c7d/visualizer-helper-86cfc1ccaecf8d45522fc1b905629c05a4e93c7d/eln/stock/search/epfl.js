"use strict";

define(["module", "superagent", "src/util/util", "src/util/ui", "lodash"], function (module, _superagent, _util, _ui, _lodash) {
  var _superagent2 = _interopRequireDefault(_superagent);

  var _util2 = _interopRequireDefault(_util);

  var _ui2 = _interopRequireDefault(_ui);

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  // example: http://stock-isic.epfl.ch/searchstock?for=json&bl=100&search=Field10.11%3D123456&bottle=123456
  module.exports = {
    search: function search(term) {
      return _superagent2["default"].get("http://stock-isic.epfl.ch/searchstock?for=json&bl=100&search=Field10.11%3D".concat(encodeURIComponent(term))).then(function (result) {
        result = result.body && result.body.entry;

        if (!result) {
          _ui2["default"].showNotification('No results in reference DB', 'warn');

          return Promise.resolve([]);
        }

        var list = [];

        for (var i = 0; i < result.length; i++) {
          if (result[i] && result[i].value) {
            var val = result[i].value;
            val.code = val.catalogID;
            list.push({
              id: i,
              name: val && val.iupac && val.iupac[0] ? val.iupac[0].value : '',
              row: val
            });
          }
        }

        return list;
      }).then(function (data) {
        return data.map(fromExpereact);
      }).then(function (data) {
        return data.sort(function (a, b) {
          var rn1 = a.$content.identifier.cas.length > 0 ? Number(a.$content.identifier.cas[0].value.replace(/-/g, '')) : Number.MAX_SAFE_INTEGER;
          var rn2 = b.$content.identifier.cas.length > 0 ? Number(b.$content.identifier.cas[0].value.replace(/-/g, '')) : Number.MAX_SAFE_INTEGER;
          return rn1 - rn2;
        });
      });
    }
  };

  function fromExpereact(expereact) {
    var mol = expereact.row.mol;
    var mf = expereact.row.mf && expereact.row.mf[0] && expereact.row.mf[0].value.value;
    var cas = expereact.row.rn && expereact.row.rn.map(function (rn) {
      return {
        value: numberToCas(rn.value.value)
      };
    });
    if (!expereact.row.iupac) expereact.row.iupac = [];
    return {
      $content: {
        general: {
          molfile: mol && mol[0] && mol[0].value.value,
          description: expereact.name,
          name: expereact.row.iupac,
          mf: mf
        },
        identifier: {
          cas: cas
        },
        stock: {
          catalogNumber: expereact.row.code
        },
        physical: {
          density: expereact.row.density,
          mp: expereact.row.mp,
          bp: expereact.row.bp
        }
      },
      id: _util2["default"].getNextUniqueId(true),
      names: _lodash2["default"].uniq([expereact.name].concat(_toConsumableArray(expereact.row.iupac.map(function (i) {
        return i.value;
      })))),
      source: 'reference'
    };
  }

  function numberToCas(nb) {
    nb = String(nb);
    return "".concat(nb.slice(0, -3), "-").concat(nb.slice(-3, -1), "-").concat(nb.slice(-1));
  }
});