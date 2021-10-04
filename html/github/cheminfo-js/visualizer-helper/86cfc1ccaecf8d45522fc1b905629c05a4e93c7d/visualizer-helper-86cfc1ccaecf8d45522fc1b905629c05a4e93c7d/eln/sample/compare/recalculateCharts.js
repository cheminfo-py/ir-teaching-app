"use strict";

define(["exports", "src/util/api"], function (exports, _api) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = recalculateCharts;

  var _api2 = _interopRequireDefault(_api);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function recalculateCharts() {
    var ExtendedCommonSpectrum = _api2["default"].cache('ExtendedCommonSpectrum');

    var analysesManager = _api2["default"].cache('analysesManager');

    var selectedSpectra = _api2["default"].getData('selectedSpectra');

    var preferences = JSON.parse(JSON.stringify(_api2["default"].getData('preferences')));
    var ids = selectedSpectra.filter(function (entry) {
      return DataObject.resurrect(entry.display);
    }).map(function (entry) {
      return String(entry.id);
    });
    var colors = selectedSpectra.filter(function (entry) {
      return DataObject.resurrect(entry.display);
    }).map(function (entry) {
      return String(entry.color);
    });
    var analyses = analysesManager.getAnalyses({
      ids: ids
    });
    console.log('Calculate chart');

    if (preferences.normalization.processing) {
      var chartProcessed = ExtendedCommonSpectrum.JSGraph.getJSGraph(analyses, {
        colors: colors,
        opacities: [0.2],
        linesWidth: [3],
        ids: ids,
        selector: preferences.selector,
        normalization: {
          processing: preferences.normalization.processing,
          filters: [{
            name: 'rescale'
          }]
        }
      });
      delete preferences.normalization.processing;

      _api2["default"].createData('chartProcessed', chartProcessed);
    } else {
      _api2["default"].createData('chartProcessed', {});
    }

    var chart = ExtendedCommonSpectrum.JSGraph.getJSGraph(analyses, {
      colors: colors,
      ids: ids,
      selector: preferences.selector,
      normalization: preferences.normalization
    });
    console.log(chart);

    _api2["default"].createData('chart', chart);

    var filterAnnotations = ExtendedCommonSpectrum.JSGraph.getNormalizationAnnotations(preferences.normalization, {
      y: {
        min: '0px',
        max: '2000px'
      }
    });

    _api2["default"].createData('filterAnnotations', filterAnnotations);
  }
});