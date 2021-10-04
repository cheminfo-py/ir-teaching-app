define([
  '../util/getViewInfo',
  'src/util/api',
  'src/util/couchdbAttachments',
], function (getViewInfo, API) {
  class UserAnalysisResults {
    constructor(roc, sampleID) {
      this.roc = roc;
      this.sampleID = sampleID;
      this.viewID = undefined;
      getViewInfo().then((result) => {
        this.viewID = result._id;
      });
    }

    setSampleID(sampleID) {
      this.sampleID = sampleID;
    }

    async refresh() {
      let analysisResults = await this.loadResults();
      API.createData('analysisResults', analysisResults);
      let analysisTemplates = await this.loadTemplates();
      API.createData('analysisTemplates', analysisTemplates);
    }

    async loadTemplates(key) {
      if (!this.roc) {
        this.viewID = this.viewID || (await getViewInfo())._id;
        return loadTemplatesFromLocalStorage(this.viewID);
      }
      return this.loadResults(key, { sampleID: '' });
    }

    /**
     * Retrieve all the analytical results for a sample in a view
     * @param {string} key
     */
    async loadResults(key, options = {}) {
      if (!this.roc) {
        console.log('Can not retrieve results, not connected to roc');
        return;
      }
      const { sampleID = this.sampleID } = options;

      this.viewID = this.viewID || (await getViewInfo())._id;
      // var user = await this.roc.getUser();
      const queryOptions = key
        ? {
          key: ['userAnalysisResults', this.viewID, sampleID, key],
        }
        : {
          startkey: ['userAnalysisResults', this.viewID, sampleID, '\u0000'],
          endkey: ['userAnalysisResults', this.viewID, sampleID, '\uffff'],
        };
      queryOptions.mine = false;

      const entries = await this.roc.query('userAnalysisToc', queryOptions);
      /* if (sampleID) {
        return entries.filter((entry) => entry.$id[2].match(/^[0-9a-f]{32}$/i));
      }*/
      console.log({ entries })
      return entries;
    }

    delete(entry) {
      entry._id = entry._id || entry.id;
      return this.roc.delete(entry);
    }

    /**
     * Result is stored in an attachment called result.json
     * @param {*} entry
     */
    async loadResult(entry) {
      entry._id = entry._id || entry.id;
      if (!this.roc) {
        return loadTemplateFromLocalStorage(this.viewID, String(entry._id));
      }
      this.lastEntry = entry;
      console.log(this.lastEntry);
      return this.roc.getAttachment(entry, 'result.json');
    }

    async saveTemplate(key, meta, result) {
      if (!this.roc) {
        return saveTemplateToLocalStorage(this.viewID, key, result);
      } else {
        return this.save(key, meta, result, { sampleID: '' });
      }
    }

    async deleteTemplate(entry) {
      if (!this.roc) {
        return deleteTemplateFromLocalStorage(this.viewID, entry._id);
      } else {
        return this.delete(entry);
      }
    }

    async save(key, meta, result, options = {}) {
      const { sampleID = this.sampleID } = options;
      this.viewID = this.viewID || (await getViewInfo())._id;
      let entry = (await this.loadResults(key, { sampleID }))[0];
      if (entry) {
        if (!entry._id) entry._id = entry.id;
        entry = await this.roc.get(entry);
        entry.$content = meta;
        console.log({ entry })
        await this.roc.update(entry);
      } else {
        entry = await this.roc.create({
          $id: ['userAnalysisResults', this.viewID, sampleID, key],
          $content: meta,
          $kind: 'userAnalysisResults',
        });
      }
      if (result) {
        let attachments = [
          {
            filename: 'result.json',
            data: JSON.stringify(result),
            contentType: 'application/json',
          },
        ];
        await this.roc.addAttachment(entry, attachments);
      }
      return entry;
    }
  }

  return UserAnalysisResults;
});

function loadTemplatesFromLocalStorage(viewID) {
  return (JSON.parse(localStorage.getItem(`templates-${viewID}`)) || []).filter(
    (template) => template.value && template.value.name,
  );
}

function loadTemplateFromLocalStorage(viewID, name) {
  let templates = loadTemplatesFromLocalStorage(viewID);
  for (let template of templates) {
    if (template.id === String(name)) {
      return template.data;
    }
  }
  return {};
}

function deleteTemplateFromLocalStorage(viewID, name) {
  let templates = loadTemplatesFromLocalStorage(viewID);
  let currentTemplates = templates.filter((entry) => entry.id !== String(name));
  localStorage.setItem(`templates-${viewID}`, JSON.stringify(currentTemplates));
}

function saveTemplateToLocalStorage(viewID, name, data) {
  let templates = loadTemplatesFromLocalStorage(viewID);
  let template = templates.filter((entry) => entry._id === String(name))[0];
  if (!template) {
    template = {
      id: name,
      value: {
        name,
      },
    };
    templates.push(template);
  }
  template.data = data;
  localStorage.setItem(`templates-${viewID}`, JSON.stringify(templates));
}
