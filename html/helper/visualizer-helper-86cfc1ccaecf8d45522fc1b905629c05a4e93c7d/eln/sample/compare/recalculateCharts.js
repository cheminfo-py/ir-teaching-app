import API from 'src/util/api';

export default function recalculateCharts() {
  const ExtendedCommonSpectrum = API.cache('ExtendedCommonSpectrum');
  const analysesManager = API.cache('analysesManager');
  const selectedSpectra = API.getData('selectedSpectra');
  const preferences = JSON.parse(JSON.stringify(API.getData('preferences')));

  let ids = selectedSpectra
    .filter((entry) => DataObject.resurrect(entry.display))
    .map((entry) => String(entry.id));
  let colors = selectedSpectra
    .filter((entry) => DataObject.resurrect(entry.display))
    .map((entry) => String(entry.color));

  let analyses = analysesManager.getAnalyses({ ids });

  console.log('Calculate chart');
  if (preferences.normalization.processing) {
    let chartProcessed = ExtendedCommonSpectrum.JSGraph.getJSGraph(analyses, {
      colors,
      opacities: [0.2],
      linesWidth: [3],
      ids,
      selector: preferences.selector,
      normalization: {
        processing: preferences.normalization.processing,
        filters: [
          {
            name: 'rescale'
          }
        ]
      }
    });
    delete preferences.normalization.processing;
    API.createData('chartProcessed', chartProcessed);
  } else {
    API.createData('chartProcessed', {});
  }

  let chart = ExtendedCommonSpectrum.JSGraph.getJSGraph(analyses, {
    colors,
    ids,
    selector: preferences.selector,
    normalization: preferences.normalization
  });

  console.log(chart);

  API.createData('chart', chart);

  let filterAnnotations =
    ExtendedCommonSpectrum.JSGraph.getNormalizationAnnotations(
      preferences.normalization,
      {
        y: { min: '0px', max: '2000px' }
      }
    );

  API.createData('filterAnnotations', filterAnnotations);
}
