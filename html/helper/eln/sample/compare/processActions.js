import API from 'src/util/api';
import trackMove from './trackMove';
import recalculateCharts from './recalculateCharts';
import Color from 'src/util/color';

const nbColors = 8;
const colors = Color.getDistinctColorsAsString(nbColors);

async function processActions(action) {
  if (!action || !action.name) return;
  switch (action.name) {
    case 'trackMove':
      trackMove(action);
      break;
    case 'recalculateCharts':
      recalculateCharts();
      break;
    case 'spectrumInfo':
      const jcampInfo = await API.require('vh/eln/util/jcampInfo');
      console.log(action.value);
      jcampInfo(action.value);
      break;
    case 'removeSpectrum': {
      removeSpectrum(action);
      break;
    }
    case 'setSpectrum': {
      const analysesManager = API.cache('analysesManager');
      let selectedSpectra = API.getData('selectedSpectra');
      analysesManager.analyses.splice(0);
      selectedSpectra.length = 0;
      let result = await addSpectrum(action, {});
      API.getData('selectedSpectra').triggerChange();
      return result;
    }
    case 'addSample':
      await addSample(action);
      API.getData('selectedSpectra').triggerChange();
      break;
    case 'addSpectrum':
      let result = await addSpectrum(action, {});
      API.getData('selectedSpectra').triggerChange();
      return result;
    case 'hideSpectra':
      hideSpectra();
      break;
    case 'hideAllSpectra':
      hideAllSpectra();
      break;
    case 'removeAllSpectra':
      removeAllSpectra();
      break;
    case 'showOnlySpectra':
      showOnlySpectra();
      break;
    case 'showSpectra':
      showSpectra();
      break;
    case 'showAllSpectra':
      showAllSpectra();
      break;
  }
}

function getSampleID(entry) {
  while ((entry = entry.__parent)) {
    if (entry.$id) return entry.$id.join(' ');
    if (entry.value && entry.value.$id) return entry.value.$id.join(' ');
  }
  return '';
}

async function addSample(action) {
  const entryID = action.value.id;
  const sample = await API.cache('roc').document(entryID);
  const analysesManager = API.cache('analysesManager');
  const target = analysesManager.target;
  if (!target || !sample.$content.spectra || !sample.$content.spectra[target]) {
    return;
  }

  for (let i = 0; i < sample.$content.spectra[target].length; i++) {
    const spectrum = sample.$content.spectra[target][i];
    await addSpectrum(
      { value: { __name: i, ...spectrum } },
      {
        sampleID: sample.$id.join(' '),
        sampleUUID: sample._id,
        spectrumUUID: sample._id + '_' + i
      }
    );
  }
}

async function addSpectrum(action, options = {}) {
  const ExtendedCommonSpectrum = API.cache('ExtendedCommonSpectrum');
  let selectedSpectra = API.getData('selectedSpectra');
  const analysesManager = API.cache('analysesManager');
  let sampleID = options.sampleID || getSampleID(action.value);
  let sampleUUID = options.sampleUUID || getSampleUUID(action.value);
  let spectrumUUID = options.spectrumUUID || getSpectrumUUID(action.value);

  let spectrumID = sampleID + ' ' + action.value.__name;
  console.log({ spectrumID, spectrumUUID });
  let jcamp = '';

  if (action.value.jcamp && action.value.jcamp.filename) {
    jcamp += await API.cache('roc').getAttachment(
      { _id: sampleUUID },
      action.value.jcamp.filename
    );
  }

  if (!jcamp) {
    // compatibility with old approach
    if (
      action.value.jcampTemperature &&
      action.value.jcampTemperature.filename
    ) {
      jcamp += await API.cache('roc').getAttachment(
        { _id: sampleUUID },
        action.value.jcampTemperature.filename
      );
    }

    if (action.value.jcampTime && action.value.jcampTime.filename) {
      jcamp +=
        '\n' +
        (await API.cache('roc').getAttachment(
          { _id: sampleUUID },
          action.value.jcampTime.filename
        ));
    }
  }

  if (jcamp) {
    let spectrum = ExtendedCommonSpectrum.fromJcamp(jcamp, {
      id: spectrumUUID,
      label: spectrumID
    });

    analysesManager.addAnalysis(spectrum);

    let index = analysesManager.getAnalysisIndex(spectrumUUID);
    selectedSpectra[index] = {
      id: spectrumUUID,
      code: sampleID,
      label: spectrumID,
      index: action.value.__name + '',
      spectrum: JSON.parse(JSON.stringify(action.value)),
      color: colors[index % nbColors],
      display: true,
      toc: JSON.parse(JSON.stringify(API.getData('currentSampleTOC')))
    };
    return spectrum;
  }
}

function getSampleUUID(entry) {
  while ((entry = entry.__parent)) {
    if (entry._id) return entry._id;
    if (entry.value && entry.value._id) return entry.value._id;
  }
  return '';
}

function getSpectrumUUID(entry) {
  return getSampleUUID(entry) + '_' + entry.__name;
}

function showAllSpectra() {
  let selectedSpectra = API.getData('selectedSpectra');
  for (let spectrum of selectedSpectra) {
    spectrum.display = true;
  }
  API.getData('selectedSpectra').triggerChange();
}

function hideAllSpectra() {
  let selectedSpectra = API.getData('selectedSpectra');
  for (let spectrum of selectedSpectra) {
    spectrum.display = false;
  }
  API.getData('selectedSpectra').triggerChange();
}

function removeAllSpectra() {
  const analysesManager = API.cache('analysesManager');
  analysesManager.removeAllAnalyses();
  let selectedSpectra = API.getData('selectedSpectra');
  selectedSpectra.length = 0;
  selectedSpectra.triggerChange();
}

function removeSpectrum(action) {
  const analysesManager = API.cache('analysesManager');
  const selectedSpectra = API.getData('selectedSpectra');
  let spectrumUUID = String(action.value.id);
  analysesManager.removeAnalysis(spectrumUUID);
  for (let i = 0; i < selectedSpectra.length; i++) {
    if (String(selectedSpectra[i].id) === spectrumUUID) {
      selectedSpectra.splice(i, 1);
      break;
    }
  }
  selectedSpectra.triggerChange();
}

function showSpectra() {
  let selectedSpectra = API.getData('selectedSpectra');
  let currentlySelectedSpectra = API.getData('currentlySelectedSpectra');
  for (let currentlySelectedSpectrum of currentlySelectedSpectra) {
    let spectrum = selectedSpectra.filter(
      (spectrum) => String(spectrum.id) === String(currentlySelectedSpectrum.id)
    )[0];
    spectrum.display = true;
  }
  API.getData('selectedSpectra').triggerChange();
}

function showOnlySpectra() {
  let selectedSpectra = API.getData('selectedSpectra');
  if (!Array.isArray(selectedSpectra)) return;
  for (let spectrum of selectedSpectra) {
    spectrum.display = false;
  }
  let currentlySelectedSpectra = API.getData('currentlySelectedSpectra');
  for (let currentlySelectedSpectrum of currentlySelectedSpectra) {
    let spectrum = selectedSpectra.filter(
      (spectrum) => String(spectrum.id) === String(currentlySelectedSpectrum.id)
    )[0];
    spectrum.display = true;
  }
  API.getData('selectedSpectra').triggerChange();
}

function hideSpectra() {
  let selectedSpectra = API.getData('selectedSpectra');
  let currentlySelectedSpectra = API.getData('currentlySelectedSpectra');
  for (let currentlySelectedSpectrum of currentlySelectedSpectra) {
    let spectrum = selectedSpectra.filter(
      (spectrum) => String(spectrum.id) === String(currentlySelectedSpectrum.id)
    )[0];
    spectrum.display = false;
  }
  API.getData('selectedSpectra').triggerChange();
}

module.exports = processActions;
