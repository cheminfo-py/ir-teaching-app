"use strict";

define(["module", "https://www.lactame.com/lib/chemspider-json-api/1.0.0/chemspider-json-api.min.js", "src/util/util", "lodash"], function (module, _chemspiderJsonApiMin, _util, _lodash) {
  var _chemspiderJsonApiMin2 = _interopRequireDefault(_chemspiderJsonApiMin);

  var _util2 = _interopRequireDefault(_util);

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = {
    search: function search(term) {
      return _chemspiderJsonApiMin2["default"].search({
        searchOptions: {
          searchOptions: {
            QueryText: term
          }
        },
        resultOptions: {
          serfilter: 'Compound[Mol|Name|Synonyms|CSID]'
        }
      }).then(function (data) {
        return data.map(fromChemspider);
      });
    }
  };

  function fromChemspider(chemspider) {
    var entry = {
      $content: {
        general: {
          molfile: chemspider.Mol,
          description: chemspider.Name
        }
      },
      names: [chemspider.name],
      id: _util2["default"].getNextUniqueId(true),
      source: 'chemspider'
    };
    var name = entry.$content.general.name = [];
    var identifier = entry.$content.identifier = {};
    var cas = identifier.cas = [];
    var CSID = identifier.chemSpiderID = [];
    var synonyms = chemspider.Synonyms;

    for (var i = 0; i < synonyms.length; i++) {
      var synonym = synonyms[i];

      if (isReliableSynonym(synonym)) {
        name.push({
          value: synonym.Name,
          language: synonym.LangID
        });
      }

      if (isReliableCas(synonym)) {
        cas.push({
          value: synonym.Name
        });
      }
    }

    entry.names = _lodash2["default"].uniq(entry.names.concat(name.map(function (n) {
      return n.value;
    })));

    if (chemspider.CSID) {
      CSID.push({
        value: chemspider.CSID
      });
    }

    return entry;
  }

  function isReliableCas(synonym) {
    return synonym.Reliability >= 4 && synonym.LangID === 'en' && synonym.SynonymType === 2;
  }

  function isReliableSynonym(synonym) {
    return synonym.Reliability >= 4 && synonym.SynonymType === 5 && synonym.LangID === 'en';
  }
});