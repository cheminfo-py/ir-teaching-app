// this class is not really related to a sampleToc but can be used for any TOC

import API from 'src/util/api';
import UI from 'src/util/ui';
import _ from 'lodash';
import Versioning from 'src/util/versioning';
import Color from 'src/util/color';

const SpectraConfigs = {
  IR: {
    tocFilter: (entry) => entry.value.nbIR && !entry.value.hidden,
    tocCallback: (entry) => {
      entry.value.nbSpectra = entry.value.nbIR;
    },
    getSpectra: (sample) => {
      if (
        sample &&
        sample.$content &&
        sample.$content.spectra &&
        Array.isArray(sample.$content.spectra.ir)
      ) {
        let spectra = sample.$content.spectra.ir;
        return spectra;
      } else {
        return [];
      }
    },
    chartPrefs: {
      yLabel: 'Absorbance',
      displayYAxis: ['display', 'main', 'sec'],
      xLabel: 'Wavelength [cm-1]',
      displayXAxis: ['display', 'flip', 'main', 'sec'],
    },
  },
  Mass: {
    tocFilter: (entry) => entry.value.nbMass && !entry.value.hidden,
    tocCallback: (entry) => {
      entry.value.nbSpectra = entry.value.nbMass;
    },
    getSpectra: (sample) => {
      if (
        sample &&
        sample.$content &&
        sample.$content.spectra &&
        Array.isArray(sample.$content.spectra.mass)
      ) {
        let spectra = sample.$content.spectra.mass;
        return spectra;
      } else {
        return [];
      }
    },
    chartPrefs: {
      yLabel: 'Intensity',
      displayYAxis: ['display', 'main', 'sec'],
      xLabel: 'm/z',
      displayXAxis: ['display', 'main', 'sec'],
    },
  },
  Raman: {
    tocFilter: (entry) => entry.value.nbRaman && !entry.value.hidden,
    tocCallback: (entry) => {
      entry.value.nbSpectra = entry.value.nbRaman;
    },
    getSpectra: (sample) => {
      if (
        sample &&
        sample.$content &&
        sample.$content.spectra &&
        Array.isArray(sample.$content.spectra.raman)
      ) {
        let spectra = sample.$content.spectra.raman;
        return spectra;
      } else {
        return [];
      }
    },
    chartPrefs: {
      yLabel: 'Absorbance',
      displayYAxis: ['display', 'main', 'sec'],
      xLabel: 'Wavelength [cm-1]',
      displayXAxis: ['display', 'flip', 'main', 'sec'],
    },
  },
  TGA: {
    tocFilter: (entry) => entry.value.nbTGA && !entry.value.hidden,
    tocCallback: (entry) => {
      entry.value.nbSpectra = entry.value.nbTGA;
    },
    getSpectra: (sample) => {
      if (
        sample &&
        sample.$content &&
        sample.$content.spectra.thermogravimetricAnalysis &&
        Array.isArray(sample.$content.spectra.thermogravimetricAnalysis)
      ) {
        let spectra = sample.$content.spectra.thermogravimetricAnalysis;
        return spectra;
      } else {
        return [];
      }
    },
    chartPrefs: {
      yLabel: 'Weight',
      displayYAxis: ['display', 'main', 'sec'],
      xLabel: 'Temperature',
      displayXAxis: ['display', 'main', 'sec'],
    },
  },
  DSC: {
    tocFilter: (entry) => entry.value.nbDSC && !entry.value.hidden,
    tocCallback: (entry) => {
      entry.value.nbSpectra = entry.value.nbDSC;
    },
    getSpectra: (sample) => {
      if (
        sample &&
        sample.$content &&
        sample.$content.spectra &&
        Array.isArray(sample.$content.spectra.differentialScanningCalorimetry)
      ) {
        let spectra = sample.$content.spectra.differenqtialScanningCalorimetry;
        return spectra;
      } else {
        return [];
      }
    },
    chartPrefs: {
      yLabel: 'Heat flow',
      displayYAxis: ['display', 'main', 'sec'],
      xLabel: 'Temperature',
      displayXAxis: ['display', 'main', 'sec'],
    },
  },
  '1H NMR': {
    tocFilter: (entry) => entry.value.nb1h && !entry.value.hidden,
    tocCallback: (entry) => {
      entry.value.nbSpectra = entry.value.nb1h;
    },
    getSpectra: (sample) => {
      if (
        sample &&
        sample.$content &&
        sample.$content.spectra &&
        Array.isArray(sample.$content.spectra.nmr)
      ) {
        let spectra = sample.$content.spectra.nmr;
        spectra = spectra.filter(
          (spectrum) =>
            spectrum.dimension === 1 && spectrum.nucleus[0] === '1H',
        );
        spectra.forEach((spectrum) => {
          let info = [];
          if (spectrum.nucleus) info.push(spectrum.nucleus[0]);
          if (spectrum.experiment) info.push(spectrum.experiment);
          if (spectrum.solvent) info.push(spectrum.solvent);
          if (spectrum.frequency) info.push(spectrum.frequency.toFixed(0));
          spectrum.info = info.join(', ');
        });
        return spectra;
      } else {
        return [];
      }
    },
    chartPrefs: {
      yLabel: 'Intensity',
      displayYAxis: ['main', 'sec'],
      xLabel: 'δ [ppm]',
      displayXAxis: ['display', 'flip', 'main', 'sec'],
    },
  },
  '13C NMR': {
    tocFilter: (entry) => entry.value.nb13c && !entry.value.hidden,
    tocCallback: (entry) => {
      entry.value.nbSpectra = entry.value.nb1h;
    },
    getSpectra: (sample) => {
      if (
        sample &&
        sample.$content &&
        sample.$content.spectra &&
        Array.isArray(sample.$content.spectra.nmr)
      ) {
        let spectra = sample.$content.spectra.nmr;
        spectra = spectra.filter(
          (spectrum) =>
            spectrum.dimension === 1 && spectrum.nucleus[0] === '13C',
        );
        spectra.forEach((spectrum) => {
          let info = [];
          if (spectrum.nucleus) info.push(spectrum.nucleus[0]);
          if (spectrum.experiment) info.push(spectrum.experiment);
          if (spectrum.solvent) info.push(spectrum.solvent);
          if (spectrum.frequency) info.push(spectrum.frequency.toFixed(0));
          spectrum.info = info.join(', ');
        });
        return spectra;
      } else {
        return [];
      }
    },
    chartPrefs: {
      yLabel: 'Intensity',
      displayYAxis: ['main', 'sec'],
      xLabel: 'δ [ppm]',
      displayXAxis: ['display', 'flip', 'main', 'sec'],
    },
  },
  Chromatography: {
    tocFilter: (entry) => entry.value.nbChromatogram && !entry.value.hidden,
    tocCallback: (entry) => {
      entry.value.nbSpectra = entry.value.nbChromatogram;
    },
    getSpectra: (sample) => {
      if (
        sample &&
        sample.$content &&
        sample.$content.spectra &&
        Array.isArray(sample.$content.spectra.chromatogram)
      ) {
        let spectra = sample.$content.spectra.chromatogram;
        return spectra;
      } else {
        return [];
      }
    },
    chartPrefs: {
      yLabel: 'Intensity',
      displayYAxis: ['main', 'sec'],
      xLabel: 'Time [s]',
      displayXAxis: ['display', 'main', 'sec'],
    },
  },
};

class SpectraDataSet {
  constructor(roc, sampleToc, options = {}) {
    this.roc = roc;
    this.sampleToc = sampleToc;
    this.spectraConfig = undefined;
    this.defaultAttributes = options.defaultAttributes || {};
  }

  getChartPrefs() {
    if (this.spectraConfig && this.spectraConfig.chartPrefs) {
      return this.spectraConfig.chartPrefs;
    }
    return {
      yLabel: 'Y axis',
      displayYAxis: ['display', 'main', 'sec'],
      xLabel: 'X axis',
      dislayXAxis: ['display', 'main', 'sec'],
    }
  }

  /**
   * @param {object} [options={}]
   * @param {string} [options.varName='analysisKind'] contains the name of the variable containing the form value
   * @param {string} [options.schemaVarName='analysisKindSchema'] contains the name of the variable containing the form schema
   * @return {string} the form to select group}
   */
  async initializeAnalysis(options = {}) {
    const {
      schemaVarName = 'analysisKindSchema',
      varName = 'analysisKind',
      cookieName = 'eln-default-analysis-kind',
    } = options;

    var possibleAnalysis = Object.keys(SpectraConfigs);
    var defaultAnalysis = localStorage.getItem(cookieName);
    if (possibleAnalysis.indexOf(defaultAnalysis) === -1) {
      defaultAnalysis = possibleAnalysis[0];
    }
    var schema = {
      type: 'object',
      properties: {
        analysis: {
          type: 'string',
          enum: possibleAnalysis,
          default: defaultAnalysis,
          required: true,
        },
      },
    };

    API.createData(schemaVarName, schema);

    let analysisKind = await API.createData(varName, {
      analysis: defaultAnalysis,
    });

    this.spectraConfig = SpectraConfigs[defaultAnalysis];

    await this.refresh();

    let mainData = Versioning.getData();
    mainData.onChange((evt) => {
      if (evt.jpath[0] === varName) {
        localStorage.setItem(cookieName, analysisKind.analysis);
        const spectraInDataset = API.getData('spectraInDataset');
        spectraInDataset.length = 0;
        spectraInDataset.triggerChange();
        const preferences = API.getData('preferences');
        if (preferences && preferences.normalization) {
          preferences.normalization.from = '';
          preferences.normalization.to = '';
          preferences.triggerChange();
          setTimeout(() => {
            preferences.normalization.from = undefined;
            preferences.normalization.to = undefined;
          }, 0);
        }
        this.spectraConfig = SpectraConfigs[String(analysisKind.analysis)];
        this.refresh();
      }
    });

    return analysisKind;
  }

  refresh() {
    if (!this.sampleToc) return;
    this.sampleToc.options.filter = this.spectraConfig.tocFilter;
    this.sampleToc.options.callback = this.spectraConfig.tocCallback;
    this.sampleToc.refresh();
  }

  async processAction(action) {
    console.log({ action });
    switch (action.name) {
      case 'resetMinMax':
        this.resetMinMax();
        break;
      case 'clickedSample':
        this.clickedSample(action.value);
        break;
      case 'refresh':
        this.refresh();
        break;
      case 'hideSpectra':
        this.hideSpectra();
        break;
      case 'hideAllSpectra':
        this.hideAllSpectra();
        break;
      case 'selectCurrentSpectraSelection':
        this.selectCurrentSpectraSelection();
        break;
      case 'forceRecolor': {
        const spectraInDataset = API.getData('spectraInDataset');
        spectraInDataset.forEach((spectrum) => (spectrum.color = ''));
        recolor(spectraInDataset);
        spectraInDataset.triggerChange();
        break;
      }
      case 'selectCategory': {
        const spectraInDataset = API.getData('spectraInDataset');
        let firstSpectrum = DataObject.resurrect(spectraInDataset[0]);

        let path = [];
        if (firstSpectrum.toc && firstSpectrum.toc.value) {
          firstSpectrum = firstSpectrum.toc.value;
          path = ['toc', 'value'];
        }

        let jpath = await UI.selectJpath(firstSpectrum, undefined, {
          height: 500,
        });
        if (!jpath) return;
        const getJpath = _.property([...path, ...jpath]);

        for (let spectrum of spectraInDataset) {
          spectrum.category = getJpath(spectrum);
        }
        spectraInDataset.triggerChange();
      }
      case 'addSpectraToSelection':
        this.addSpectraToSelection();
        break;
      case 'selectAllSpectra':
        this.selectAllSpectra();
        break;
      case 'clearSelectedSamples':
        {
          let spectraInDataset = API.getData('spectraInDataset');
          spectraInDataset.length = 0;
          spectraInDataset.triggerChange();
        }
        break;
      case 'addSelectedSamples':
        if (!API.getData('tocSelected')) {
          UI.showNotification('Please select at least one sample');
          return;
        }
        API.loading('loading', 'Loading spectra');
        await this.addSelectedSamples(API.getData('tocSelected').resurrect());
        API.stopLoading('loading');
        break;
      case 'addSample':
        API.loading('loading', 'Loading spectra');
        await this.addSelectedSamples([action.value.resurrect()]);
        API.stopLoading('loading');
        break;
      case 'addSpectrum':
        API.loading('loading', 'Loading spectra');
        await this.addSpectrum(
          API.getData('tocClicked').resurrect(),
          action.value.resurrect(),
        );
        API.stopLoading('loading');
        break;
      case 'addDirectSpectrum': // data are in memory in data property
        this.addDirectSpectrum(action.value.resurrect());
        break;
      case 'addDirectSpectra': // data are in memory in data property
        this.addDirectSpectra();
        break;
      default:
    }
  }

  async clickedSample(samples) {
    if (samples.length !== 1) {
      API.createData('spectra', []);
      return;
    }
    let uuid = String(samples[0].id);
    let data = await this.roc.document(uuid, { varName: 'linkedSample' });
    let spectra = this.spectraConfig.getSpectra(data);
    API.createData('spectra', spectra);
  }

  selectAllSpectra() {
    let spectraInDataset = API.getData('spectraInDataset');
    for (let spectrum of spectraInDataset) {
      spectrum.selected = true;
    }
    API.getData('spectraInDataset').triggerChange();
  }

  hideAllSpectra() {
    let spectraInDataset = API.getData('spectraInDataset');
    for (let spectrum of spectraInDataset) {
      spectrum.selected = false;
    }
    API.getData('spectraInDataset').triggerChange();
  }

  addSpectraToSelection() {
    let spectraInDataset = API.getData('spectraInDataset');
    let currentlySelectedSpectra = API.getData('currentlySelectedSpectra');
    for (let currentlySelectedSpectrum of currentlySelectedSpectra) {
      let spectrum = spectraInDataset.filter(
        (spectrum) =>
          String(spectrum.id) === String(currentlySelectedSpectrum.id),
      )[0];
      spectrum.selected = true;
    }
    API.getData('spectraInDataset').triggerChange();
  }

  selectCurrentSpectraSelection() {
    let spectraInDataset = API.getData('spectraInDataset');
    if (!Array.isArray(spectraInDataset)) return;
    for (let spectrum of spectraInDataset) {
      spectrum.selected = false;
    }
    let currentlySelectedSpectra = API.getData('currentlySelectedSpectra');
    for (let currentlySelectedSpectrum of currentlySelectedSpectra) {
      let spectrum = spectraInDataset.filter(
        (spectrum) =>
          String(spectrum.id) === String(currentlySelectedSpectrum.id),
      )[0];
      spectrum.selected = true;
    }
    API.getData('spectraInDataset').triggerChange();
  }

  hideSpectra() {
    let spectraInDataset = API.getData('spectraInDataset');
    let currentlySelectedSpectra = API.getData('currentlySelectedSpectra');
    for (let currentlySelectedSpectrum of currentlySelectedSpectra) {
      let spectrum = spectraInDataset.filter(
        (spectrum) =>
          String(spectrum.id) === String(currentlySelectedSpectrum.id),
      )[0];
      spectrum.selected = false;
    }
    API.getData('spectraInDataset').triggerChange();
  }

  addSpectrum(tocEntry, spectrum) {
    let spectraInDataset = API.getData('spectraInDataset');
    this.addSpectrumToSelected(spectrum, tocEntry, spectraInDataset);
    recolor(spectraInDataset);
    spectraInDataset.triggerChange();
  }

  addDirectSpectrum(spectrum) {
    let spectraInDataset = API.getData('spectraInDataset');
    console.log({ spectraInDataset });
    this.addDirectSpectrumToSelected(spectrum, spectraInDataset);
    recolor(spectraInDataset);
    spectraInDataset.triggerChange();
  }

  addDirectSpectra() {
    let selectedSpectra = API.getData('selectedSpectra') || [];
    if (selectedSpectra.length < 3) {
      selectedSpectra = API.getData('spectra').resurrect();
    } else {
      selectedSpectra = selectedSpectra.resurrect();
    }
    let spectraInDataset = API.getData('spectraInDataset');
    for (let spectrum of selectedSpectra) {
      this.addDirectSpectrumToSelected(spectrum, spectraInDataset);
    }
    recolor(spectraInDataset);
    spectraInDataset.triggerChange();
  }

  async addSelectedSamples(tocSelected) {
    let spectraInDataset = API.getData('spectraInDataset');
    // count the number of sampleIDs to determine the number of colros
    let promises = [];
    for (let tocEntry of tocSelected) {
      promises.push(
        this.roc.document(tocEntry.id).then((sample) => {
          let spectra = this.spectraConfig.getSpectra(sample);
          for (let spectrum of spectra) {
            if (spectrum.jcamp && spectrum.jcamp.filename) {
              this.addSpectrumToSelected(spectrum, tocEntry, spectraInDataset);
            }
          }
        }),
      );
    }
    await Promise.all(promises);
    recolor(spectraInDataset);
    spectraInDataset.triggerChange();
  }

  addDirectSpectrumToSelected(spectrum, spectraInDataset) {
    console.log(spectrum);
    if (spectrum.data) {
      let spectrumID = String(spectrum.id);
      let sampleID = String(spectrum.name);
      if (
        spectraInDataset.filter(
          (spectrum) => String(spectrum.id) === spectrumID,
        ).length > 0
      ) {
        return;
      }
      spectrum.sampleID = sampleID;
      spectrum.id = spectrumID;
      spectrum.selected = true;
      for (let key in this.defaultAttributes) {
        spectrum[key] = this.defaultAttributes[key];
      }

      spectrum.sampleCode = spectrum.id;
      spectrum.category = spectrum.sampleCode;
      spectrum._highlight = spectrumID;
      spectraInDataset.push(spectrum);
    }
  }

  addSpectrumToSelected(spectrum, tocEntry, spectraInDataset) {
    if (spectrum.jcamp) {
      API.loading('loading', 'Loading: ' + spectrum.jcamp.filename);
      let spectrumID = String(
        `${tocEntry.value.reference} / ${spectrum.jcamp.filename.replace(
          /.*\/(.*)\..*/,
          '$1',
        )}`,
      );
      let sampleID = String(tocEntry.id);
      if (
        spectraInDataset.filter(
          (spectrum) => String(spectrum.id) === spectrumID,
        ).length > 0
      ) {
        return;
      }
      spectrum.sampleID = sampleID;
      spectrum.id = spectrumID;
      spectrum.selected = true;
      for (let key in this.defaultAttributes) {
        spectrum[key] = this.defaultAttributes[key];
      }

      spectrum.sampleCode = tocEntry.key.slice(1).join('_');
      spectrum.toc = tocEntry;
      spectrum.category = spectrum.sampleCode;
      spectrum._highlight = spectrumID;
      spectraInDataset.push(spectrum);
    }
  }

  resetMinMax() {
    let boundary = API.cache('spectraProcessor').getNormalizedCommonBoundary();
    const preferences = API.getData('preferences');
    if (preferences && preferences.normalization) {
      preferences.normalization.from = boundary.x.min;
      preferences.normalization.to = boundary.x.max;
      preferences.triggerChange();
    }
  }

}

function recolor(spectraInDataset) {
  // need to count the categories
  let categoryColors = {};
  let existingColors = 0;
  for (let spectrum of spectraInDataset) {
    let category = String(spectrum.category);
    if (categoryColors[category] === undefined) {
      if (spectrum.color) {
        categoryColors[String(spectrum.category)] = spectrum.color;
        existingColors++;
      } else {
        categoryColors[String(spectrum.category)] = '';
      }
    }
  }

  let nbColors = Math.max(
    8,
    1 << Math.ceil(Math.log2(Object.keys(categoryColors).length)),
  );
  const colors = Color.getDistinctColorsAsString(nbColors);
  let i = existingColors;
  for (let key in categoryColors) {
    if (!categoryColors[key]) {
      categoryColors[key] = colors[i++];
    }
  }
  for (let spectrum of spectraInDataset) {
    if (!spectrum.color) {
      spectrum.color = categoryColors[String(spectrum.category)];
    }
  }
}

module.exports = SpectraDataSet;
