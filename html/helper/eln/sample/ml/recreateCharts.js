define(['src/util/api', 'src/util/ui'], function (API, UI) {
  async function recreateCharts(variable) {
    if (!API.getData('preferences')) return;
    const preferences = JSON.parse(JSON.stringify(API.getData('preferences')));

    if (variable && !preferences.display.autorefresh) {
      return;
    }

    const spectraProcessor = API.cache('spectraProcessor');
    const spectraDataSet = API.cache('spectraDataSet');

    if (!spectraProcessor.spectra || spectraProcessor.spectra.length === 0)
      return;

    if (variable === 'preferences') {
      let currentPreferences = JSON.stringify(preferences);
      if (API.cache('previousPreferences') === currentPreferences) return;
      API.cache('previousPreferences', currentPreferences);
    }

    console.log('Update chart');

    const selectedIDs = spectraProcessor.spectra
      .filter((spectrum) => spectrum.meta.selected)
      .map((spectrum) => spectrum.id);

    let ids = [];
    switch (preferences.display.selection) {
      case 'all':
        ids = spectraProcessor.spectra.map((spectrum) => spectrum.id);
        break;
      case 'selected':
        ids = selectedIDs;
        break;
      default:
    }

    try {
      if (preferences.display.original === 'true') {
        let chart = spectraProcessor.getChart({ ids });
        API.createData('chart', chart);
      } else {
        spectraProcessor.setNormalization(preferences.normalization);
        if (preferences.postProcessing && preferences.postProcessing.scale) {
          let postProcessingOptions = JSON.parse(JSON.stringify(preferences.postProcessing));
          let ranges = API.getData('ranges');
          if (Array.isArray(ranges)) {
            postProcessingOptions.scale.range = ranges
              .resurrect()
              .filter((range) => range.label === postProcessingOptions.scale.range)[0];
          }
          postProcessingOptions.ids = ids;
          console.log({ postProcessingOptions });
          API.createData(
            'chart',
            spectraProcessor.getPostProcessedChart(postProcessingOptions),
          );
        } else {
          API.createData('chart', spectraProcessor.getNormalizedChart({ ids }));
        }
      }
    } catch (e) {
      API.createData('chart', {});
      UI.showNotification(e.toString(), 'warning');
    }

    let chartPrefs = spectraDataSet.getChartPrefs();
    let currentChartPrefs = API.cache('currentChartPrefs');
    if (chartPrefs !== currentChartPrefs) {
      API.cache('currentChartPrefs', chartPrefs);
      API.doAction('setChartPreferences', chartPrefs);
    }

    API.createData(
      'filterAnnotations',
      spectraProcessor.getNormalizationAnnotations(),
    );

    if (!preferences.display.boxplot) {
      API.createData('boxPlotChart', []);
    } else {
      try {
        const boxPlotChart = spectraProcessor.getBoxPlotChart({
          ids:
            preferences.display.boxplot === 'selected'
              ? selectedIDs
              : undefined,
          boxplot: preferences.display.boxplotOptions,
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
      preferences.display.correlationIndex = Number.parseInt(
        preferences.display.correlationIndex,
      );
      if (!Number.isInteger(preferences.display.correlationIndex)) {
        preferences.display.correlationIndex = Math.floor(
          preferences.normalization.numberOfPoints / 2,
        );
      }

      let correlationChart = spectraProcessor.getAutocorrelationChart(
        preferences.display.correlationIndex,
        {
          ids:
            preferences.display.correlation === 'selected'
              ? selectedIDs
              : undefined,
        },
      );
      API.createData('correlationChart', correlationChart);

      const annotations = [];
      annotations.push({
        type: 'line',
        position: [
          {
            x: preferences.display.correlationX,
            y: '2000px',
          },
          {
            x: preferences.display.correlationX,
            y: '0px',
          },
        ],
        strokeWidth: '2px',
        strokeColor: 'yellow',
      });
      API.createData('correlationAnnotations', annotations);
    }
  }
  return recreateCharts;
});
