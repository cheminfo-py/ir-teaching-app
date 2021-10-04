import API from 'src/util/api';
import IDB from 'src/util/IDBKeyValue';

import ExpandableMolecule from './ExpandableMolecule';
import MF from './MF';
import elnPlugin from './libs/elnPlugin';

const idb = new IDB('external-samples');

const defaultOptions = {
  varName: 'sample'
};

class Sample {
  constructor(sample, options) {
    // make sure we don't copy attachment metadata
    const s = sample.$content
      ? {
          $content: {
            general: sample.$content.general,
            spectra: {
              nmr: [],
              mass: [],
              ir: [],
              chromatogram: []
            },
            identifier: sample.$content.identifier,
            stock: sample.$content.stock
          }
        }
      : {
          $content: {
            general: {
              title: '',
              description: '',
              mf: '',
              molfile: ''
            },
            spectra: {
              nmr: [],
              mass: [],
              ir: [],
              chromatogram: []
            },
            image: []
          }
        };

    this.sample = JSON.parse(JSON.stringify(s));

    this.options = Object.assign({}, defaultOptions, options);
    Object.assign(this.sample, this.options.sample);
    this._init();
  }

  _loadSample(sample) {
    this.sample = sample;
    var sampleVar = API.getVar(this.options.varName);

    API.setVariable('sampleCode', sampleVar, ['$id', 0]);
    API.setVariable('batchCode', sampleVar, ['$id', 1]);
    API.setVariable('content', sampleVar, ['$content']);
    API.setVariable('general', sampleVar, ['$content', 'general']);
    API.setVariable('molfile', sampleVar, ['$content', 'general', 'molfile']);
    API.setVariable('mf', sampleVar, ['$content', 'general', 'mf']);
    API.setVariable('mw', sampleVar, ['$content', 'general', 'mw']);
    API.setVariable('em', sampleVar, ['$content', 'general', 'em']);
    API.setVariable('mass', sampleVar, ['$content', 'spectra', 'mass']);
    API.setVariable('nmr', sampleVar, ['$content', 'spectra', 'nmr']);
    API.setVariable('ir', sampleVar, ['$content', 'spectra', 'ir']);
    API.setVariable('chromatogram', sampleVar, [
      '$content',
      'spectra',
      'chromatogram'
    ]);
    API.setVariable('description', sampleVar, [
      '$content',
      'general',
      'description'
    ]);
    API.setVariable('title', sampleVar, ['$content', 'general', 'title']);
    API.setVariable('iupac', sampleVar, ['$content', 'general', 'iupac']);
    API.setVariable('image', sampleVar, ['$content', 'image']);

    this.expandableMolecule = new ExpandableMolecule(this.sample, this.options);
    this.mf = new MF(this.sample);
    this.mf.fromMF();

    this.onChange = (event) => {
      var jpathStr = event.jpath.join('.');

      if (jpathStr.replace(/\.\d+\..*/, '') === '$content.spectra.nmr') {
        this.nmr1dManager.updateIntegralOptions();
      }

      switch (event.jpath.join('.')) {
        case '$content.general.molfile':
          this.mf.fromMolfile();
          break;
        case '$content.general.mf':
          try {
            this.mf.fromMF();
          } catch (e) {
            // ignore
          }
          break;
        default:
          break;
      }

      const contentString = JSON.stringify(this.sample);
      if (contentString !== this.contentString && this.options.trackId) {
        this.contentString = contentString;
        idb.set(this.options.trackId, JSON.parse(contentString));
      }
    };

    this.bindChange();
  }

  async _init() {
    this._initialized = new Promise(async (resolve) => {
      var sample;
      if (this.options.trackId) {
        try {
          sample = await idb.get(this.options.trackId);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          sample = this.sample;
          this.options.trackId = false;
        }
      }
      sample = await API.createData(
        this.options.varName,
        sample || this.sample
      );

      if (sample.$content.general.molfile) {
        // Let the mf be calculated from the molfile
        delete sample.$content.general.mf;
      } else {
        sample.$content.general.molfile = ''; // can not be edited otherwise
      }
      this._loadSample(sample);
      resolve();
    });
  }

  bindChange() {
    this.sample.unbindChange(this.onChange);
    this.sample.onChange(this.onChange);
  }

  unbindChange() {
    this.sample.unbindChange(this.onChange);
  }

  async handleDrop(name, askType, options = {}) {
    let { converters = {}, autoJcamp, autoKind } = options;
    if (!name) {
      throw new Error('handleDrop expects a variable name');
    }
    name = String(name);
    // maps name of variable to type of data
    var types = {
      droppedNmr: 'nmr',
      droppedIR: 'ir',
      droppedUV: 'uv',
      droppedIV: 'iv',
      droppedMS: 'mass',
      droppedChrom: 'chromatogram',
      droppedXray: 'xray',
      droppedXRD: 'xrd',
      droppedXPS: 'xps',
      droppedTGA: 'thermogravimetricAnalysis',
      droppedDSC: 'differentialScanningCalorimetry',
      droppedHg: 'hgPorosimetry',
      droppedDCS: 'differentialCentrifugalSedimentation',
      droppedXray: 'xray',
      droppedXRD: 'xrd',
      droppedXRF: 'xrf',
      droppedXPS: 'xps',
      droppedImage: 'image',
      droppedGenbank: 'genbank'
    };

    if (!types[name]) {
      throw new Error('Unexpected variable name');
    }

    // Dropped data can be an array
    // Expecting format as from drag and drop module
    // we store the data in the view
    var droppedDatas = API.getData(name);
    droppedDatas = droppedDatas.file || droppedDatas.str;
    for (let droppedData of droppedDatas) {
      if (!droppedData.filename.includes('.')) droppedData.filename += '.txt';

      const extension = droppedData.filename.replace(/.*\./, '').toLowerCase();
      let kind = extension;
      if (autoKind) {
        kind = autoKind(droppedData) || kind;
      }

      if (converters[kind]) {
        autoJcamp = false;

        let converted = await converters[kind](droppedData.content);
        if (!Array.isArray(converted)) {
          converted = [converted];
        }

        for (let i = 1; i < converted.length; i++) {
          newData.push({
            filename: droppedData.filename.replace(
              '.' + extension,
              '_' + i + '.jdx'
            ),
            mimetype: 'chemical/x-jcamp-dx',
            contentType: 'chemical/x-jcamp-dx',
            encoding: 'utf8',
            content: converted[i]
          });
        }

        droppedData.filename = droppedData.filename.replace(
          '.' + extension,
          '.jdx'
        );
        droppedData.mimetype = 'chemical/x-jcamp-dx';
        droppedData.contentType = 'chemical/x-jcamp-dx';
        droppedData.encoding = 'utf8';
        droppedData.content = converted[0];
      }

      elnPlugin.process(
        types[name],
        this.sample.$content,
        droppedData,
        {},
        { keepContent: true }
      );
    }
    this.sample.triggerChange();
  }

  handleAction(action) {
    if (!action) return;
    switch (action.name) {
      case 'unattach':
        {
          let value = action.value;
          if (value && value.__parent) {
            for (let i = 0; i < value.__parent.length; i++) {
              let row = value.__parent[i];
              if (row === value) {
                value.__parent.splice(i, 1);
                value.__parent.triggerChange();
                return;
              }
            }
          }
        }
        break;
      default:
    }
    if (this.expandableMolecule) {
      this.expandableMolecule.handleAction(action);
    }
  }
}

module.exports = Sample;
