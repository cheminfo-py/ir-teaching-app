import Datas from 'src/main/datas';
import API from 'src/util/api';
import UI from 'src/util/ui';

import Roc from '../rest-on-couch/Roc';

import { createVar } from './jpaths';
import elnPlugin from './libs/elnPlugin';

const DataObject = Datas.DataObject;

var defaultOptions = {
  varName: 'sample',
  track: false,
  bindChange: true,
};

class BioReaction {
  constructor(couchDB, uuid, options) {
    this.options = Object.assign({}, defaultOptions, options);

    var roc = API.cache('roc');
    if (!roc) {
      roc = new Roc({
        url: couchDB.url,
        database: couchDB.database,
        processor: elnPlugin,
        kind: couchDB.kind,
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
        'error',
      );
      return;
    }
    this._loadInstanceInVisualizer();
  }

  async _loadInstanceInVisualizer() {
    this.sample = await this.roc.document(this.uuid, this.options);

    if (!this.sample.$content.general) {
      this.sample.$content.general = {};
    }

    var sampleVar = API.getVar(this.options.varName);

    createVar(sampleVar, 'reactionCode');
    createVar(sampleVar, 'creationDate');
    createVar(sampleVar, 'modificationDate');
    createVar(sampleVar, 'procedure');
    createVar(sampleVar, 'products');
    createVar(sampleVar, 'reagents');
    createVar(sampleVar, 'attachments');

    this.onChange = (event) => {
      switch (event.jpath.join('.')) {
        default:
          break; // ignore
      }
    };

    this.bindChange();
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
            'error',
          );
          return undefined;
      }
      return this.handleDrop(variableName, false);
    }
    return undefined;
  }

  async handleDrop(name, askType) {
    var type;
    if (!name) {
      throw new Error('handleDrop expects a variable name');
    }
    name = String(name);
    if (!askType) {
      // maps name of variable to type of data
      var types = {
        droppedNmr: 'nmr',
        droppedIR: 'ir',
        droppedMS: 'mass',
        droppedXray: 'xray',
        droppedOverview: 'image',
        droppedImage: 'image',
        droppedGenbank: 'genbank',
      };
      if (!types[name]) {
        throw new Error('Unexpected variable name');
      }
      type = types[name];
    } else {
      type = await UI.choose(
        {
          xray: 'Xray (cif, pdb)',
          image: 'Images (jpg, png or tiff)',
          other: 'Other',
        },
        {
          noConfirmation: true,
          columns: [
            {
              id: 'description',
              name: 'description',
              field: 'description',
            },
          ],
        },
      );
      if (!type) return;
    }

    // Dropped data can be an array
    // Expecting format as from drag and drop module
    var droppedDatas = API.getData(name);
    droppedDatas = droppedDatas.file || droppedDatas.str;

    if (type === 'other') {
      await this.roc.addAttachment(this.sample, droppedDatas);
    } else {
      await this.attachFiles(droppedDatas, type);
    }
  }

  async handleAction(action) {
    if (!action) return;

    switch (action.name) {
      case 'save':
        await this.roc.update(this.sample);
        break;
      case 'deleteAttachment':
        var attachment = action.value.name;
        await this.roc.deleteAttachment(this.sample, attachment);
        break;
      case 'unattach':
        await this.roc.unattach(this.sample, action.value);
        break;
      case 'attachNMR':
      case 'attachIR':
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
          'Are you sure you want to refresh? This will discard your local modifications.',
        );
        if (!ok) return;
        this.unbindChange();
        await this.roc.discardLocal(this.sample);
        this.bindChange();
        break;
      }
      default:
        break;
    }
  }

  async attachFiles(files, type) {
    if (!files || !type) return;

    if (!Array.isArray(files)) {
      files = [files];
    }
    for (let i = 0; i < files.length; i++) {
      const data = DataObject.resurrect(files[i]);
      await this.roc.attach(type, this.sample, data);
    }
  }
}

module.exports = BioReaction;
