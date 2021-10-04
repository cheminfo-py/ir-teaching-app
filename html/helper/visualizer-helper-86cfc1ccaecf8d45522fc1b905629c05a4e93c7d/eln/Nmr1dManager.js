import fileSaver from 'file-saver';
import API from 'src/util/api';
import UI from 'src/util/ui';

import { getData } from './jpaths';
import SD from './libs/SD';
import * as GUI from './nmrGUI';
import MolecularFormula from './libs/MolecularFormula';

const Ranges = SD.Ranges;
const NMR = SD.NMR;

const nmr1hOndeTemplates = {
  full: {
    type: 'object',
    properties: {
      integral: {
        type: 'number',
        title: 'value to fit the spectrum integral',
        label: 'Integral'
      },
      noiseFactor: {
        type: 'number',
        title: 'Mutiplier of the auto-detected noise level',
        label: 'noiseFactor'
      },
      clean: {
        type: 'number',
        title: 'Delete signals with integration less than input value',
        label: 'clean'
      },
      compile: {
        type: 'boolean',
        title: 'Compile the multiplets',
        label: 'compile'
      },
      optimize: {
        type: 'boolean',
        title: 'Optimize the peaks to fit the spectrum',
        label: 'optimize'
      },
      integralFn: {
        type: 'string',
        title: 'Type of integration',
        label: 'Integral type',
        enum: ['sum', 'peaks']
      },
      type: {
        type: 'string',
        title: 'Nucleus',
        label: 'Nucleus',
        editable: false
      },
      removeImpurities: {
        type: 'object',
        label: 'Remove residual solvent, TMS and water',
        properties: {
          useIt: {
            type: 'boolean',
            label: 'Remove Impurities'
          },
          error: {
            type: 'number',
            label: 'Tolerance',
            title: 'Allowed error in ppm'
          }
        }
      }
    }
  },
  short: {
    type: 'object',
    properties: {
      integral: {
        type: 'number',
        title: 'Total integral value',
        label: 'Integral'
      },
      removeImpurities: {
        type: 'object',
        label: 'Remove solvent impurities',
        properties: {
          useIt: {
            type: 'boolean',
            label: 'Remove Impurities'
          },
          error: {
            type: 'number',
            label: 'Tolerance',
            title: 'Allowed error in ppm'
          }
        }
      }
    }
  }
};
API.cache('nmr1hOndeTemplates', nmr1hOndeTemplates);

class Nmr1dManager {
  constructor(sample) {
    this.spectra = {};
    this.sample = sample;
    this.previousNMR = undefined;
    this.initializeNMROptions();
  }

  handleAction(action) {
    switch (action.name) {
      case 'updateRanges': {
        this.updateIntegrals();
        break;
      }
      case 'downloadSVG': {
        var blob = new Blob([`${action.value}`], {
          type: 'application/jcamp-dx;charset=utf-8'
        });
        fileSaver(blob, 'spectra.svg');
        break;
      }
      case 'toggleNMR1hAdvancedOptions': {
        var advancedOptions1H = !API.cache('nmr1hAdvancedOptions');
        API.cache('nmr1hAdvancedOptions', advancedOptions1H);
        if (advancedOptions1H) {
          API.createData(
            'nmr1hOndeTemplate',
            API.cache('nmr1hOndeTemplates').full
          );
        } else {
          API.createData(
            'nmr1hOndeTemplate',
            API.cache('nmr1hOndeTemplates').short
          );
        }
        break;
      }
      case 'resetNMR1d': {
        var type = action.name.replace(/[^0-9]/g, '');
        type = `${type}d`;
        API.createData(`blackNMR${type}`, null);
        API.createData(`annotationNMR${type}`, null);
        API.createData(`acsNMR${type}`, null);
        break;
      }
      case 'switchNMRLayer': {
        var goToLayer =
          action.value && action.value.dimension > 1
            ? 'nmr2D'
            : 'Default layer';
        API.switchToLayer(goToLayer, { autoSize: true });
        if (action.value.dimension > 1) {
          if (action.value.jcamp) {
            API.createData('blackNMR2d', action.value.jcamp.data);
          } else {
            API.createData('blackNMR2d', null);
          }
        } else {
          if (action.value.jcamp) {
            API.createData('blackNMR1d', action.value.jcamp.data);
          } else {
            API.createData('blackNMR1d', null);
          }
        }
        break;
      }
      case 'executePeakPicking': {
        var options = API.getData('nmr1hOptions');
        delete options.from;
        delete options.to;
        var currentNmr = API.getData('currentNmr');
        if (currentNmr.dimension > 1) {
          if (typeof UI !== 'undefined') {
            UI.showNotification(
              'Peak picking can only be applied on 1D spectra',
              'warning'
            );
          }
          return false;
        }
        this._autoRanges(currentNmr);
        break;
      }
      case 'deleteAllRanges':
        var ranges = API.getData('currentNmrRanges');
        while (ranges.length) {
          ranges.pop();
        }
        ranges.triggerChange();
        break;
      case 'clearAssignments': {
        let ranges = this.getCurrentRanges();
        if (ranges) {
          ranges.forEach((a) => {
            if (a.signal) {
              a.signal.forEach((b) => {
                b.diaID = [];
              });
            }
          });
          ranges.triggerChange();
        }
        break;
      }
      case 'clearAllAssignments': {
        var nmr = this.sample.$content.spectra.nmr;
        nmr.forEach((n) => {
          if (n.range) {
            n.range.forEach((a) => {
              if (a.signal) {
                a.signal.forEach((b) => {
                  b.diaID = [];
                });
              }
            });
          }
        });
        let ranges = this.getCurrentRanges();
        if (ranges) ranges.triggerChange();
        break;
      }
      case 'nmrChanged': {
        if (this.previousNMR === API.getData('currentNmr')) break;
        if (!API.getData('currentNmr')) break;
        this.previousNMR = API.getData('currentNmr');
        // Init ranges if does not exist
        this.initCurrentNmrRanges();
        this.updateIntegralOptions();
        this.rangesHasChanged();
        break;
      }
      case 'setIntegralFromMF': {
        this.updateIntegralOptionsFromMF();
        break;
      }
      default: {
        return false;
      }
    }
    return true;
  }

  initCurrentNmrRanges() {
    const nmr = API.getData('currentNmr');
    if (nmr.range === undefined) {
      const currentNmrVar = API.getVar('currentNmr');
      API.setVariable('currentNmrRanges', currentNmrVar, ['range']);
      nmr.setChildSync(['range'], []);
    }
  }

  getCurrentRanges() {
    const nmr = API.getData('currentNmr');
    if (nmr !== null) {
      return nmr.getChildSync(['range']);
    } else {
      return null;
    }
  }

  updateIntegralOptions() {
    const nmr = API.getData('currentNmr');
    if (!nmr || nmr.dimension > 1) {
      return;
    }
    if (nmr.nucleus && nmr.nucleus[0].replace(/[0-9]/, '') !== 'H') {
      return;
    }

    if (!nmr.range || !nmr.range.length) {
      this.updateIntegralOptionsFromMF();
    } else {
      this.updateIntegralOptionsFromRanges();
    }
  }

  async updateIntegralsFromSpectrum() {
    const nmr = API.getData('currentNmr');
    if (!nmr) return;
    const spectrum = await this._getNMR(nmr);
    if (spectrum && spectrum.sd && nmr.range && nmr.range.length > 0) {
      const ranges = new Ranges(nmr.range);
      var ppOptions = API.getData('nmr1hOptions');
      spectrum.updateIntegrals(ranges, {
        nH: Number(ppOptions.integral)
      });
    }
  }

  updateIntegrals(integral) {
    var ppOptions = API.getData('nmr1hOptions');
    var currentRanges = this.getCurrentRanges();
    if (!currentRanges || currentRanges.length === 0) return;

    // We initialize ranges with the DataObject so that
    // the integral update is inplace
    var ranges = new Ranges(currentRanges);
    ranges.updateIntegrals({ sum: Number(ppOptions.integral || integral) });
    currentRanges.triggerChange();
  }

  _getNMR(currentNMRLine) {
    var filename = String(currentNMRLine.getChildSync(['jcamp', 'filename']));
    return currentNMRLine.getChild(['jcamp', 'data']).then((jcamp) => {
      if (filename && this.spectra[filename]) {
        var spectrum = this.spectra[filename];
      } else {
        if (jcamp) {
          jcamp = String(jcamp.get());
          spectrum = NMR.fromJcamp(jcamp);
          if (filename) {
            this.spectra[filename] = spectrum;
          }
        } else {
          spectrum = new NMR();
        }
      }
      return spectrum;
    });
  }

  _autoRanges(nmrLine) {
    this._getNMR(nmrLine).then((nmrSpectrum) => {
      var ppOptions = API.getData('nmr1hOptions').resurrect();
      var removeImpurityOptions = {};
      if (ppOptions.removeImpurities.useIt) {
        removeImpurityOptions = {
          solvent: nmrLine.solvent,
          nH: Number(ppOptions.integral),
          error: ppOptions.removeImpurities.error
        };
      }
      var ranges = nmrSpectrum.getRanges({
        nH: Number(ppOptions.integral),
        realTop: true,
        thresholdFactor: Number(ppOptions.noiseFactor),
        clean: ppOptions.clean,
        compile: ppOptions.compile,
        from: ppOptions.from,
        to: ppOptions.to,
        optimize: ppOptions.optimize,
        integralType: ppOptions.integralFn,
        gsdOptions: { minMaxRatio: 0.001, smoothY: false, broadWidth: 0.004 },
        removeImpurity: removeImpurityOptions
      });
      nmrLine.setChildSync(['range'], ranges);
    });
  }

  async _createNMRannotationsAndACS() {
    var nmrLine = API.getData('currentNmr');
    var ranges = nmrLine.range;
    var nmrSpectrum = await this._getNMR(nmrLine);
    var nucleus = nmrLine.nucleus[0];
    var observe = nmrLine.frequency;
    if (nmrSpectrum && nmrSpectrum.sd) {
      nucleus = nmrSpectrum.getNucleus(0);
      observe = nmrSpectrum.observeFrequencyX();
    }

    if (nmrSpectrum) {
      API.createData(
        'annotationsNMR1d',
        GUI.annotations1D(ranges, {
          line: 1,
          fillColor: 'lightgreen',
          strokeWidth: 0
        })
      );
    }

    API.createData(
      'acsNMR1d',
      SD.getACS(ranges, {
        rangeForMultiplet: true,
        nucleus,
        observe
      })
    );
  }

  getNumberHydrogens() {
    const mf = String(getData(this.sample, 'mf'));
    if (mf) {
      try {
        const mfInfo = new MolecularFormula.MF(mf).getInfo();
        if (mfInfo && mfInfo.atoms && mfInfo.atoms.H) {
          return mfInfo.atoms.H || 100;
        }
      } catch (e) {
        return 100;
      }
    }
    return 100;
  }

  updateIntegralOptionsFromMF() {
    var options = API.getData('nmr1hOptions');
    const currentIntegral = Number(options.integral);
    const newIntegral = this.getNumberHydrogens();
    if (currentIntegral !== newIntegral) {
      options.setChildSync(['integral'], newIntegral);
    }
  }

  // todo : migrate this code to spectra-data-ranges
  getRangesTotalIntegral() {
    var ranges = API.getData('currentNmrRanges') || [];
    let sum = 0;
    for (const range of ranges) {
      if (SD.Ranges.shouldIntegrate(range)) {
        sum += range.integral;
      }
    }
    return sum;
  }

  updateIntegralOptionsFromRanges() {
    var options = API.getData('nmr1hOptions');
    const currentIntegral = Number(options.integral);
    const newIntegral = Math.round(this.getRangesTotalIntegral());
    if (currentIntegral !== newIntegral && newIntegral > 0) {
      options.setChildSync(['integral'], newIntegral);
    }
  }

  async rangesHasChanged() {
    const ranges = this.getCurrentRanges();
    await this.updateIntegralsFromSpectrum();
    const newRangesID = this._getRangesID(ranges);

    this.ensureHighlights(this.previousRangesID !== newRangesID);
    this.previousRangesID = newRangesID;
  }

  ensureHighlights(forceTrigger) {
    const ranges = this.getCurrentRanges();
    const highlightWasUpdated = GUI.ensureRangesHighlight(ranges);
    if (highlightWasUpdated || forceTrigger) {
      ranges.triggerChange();
      this._createNMRannotationsAndACS();
    }
  }

  _getRangesID(ranges) {
    return JSON.stringify(ranges);
  }

  initializeNMROptions() {
    API.createData('nmr1hOptions', {
      noiseFactor: 0.8,
      clean: 0.5,
      compile: true,
      optimize: false,
      integralType: 'sum',
      integral: this.getNumberHydrogens(),
      type: '1H',
      removeImpurities: {
        useIt: true,
        error: 0.025
      }
    });

    API.createData('nmr1hOndeTemplate', nmr1hOndeTemplates.short);
  }
}

module.exports = Nmr1dManager;
