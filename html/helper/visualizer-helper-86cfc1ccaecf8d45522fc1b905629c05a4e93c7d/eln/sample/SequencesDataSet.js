// this class is not really related to a sampleToc but can be used for any TOC

import API from 'src/util/api';
import UI from 'src/util/ui';
import _ from 'lodash';
import Versioning from 'src/util/versioning';
import Color from 'src/util/color';

import md5 from '../../util/md5';

const SequencesConfigs = {
  Nucleic: {
    tocFilter: (entry) => entry.value.nbNucleic && !entry.value.hidden,
    tocCallback: (entry) => {
      entry.value.nbSequences = entry.value.nbNucleic;
    },
    getSequences: (sample) => {
      if (
        sample &&
        sample.$content &&
        sample.$content.biology &&
        Array.isArray(sample.$content.biology.nucleic)
      ) {
        let sequences = sample.$content.biology.nucleic;
        return sequences;
      } else {
        return [];
      }
    },
  },
  Peptidic: {
    tocFilter: (entry) => entry.value.nbPeptidic && !entry.value.hidden,
    tocCallback: (entry) => {
      entry.value.nbSequences = entry.value.nbPeptidic;
    },
    getSequences: (sample) => {
      if (
        sample &&
        sample.$content &&
        sample.$content.biology &&
        Array.isArray(sample.$content.biology.peptidic)
      ) {
        let sequences = sample.$content.biology.peptidic;
        return sequences;
      } else {
        return [];
      }
    },
  },
};

class SequencesDataSet {
  constructor(roc, sampleToc, options = {}) {
    this.roc = roc;
    this.sampleToc = sampleToc;
    this.spectraConfig = undefined;
    this.defaultAttributes = options.defaultAttributes || {};
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

    var possibleAnalysis = Object.keys(SequencesConfigs);
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

    this.spectraConfig = SequencesConfigs[defaultAnalysis];

    await this.refresh();

    let mainData = Versioning.getData();
    mainData.onChange((evt) => {
      if (evt.jpath[0] === varName) {
        localStorage.setItem(cookieName, analysisKind.analysis);
        const selectedSequences = API.getData('selectedSequences');
        selectedSequences.length = 0;
        selectedSequences.triggerChange();
        this.spectraConfig = SequencesConfigs[String(analysisKind.analysis)];
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
      case 'showOnlySpectra':
        this.showOnlySpectra();
        break;
      case 'forceRecolor': {
        const selectedSequences = API.getData('selectedSequences');
        selectedSequences.forEach((sequence) => (sequence.color = ''));
        recolor(selectedSequences);
        selectedSequences.triggerChange();
        break;
      }
      case 'selectCategory': {
        const selectedSequences = API.getData('selectedSequences');
        let firstSpectrum = DataObject.resurrect(selectedSequences[0]);

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

        for (let sequence of selectedSequences) {
          sequence.category = getJpath(sequence);
        }
        selectedSequences.triggerChange();
      }
      case 'showSpectra':
        this.showSpectra();
        break;
      case 'showAllSpectra':
        this.showAllSpectra();
        break;
      case 'clearSelectedSamples':
        {
          let selectedSequences = API.getData('selectedSequences');
          selectedSequences.length = 0;
          selectedSequences.triggerChange();
        }
        break;
      case 'addSelectedSamples':
        await this.addSelectedSamples(API.getData('tocSelected').resurrect());
        break;
      case 'addSample':
        await this.addSelectedSamples([action.value.resurrect()]);
        break;
      case 'addSpectrum':
        await this.addSpectrum(
          API.getData('tocClicked').resurrect(),
          action.value.resurrect(),
        );
        break;
      default:
    }
  }

  async clickedSample(samples) {
    if (samples.length !== 1) {
      API.createData('sequences', []);
      return;
    }
    let uuid = String(samples[0].id);
    let data = await this.roc.document(uuid, { varName: 'linkedSample' });
    let sequences = this.spectraConfig.getSequences(data);
    API.createData('sequences', sequences);
  }

  showAllSpectra() {
    let selectedSequences = API.getData('selectedSequences');
    for (let sequence of selectedSequences) {
      sequence.display = true;
    }
    API.getData('selectedSequences').triggerChange();
  }

  hideAllSpectra() {
    let selectedSequences = API.getData('selectedSequences');
    for (let sequence of selectedSequences) {
      sequence.display = false;
    }
    API.getData('selectedSequences').triggerChange();
  }

  showSpectra() {
    let selectedSequences = API.getData('selectedSequences');
    let currentlySelectedSpectra = API.getData('currentlySelectedSpectra');
    for (let currentlySelectedSpectrum of currentlySelectedSpectra) {
      let sequence = selectedSequences.filter(
        (sequence) =>
          String(sequence.id) === String(currentlySelectedSpectrum.id),
      )[0];
      sequence.display = true;
    }
    API.getData('selectedSequences').triggerChange();
  }

  showOnlySpectra() {
    let selectedSequences = API.getData('selectedSequences');
    if (!Array.isArray(selectedSequences)) return;
    for (let sequence of selectedSequences) {
      sequence.display = false;
    }
    let currentlySelectedSpectra = API.getData('currentlySelectedSpectra');
    for (let currentlySelectedSpectrum of currentlySelectedSpectra) {
      let sequence = selectedSequences.filter(
        (sequence) =>
          String(sequence.id) === String(currentlySelectedSpectrum.id),
      )[0];
      sequence.display = true;
    }
    API.getData('selectedSequences').triggerChange();
  }

  hideSpectra() {
    let selectedSequences = API.getData('selectedSequences');
    let currentlySelectedSpectra = API.getData('currentlySelectedSpectra');
    for (let currentlySelectedSpectrum of currentlySelectedSpectra) {
      let sequence = selectedSequences.filter(
        (sequence) =>
          String(sequence.id) === String(currentlySelectedSpectrum.id),
      )[0];
      sequence.display = false;
    }
    API.getData('selectedSequences').triggerChange();
  }

  addSpectrum(tocEntry, sequence) {
    let selectedSequences = API.getData('selectedSequences');
    this.addSequenceToSelected(sequence, tocEntry, selectedSequences);
    recolor(selectedSequences);
    selectedSequences.triggerChange();
  }

  async addSelectedSamples(tocSelected) {
    let selectedSequences = API.getData('selectedSequences');
    // count the number of sampleIDs to determine the number of colros
    let promises = [];
    for (let tocEntry of tocSelected) {
      promises.push(
        this.roc.document(tocEntry.id).then((sample) => {
          let sequences = this.spectraConfig.getSequences(sample);
          console.log({ sequences });
          for (let sequence of sequences) {
            if (Array.isArray(sequence.seq)) {
              for (let seq of sequence.seq) {
                this.addSequenceToSelected(seq, tocEntry, selectedSequences);
              }
            }
          }
        }),
      );
    }
    await Promise.all(promises);
    recolor(selectedSequences);
    console.log(selectedSequences);
    selectedSequences.triggerChange();
  }

  async addSequenceToSelected(seq, tocEntry, selectedSequences) {
    if (seq.sequence) {
      let hash = md5(seq.sequence).substring(0, 8);
      let sequenceID = String(`${tocEntry.value.reference} / ${hash}`);
      let sampleID = String(tocEntry.id);
      if (
        selectedSequences.filter(
          (sequence) => String(sequence.id) === sequenceID,
        ).length > 0
      ) {
        return;
      }
      let sequence = {
        sequence: seq.sequence,
      };
      sequence.sampleID = sampleID;
      sequence.id = sequenceID;
      sequence.display = true;
      for (let key in this.defaultAttributes) {
        sequence[key] = this.defaultAttributes[key];
      }
      sequence.sampleCode = tocEntry.key.slice(1).join('_');
      sequence.toc = tocEntry;
      sequence.sequence = seq.sequence.replace(/[^A-Za-z]/g, '');
      sequence.category = sequence.sampleCode;
      sequence._highlight = sequenceID;
      selectedSequences.push(sequence);
    }
    console.log({ selectedSequences });
  }
}

function recolor(selectedSequences) {
  // need to count the categories
  let categoryColors = {};
  let existingColors = 0;
  for (let sequence of selectedSequences) {
    let category = String(sequence.category);
    if (categoryColors[category] === undefined) {
      if (sequence.color) {
        categoryColors[String(sequence.category)] = sequence.color;
        existingColors++;
      } else {
        categoryColors[String(sequence.category)] = '';
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
  for (let sequence of selectedSequences) {
    if (!sequence.color) {
      sequence.color = categoryColors[String(sequence.category)];
    }
  }
}

module.exports = SequencesDataSet;
