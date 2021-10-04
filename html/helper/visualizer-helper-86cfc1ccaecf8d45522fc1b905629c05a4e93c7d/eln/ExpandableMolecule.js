import API from 'src/util/api';
import UI from 'src/util/ui';

import OCLE from './libs/OCLE';

const noop = () => {
  /* noop */
};

const defaultOptions = {
  onMolfileChanged: noop,
  calculateDiastereotopicID: false,
  maxDiastereotopicCalculationTime: 3000,
};

class ExpandableMolecule {
  constructor(sample, options) {
    this.options = Object.assign({}, defaultOptions, options);
    this.sample = sample;
    this.molfile = String(
      this.sample.getChildSync(['$content', 'general', 'molfile']) || '',
    );
    this.idCode = OCLE.Molecule.fromMolfile(this.molfile).getIDCode();
    this.expandedHydrogens = false;
    this.jsmeEditionMode = false;
    this.calculateDiastereotopicID = this.options.calculateDiastereotopicID;
    this.maxDiastereotopicCalculationTime = this.options.maxDiastereotopicCalculationTime;

    this.onChange = (event) => {
      // is this really a modification ? or a loop event ...
      // need to compare former oclID with new oclID

      var newMolecule = OCLE.Molecule.fromMolfile(`${event.target}`);

      var oclID = newMolecule.getIDCodeAndCoordinates();
      if (oclID.idCode !== this.idCode) {
        this.idCode = oclID.idCode;
        this.molfile = `${event.target}`;
        this.sample.setChildSync(
          ['$content', 'general', 'molfile'],
          this.molfile,
        );
        this.sample.setChildSync(['$content', 'general', 'ocl'], {
          value: oclID.idCode,
          coordinates: oclID.coordinates,
          index: newMolecule.getIndex(),
        });
      }
      this.options.onMolfileChanged(this);
      this.updateHistory();
    };

    API.createData('editableMolfile', this.molfile).then((editableMolfile) => {
      this.editableMolfile = editableMolfile;
      this.bindChange();
      this.createViewVariable();
    });
  }

  bindChange() {
    this.editableMolfile.onChange(this.onChange);
  }

  unbindChange() {
    this.editableMolfile.unbindChange(this.onChange);
  }

  updateHistory() {
    let history = JSON.parse(localStorage.getItem('moleculesHistory') || '[]');
    let exists = false;
    let uuid = this.sample._id;
    let entry;
    for (entry of history) {
      if (entry.uuid === uuid) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      entry = { uuid };
      history.push(entry);
    }
    entry.timestamp = Date.now();
    entry.idCode = this.idCode;
    entry.molfile = this.molfile;
    if (this.sample.$id) {
      entry.id = DataObject.resurrect(this.sample.$id)
        .filter((a) => a)
        .join(' ');
    }
    // we sort by timestamp
    history = history.filter((entry) => entry.idCode !== 'd@');
    history.sort((a, b) => b.timestamp - a.timestamp);
    history.slice(0, 20);
    localStorage.setItem('moleculesHistory', JSON.stringify(history));
  }

  toggleJSMEEdition() {
    this.jsmeEditionMode = !this.jsmeEditionMode;
    this.expandedHydrogens = false;
    let options = {
      prefs: [],
    };

    if (this.jsmeEditionMode) {
      options.prefs.push('nodepict');
      API.createData('editableMolfile', this.molfile);
    } else {
      options.prefs.push('depict');
      this.createViewVariable();
    }
    API.doAction('setJSMEOptions', options);
  }

  setExpandedHydrogens() {
    if (this.jsmeEditionMode) {
      this.toggleJSMEEdition();
    } else {
      this.expandedHydrogens = !this.expandedHydrogens;
    }
    this.createViewVariable();
  }

  /*
    We create the view variable with or without expanded hydrogens
     */
  createViewVariable() {
    var molecule = OCLE.Molecule.fromMolfile(this.molfile);
    let calculateDiastereotopicID = this.calculateDiastereotopicID;
    if (calculateDiastereotopicID) {
      // is it reasonnable to calculate the DiastereotopicID. We check the time it will take

      var start = Date.now();
      molecule.getCompactCopy().getIDCode();
      let expected = (Date.now() - start) * 4 * molecule.getAllAtoms();
      if (expected > this.maxDiastereotopicCalculationTime) {
        // eslint-disable-next-line no-console
        console.log(
          'The diastereotopic calculation is expected to last more than 3s. No way to assign molecule.',
          this.maxDiastereotopicCalculationTime,
        );
        calculateDiastereotopicID = false;
      }
    }
    if (this.expandedHydrogens) {
      molecule.addImplicitHydrogens();
      let viewMolfileExpandedH = molecule.toVisualizerMolfile({
        diastereotopic: calculateDiastereotopicID,
      });
      API.createData('viewMolfileExpandedH', viewMolfileExpandedH);
    } else {
      let viewMolfile = molecule.toVisualizerMolfile({
        heavyAtomHydrogen: true,
        diastereotopic: calculateDiastereotopicID,
      });
      API.createData('viewMolfile', viewMolfile);
    }
  }

  setMolfile(molfile) {
    const editableMolfile = API.getData('editableMolfile');
    if (editableMolfile) editableMolfile.setValue(molfile || '');
  }

  async loadMolfileFromHistory() {
    let history = JSON.parse(localStorage.getItem('moleculesHistory') || '[]');
    let molecule = await UI.choose(history, {
      autoSelect: false,
      noConfirmation: true,
      returnRow: true,
      dialog: {
        width: 600,
        height: 800,
      },
      columns: [
        {
          id: 'id',
          name: 'Reference',
          jpath: ['id'],
          maxWidth: 100,
        },
        {
          id: 'molfile',
          name: 'Structure',
          jpath: ['molfile'],
          rendererOptions: {
            forceType: 'mol2d',
          },
        },
      ],
      idField: 'uuid',
      slick: {
        rowHeight: 140,
      },
    });
    if (molecule) {
      this.setMolfile(String(molecule.molfile));
    }
  }

  handleAction(action) {
    if (!action) return false;
    switch (action.name) {
      case 'toggleJSMEEdition':
        this.toggleJSMEEdition(!this.jsmeEditionMode);
        break;
      case 'clearMolfile':
        var molfile = API.getData('editableMolfile');
        molfile.setValue('');
        break;
      case 'swapHydrogens':
        this.setExpandedHydrogens();
        break;
      case 'loadMolfileFromHistory':
        this.loadMolfileFromHistory();
        break;
      default:
        return false;
    }
    return true;
  }
}

module.exports = ExpandableMolecule;
