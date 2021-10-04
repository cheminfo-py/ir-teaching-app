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

  module.exports = {
    search: function search(term) {
      return _superagent2["default"].get("https://reference.cheminfo.org/v1/search?appendMolfile=true&quick=".concat(encodeURIComponent(term))).then(function (result) {
        var data = result.body && result.body.data;

        if (!data) {
          _ui2["default"].showNotification('No results in reference DB', 'warn');

          return Promise.resolve([]);
        }

        return data;
      }).then(function (data) {
        return data.map(fromChemexper);
      }).then(function (data) {
        return data.sort(function (a, b) {
          var rn1 = Number(a.catalogID);
          var rn2 = Number(b.catalogID);
          return rn1 - rn2;
        });
      });
    }
  };

  function fromChemexper(datum) {
    return {
      $content: {
        general: {
          molfile: datum.molfile,
          description: datum.iupac && datum.iupac[0],
          name: [{
            value: datum.iupac[0]
          }],
          mf: datum.mf && datum.mf.mf,
          mw: datum.mf && datum.mf.mass,
          em: datum.mf && datum.mf.monoisotopicMass
        },
        identifier: {
          cas: numberToCas(datum.catalogID)
        },
        stock: {
          catalogNumber: datum.catalogID
        },
        physical: {
          density: datum.density,
          mp: datum.mp,
          bp: datum.bp
        }
      },
      id: _util2["default"].getNextUniqueId(true),
      names: datum.iupac,
      source: 'reference'
    };
  }

  function numberToCas(nb) {
    nb = String(nb);
    return "".concat(nb.slice(0, -3), "-").concat(nb.slice(-3, -1), "-").concat(nb.slice(-1));
  }
});