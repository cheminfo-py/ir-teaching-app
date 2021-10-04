"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/util/api', 'src/util/ui'], function (API, UI) {
  function recreateCharts(_x) {
    return _recreateCharts.apply(this, arguments);
  }

  function _recreateCharts() {
    _recreateCharts = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(variable) {
      var preferences, spectraProcessor, spectraDataSet, currentPreferences, selectedIDs, ids, chart, postProcessingOptions, ranges, chartPrefs, currentChartPrefs, boxPlotChart, correlationChart, annotations;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (API.getData('preferences')) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              preferences = JSON.parse(JSON.stringify(API.getData('preferences')));

              if (!(variable && !preferences.display.autorefresh)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return");

            case 5:
              spectraProcessor = API.cache('spectraProcessor');
              spectraDataSet = API.cache('spectraDataSet');

              if (!(!spectraProcessor.spectra || spectraProcessor.spectra.length === 0)) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("return");

            case 9:
              if (!(variable === 'preferences')) {
                _context.next = 14;
                break;
              }

              currentPreferences = JSON.stringify(preferences);

              if (!(API.cache('previousPreferences') === currentPreferences)) {
                _context.next = 13;
                break;
              }

              return _context.abrupt("return");

            case 13:
              API.cache('previousPreferences', currentPreferences);

            case 14:
              console.log('Update chart');
              selectedIDs = spectraProcessor.spectra.filter(function (spectrum) {
                return spectrum.meta.selected;
              }).map(function (spectrum) {
                return spectrum.id;
              });
              ids = [];
              _context.t0 = preferences.display.selection;
              _context.next = _context.t0 === 'all' ? 20 : _context.t0 === 'selected' ? 22 : 24;
              break;

            case 20:
              ids = spectraProcessor.spectra.map(function (spectrum) {
                return spectrum.id;
              });
              return _context.abrupt("break", 24);

            case 22:
              ids = selectedIDs;
              return _context.abrupt("break", 24);

            case 24:
              try {
                if (preferences.display.original === 'true') {
                  chart = spectraProcessor.getChart({
                    ids: ids
                  });
                  API.createData('chart', chart);
                } else {
                  spectraProcessor.setNormalization(preferences.normalization);

                  if (preferences.postProcessing && preferences.postProcessing.scale) {
                    postProcessingOptions = JSON.parse(JSON.stringify(preferences.postProcessing));
                    ranges = API.getData('ranges');

                    if (Array.isArray(ranges)) {
                      postProcessingOptions.scale.range = ranges.resurrect().filter(function (range) {
                        return range.label === postProcessingOptions.scale.range;
                      })[0];
                    }

                    postProcessingOptions.ids = ids;
                    console.log({
                      postProcessingOptions: postProcessingOptions
                    });
                    API.createData('chart', spectraProcessor.getPostProcessedChart(postProcessingOptions));
                  } else {
                    API.createData('chart', spectraProcessor.getNormalizedChart({
                      ids: ids
                    }));
                  }
                }
              } catch (e) {
                API.createData('chart', {});
                UI.showNotification(e.toString(), 'warning');
              }

              chartPrefs = spectraDataSet.getChartPrefs();
              currentChartPrefs = API.cache('currentChartPrefs');

              if (chartPrefs !== currentChartPrefs) {
                API.cache('currentChartPrefs', chartPrefs);
                API.doAction('setChartPreferences', chartPrefs);
              }

              API.createData('filterAnnotations', spectraProcessor.getNormalizationAnnotations());

              if (!preferences.display.boxplot) {
                API.createData('boxPlotChart', []);
              } else {
                try {
                  boxPlotChart = spectraProcessor.getBoxPlotChart({
                    ids: preferences.display.boxplot === 'selected' ? selectedIDs : undefined,
                    boxplot: preferences.display.boxplotOptions
                  });
                  API.createData('boxPlotChart', boxPlotChart);
                } catch (e) {
                  UI.showNotification(e.toString(), 'warning');
                }
              }

              if (!preferences.display.correlation) {
                API.createData('correlationChart', {});
                API.createData('correlationAnnotations', []);
              } else {
                preferences.display.correlationIndex = Number.parseInt(preferences.display.correlationIndex);

                if (!Number.isInteger(preferences.display.correlationIndex)) {
                  preferences.display.correlationIndex = Math.floor(preferences.normalization.numberOfPoints / 2);
                }

                correlationChart = spectraProcessor.getAutocorrelationChart(preferences.display.correlationIndex, {
                  ids: preferences.display.correlation === 'selected' ? selectedIDs : undefined
                });
                API.createData('correlationChart', correlationChart);
                annotations = [];
                annotations.push({
                  type: 'line',
                  position: [{
                    x: preferences.display.correlationX,
                    y: '2000px'
                  }, {
                    x: preferences.display.correlationX,
                    y: '0px'
                  }],
                  strokeWidth: '2px',
                  strokeColor: 'yellow'
                });
                API.createData('correlationAnnotations', annotations);
              }

            case 31:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _recreateCharts.apply(this, arguments);
  }

  return recreateCharts;
});