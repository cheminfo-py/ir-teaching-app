define([
  '../../rest-on-couch/Roc',
  '../../rest-on-couch/getChangedGroups',
  'src/util/api',
  'vh/rest-on-couch/showRecordInfo',
  'src/util/ui'
], function (Roc, getChangedGroups, API, showRecordInfo, UI) {
  class TemplatesManager {
    /**
     *
     * @param {*} couchDB
     * @param {object} [options={}]
     * @param {string} [options.basename='']
     * @param {Array} [options.categories=[{value: 'chemical', description: 'Chemical'}]]
     */
    constructor(couchDB, options = {}) {
      this.roc = new Roc({ ...couchDB, database: 'templates' });
      this.roc.getGroupMembership().then((groups) => (this.allGroups = groups));
      this.basename = options.basename || '';
      if (this.basename && !this.basename.endsWith('.')) this.basename += '.';
      this.categories = options.categories || [
        { value: 'chemical', description: 'Chemical' }
      ];
      this.refreshTemplates();
    }

    async updateTemplate() {
      console.log('UPDATE TEMPLATE');
      const template = API.getData('currentTemplate');
      await this.roc.update(template.value);
      this.refreshTemplates();
    }

    async deleteTemplate(template) {
      let result = await UI.confirm(
        'Are you sure you want to delete this template ?',
        'Delete',
        'Cancel',
        {}
      );
      if (!result) return;
      await this.roc.delete(template.id);
      this.refreshTemplates();
    }

    async createTemplate(options = {}) {
      const { defaultTwig = '' } = options;
      const form = await UI.form(
        `
          <div>
          <form>
              <table>
              <tr>
              <th align=right>Category<br><span style='font-size: smaller'>Reaction code</span></th>
              <td>
                  <select name="category">
		  ${this.categories.map(
        (category) =>
          `<option value="${category.value}">${category.description}</option>`
      )}
                  </select>
                  <i>
                      The sample category (currently only 'chemical')
                  </i>
              </td>
              </tr>
              <tr>
              <th align=right>Name<br><span style='font-size: smaller'>Template name</span></th>
              <td>
                  <input type="text" name="name" pattern="[A-Za-z0-9 ,-]*"/><br>
                  <i>
                      Only letters, numbers, space, comma and dash
                  </i>
              </td>
              </tr>
              </table>
              <input type="submit" value="Create template"/>
          </form>
          </div>
      `,
        {}
      );
      if (!form || !form.name || form.category == null) return;
      const templateEntry = {
        $id: Math.random().toString(36).replace('0.', ''),
        $kind: 'template',
        $content: {
          title: '',
          description: '',
          twig: defaultTwig,
          category: [
            {
              value: this.basename + form.category + '.' + form.name
            }
          ]
        }
      };

      const template = await this.roc.create(templateEntry);
      await this.refreshTemplates();
      console.log(template);
      return template;
    }

    async refreshTemplates() {
      const filter = (template) =>
        template.value.category &&
        template.value.category.find(
          (category) =>
            category.value && category.value.startsWith(this.basename)
        );

      let templates = await this.roc.query('toc', { mine: true, filter });
      templates.forEach((template) => (template.readWrite = true));

      const allTemplates = await this.roc.query('toc', { filter });
      for (let newTemplate of allTemplates) {
        if (!templates.find((template) => template.id === newTemplate.id)) {
          newTemplate.readWrite = false;
          templates.push(newTemplate);
        }
      }

      templates = templates.sort(
        (a, b) => b.value.modificationDate - a.value.modificationDate
      );
      await API.createData('templates', templates);
      setTimeout(() => {
        API.doAction('setSelectedTemplate', 0);
      });
      return templates;
    }

    async doAction(action, options) {
      if (!action) return;
      var actionName = action.name;
      var actionValue = action.value;

      console.log('ACTION:', actionName, actionValue);

      switch (actionName) {
        case 'createTemplate':
          return this.createTemplate(options);
        case 'updateTemplate':
          return this.updateTemplate(actionValue);
        case 'deleteTemplate':
          return this.deleteTemplate(actionValue);
        case 'getTemplate':
          return this.getTemplate(actionValue);
        case 'showTemplateInfo':
          return this.showTemplateInfo(actionValue);
        case 'editTemplateAccess':
          return this.editTemplateAccess(actionValue);
        case 'refreshTemplates':
          return this.refreshTemplates();
      }
    }

    async editTemplateAccess(entry) {
      const record = await this.roc.get(entry.id);
      const changed = await getChangedGroups(record, this.allGroups);
      if (!changed) return;
      try {
        for (let group of changed.add) {
          await this.roc.addGroup(record, group);
        }
        for (let group of changed.remove) {
          await this.roc.deleteGroup(record, group);
        }
      } catch (e) {
        UI.showNotification(e.message, 'error');
      }
    }

    async showTemplateInfo(entry) {
      const record = await this.roc.get(entry.id);
      console.log('got record');
      console.log({ record });
      return showRecordInfo(record);
    }
  }
  return TemplatesManager;
});
