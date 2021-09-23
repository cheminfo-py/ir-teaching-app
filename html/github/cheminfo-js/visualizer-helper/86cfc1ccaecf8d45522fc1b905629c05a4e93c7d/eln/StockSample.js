import API from 'src/util/api';

import ExpandableMolecule from './ExpandableMolecule';
import MF from './MF';

const defaultOptions = {
  varName: 'sample',
};

class Sample {
  constructor(sample, options) {
    // make sure we don't copy attachment metadata
    this.sample = sample || {
      $content: {
        general: {},
      },
    };

    this.options = Object.assign({}, defaultOptions, options);
    this._init();
  }

  _loadSample() {
    var sampleVar = API.getVar(this.options.varName);

    API.setVariable('sampleCode', sampleVar, ['$id', 0]);
    API.setVariable('batchCode', sampleVar, ['$id', 1]);
    API.setVariable('content', sampleVar, ['$content']);
    API.setVariable('general', sampleVar, ['$content', 'general']);
    API.setVariable('molfile', sampleVar, ['$content', 'general', 'molfile']);
    API.setVariable('mf', sampleVar, ['$content', 'general', 'mf']);
    API.setVariable('mw', sampleVar, ['$content', 'general', 'mw']);
    API.setVariable('em', sampleVar, ['$content', 'general', 'em']);
    API.setVariable('description', sampleVar, [
      '$content',
      'general',
      'description',
    ]);
    API.setVariable('iupac', sampleVar, ['$content', 'general', 'iupac']);

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
    };

    this.bindChange();
  }

  async _init() {
    this._initialized = new Promise(async (resolve) => {
      this.sample = await API.createData(this.options.varName, this.sample);
      this._loadSample();
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

  handleAction(action) {
    if (!action) return;
    if (this.expandableMolecule) {
      this.expandableMolecule.handleAction(action);
    }
  }

  updateSample(sample) {
    const general = sample.$content.general;
    const stock = sample.$content.stock;
    const identifier = sample.$content.identifier;
    // This part will handle the mf and mw
    this.expandableMolecule.setMolfile(general.molfile);

    if (general) {
      this.sample.setChildSync(
        ['$content', 'general', 'description'],
        general.description
      );
      this.sample.setChildSync(['$content', 'general', 'name'], general.name);
    }
    if (identifier) {
      this.sample.setChildSync(
        ['$content', 'identifier', 'cas'],
        identifier.cas
      );
    }
    if (stock) {
      this.sample.setChildSync(
        ['$content', 'stock', 'catalogNumber'],
        stock.catalogNumber
      );
      this.sample.setChildSync(
        ['$content', 'stock', 'quantity'],
        stock.quantity
      );
      this.sample.setChildSync(['$content', 'general', 'purity'], stock.purity);
      this.sample.setChildSync(
        ['$content', 'stock', 'supplier'],
        stock.supplier
      );
    }
  }
}

module.exports = Sample;
