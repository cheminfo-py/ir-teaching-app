import API from 'src/util/api';
import UI from 'src/util/ui';

import getViewInfo from './getViewInfo';

// ModulePrefsManager is created in the init script
// Any module may have a gear in the settings allowing to change preferences
// the system will either store in Roc or localStorge depending what is available

export class ModulePrefsManager {
  constructor(options = {}) {
    let promises = [];
    if (options.hasRoc) {
      let waitingRoc = new Promise((resolveRoc) => {
        this.resolveRoc = resolveRoc;
      }).then(() => {
        console.log('Roc initialized');
      });
      promises.push(waitingRoc);
    }

    let waitingView = getViewInfo().then((result) => {
      this.viewID = result._id;
    });
    promises.push(waitingView);

    let promiseAll = Promise.all(promises).then(() => {
      this.waiting = () => true;
    });
    this.waiting = () => promiseAll;
  }

  setRoc(roc) {
    this.roc = roc;
    this.resolveRoc();
  }

  async updateSlickGridPrefs(moduleID) {
    await this.waiting();
    const objectStructure = API.getModule(moduleID).data.resurrect()[0];

    const cols = JSON.parse(
      JSON.stringify(API.getModulePreferences(moduleID).cols)
    );
    cols.forEach((item) => {
      if (!item.id) item.id = Math.random();
    });

    await UI.editTable(cols, {
      remove: true,
      reorder: true,
      dialog: {
        title: 'Configure the columns of the module'
      },
      columns: [
        {
          id: 'id',
          name: 'name',
          jpath: ['name'],
          editor: Slick.CustomEditors.TextValue
        },
        {
          id: 'rendererOptions',
          name: 'rendererOptions',
          jpath: ['rendererOptions'],
          editor: Slick.CustomEditors.TextValue
        },
        {
          id: 'width',
          name: 'width',
          jpath: ['width'],
          editor: Slick.CustomEditors.NumberValue
        },
        {
          id: 'x',
          name: 'x',
          jpath: ['x'],
          editor: Slick.CustomEditors.Select,
          editorOptions: { choices: 'ab:cd;ef:gh' }
        },
        {
          id: 'jpath',
          name: 'jpath',
          jpath: ['jpath'],
          editor: Slick.CustomEditors.JPathFactory(objectStructure),
          forceType: 'jpath',
          rendererOptions: {
            forceType: 'jpath'
          }
        }
      ]
    });

    cols.forEach((item) => {
      item.formatter = 'typerenderer';
    });
    API.updateModulePreferences(moduleID, {
      cols: JSON.parse(JSON.stringify(cols))
    });

    this.saveModulePrefs(moduleID, { cols });
  }

  async reloadModulePrefs(moduleID) {
    await this.waiting();
    if (this.roc) {
      this.reloadModulePrefsFromRoc(moduleID);
    } else {
      this.reloadModulePrefsFromLocalStorage(moduleID);
    }
  }

  async reloadModulePrefsFromLocalStorage(moduleID) {
    let prefs = JSON.parse(
      localStorage.getItem('viewModulePreferences') || '{}'
    );
    if (!prefs[this.viewID]) return;
    if (moduleID && !prefs[this.viewID][moduleID]) return;
    if (moduleID) {
      API.updateModulePreferences(moduleID, prefs[this.viewID][moduleID]);
    } else {
      for (moduleID in prefs[this.viewID]) {
        API.updateModulePreferences(moduleID, prefs[this.viewID][moduleID]);
      }
    }
  }

  async getRecord() {
    var user = await this.roc.getUser();
    if (!user || !user.username) return undefined;
    return (
      await this.roc.view('entryByOwnerAndId', {
        key: [user.username, ['userModulePrefs', this.viewID]]
      })
    )[0];
  }

  async reloadModulePrefsFromRoc(moduleID) {
    const record = await this.getRecord();
    if (!record) return;
    if (moduleID) {
      API.updateModulePreferences(moduleID, record.$content[moduleID]);
    } else {
      for (moduleID in record.$content[moduleID]) {
        API.updateModulePreferences(moduleID, record.$content[moduleID]);
      }
    }
  }

  async saveModulePrefs(moduleID, modulePrefs) {
    await this.waiting();
    if (this.roc) {
      this.saveModulePrefsToRoc(moduleID, modulePrefs);
    } else {
      this.saveModulePrefsToLocalStorage(moduleID, modulePrefs);
    }
  }

  async saveModulePrefsToLocalStorage(moduleID, modulePrefs) {
    let prefs = JSON.parse(
      localStorage.getItem('viewModulePreferences') || '{}'
    );
    if (!prefs[this.viewID]) prefs[this.viewID] = {};
    prefs[this.viewID][moduleID] = modulePrefs;
    localStorage.setItem('viewModulePreferences', JSON.stringify(prefs));
  }

  async saveModulePrefsToRoc(moduleID, modulePrefs) {
    let record = await this.getRecord();
    if (record) {
      record.$content[moduleID] = modulePrefs;
      return this.roc.update(record);
    } else {
      let content = {};
      content[moduleID] = modulePrefs;
      return this.roc.create({
        $id: ['userModulePrefs', this.viewID],
        $content: content,
        $kind: 'userModulePrefs'
      });
    }
  }
}

module.exports = ModulePrefsManager;
