import Datas from 'src/main/datas';
import API from 'src/util/api';
import UI from 'src/util/ui';

import Roc from '../rest-on-couch/Roc';

import ExpandableMolecule from './ExpandableMolecule';
import Nmr1dManager from './Nmr1dManager';
import MF from './MF';
import { createVar } from './jpaths';
import elnPlugin from './libs/elnPlugin';
import Sequence from './Sequence';
import convertToJcamp from './libs/convertToJcamp';

const DataObject = Datas.DataObject;

var defaultOptions = {
  varName: 'sample',
  track: false,
  bindChange: true
};

class Sample {
  constructor(couchDB, uuid, options) {
    this.options = Object.assign({}, defaultOptions, options);

    var roc = API.cache('roc');
    if (!roc) {
      roc = new Roc({
        url: couchDB.url,
        database: couchDB.database,
        processor: elnPlugin,
        kind: couchDB.kind
      });
      API.cache('roc', roc);
    }
    this.roc = roc;

    if (options.onSync) {
      var emitter = this.roc.getDocumentEventEmitter(uuid);
      emitter.on('sync', () => options.onSync(true));
      emitter.on('unsync', () => options.onSync(false));
    }

    this.uuid = uuid;
    if (!this.uuid) {
      UI.showNotification(
        'Cannot create an editable sample without an uuid',
        'error'
      );
      return;
    }
    this.sample = this.roc
      .document(this.uuid, this.options)
      .then(async (sample) => {
        this.sample = sample;
        this.updateOtherAttachments();
        this._loadInstanceInVisualizer();
      });

    this._checkServerChanges();
  }

  waitSampleLoaded() {
    return this.sample;
  }

  async getToc() {
    let id = DataObject.resurrect(this.sample.$id).join(' ');
    let result = await this.roc.query('sample_toc', {
      key: id,
      filter: (entry) => {
        return entry.id === this.uuid;
      }
    });
    if (result.length === 0) {
      result = await this.roc.query('sample_toc', {
        key: id.trimEnd(' '),
        filter: (entry) => {
          return entry.id === this.uuid;
        }
      });
    }
    return result[0];
  }

  _checkServerChanges() {
    window.setInterval(async () => {
      if (this.sample && this.sample._rev) {
        let uuid = this.sample._id;
        let rev = this.sample._rev;
        let headers = await this.roc.getHeader(uuid);
        if (!headers || !headers.etag) return;
        let remoteRev = String(headers.etag).replace(/"/g, '');
        let target = document.getElementById('modules-grid');
        if (remoteRev && rev !== remoteRev && this.options.track) {
          let remoteHasChangedDiv = document.getElementById('remoteHasChanged');
          if (!remoteHasChangedDiv) {
            let alertDiv = document.createElement('DIV');
            alertDiv.innerHTML = `<p id="remoteHasChanged" style="font-weight: bold; color: red; font-size: 3em; background-color: yellow">
This entry has changed on the server, please reload the sample.<br>
Your local changes will be lost.</p>`;

            alertDiv.style.zIndex = 99;
            alertDiv.style.position = 'fixed';

            target.prepend(alertDiv);
          } else {
            remoteHasChangedDiv.style.display = 'block';
          }
          this.remoteChanged = true;
        }
      }
    }, 60 * 1000);
  }

  createVariables() {
    var sampleVar = API.getVar(this.options.varName);
    createVar(sampleVar, 'sampleCode');
    createVar(sampleVar, 'batchCode');
    createVar(sampleVar, 'creationDate');
    createVar(sampleVar, 'modificationDate');
    createVar(sampleVar, 'content');
    createVar(sampleVar, 'general');
    createVar(sampleVar, 'molfile');
    createVar(sampleVar, 'firstPeptide');
    createVar(sampleVar, 'firstNucleotide');
    createVar(sampleVar, 'mf');
    createVar(sampleVar, 'mw');
    createVar(sampleVar, 'em');
    createVar(sampleVar, 'title');
    createVar(sampleVar, 'description');
    createVar(sampleVar, 'keyword');
    createVar(sampleVar, 'meta');
    createVar(sampleVar, 'name');
    createVar(sampleVar, 'physical');
    createVar(sampleVar, 'bp');
    createVar(sampleVar, 'nd');
    createVar(sampleVar, 'mp');
    createVar(sampleVar, 'density');
    createVar(sampleVar, 'stockHistory');
    createVar(sampleVar, 'stock');
    createVar(sampleVar, 'lastStock');
    createVar(sampleVar, 'supplier');
    createVar(sampleVar, 'ir');
    createVar(sampleVar, 'uv');
    createVar(sampleVar, 'raman');
    createVar(sampleVar, 'mass');
    createVar(sampleVar, 'nmr');
    createVar(sampleVar, 'iv');
    createVar(sampleVar, 'xray');
    createVar(sampleVar, 'chromatogram');
    createVar(sampleVar, 'thermogravimetricAnalysis');
    createVar(sampleVar, 'hgPorosimetry');
    createVar(sampleVar, 'differentialCentrifugalSedimentation');
    createVar(sampleVar, 'isotherm');
    createVar(sampleVar, 'pelletHardness');
    createVar(sampleVar, 'oan');
    createVar(sampleVar, 'xrd');
    createVar(sampleVar, 'xrf');
    createVar(sampleVar, 'xps');
    createVar(sampleVar, 'cyclicVoltammetry');
    createVar(sampleVar, 'elementalAnalysis');
    createVar(sampleVar, 'differentialScanningCalorimetry');
    createVar(sampleVar, 'image');
    createVar(sampleVar, 'video');
    createVar(sampleVar, 'sampleCode');
    createVar(sampleVar, 'attachments');
    createVar(sampleVar, 'nucleic');
    createVar(sampleVar, 'peptidic');
    createVar(sampleVar, 'biology');
  }

  async _loadInstanceInVisualizer() {
    updateSample(this.sample);

    this.createVariables();

    this._initializeObjects();

    this.onChange = (event) => {
      let jpathStr = event.jpath.join('.');
      if (jpathStr.match(/\$content.spectra.nmr.[0-9]+.range/)) {
        this.nmr1dManager.rangesHasChanged();
      }

      switch (jpathStr) {
        case '$content.general.molfile':
          this.mf.fromMolfile();
          this.nmr1dManager.handleAction({
            name: 'clearAllAssignments'
          });
          break;
        case '$content.general.mf':
          this.mf.fromMF();
          this.nmr1dManager.updateIntegralOptionsFromMF();
          break;
        case '$content.biology':
          break;
        case '$content.general.sequence':
          throw new Error('Trying to change old sequence, this is a bug');

        default:
          break; // ignore
      }
    };

    this.bindChange();
  }

  updateOtherAttachments() {
    let otherAttachments = this.sample.attachmentList.filter(
      (entry) => !entry.name.includes('/')
    );
    API.createData('otherAttachments', otherAttachments);
  }

  _initializeObjects() {
    this.expandableMolecule = new ExpandableMolecule(this.sample, this.options);
    this.nmr1dManager = new Nmr1dManager(this.sample);

    this.mf = new MF(this.sample);
    this.mf.fromMF();
  }

  bindChange() {
    if (this.options.bindChange) {
      this.sample.unbindChange(this.onChange);
      this.sample.onChange(this.onChange);
    }
  }

  unbindChange() {
    if (this.options.bindChange) this.sample.unbindChange(this.onChange);
  }

  /** An image with a special name that is used to display on the
   * first page of a sample
   */
  async handleOverview(variableName) {
    let data = API.getData(variableName);
    if (data && data.file && data.file[0]) {
      let file = data.file[0];
      // we only accepts 3 mimetype
      switch (file.mimetype) {
        case 'image/png':
          file.filename = 'overview.png';
          break;
        case 'image/jpeg':
          file.filename = 'overview.jpg';
          break;
        case 'image/svg+xml':
          file.filename = 'overview.svg';
          break;
        default:
          UI.showNotification(
            'For overview only the following formats are allowed: png, jpg and svg.',
            'error'
          );
          return undefined;
      }
      return this.handleDrop(variableName, false);
    }
    return undefined;
  }

  /**
   *
   * @param {string} variableName
   * @param {boolean} askType
   * @param {object} options
   * @param {string} [options.customMetadata]
   * @param {boolean} [options.autoJcamp] - converts automatically tsv, txt and csv to jcamp
   * @param {boolean} [options.converters] - callback to convert some files based on their kind (extension)
   * @param {boolean} [options.autoKind] - callback to determine automatically kind
   */
  async handleDrop(variableName, askType, options = {}) {
    let { converters, autoJcamp, autoKind } = options;
    let type;
    if (!variableName) {
      throw new Error('handleDrop expects a variable name');
    }
    variableName = String(variableName);
    if (!askType) {
      // maps name of variable to type of data
      const types = {
        droppedNmr: 'nmr',
        droppedIR: 'ir',
        droppedUV: 'uv',
        droppedIV: 'iv',
        droppedMS: 'mass',
        droppedRaman: 'raman',
        droppedChrom: 'chromatogram',
        droppedCV: 'cyclicVoltammetry',
        droppedTGA: 'thermogravimetricAnalysis',
        droppedIsotherm: 'isotherm',
        droppedDSC: 'differentialScanningCalorimetry',
        droppedHg: 'hgPorosimetry',
        droppedPelletHardness: 'pelletHardness',
        droppedOAN: 'oan',
        droppedDCS: 'differentialCentrifugalSedimentation',
        droppedXray: 'xray',
        droppedXRD: 'xrd',
        droppedXRF: 'xrf',
        droppedXPS: 'xps',
        droppedOverview: 'image',
        droppedImage: 'image',
        droppedVideo: 'video',
        droppedGenbank: 'genbank',
        droppedOther: 'other'
      };
      if (!types[variableName]) {
        throw new Error('Unexpected variable name');
      }
      type = types[variableName];
    } else {
      type = await UI.choose(
        {
          nmr: 'NMR (csv, tsv, txt, jcamp, pdf)',
          mass: 'Mass (csv, tsv, txt, jcamp, pdf, netcdf, xml)',
          ir: 'Infrared (csv, tsv, txt, jcamp, pdf)',
          raman: 'Raman (csv, tsv, txt, jcamp, pdf)',
          uv: 'UV (csv, tsv, txt, jcamp, pdf)',
          iv: 'IV (csv, tsv, txt, jcamp, pdf)',
          chromatogram:
            'Chromatogram LC, GC, LC/MS, GC/MS (csv, tsv, txt, jcamp, pdf, netcdf, xml)',
          thermogravimetricAnalysis:
            'Thermogravimetric Analysis (csv, tsv, txt, jcamp)',
          xrd: 'Powder XRD (csv, tsv, txt, jcamp)',
          xrd: 'Powder XRD Analysis (csv, tsv, txt, jcamp)',
          xrf: 'Xray fluoresence (csv, tsv, txt, jcamp)',
          xps: 'XPS (csv, tsv, txt, jcamp)',
          differentialCentrifugalSedimentation:
            'Differential Centrifugal Sedimentation (csv, tsv, txt, jcamp)',
          hgPorosimetry: 'Hg porosimetry (csv, tsv, txt, jcamp)',
          isotherm: 'Isotherm (csv, tsv, txt, jcamp, xls)',
          cyclicVoltammetry: 'Cyclic voltammetry (csv, tsv, txt, jcamp, pdf)',
          differentialScanningCalorimetry:
            'Differential Scanning Calorimetry (csv, tsv, txt, jcamp)',
          xray: 'Crystal structure (cif, pdb)',
          image: 'Images (jpg, png or tiff)',
          video: 'Videos (mp4, m4a, avi, wav)',
          other: 'Other'
        },
        {
          noConfirmation: true,
          columns: [
            {
              id: 'description',
              name: 'description',
              field: 'description'
            }
          ]
        }
      );
      if (!type) return;
    }

    // Dropped data can be an array
    // Expecting format as from drag and drop module
    var droppedDatas = API.getData(variableName);
    droppedDatas = droppedDatas.file || droppedDatas.str;
    if (converters) {
      // a converter may generate many results
      const newData = [];
      for (let droppedData of droppedDatas) {
        if (!droppedData.filename.includes('.')) {
          droppedData.filename += '.txt';
        }
        const extension = droppedData.filename
          .replace(/.*\./, '')
          .toLowerCase();
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
      }
      droppedDatas = droppedDatas.concat(newData);
    }

    console.log({ droppedDatas });

    /*
      Possible autoconvertion of text file to jcamp
      * if filename ends with TXT, TSV or CSV
      * use convert-to-jcamp
    */
    if (autoJcamp) {
      const jcampTypes = {
        nmr: {
          type: 'NMR SPECTRUM',
          xUnit: 'Delta [ppm]',
          yUnit: 'Relative'
        },
        ir: {
          type: 'IR SPECTRUM',
          xUnit: 'wavelength [cm-1]',
          yUnit: ['Transmittance (%)', 'Absorbance']
        },
        raman: {
          type: 'RAMAN SPECTRUM',
          xUnit: 'wavelength [cm-1]',
          yUnit: 'Absorbance'
        },
        iv: {
          type: 'IV SPECTRUM',
          xUnit: [
            'Potential vs Fc/Fc+ [V]',
            'Potential vs Ag/AgNO3 [V]',
            'Potential vs Ag/AgCl/KCl [V]',
            'Potential vs Ag/AgCl/NaCl [V]',
            'Potential vs SCE [V]',
            'Potential vs NHE [V]',
            'Potential vs SSCE [V]',
            'Potential vs Hg/Hg2SO4/K2SO4 [V]'
          ],
          yUnit: ['Current [mA]', 'Current [µA]']
        },
        uv: {
          type: 'UV SPECTRUM',
          xUnit: 'wavelength [nm]',
          yUnit: 'Absorbance'
        },
        mass: {
          type: 'MASS SPECTRUM',
          xUnit: 'm/z [Da]',
          yUnit: 'Relative'
        },
        cyclicVoltammetry: {
          type: 'Cyclic voltammetry',
          xUnit: 'Ewe [V]',
          yUnit: 'I [mA]'
        },
        thermogravimetricAnalysis: {
          type: 'Thermogravimetric analysis',
          xUnit: 'Temperature [°C]',
          yUnit: 'Weight [mg]'
        },
        hgPorosimetry: {
          type: 'Hg porosimetry',
          xUnit: 'Pressure [MPa]',
          yUnit: 'Volume [mm³/g]'
        },
        differentialCentrifugalSedimentation: {
          type: 'Differential Centrifugal Sedimentation',
          xUnit: 'Diameter [nm]',
          yUnit: 'Quantity'
        },
        differentialScanningCalorimetry: {
          type: 'Differentical scanning calorimetry',
          xUnit: 'I [mA]',
          yUnit: 'Ewe [V]'
        },
        isotherm: {
          type: 'Isotherm',
          xUnit: ['p/p0', 'p / kPa'],
          yUnit: ['excess adsorption mmol/g', 'adsorbed volume cm3/g']
        },
        xrd: {
          type: 'X-ray powder diffraction',
          xUnit: '2ϴ [°]',
          yUnit: 'counts'
        },
        xrf: {
          type: 'X-ray fluoresence',
          xUnit: 'Energy [keV]',
          yUnit: 'Intensity'
        }
      };

      for (let droppedData of droppedDatas) {
        if (!droppedData.filename.includes('.')) droppedData.filename += '.txt';
        let extension = droppedData.filename.replace(/.*\./, '').toLowerCase();
        if (extension === 'txt' || extension === 'csv' || extension === 'tsv') {
          let info = jcampTypes[type];
          if (info) {
            info.filename = `${droppedData.filename.replace(
              /\.[^.]*$/,
              ''
            )}.jdx`;
            // we will ask for meta information
            let meta = await UI.form(
              `
              <style>
                  #jcamp {
                      zoom: 1.5;
                  }
              </style>
              <div id='jcamp'>
                  <b>Automatic conversion of text file to jcamp</b>
                  <form>
                  <table>
                  <tr>
                    <th>Kind</th>
                    <td><input type="text" readonly name="type" value="${
                      info.type
                    }"></td>
                  </tr>
                  <tr>
                    <th>Filename (ending with .jdx)</th>
                    <td><input type="text" pattern=".*\\.jdx$" name="filename" size=40 value="${
                      info.filename
                    }"></td>
                  </tr>
                  <tr>
                    <th>xUnit (horizon axis)</th>
                    ${
                      info.xUnit instanceof Array
                        ? `<td><select name="xUnit">${info.xUnit.map(
                            (xUnit) =>
                              `<option value="${xUnit}">${xUnit}</option>`
                          )}</select></td>`
                        : `<td><input type="text" readonly name="xUnit" value="${info.xUnit}"></td>`
                    }
                  </tr>
                  <tr>
                  <th>yUnit (vectical axis)</th>
                  ${
                    info.yUnit instanceof Array
                      ? `<td><select name="yUnit">${info.yUnit.map(
                          (yUnit) =>
                            `<option value="${yUnit}">${yUnit}</option>`
                        )}</select></td>`
                      : `<td><input type="text" readonly name="yUnit" value="${info.yUnit}"></td>`
                  }
                </tr>
                  </table>
                    <input type="submit" value="Submit"/>
                  </form>
              </div>
            `,
              {},
              {
                dialog: {
                  width: 600
                }
              }
            );
            if (!meta) return;

            droppedData.filename = `${meta.filename}`;
            droppedData.mimetype = 'chemical/x-jcamp-dx';
            droppedData.contentType = 'chemical/x-jcamp-dx';
            let content = droppedData.content;
            switch (droppedData.encoding) {
              case 'base64':
                content = atob(droppedData.content);
                droppedData.encoding = 'text';
                break;
              case 'buffer':
                const decoder = new TextDecoder();
                content = decoder.decode(droppedData.content);
                droppedData.encoding = 'text';
                break;
            }
            droppedData.content = convertToJcamp(content, {
              meta
            });
          } else {
            // eslint-disable-next-line no-console
            console.log('Could not convert to jcamp file: ', type);
          }
        }
      }
    }
    if (type === 'other') {
      await this.roc.addAttachment(this.sample, droppedDatas);
      this.updateOtherAttachments();
    } else {
      await this.attachFiles(droppedDatas, type, options);
    }
  }

  async handleAction(action) {
    if (!action) return;

    if (
      this.expandableMolecule &&
      this.expandableMolecule.handleAction(action)
    ) {
      return;
    }
    if (this.nmr1dManager && this.nmr1dManager.handleAction(action)) return;
    switch (action.name) {
      case 'save':
        await this.roc.update(this.sample);
        break;
      case 'explodeSequences':
        Sequence.explodeSequences(this.sample);
        break;
      case 'calculateMFFromSequence':
        Sequence.calculateMFFromSequence(this.sample);
        break;
      case 'calculateMFFromPeptidic':
        Sequence.calculateMFFromPeptidic(this.sample);
        break;
      case 'calculateMFFromNucleic':
        Sequence.calculateMFFromNucleic(this.sample);
        break;
      case 'translateNucleic':
        Sequence.translateNucleic(this.sample);
        break;
      case 'createOptions':
        var advancedOptions1H = API.cache('nmr1hAdvancedOptions');
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
      case 'recreateVariables':
        this.createVariables();
      case 'deleteAttachment':
        const ok = await UI.confirm(
          'Are you sure you want to delete the attachment?'
        );
        if (!ok) return;
        const attachment = action.value.name;
        await this.roc.deleteAttachment(this.sample, attachment);
        this.updateOtherAttachments();
        break;
      case 'deleteNmr': // Deprecated. Use unattach. Leave this for backward compatibility
      case 'unattach':
        await this.roc.unattach(this.sample, action.value);
        break;
      case 'attachNMR':
      case 'attachIR':
      case 'attachRaman':
      case 'attachMass': {
        var tempType = action.name.replace('attach', '');
        var type = tempType.charAt(0).toLowerCase() + tempType.slice(1);
        var droppedDatas = action.value;
        droppedDatas = droppedDatas.file || droppedDatas.str;
        await this.attachFiles(droppedDatas, type);
        break;
      }
      case 'refresh': {
        const ok = await UI.confirm(
          'Are you sure you want to refresh? This will discard your local modifications.'
        );
        if (!ok) return;
        this.unbindChange();
        this.expandableMolecule.unbindChange();
        await this.roc.discardLocal(this.sample);
        this._initializeObjects();
        this.bindChange();
        this.remoteChanged = false;
        let remoteHasChangedDiv = document.getElementById('remoteHasChanged');
        if (remoteHasChangedDiv) {
          remoteHasChangedDiv.style.display = 'none';
        }
        this.nmr1dManager.handleAction({ name: 'nmrChanged' });
        break;
      }
      default:
        break;
    }
  }

  async attachFiles(files, type, options) {
    if (!files || !type) return;

    if (!Array.isArray(files)) {
      files = [files];
    }
    for (let i = 0; i < files.length; i++) {
      const data = DataObject.resurrect(files[i]);
      await this.roc.attach(type, this.sample, data, options);
    }
  }
}

function updateSample(sample) {
  if (!sample.$content.general) {
    sample.$content.general = {};
  }

  /** This is the old place we used to put the sequence.
   * By default we expect it is a peptidic sequence
   */
  if (sample.$content.general.sequence) {
    // eslint-disable-next-line no-console
    console.log('Migrating sequence', sample.$content.general.sequence);
    if (!sample.$content.biology) sample.$content.biology = {};
    if (!sample.$content.biology.peptidic) {
      sample.$content.biology.peptidic = [];
    }
    if (!sample.$content.biology.peptidic.length > 0) {
      sample.$content.biology.peptidic[0] = {};
    }
    if (!sample.$content.biology.peptidic[0].seq) {
      sample.$content.biology.peptidic[0].seq = [];
    }
    if (!sample.$content.biology.peptidic[0].seq.length > 0) {
      sample.$content.biology.peptidic[0].seq[0] = {};
    }
    sample.setChildSync(
      ['$content', 'biology', 'peptidic', 0, 'seq', 0, 'sequence'],
      sample.$content.general.sequence
    );
    sample.$content.general.sequence = undefined;
  }
}
module.exports = Sample;
