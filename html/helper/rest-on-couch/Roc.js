define([
  'src/main/datas',
  'src/util/api',
  'src/util/ui',
  'src/util/util',
  'src/util/debug',
  'superagent',
  'uri/URI',
  'lodash',
  'src/util/couchdbAttachments',
  'src/util/mimeTypes',
  'src/util/IDBKeyValue',
  'eventEmitter',
  './UserViewPrefs',
  './UserAnalysisResults'
], function (
  Datas,
  API,
  ui,
  Util,
  Debug,
  superagent,
  URI,
  _,
  CDB,
  mimeTypes,
  IDB,
  EventEmitter,
  UserViewPrefs,
  UserAnalysisResults
) {
  const DataObject = Datas.DataObject;
  const eventEmitters = {};

  const objectHasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwnProperty = function (obj, prop) {
    return objectHasOwnProperty.call(obj, prop);
  };

  function setTabSavedStatus(saved) {
    if (self.IframeBridge) {
      self.IframeBridge.postMessage('tab.status', {
        saved
      });
    }
  }

  const defaultOptions = {
    messages: {
      200: 'OK',
      201: 'Created',
      202: 'Accepted',
      204: 'No content',
      400: 'Bad request',
      401: 'Unauthorized',
      404: 'Not Found',
      409: 'Conflict',
      403: 'Forbidden',
      408: 'Request timeout',
      500: 'Internal server error',
      502: 'Bad gateway'
    }
  };

  const getTypes = [
    'get',
    'getAttachment',
    'getView',
    'getQuery',
    'getTokens',
    'getGroups',
    'getGroupsInfo',
    'getToken'
  ];

  const messagesByType = {
    get: {
      401: 'Unauthorized to get entry'
    },
    getAll: {
      401: 'Unauthorized to get all entries'
    },
    create: {
      200: 'Entry created',
      201: 'Entry created',
      401: 'Unauthorized to create entry'
    },
    update: {
      200: 'Entry updated',
      401: 'Unauthorized to update entry',
      404: 'Could not update entry: does not exist'
    },
    delete: {
      200: 'Entry deleted',
      401: 'Unauthorized to delete entry',
      404: 'Cannot delete entry: does not exist'
    },
    addAttachment: {
      200: 'Added attachment',
      401: 'Unauthorized to add attachment',
      404: 'Cannot add attachment: document does not exist'
    },
    deleteAttachment: {
      200: 'Attachment deleted',
      401: 'Unauthorized to delete attachment',
      404: 'Cannot delete attachment: does not exist'
    },
    getAttachment: {
      401: 'Unauthorized to get attachment',
      404: 'Attachment does not exist'
    },
    getView: {
      401: 'Unauthorized to get view',
      404: 'View does not exist'
    },
    getQuery: {
      401: 'Unauthorized to get query',
      404: 'Query does not exist'
    },
    getGroups: {},
    getGroupsInfo: {},
    addGroup: {
      401: 'Unauthorized to add group',
      200: 'Group added to entry'
    },
    deleteGroup: {
      401: 'Unauthorized to remove group',
      200: 'Group removed from entry'
    },
    getTokens: {},
    getToken: {},
    createToken: {
      200: 'Token created',
      401: 'Unauthorized to create token'
    },
    createUserToken: {
      200: 'Token created',
      401: 'Unauthorized to create token'
    },
    deleteToken: {
      200: 'Token deleted',
      401: 'Unauthorized to delete token'
    }
  };

  for (let key in defaultOptions.messages) {
    // For get requests default is not to show any messages
    if (key < '300') {
      for (let i = 0; i < getTypes.length; i++) {
        messagesByType[getTypes[i]][key] = '';
      }
    }
  }

  const viewSearchJsonify = ['key', 'startkey', 'endkey'];
  const viewSearch = [
    'limit',
    'mine',
    'groups',
    'descending',
    'reduce',
    'include_docs',
    'group',
    'group_level'
  ];
  const mandatoryOptions = ['url', 'database'];

  const idb = new IDB('roc-documents');

  class Roc {
    constructor(opts) {
      for (var key in opts) {
        if (hasOwnProperty(opts, key)) {
          this[key] = opts[key];
        }
      }

      for (let i = 0; i < mandatoryOptions.length; i++) {
        if (!this[mandatoryOptions[i]]) {
          throw new Error(`${mandatoryOptions[i]} is a mandatory option`);
        }
      }
      this.messages = this.messages || {};
      this.variables = {};

      this.requestUrl = new URI(opts.url);
      this.sessionUrl = new URI(opts.url)
        .segment('auth/session')
        .normalize()
        .href();
      this.databaseUrl = new URI(opts.url)
        .segment(`db/${this.database}`)
        .normalize()
        .href();
      this.entryUrl = new URI(this.databaseUrl)
        .segment('entry')
        .normalize()
        .href();
      this.trackIgnore = new Map();
      this.__ready = Promise.resolve();

      this.UserViewPrefs = new UserViewPrefs(this);
      this.UserAnalysisResults = new UserAnalysisResults(this);
    }

    async getUser() {
      await this.__ready;
      return (await fetch(this.sessionUrl, { credentials: 'include' })).json();
    }

    /**
     * Retrieve current logged in user preferences
     * @param {*} defaultPrefs
     */
    async getUserPrefs(defaultPrefs = {}) {
      await this.__ready;
      try {
        return (
          await fetch(`${this.databaseUrl}/user/_me`, {
            credentials: 'include'
          })
        ).json();
      } catch (e) {
        this.setUserPrefs(defaultPrefs);
        return defaultPrefs;
      }
    }

    /**
     * Set user personal preferences. The key of the object send are joined on the server side
     * @param {*} prefs - the prefereces to save as an object
     */
    async setUserPrefs(prefs) {
      await this.__ready;
      const res = await superagent
        .post(`${this.databaseUrl}/user/_me`)
        .withCredentials()
        .send(prefs);
      return res.body;
    }

    async getUserInfo() {
      await this.__ready;
      return (
        await fetch(`${this.databaseUrl}/userInfo/_me`, {
          credentials: 'include'
        })
      ).json();
    }

    async view(viewName, options) {
      await this.__ready;
      options = createOptions(options, 'getView');
      let requestUrl = new URI(this.databaseUrl).segment(`_view/${viewName}`);
      addSearch(requestUrl, options);

      requestUrl = requestUrl.normalize().href();

      return superagent
        .get(requestUrl)
        .withCredentials()
        .then((res) => {
          if (res && res.body && res.status === 200) {
            if (options.filter) {
              res.body = res.body.filter(options.filter);
            }
            if (options.sort) {
              res.body = res.body.sort(options.sort);
            }
            if (options.varName) {
              for (var i = 0; i < res.body.length; i++) {
                this.typeUrl(res.body[i].$content, res.body[i]);
              }
              return API.createData(options.varName, res.body).then((data) => {
                this.variables[options.varName] = {
                  type: 'view',
                  options,
                  viewName,
                  requestUrl,
                  data: data
                };
                for (var i = 0; i < data.length; i++) {
                  data.traceSync([i]);
                }
                return data;
              });
            }
          }
          return res.body;
        })
        .then(handleSuccess(this, options))
        .catch(handleError(this, options));
    }

    async query(viewName, options) {
      await this.__ready;
      options = createOptions(options, 'getQuery');
      let requestUrl = new URI(this.databaseUrl).segment(`_query/${viewName}`);
      addSearch(requestUrl, options);
      requestUrl = requestUrl.normalize().href();

      return superagent
        .get(requestUrl)
        .withCredentials()
        .then((res) => {
          if (res && res.body && res.status === 200) {
            if (options.filter) {
              res.body = res.body.filter(options.filter);
            }
            if (options.sort) {
              res.body = res.body.sort(options.sort);
            }
            if (options.addRightsInfo) {
              for (var i = 0; i < res.body.length; i++) {
                res.body[i].anonymousRead = {
                  type: 'boolean',
                  withCredentials: true,
                  url: `${this.entryUrl}/${res.body[i].id}/_rights/read?asAnonymous=true`
                };
                res.body[i].userWrite = {
                  type: 'boolean',
                  withCredentials: true,
                  url: `${this.entryUrl}/${res.body[i].id}/_rights/write`
                };
              }
            }
            for (let i = 0; i < res.body.length; i++) {
              res.body[i].document = {
                type: 'object',
                withCredentials: true,
                url: `${this.entryUrl}/${res.body[i].id}`
              };
            }
            if (options.varName) {
              return API.createData(options.varName, res.body).then((data) => {
                this.variables[options.varName] = {
                  type: 'query',
                  options,
                  requestUrl,
                  viewName,
                  data: data
                };
                return data;
              });
            }
          }
          return res.body;
        })
        .then(handleSuccess(this, options))
        .catch(handleError(this, options));
    }

    getDocumentEventEmitter(uuid) {
      if (!eventEmitters[uuid]) {
        // We use this object to store some state...
        eventEmitters[uuid] = {
          isSync: undefined,
          eventEmitter: new EventEmitter()
        };
      } else {
        if (!eventEmitters[uuid].eventEmitter) {
          eventEmitters[uuid].eventEmitter = new EventEmitter();
        }
      }
      return eventEmitters[uuid].eventEmitter;
    }

    _emitSync(uuid, isSync) {
      uuid = String(uuid);
      setTabSavedStatus(isSync);
      if (eventEmitters[uuid]) {
        if (eventEmitters[uuid].isSync !== isSync) {
          eventEmitters[uuid].isSync = isSync;
          if (eventEmitters[uuid].eventEmitter) {
            eventEmitters[uuid].eventEmitter.emit(isSync ? 'sync' : 'unsync');
          }
        }
      } else {
        eventEmitters[uuid] = {
          isSync
        };
      }
    }

    bindChange(varName) {
      const variable = this.variables[varName];
      if (!variable) return;
      this.unbindChange(varName);
      variable.onChange = () => {
        const serverJsonString = JSON.stringify(variable.data.$content);
        const uuid = String(variable.data._id);
        if (serverJsonString !== variable.serverJsonString) {
          idb.set(uuid, JSON.parse(JSON.stringify(variable.data)));
          this._emitSync(uuid, false);
        } else {
          // Going back to previous state sets the tab as saved
          idb.delete(uuid);
          this._emitSync(uuid, true);
        }
      };
      variable.data.onChange(variable.onChange);
    }

    unbindChange(varName) {
      const variable = this.variables[varName];
      if (!variable) return;
      if (!variable.onChange) return;
      variable.data.unbindChange(variable.onChange);
    }

    bindChangeByUuid(uuid) {
      for (let key in this.variables) {
        if (
          this.variables[key].type === 'document' &&
          String(this.variables[key].data._id) === String(uuid)
        ) {
          this.bindChange(key);
        }
      }
    }

    unbindChangeByUuid(uuid) {
      for (let key in this.variables) {
        if (
          this.variables[key].type === 'document' &&
          String(this.variables[key].data._id) === String(uuid)
        ) {
          this.unbindChange(key);
        }
      }
    }

    async document(uuid, options) {
      options = options || {};
      const doc = await this.get(uuid, options);
      await this.updateAttachmentList(doc);
      if (!doc) return null;
      if (options.varName) {
        this.typeUrl(doc.$content, doc);
        const data = await API.createData(options.varName, doc);
        this.variables[options.varName] = {
          type: 'document',
          data: data,
          serverJsonString: JSON.stringify(data.$content)
        };
        if (options.track) {
          this.bindChange(options.varName);
          try {
            const localEntry = await idb.get(data._id);
            if (localEntry) {
              if (localEntry._rev === doc._rev) {
                this._updateByUuid(data._id, localEntry, options);
              } else {
                // Local storage has an anterior revision
                idb.delete(data._id);
              }
            }
          } catch (e) {
            Debug.error('could not retrieve local entry', e, e.stack);
          }
        }
        return data;
      }
      return doc;
    }

    async getAll(options) {
      await this.__ready;
      options = createOptions(options, 'getAll');
      try {
        const res = await superagent
          .get(`${this.entryUrl}/_all`)
          .withCredentials();
        if (res.body && res.status === 200) {
          return res.body;
        }
        return null;
      } catch (e) {
        handleError(this, options);
        return null;
      }
    }

    async getHeader(entry, options) {
      await this.__ready;
      const uuid = getUuid(entry);
      return (
        superagent
          .head(`${this.entryUrl}/${uuid}`)
          //       .query(options.query)
          .withCredentials()
          .then((res) => {
            if (res.header && res.status === 200) {
              return res.header;
            }
            return null;
          })
          .catch(handleError(this, options))
      );
    }

    async get(entry, options) {
      await this.__ready;
      const uuid = getUuid(entry);
      options = createOptions(options, 'get');
      if (options.fromCache) {
        const e = this._findByUuid(uuid);
        if (e) return e;
        if (!options.fallback) return e;
      }
      return superagent
        .get(`${this.entryUrl}/${uuid}`)
        .query(options.query)
        .withCredentials()
        .then((res) => {
          if (res.body && res.status === 200) {
            this._defaults(res.body.$content);
            if (!options.noUpdate) {
              this._updateByUuid(uuid, res.body, options);
            }
            return res.body;
          }
          return null;
        })
        .catch(handleError(this, options));
    }

    async getById(id, options) {
      await this.__ready;
      options = createOptions(options, 'get');
      const entry = this._findById(id);
      if (!entry || options.fromCache) {
        return entry;
      }
      return this.get(entry).catch(handleError(this, options));
    }

    // Get the groups the user is owner of
    async getGroups(options) {
      await this.__ready;
      options = createOptions(options, 'getGroups');
      const groupUrl = new URI(this.databaseUrl)
        .segment('groups')
        .normalize()
        .href();
      return superagent
        .get(groupUrl)
        .withCredentials()
        .then((res) => res.body)
        .catch(handleError(this, options));
    }

    // Get basic info about every group (only name and description)
    async getGroupsInfo(options) {
      await this.__ready;
      options = createOptions(options, 'getGroupsInfo');
      const groupsInfoUrl = new URI(this.databaseUrl)
        .segment('groups/info')
        .normalize()
        .href();
      return superagent
        .get(groupsInfoUrl)
        .withCredentials()
        .then((res) => res.body)
        .catch(handleError(this, options));
    }

    // Get the groups the user is member of
    // Returns a promise that resolves with an array of strings
    async getGroupMembership(options) {
      options = createOptions(options);
      await this.__ready;
      const url = new URI(this.databaseUrl).segment('user/_me/groups');
      return superagent
        .get(url)
        .withCredentials()
        .then((res) => res.body)
        .catch(handleError(this, options));
    }

    async create(entry, options) {
      await this.__ready;
      options = createOptions(options, 'create');
      if (!entry.$kind) {
        entry.$kind = this.kind;
      }
      this._defaults(entry.$content);
      return superagent
        .post(this.entryUrl)
        .withCredentials()
        .send(entry)
        .then(handleSuccess(this, options))
        .then((res) => {
          if (res.body && (res.status === 200 || res.status === 201)) {
            return this.get(res.body.id);
          }
          return null;
        })
        .then((entry) => {
          if (!entry) return null;
          this.typeUrl(entry.$content, entry);
          let keys = Object.keys(this.variables);
          for (let i = 0; i < keys.length; i++) {
            let v = this.variables[keys[i]];
            if (v.type === 'view') {
              var idx = v.data.length;
              v.data.push(entry);
              v.data.traceSync([idx]);
              if (!options.noTrigger) {
                v.data.triggerChange();
              }
            } else if (v.type === 'query') {
              this.query(v.viewName, v.options);
            }
          }
          return entry;
        })
        .catch(handleError(this, options));
    }

    async getLastRevision(entry) {
      const uuid = getUuid(entry);
      const header = await this.getHeader(uuid);
      return header.etag.replace(/"/g, '');
    }

    async update(entry, options) {
      await this.__ready;
      options = createOptions(options, 'update');
      var reqEntry = DataObject.resurrect(entry);
      this.untypeUrl(reqEntry.$content);
      return superagent
        .put(`${this.entryUrl}/${String(entry._id)}`)
        .withCredentials()
        .send(reqEntry)
        .then(handleSuccess(this, options))
        .then((res) => {
          if (res.body && res.status === 200) {
            entry._rev = res.body.rev;
            entry.$creationDate = res.body.$creationDate;
            entry.$modificationDate = res.body.$modificationDate;
            this._updateByUuid(
              entry._id,
              entry,
              Object.assign(options, { updateServerString: true })
            );
            idb.delete(entry._id);
          }
          return entry;
        })
        .catch(handleError(this, options));
    }

    async deleteAttachment(entry, attachments, options) {
      await this.__ready;
      options = createOptions(options, 'deleteAttachment');
      if (DataObject.getType(entry) !== 'object') {
        handleError(this, options)(new Error('invalid argument'));
        return null;
      }
      if (Array.isArray(attachments) && attachments.length === 0) return entry;
      if (!Array.isArray(attachments)) attachments = [attachments];

      attachments = attachments.map(String);
      entry = await this.get(entry, { fromCache: true, fallback: true });

      try {
        const hasDeleted = this._deleteFilename(entry.$content, attachments);
        for (let i = 0; i < attachments.length; i++) {
          delete entry._attachments[attachments[i]];
        }
        const cdb = this._getCdb(entry);
        await cdb.remove(attachments, { noRefresh: true });
        const data = await this.get(entry, { noUpdate: true });

        entry._rev = data._rev;
        entry._attachments = data._attachments;
        entry.$creationDate = data.$creationDate;
        entry.$modificationDate = data.$modificationDate;
        await this.updateAttachmentList(entry);
        if (hasDeleted) {
          await this.update(entry, options);
        } else if (entry.triggerChange && !options.noTrigger) {
          entry.triggerChange();
          handleSuccess(this, options)(entry);
        }
      } catch (e) {
        return handleError(this, options)(e);
      }
      return entry;
    }

    removeAttachment(entry, attachments, options) {
      return this.deleteAttachment(entry, attachments, options);
    }

    async unattach(entry, row, options) {
      await this.__ready;
      options = createOptions(options, 'deleteAttachment');
      if (!this.processor) throw new Error('no processor');
      if (!row.__parent) {
        throw new Error('row must be linked to parent for unattach to work');
      }
      var arr = row.__parent;
      var idx = arr.indexOf(row);
      if (idx === -1) {
        Debug.warn('element to unattach not found');
        return null;
      }

      var toDelete = this._findFilename(row);
      toDelete = toDelete.map((d) => String(d.filename));

      // We compute the difference between the delete and still present attachment
      // entries, just in case there are 2 for the same attachment. In that case the
      // attachment should not be deleted
      var toKeep = this._findFilename(entry.$content, toDelete);
      toKeep = toKeep
        .map((k) => String(k.filename))
        .filter((k) => k === row.filename);
      toDelete = _.difference(toDelete, toKeep);
      await this.deleteAttachment(entry, toDelete, options);
      arr.splice(idx, 1);
      if (!options.noTrigger) {
        arr.triggerChange();
      }
      await this.update(entry);
      return entry;
    }

    async _processAttachment(type, attachment) {
      let filename;
      if (!attachment.filename) {
        filename = await ui.enterValue('Enter a filename');
      }
      if (filename) attachment.filename = filename;
      if (!attachment.filename) {
        return false;
      }

      attachment.filename = this.processor.getFilename(
        type,
        attachment.filename
      );

      // If we had to ask for a filename, resolve content type
      var fallback;
      if (filename) {
        fallback = attachment.contentType;
        attachment.contentType = undefined;
      }
      setContentType(attachment, fallback);
      return true;
    }

    async attachBulk(type, entry, attachments, options) {
      if (!attachments.length) return null;
      if (attachments.length === 1) {
        return this.attach(type, entry, attachments[0], options);
      }
      await this.__ready;
      const attachOptions = createOptions(options, 'attach');
      try {
        for (let i = 0; i < attachments.length; i++) {
          let attachment = attachments[i];
          if (!this._processAttachment(type, attachment)) return null;
        }
        entry = await this.get(entry, { fromCache: true, fallback: true });
        const addAttachmentOptions = createOptions(options, 'addAttachment');
        entry = await this.addAttachment(
          entry,
          attachments,
          addAttachmentOptions
        );

        for (let i = 0; i < attachments.length; i++) {
          await this.processor.process(type, entry.$content, attachments[i]);
        }
        this.typeUrl(entry.$content, entry);
        await this.update(entry);
      } catch (e) {
        return handleError(this, attachOptions)(e);
      }
      handleSuccess(this, attachOptions)(entry);
      return entry;
    }

    async attach(type, entry, attachment, options) {
      await this.__ready;
      var attachOptions = createOptions(options, 'attach');

      try {
        const ok = this._processAttachment(type, attachment);
        if (!ok) return null;

        entry = await this.get(entry, { fromCache: true, fallback: true });
        const addAttachmentOptions = createOptions(options, 'addAttachment');
        entry = await this.addAttachment(
          entry,
          attachment,
          addAttachmentOptions
        );
        if (!this.processor) {
          throw new Error('no processor');
        }

        await this.processor.process(
          type,
          entry.$content,
          attachment,
          attachOptions.customMetadata
        );
        this.typeUrl(entry.$content, entry);
        await this.update(entry);
      } catch (e) {
        return handleError(this, attachOptions)(e);
      }
      handleSuccess(this, attachOptions)(entry);
      return entry;
    }

    async discardLocal(entry) {
      // entry or uuid
      const uuid = getUuid(entry);
      // Make sure the data change is not tracked
      this.unbindChangeByUuid(uuid);
      // Get from server again
      const serverEntry = await this.get(entry);
      this._updateByUuid(entry._id, serverEntry, {
        updateServerString: true
      });
      try {
        await idb.delete(uuid);
      } catch (e) {
        // ignored error
      }
      // Track data again
      this.bindChangeByUuid(uuid);
      if (entry.triggerChange) entry.triggerChange();
      return serverEntry;
    }

    async getAttachment(entry, name, options) {
      await this.__ready;
      options = createOptions(options, 'getAttachment');
      const cdb = this._getCdb(entry);
      return cdb.get(name, options).catch(handleError(this, options));
    }

    async getAttachmentList(entry) {
      await this.__ready;
      const cdb = this._getCdb(entry);
      return cdb.list();
    }

    async updateAttachmentList(entry) {
      await this.__ready;
      const cdb = this._getCdb(entry);
      entry.attachmentList = await cdb.list();
    }

    async addAttachment(entry, attachments, options) {
      options = options || {};
      let filename = true;
      await this.__ready;
      attachments = DataObject.resurrect(attachments);
      if (attachments.length === 1) {
        attachments = attachments[0];
      }

      if (!Array.isArray(attachments)) {
        if (!attachments.filename) {
          filename = await ui.enterValue('Enter a filename');
          if (filename) attachments.filename = filename;
          if (!attachments.filename) {
            return null;
          }
          // If we had to ask for a filename, resolve content type
          var fallback = attachments.contentType;
          attachments.contentType = undefined;
          setContentType(attachments, fallback);
          attachments = [attachments];
        } else {
          attachments = [attachments];
        }
      }

      attachments.forEach((attachment) => {
        setContentType(attachment);
      });

      if (!filename) return null;

      options = createOptions(options, 'addAttachment');
      entry = await this.get(entry, { fromCache: true, fallback: true });

      try {
        const cdb = this._getCdb(entry);
        await cdb.inlineUploads(attachments, {
          noRefresh: true
        });
        const data = await this.get(entry, { noUpdate: true });
        entry._rev = data._rev;
        entry._attachments = data._attachments;
        entry.$creationDate = data.$creationDate;
        entry.$modificationDate = data.$modificationDate;
        await this.updateAttachmentList(entry);
        if (entry.triggerChange && !options.noTrigger) {
          entry.triggerChange();
        }
      } catch (e) {
        return handleError(this, options)(e);
      }
      handleSuccess(this, options)(entry);
      return entry;
    }

    async addAttachmentById(id, attachment, options) {
      options = options || {};
      await this.__ready;
      const doc = this._findById(id);
      if (!doc) return null;
      return this.addAttachment(doc._id, attachment, options);
    }

    async getTokens(options) {
      await this.__ready;
      options = createOptions(options, 'getTokens');
      const tokenUrl = new URI(this.databaseUrl)
        .segment('token')
        .normalize()
        .href();
      return superagent
        .get(tokenUrl)
        .withCredentials()
        .then(handleSuccess(this, options))
        .then((res) => res.body)
        .catch(handleError(this, options));
    }

    async getToken(token, options) {
      await this.__ready;
      options = createOptions(options, 'getToken');
      const tokenId = getTokenId(token);
      const tokenUrl = new URI(this.databaseUrl)
        .segment(`token/${tokenId}`)
        .normalize()
        .href();
      return superagent
        .get(tokenUrl)
        .withCredentials()
        .then(handleSuccess(this, options))
        .then((res) => res.body)
        .catch(handleError(this, options));
    }

    async createToken(entry, options) {
      await this.__ready;
      options = createOptions(options, 'createToken');
      const uuid = getUuid(entry);
      const request = superagent
        .post(`${this.entryUrl}/${uuid}/_token`)
        .withCredentials();
      if (options.rights) {
        let rights = options.rights;
        if (Array.isArray(rights)) {
          rights = options.rights.join(',');
        }
        request.query({ rights });
      }
      return request
        .then(handleSuccess(this, options))
        .then((res) => res.body)
        .catch(handleError(this, options));
    }

    async createUserToken(options) {
      await this.__ready;
      options = createOptions(options, 'createUserToken');
      const request = superagent
        .post(`${this.databaseUrl}/user/_me/token`)
        .withCredentials();
      if (options.rights) {
        let rights = options.rights;
        if (Array.isArray(rights)) {
          rights = options.rights.join(',');
        }
        request.query({ rights });
      }
      return request
        .then(handleSuccess(this, options))
        .then((res) => res.body)
        .catch(handleError(this, options));
    }

    async deleteToken(token, options) {
      await this.__ready;
      options = createOptions(options, 'deleteToken');
      const tokenId = getTokenId(token);
      const tokenUrl = new URI(this.databaseUrl)
        .segment(`token/${tokenId}`)
        .normalize()
        .href();
      return superagent
        .del(tokenUrl)
        .withCredentials()
        .then(handleSuccess(this, options))
        .then((res) => res.body)
        .catch(handleError(this, options));
    }

    async addGroup(entry, group, options, remove) {
      const uuid = getUuid(entry);
      const eventEmmitter = eventEmitters[uuid];
      if (eventEmmitter && eventEmmitter.isSync === false) {
        throw new Error('Cannot update group while entry is edited');
      }
      var method = remove ? 'del' : 'put';
      await this.__ready;
      options = createOptions(options, remove ? 'deleteGroup' : 'addGroup');
      return superagent[method](
        `${this.entryUrl}/${uuid}/_owner/${String(group)}`
      )
        .withCredentials()
        .then(handleSuccess(this, options))
        .then((res) => {
          if (!options.noUpdate) {
            return this.get(uuid).then(() => res.body);
          } else {
            return res.body;
          }
        })
        .catch(handleError(this, options));
    }

    deleteGroup(entry, group, options) {
      return this.addGroup(entry, group, options, true);
    }

    async delete(entry, options) {
      await this.__ready;
      const uuid = getUuid(entry);
      options = createOptions(options, 'delete');
      return superagent
        .del(`${this.entryUrl}/${uuid}`)
        .withCredentials()
        .then(handleSuccess(this, options))
        .then((res) => {
          if (res.body && res.status === 200) {
            for (let key in this.variables) {
              const idx = this._findIndexByUuid(uuid, key);
              if (idx !== -1) {
                this.variables[key].data.splice(idx, 1);
                if (!options.noTrigger) {
                  this.variables[key].data.triggerChange();
                }
              }
            }
          }
          return res.body;
        })
        .catch(handleError(this, options));
    }

    remove(entry, options) {
      return this.delete(entry, options);
    }

    // Private
    _getCdb(entry) {
      var uuid;
      var type = DataObject.getType(entry);
      if (type === 'object') {
        uuid = String(entry._id);
      } else {
        throw new Error('Bad arguments, entry can only be an object');
      }
      const docUrl = `${this.entryUrl}/${String(uuid)}`;
      var cdb = new CDB(docUrl);
      cdb.setDoc(entry);
      return cdb;
    }

    _findByUuid(uuid, key) {
      if (key === undefined) {
        var result;
        // Return the first one found (they are all supposed to be the same...)
        for (let key in this.variables) {
          result = this._findByUuid(uuid, key);
          if (result) return result;
        }
        return null;
      }

      if (!this.variables[key]) return null;
      if (this.variables[key].type === 'view') {
        return this.variables[key].data.find(
          (entry) => String(entry._id) === String(uuid)
        );
      } else if (this.variables[key].type === 'document') {
        if (String(this.variables[key].data._id) === String(uuid)) {
          return this.variables[key].data;
        }
      }
      return null;
    }

    _findById(id, key) {
      if (key === undefined) {
        var result;
        for (let key in this.variables) {
          result = this._findById(id, key);
          if (result) return result;
        }
        return null;
      }
      if (!this.variables[key]) return null;
      id = DataObject.resurrect(id);
      if (
        this.variables[key].type === 'document' &&
        _.isEqual(DataObject.resurrect(this.variables[key].data.$id), id)
      ) {
        return this.variables[key].data;
      } else if (this.variables[key].type === 'view') {
        return this.variables[key].data.find((entry) =>
          _.isEqual(id, DataObject.resurrect(entry.$id))
        );
      }
      return null;
    }

    _findIndexByUuid(uuid, key) {
      if (!this.variables[key]) return -1;
      if (this.variables[key].type === 'document') {
        return -1;
      } else if (this.variables[key].type === 'view') {
        return this.variables[key].data.findIndex(
          (entry) => String(entry._id) === String(uuid)
        );
      } else if (this.variables[key].type === 'query') {
        return this.variables[key].data.findIndex(
          (entry) => String(entry.id) === String(uuid)
        );
      }
      return -1;
    }

    _updateByUuid(uuid, data, options) {
      for (let key in this.variables) {
        if (this.variables[key].type === 'view') {
          const idx = this._findIndexByUuid(uuid, key);
          if (idx !== -1) {
            this.typeUrl(data.$content, data);
            // this.variables[key].data.setChildSync([idx], data);
            let row = this.variables[key].data.getChildSync([idx]);
            this._updateDocument(row, data, options);
          }
        } else if (this.variables[key].type === 'document') {
          uuid = String(uuid);
          const _id = this.variables[key].data._id;
          if (uuid === _id) {
            // var newData = DataObject.resurrect(data);
            this.typeUrl(data.$content, data);
            let doc = this.variables[key].data;
            if (options.updateServerString) {
              this.variables[key].serverJsonString = JSON.stringify(
                doc.$content
              );
              this._emitSync(uuid, true);
            }
            this._updateDocument(doc, data, options);
          }
        } else if (
          this.variables[key].type === 'query' &&
          this.queryAutoRefresh
        ) {
          const idx = this._findIndexByUuid(uuid, key);
          if (idx !== -1) {
            // Redo the same query
            this.query(
              this.variables[key].viewName,
              this.variables[key].options
            );
          }
        }
      }
    }

    _updateDocument(doc, data, options) {
      if (doc && data) {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          doc[key] = data[key];
        }
        if (doc.triggerChange && !options.noTrigger) {
          doc.triggerChange();
        }
      }
    }

    _defaults(content) {
      if (this.processor) {
        var kind = this.kind;
        if (kind) {
          this.processor.defaults(kind, content);
        }
      }
    }

    _traverseFilename(v, cb) {
      var type = DataObject.getType(v);
      var i;
      if (type === 'array') {
        for (i = 0; i < v.length; i++) {
          this._traverseFilename(v[i], cb);
        }
      } else if (type === 'object') {
        if (v.filename) {
          cb(v);
        } else {
          var keys = Object.keys(v);
          for (i = 0; i < keys.length; i++) {
            this._traverseFilename(v[keys[i]], cb);
          }
        }
      }
    }

    _findFilename(v, filename) {
      var r = [];
      if (!Array.isArray(filename) && typeof filename !== 'undefined') {
        filename = [filename];
      }
      this._traverseFilename(v, function (v) {
        if (typeof filename === 'undefined') {
          r.push(v);
        } else if (filename.indexOf(String(v.filename)) !== -1) {
          r.push(v);
        }
      });
      return r;
    }

    _deleteFilename(v, filename) {
      let hasDeleted = false;
      var filenames = this._findFilename(v, filename);
      for (var i = 0; i < filenames.length; i++) {
        hasDeleted = true;
        delete filenames[i].filename;
      }
      return hasDeleted;
    }

    untypeUrl(v) {
      this._traverseFilename(v, (v) => {
        if (v.data && v.data.url) {
          delete v.data;
        }
      });
    }

    typeUrl(content, entry) {
      this._traverseFilename(content, (v) => {
        var filename = String(v.filename);
        if (!entry._attachments) return;
        var att = entry._attachments[filename];
        if (!att) return;
        var contentType = String(att.content_type);
        var vtype = Util.contentTypeToType(contentType);
        var prop;
        if (typeValue.indexOf(vtype) !== -1) {
          prop = 'value';
        } else {
          prop = 'url';
        }

        Object.defineProperty(v, 'data', {
          value: {
            type: vtype || 'string'
          },
          enumerable: false,
          writable: true,
          configurable: true
        });

        var dUrl = `${this.entryUrl}/${entry._id}/${encodeURIComponent(
          v.filename
        )}`;
        v.data[prop] = dUrl;
        Object.defineProperty(v, 'dUrl', {
          value: dUrl,
          enumerable: false,
          writable: true
        });
      });
    }
  }

  function createOptions(options, type, custom) {
    var messages = Object.assign(
      {},
      defaultOptions.messages,
      messagesByType[type],
      options && options.messages
    );
    options = Object.assign({}, defaultOptions, options, custom);
    if (messages) options.messages = messages;
    options.type = type;
    return options;
  }

  function handleError(ctx, options) {
    return function (err) {
      if (!options.mute || !options.muteError) {
        if (err.status || err.timeout) {
          // error comes from superagent
          handleSuperagentError(err, ctx, options);
        } else {
          defaultErrorHandler(err);
        }
      }
      // Propagate error
      throw err;
    };
  }

  function handleSuccess(ctx, options) {
    return function (data) {
      if (!options.mute && !options.muteSuccess) {
        if (data.status) {
          handleSuperagentSuccess(data, ctx, options);
        } else if (options.type && options.type.match(/attachment/i)) {
          handleSuperagentSuccess({ status: 200 }, ctx, options);
        }
      }
      return data;
    };
  }

  function handleSuperagentSuccess(data, ctx, options) {
    const message = options.messages[data.status] || ctx.messages[data.status];
    if (message && !options.disableNotification) {
      ui.showNotification(message, 'success');
    }
  }

  function handleSuperagentError(err, ctx, options) {
    const message = options.messages[err.status] || ctx.messages[err.status];
    if (message && !options.disableNotification) {
      ui.showNotification(message, 'error');
      Debug.error(err, err.stack);
    }
  }

  function getUuid(entry) {
    var uuid;
    var type = DataObject.getType(entry);
    if (type === 'string') {
      uuid = entry;
    } else if (type === 'object') {
      uuid = entry._id;
    } else {
      throw new Error('Bad arguments');
    }
    return String(uuid);
  }

  function getTokenId(token) {
    var id;
    var type = DataObject.getType(token);
    if (type === 'string') {
      id = token;
    } else if (type === 'object') {
      id = token.$id;
    } else {
      throw new Error('Bad arguments');
    }
    return String(id);
  }

  function defaultErrorHandler(err) {
    ui.showNotification(`Error: ${err.message}`, 'error');
    Debug.error(err, err.stack);
  }

  function setContentType(attachment, fallback) {
    fallback = fallback || 'application/octet-stream';
    var filename = attachment.filename;
    var contentType = attachment.contentType;
    if (contentType && contentType !== 'application/octet-stream') {
      return;
    }

    // Ideally jcamp extensions should be handled by mime-types
    attachment.contentType = mimeTypes.lookup(filename, fallback) || fallback;
  }

  function addSearch(requestUrl, options) {
    for (let i = 0; i < viewSearchJsonify.length; i++) {
      if (options[viewSearchJsonify[i]]) {
        requestUrl.addSearch(
          viewSearchJsonify[i],
          JSON.stringify(options[viewSearchJsonify[i]])
        );
      }
    }

    for (let i = 0; i < viewSearch.length; i++) {
      if (options[viewSearch[i]]) {
        requestUrl.addSearch(viewSearch[i], options[viewSearch[i]]);
      }
    }
  }

  const typeValue = ['gif', 'tiff', 'jpeg', 'jpg', 'png'];

  return Roc;
});
