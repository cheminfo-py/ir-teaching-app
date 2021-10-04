"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(['src/main/datas', 'src/util/api', 'src/util/ui', 'src/util/util', 'src/util/debug', 'superagent', 'uri/URI', 'lodash', 'src/util/couchdbAttachments', 'src/util/mimeTypes', 'src/util/IDBKeyValue', 'eventEmitter', './UserViewPrefs', './UserAnalysisResults'], function (Datas, API, ui, Util, Debug, superagent, URI, _, CDB, mimeTypes, IDB, EventEmitter, UserViewPrefs, UserAnalysisResults) {
  var DataObject = Datas.DataObject;
  var eventEmitters = {};
  var objectHasOwnProperty = Object.prototype.hasOwnProperty;

  var hasOwnProperty = function hasOwnProperty(obj, prop) {
    return objectHasOwnProperty.call(obj, prop);
  };

  function setTabSavedStatus(saved) {
    if (self.IframeBridge) {
      self.IframeBridge.postMessage('tab.status', {
        saved: saved
      });
    }
  }

  var defaultOptions = {
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
  var getTypes = ['get', 'getAttachment', 'getView', 'getQuery', 'getTokens', 'getGroups', 'getGroupsInfo', 'getToken'];
  var messagesByType = {
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
    "delete": {
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

  for (var key in defaultOptions.messages) {
    // For get requests default is not to show any messages
    if (key < '300') {
      for (var i = 0; i < getTypes.length; i++) {
        messagesByType[getTypes[i]][key] = '';
      }
    }
  }

  var viewSearchJsonify = ['key', 'startkey', 'endkey'];
  var viewSearch = ['limit', 'mine', 'groups', 'descending', 'reduce', 'include_docs', 'group', 'group_level'];
  var mandatoryOptions = ['url', 'database'];
  var idb = new IDB('roc-documents');

  var Roc = /*#__PURE__*/function () {
    function Roc(opts) {
      _classCallCheck(this, Roc);

      for (var key in opts) {
        if (hasOwnProperty(opts, key)) {
          this[key] = opts[key];
        }
      }

      for (var _i = 0; _i < mandatoryOptions.length; _i++) {
        if (!this[mandatoryOptions[_i]]) {
          throw new Error("".concat(mandatoryOptions[_i], " is a mandatory option"));
        }
      }

      this.messages = this.messages || {};
      this.variables = {};
      this.requestUrl = new URI(opts.url);
      this.sessionUrl = new URI(opts.url).segment('auth/session').normalize().href();
      this.databaseUrl = new URI(opts.url).segment("db/".concat(this.database)).normalize().href();
      this.entryUrl = new URI(this.databaseUrl).segment('entry').normalize().href();
      this.trackIgnore = new Map();
      this.__ready = Promise.resolve();
      this.UserViewPrefs = new UserViewPrefs(this);
      this.UserAnalysisResults = new UserAnalysisResults(this);
    }

    _createClass(Roc, [{
      key: "getUser",
      value: function () {
        var _getUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.__ready;

                case 2:
                  _context.next = 4;
                  return fetch(this.sessionUrl, {
                    credentials: 'include'
                  });

                case 4:
                  return _context.abrupt("return", _context.sent.json());

                case 5:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function getUser() {
          return _getUser.apply(this, arguments);
        }

        return getUser;
      }()
      /**
       * Retrieve current logged in user preferences
       * @param {*} defaultPrefs
       */

    }, {
      key: "getUserPrefs",
      value: function () {
        var _getUserPrefs = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          var defaultPrefs,
              _args2 = arguments;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  defaultPrefs = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
                  _context2.next = 3;
                  return this.__ready;

                case 3:
                  _context2.prev = 3;
                  _context2.next = 6;
                  return fetch("".concat(this.databaseUrl, "/user/_me"), {
                    credentials: 'include'
                  });

                case 6:
                  return _context2.abrupt("return", _context2.sent.json());

                case 9:
                  _context2.prev = 9;
                  _context2.t0 = _context2["catch"](3);
                  this.setUserPrefs(defaultPrefs);
                  return _context2.abrupt("return", defaultPrefs);

                case 13:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[3, 9]]);
        }));

        function getUserPrefs() {
          return _getUserPrefs.apply(this, arguments);
        }

        return getUserPrefs;
      }()
      /**
       * Set user personal preferences. The key of the object send are joined on the server side
       * @param {*} prefs - the prefereces to save as an object
       */

    }, {
      key: "setUserPrefs",
      value: function () {
        var _setUserPrefs = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(prefs) {
          var res;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return this.__ready;

                case 2:
                  _context3.next = 4;
                  return superagent.post("".concat(this.databaseUrl, "/user/_me")).withCredentials().send(prefs);

                case 4:
                  res = _context3.sent;
                  return _context3.abrupt("return", res.body);

                case 6:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function setUserPrefs(_x) {
          return _setUserPrefs.apply(this, arguments);
        }

        return setUserPrefs;
      }()
    }, {
      key: "getUserInfo",
      value: function () {
        var _getUserInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return this.__ready;

                case 2:
                  _context4.next = 4;
                  return fetch("".concat(this.databaseUrl, "/userInfo/_me"), {
                    credentials: 'include'
                  });

                case 4:
                  return _context4.abrupt("return", _context4.sent.json());

                case 5:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function getUserInfo() {
          return _getUserInfo.apply(this, arguments);
        }

        return getUserInfo;
      }()
    }, {
      key: "view",
      value: function () {
        var _view = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(viewName, options) {
          var _this = this;

          var requestUrl;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'getView');
                  requestUrl = new URI(this.databaseUrl).segment("_view/".concat(viewName));
                  addSearch(requestUrl, options);
                  requestUrl = requestUrl.normalize().href();
                  return _context5.abrupt("return", superagent.get(requestUrl).withCredentials().then(function (res) {
                    if (res && res.body && res.status === 200) {
                      if (options.filter) {
                        res.body = res.body.filter(options.filter);
                      }

                      if (options.sort) {
                        res.body = res.body.sort(options.sort);
                      }

                      if (options.varName) {
                        for (var i = 0; i < res.body.length; i++) {
                          _this.typeUrl(res.body[i].$content, res.body[i]);
                        }

                        return API.createData(options.varName, res.body).then(function (data) {
                          _this.variables[options.varName] = {
                            type: 'view',
                            options: options,
                            viewName: viewName,
                            requestUrl: requestUrl,
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
                  }).then(handleSuccess(this, options))["catch"](handleError(this, options)));

                case 7:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function view(_x2, _x3) {
          return _view.apply(this, arguments);
        }

        return view;
      }()
    }, {
      key: "query",
      value: function () {
        var _query = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(viewName, options) {
          var _this2 = this;

          var requestUrl;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'getQuery');
                  requestUrl = new URI(this.databaseUrl).segment("_query/".concat(viewName));
                  addSearch(requestUrl, options);
                  requestUrl = requestUrl.normalize().href();
                  return _context6.abrupt("return", superagent.get(requestUrl).withCredentials().then(function (res) {
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
                            url: "".concat(_this2.entryUrl, "/").concat(res.body[i].id, "/_rights/read?asAnonymous=true")
                          };
                          res.body[i].userWrite = {
                            type: 'boolean',
                            withCredentials: true,
                            url: "".concat(_this2.entryUrl, "/").concat(res.body[i].id, "/_rights/write")
                          };
                        }
                      }

                      for (var _i2 = 0; _i2 < res.body.length; _i2++) {
                        res.body[_i2].document = {
                          type: 'object',
                          withCredentials: true,
                          url: "".concat(_this2.entryUrl, "/").concat(res.body[_i2].id)
                        };
                      }

                      if (options.varName) {
                        return API.createData(options.varName, res.body).then(function (data) {
                          _this2.variables[options.varName] = {
                            type: 'query',
                            options: options,
                            requestUrl: requestUrl,
                            viewName: viewName,
                            data: data
                          };
                          return data;
                        });
                      }
                    }

                    return res.body;
                  }).then(handleSuccess(this, options))["catch"](handleError(this, options)));

                case 7:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function query(_x4, _x5) {
          return _query.apply(this, arguments);
        }

        return query;
      }()
    }, {
      key: "getDocumentEventEmitter",
      value: function getDocumentEventEmitter(uuid) {
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
    }, {
      key: "_emitSync",
      value: function _emitSync(uuid, isSync) {
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
            isSync: isSync
          };
        }
      }
    }, {
      key: "bindChange",
      value: function bindChange(varName) {
        var _this3 = this;

        var variable = this.variables[varName];
        if (!variable) return;
        this.unbindChange(varName);

        variable.onChange = function () {
          var serverJsonString = JSON.stringify(variable.data.$content);
          var uuid = String(variable.data._id);

          if (serverJsonString !== variable.serverJsonString) {
            idb.set(uuid, JSON.parse(JSON.stringify(variable.data)));

            _this3._emitSync(uuid, false);
          } else {
            // Going back to previous state sets the tab as saved
            idb["delete"](uuid);

            _this3._emitSync(uuid, true);
          }
        };

        variable.data.onChange(variable.onChange);
      }
    }, {
      key: "unbindChange",
      value: function unbindChange(varName) {
        var variable = this.variables[varName];
        if (!variable) return;
        if (!variable.onChange) return;
        variable.data.unbindChange(variable.onChange);
      }
    }, {
      key: "bindChangeByUuid",
      value: function bindChangeByUuid(uuid) {
        for (var _key in this.variables) {
          if (this.variables[_key].type === 'document' && String(this.variables[_key].data._id) === String(uuid)) {
            this.bindChange(_key);
          }
        }
      }
    }, {
      key: "unbindChangeByUuid",
      value: function unbindChangeByUuid(uuid) {
        for (var _key2 in this.variables) {
          if (this.variables[_key2].type === 'document' && String(this.variables[_key2].data._id) === String(uuid)) {
            this.unbindChange(_key2);
          }
        }
      }
    }, {
      key: "document",
      value: function () {
        var _document = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(uuid, options) {
          var doc, data, localEntry;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  options = options || {};
                  _context7.next = 3;
                  return this.get(uuid, options);

                case 3:
                  doc = _context7.sent;
                  _context7.next = 6;
                  return this.updateAttachmentList(doc);

                case 6:
                  if (doc) {
                    _context7.next = 8;
                    break;
                  }

                  return _context7.abrupt("return", null);

                case 8:
                  if (!options.varName) {
                    _context7.next = 27;
                    break;
                  }

                  this.typeUrl(doc.$content, doc);
                  _context7.next = 12;
                  return API.createData(options.varName, doc);

                case 12:
                  data = _context7.sent;
                  this.variables[options.varName] = {
                    type: 'document',
                    data: data,
                    serverJsonString: JSON.stringify(data.$content)
                  };

                  if (!options.track) {
                    _context7.next = 26;
                    break;
                  }

                  this.bindChange(options.varName);
                  _context7.prev = 16;
                  _context7.next = 19;
                  return idb.get(data._id);

                case 19:
                  localEntry = _context7.sent;

                  if (localEntry) {
                    if (localEntry._rev === doc._rev) {
                      this._updateByUuid(data._id, localEntry, options);
                    } else {
                      // Local storage has an anterior revision
                      idb["delete"](data._id);
                    }
                  }

                  _context7.next = 26;
                  break;

                case 23:
                  _context7.prev = 23;
                  _context7.t0 = _context7["catch"](16);
                  Debug.error('could not retrieve local entry', _context7.t0, _context7.t0.stack);

                case 26:
                  return _context7.abrupt("return", data);

                case 27:
                  return _context7.abrupt("return", doc);

                case 28:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this, [[16, 23]]);
        }));

        function document(_x6, _x7) {
          return _document.apply(this, arguments);
        }

        return document;
      }()
    }, {
      key: "getAll",
      value: function () {
        var _getAll = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(options) {
          var res;
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'getAll');
                  _context8.prev = 3;
                  _context8.next = 6;
                  return superagent.get("".concat(this.entryUrl, "/_all")).withCredentials();

                case 6:
                  res = _context8.sent;

                  if (!(res.body && res.status === 200)) {
                    _context8.next = 9;
                    break;
                  }

                  return _context8.abrupt("return", res.body);

                case 9:
                  return _context8.abrupt("return", null);

                case 12:
                  _context8.prev = 12;
                  _context8.t0 = _context8["catch"](3);
                  handleError(this, options);
                  return _context8.abrupt("return", null);

                case 16:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this, [[3, 12]]);
        }));

        function getAll(_x8) {
          return _getAll.apply(this, arguments);
        }

        return getAll;
      }()
    }, {
      key: "getHeader",
      value: function () {
        var _getHeader = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(entry, options) {
          var uuid;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  _context9.next = 2;
                  return this.__ready;

                case 2:
                  uuid = getUuid(entry);
                  return _context9.abrupt("return", superagent.head("".concat(this.entryUrl, "/").concat(uuid)) //       .query(options.query)
                  .withCredentials().then(function (res) {
                    if (res.header && res.status === 200) {
                      return res.header;
                    }

                    return null;
                  })["catch"](handleError(this, options)));

                case 4:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        }));

        function getHeader(_x9, _x10) {
          return _getHeader.apply(this, arguments);
        }

        return getHeader;
      }()
    }, {
      key: "get",
      value: function () {
        var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(entry, options) {
          var _this4 = this;

          var uuid, e;
          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  _context10.next = 2;
                  return this.__ready;

                case 2:
                  uuid = getUuid(entry);
                  options = createOptions(options, 'get');

                  if (!options.fromCache) {
                    _context10.next = 10;
                    break;
                  }

                  e = this._findByUuid(uuid);

                  if (!e) {
                    _context10.next = 8;
                    break;
                  }

                  return _context10.abrupt("return", e);

                case 8:
                  if (options.fallback) {
                    _context10.next = 10;
                    break;
                  }

                  return _context10.abrupt("return", e);

                case 10:
                  return _context10.abrupt("return", superagent.get("".concat(this.entryUrl, "/").concat(uuid)).query(options.query).withCredentials().then(function (res) {
                    if (res.body && res.status === 200) {
                      _this4._defaults(res.body.$content);

                      if (!options.noUpdate) {
                        _this4._updateByUuid(uuid, res.body, options);
                      }

                      return res.body;
                    }

                    return null;
                  })["catch"](handleError(this, options)));

                case 11:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10, this);
        }));

        function get(_x11, _x12) {
          return _get.apply(this, arguments);
        }

        return get;
      }()
    }, {
      key: "getById",
      value: function () {
        var _getById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(id, options) {
          var entry;
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'get');
                  entry = this._findById(id);

                  if (!(!entry || options.fromCache)) {
                    _context11.next = 6;
                    break;
                  }

                  return _context11.abrupt("return", entry);

                case 6:
                  return _context11.abrupt("return", this.get(entry)["catch"](handleError(this, options)));

                case 7:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11, this);
        }));

        function getById(_x13, _x14) {
          return _getById.apply(this, arguments);
        }

        return getById;
      }() // Get the groups the user is owner of

    }, {
      key: "getGroups",
      value: function () {
        var _getGroups = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(options) {
          var groupUrl;
          return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  _context12.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'getGroups');
                  groupUrl = new URI(this.databaseUrl).segment('groups').normalize().href();
                  return _context12.abrupt("return", superagent.get(groupUrl).withCredentials().then(function (res) {
                    return res.body;
                  })["catch"](handleError(this, options)));

                case 5:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12, this);
        }));

        function getGroups(_x15) {
          return _getGroups.apply(this, arguments);
        }

        return getGroups;
      }() // Get basic info about every group (only name and description)

    }, {
      key: "getGroupsInfo",
      value: function () {
        var _getGroupsInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(options) {
          var groupsInfoUrl;
          return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  _context13.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'getGroupsInfo');
                  groupsInfoUrl = new URI(this.databaseUrl).segment('groups/info').normalize().href();
                  return _context13.abrupt("return", superagent.get(groupsInfoUrl).withCredentials().then(function (res) {
                    return res.body;
                  })["catch"](handleError(this, options)));

                case 5:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13, this);
        }));

        function getGroupsInfo(_x16) {
          return _getGroupsInfo.apply(this, arguments);
        }

        return getGroupsInfo;
      }() // Get the groups the user is member of
      // Returns a promise that resolves with an array of strings

    }, {
      key: "getGroupMembership",
      value: function () {
        var _getGroupMembership = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(options) {
          var url;
          return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  options = createOptions(options);
                  _context14.next = 3;
                  return this.__ready;

                case 3:
                  url = new URI(this.databaseUrl).segment('user/_me/groups');
                  return _context14.abrupt("return", superagent.get(url).withCredentials().then(function (res) {
                    return res.body;
                  })["catch"](handleError(this, options)));

                case 5:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14, this);
        }));

        function getGroupMembership(_x17) {
          return _getGroupMembership.apply(this, arguments);
        }

        return getGroupMembership;
      }()
    }, {
      key: "create",
      value: function () {
        var _create = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(entry, options) {
          var _this5 = this;

          return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  _context15.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'create');

                  if (!entry.$kind) {
                    entry.$kind = this.kind;
                  }

                  this._defaults(entry.$content);

                  return _context15.abrupt("return", superagent.post(this.entryUrl).withCredentials().send(entry).then(handleSuccess(this, options)).then(function (res) {
                    if (res.body && (res.status === 200 || res.status === 201)) {
                      return _this5.get(res.body.id);
                    }

                    return null;
                  }).then(function (entry) {
                    if (!entry) return null;

                    _this5.typeUrl(entry.$content, entry);

                    var keys = Object.keys(_this5.variables);

                    for (var _i3 = 0; _i3 < keys.length; _i3++) {
                      var v = _this5.variables[keys[_i3]];

                      if (v.type === 'view') {
                        var idx = v.data.length;
                        v.data.push(entry);
                        v.data.traceSync([idx]);

                        if (!options.noTrigger) {
                          v.data.triggerChange();
                        }
                      } else if (v.type === 'query') {
                        _this5.query(v.viewName, v.options);
                      }
                    }

                    return entry;
                  })["catch"](handleError(this, options)));

                case 6:
                case "end":
                  return _context15.stop();
              }
            }
          }, _callee15, this);
        }));

        function create(_x18, _x19) {
          return _create.apply(this, arguments);
        }

        return create;
      }()
    }, {
      key: "getLastRevision",
      value: function () {
        var _getLastRevision = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(entry) {
          var uuid, header;
          return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
              switch (_context16.prev = _context16.next) {
                case 0:
                  uuid = getUuid(entry);
                  _context16.next = 3;
                  return this.getHeader(uuid);

                case 3:
                  header = _context16.sent;
                  return _context16.abrupt("return", header.etag.replace(/"/g, ''));

                case 5:
                case "end":
                  return _context16.stop();
              }
            }
          }, _callee16, this);
        }));

        function getLastRevision(_x20) {
          return _getLastRevision.apply(this, arguments);
        }

        return getLastRevision;
      }()
    }, {
      key: "update",
      value: function () {
        var _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(entry, options) {
          var _this6 = this;

          var reqEntry;
          return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  _context17.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'update');
                  reqEntry = DataObject.resurrect(entry);
                  this.untypeUrl(reqEntry.$content);
                  return _context17.abrupt("return", superagent.put("".concat(this.entryUrl, "/").concat(String(entry._id))).withCredentials().send(reqEntry).then(handleSuccess(this, options)).then(function (res) {
                    if (res.body && res.status === 200) {
                      entry._rev = res.body.rev;
                      entry.$creationDate = res.body.$creationDate;
                      entry.$modificationDate = res.body.$modificationDate;

                      _this6._updateByUuid(entry._id, entry, Object.assign(options, {
                        updateServerString: true
                      }));

                      idb["delete"](entry._id);
                    }

                    return entry;
                  })["catch"](handleError(this, options)));

                case 6:
                case "end":
                  return _context17.stop();
              }
            }
          }, _callee17, this);
        }));

        function update(_x21, _x22) {
          return _update.apply(this, arguments);
        }

        return update;
      }()
    }, {
      key: "deleteAttachment",
      value: function () {
        var _deleteAttachment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(entry, attachments, options) {
          var hasDeleted, _i4, cdb, data;

          return regeneratorRuntime.wrap(function _callee18$(_context18) {
            while (1) {
              switch (_context18.prev = _context18.next) {
                case 0:
                  _context18.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'deleteAttachment');

                  if (!(DataObject.getType(entry) !== 'object')) {
                    _context18.next = 6;
                    break;
                  }

                  handleError(this, options)(new Error('invalid argument'));
                  return _context18.abrupt("return", null);

                case 6:
                  if (!(Array.isArray(attachments) && attachments.length === 0)) {
                    _context18.next = 8;
                    break;
                  }

                  return _context18.abrupt("return", entry);

                case 8:
                  if (!Array.isArray(attachments)) attachments = [attachments];
                  attachments = attachments.map(String);
                  _context18.next = 12;
                  return this.get(entry, {
                    fromCache: true,
                    fallback: true
                  });

                case 12:
                  entry = _context18.sent;
                  _context18.prev = 13;
                  hasDeleted = this._deleteFilename(entry.$content, attachments);

                  for (_i4 = 0; _i4 < attachments.length; _i4++) {
                    delete entry._attachments[attachments[_i4]];
                  }

                  cdb = this._getCdb(entry);
                  _context18.next = 19;
                  return cdb.remove(attachments, {
                    noRefresh: true
                  });

                case 19:
                  _context18.next = 21;
                  return this.get(entry, {
                    noUpdate: true
                  });

                case 21:
                  data = _context18.sent;
                  entry._rev = data._rev;
                  entry._attachments = data._attachments;
                  entry.$creationDate = data.$creationDate;
                  entry.$modificationDate = data.$modificationDate;
                  _context18.next = 28;
                  return this.updateAttachmentList(entry);

                case 28:
                  if (!hasDeleted) {
                    _context18.next = 33;
                    break;
                  }

                  _context18.next = 31;
                  return this.update(entry, options);

                case 31:
                  _context18.next = 34;
                  break;

                case 33:
                  if (entry.triggerChange && !options.noTrigger) {
                    entry.triggerChange();
                    handleSuccess(this, options)(entry);
                  }

                case 34:
                  _context18.next = 39;
                  break;

                case 36:
                  _context18.prev = 36;
                  _context18.t0 = _context18["catch"](13);
                  return _context18.abrupt("return", handleError(this, options)(_context18.t0));

                case 39:
                  return _context18.abrupt("return", entry);

                case 40:
                case "end":
                  return _context18.stop();
              }
            }
          }, _callee18, this, [[13, 36]]);
        }));

        function deleteAttachment(_x23, _x24, _x25) {
          return _deleteAttachment.apply(this, arguments);
        }

        return deleteAttachment;
      }()
    }, {
      key: "removeAttachment",
      value: function removeAttachment(entry, attachments, options) {
        return this.deleteAttachment(entry, attachments, options);
      }
    }, {
      key: "unattach",
      value: function () {
        var _unattach = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(entry, row, options) {
          var arr, idx, toDelete, toKeep;
          return regeneratorRuntime.wrap(function _callee19$(_context19) {
            while (1) {
              switch (_context19.prev = _context19.next) {
                case 0:
                  _context19.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'deleteAttachment');

                  if (this.processor) {
                    _context19.next = 5;
                    break;
                  }

                  throw new Error('no processor');

                case 5:
                  if (row.__parent) {
                    _context19.next = 7;
                    break;
                  }

                  throw new Error('row must be linked to parent for unattach to work');

                case 7:
                  arr = row.__parent;
                  idx = arr.indexOf(row);

                  if (!(idx === -1)) {
                    _context19.next = 12;
                    break;
                  }

                  Debug.warn('element to unattach not found');
                  return _context19.abrupt("return", null);

                case 12:
                  toDelete = this._findFilename(row);
                  toDelete = toDelete.map(function (d) {
                    return String(d.filename);
                  }); // We compute the difference between the delete and still present attachment
                  // entries, just in case there are 2 for the same attachment. In that case the
                  // attachment should not be deleted

                  toKeep = this._findFilename(entry.$content, toDelete);
                  toKeep = toKeep.map(function (k) {
                    return String(k.filename);
                  }).filter(function (k) {
                    return k === row.filename;
                  });
                  toDelete = _.difference(toDelete, toKeep);
                  _context19.next = 19;
                  return this.deleteAttachment(entry, toDelete, options);

                case 19:
                  arr.splice(idx, 1);

                  if (!options.noTrigger) {
                    arr.triggerChange();
                  }

                  _context19.next = 23;
                  return this.update(entry);

                case 23:
                  return _context19.abrupt("return", entry);

                case 24:
                case "end":
                  return _context19.stop();
              }
            }
          }, _callee19, this);
        }));

        function unattach(_x26, _x27, _x28) {
          return _unattach.apply(this, arguments);
        }

        return unattach;
      }()
    }, {
      key: "_processAttachment",
      value: function () {
        var _processAttachment2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(type, attachment) {
          var filename, fallback;
          return regeneratorRuntime.wrap(function _callee20$(_context20) {
            while (1) {
              switch (_context20.prev = _context20.next) {
                case 0:
                  if (attachment.filename) {
                    _context20.next = 4;
                    break;
                  }

                  _context20.next = 3;
                  return ui.enterValue('Enter a filename');

                case 3:
                  filename = _context20.sent;

                case 4:
                  if (filename) attachment.filename = filename;

                  if (attachment.filename) {
                    _context20.next = 7;
                    break;
                  }

                  return _context20.abrupt("return", false);

                case 7:
                  attachment.filename = this.processor.getFilename(type, attachment.filename); // If we had to ask for a filename, resolve content type

                  if (filename) {
                    fallback = attachment.contentType;
                    attachment.contentType = undefined;
                  }

                  setContentType(attachment, fallback);
                  return _context20.abrupt("return", true);

                case 11:
                case "end":
                  return _context20.stop();
              }
            }
          }, _callee20, this);
        }));

        function _processAttachment(_x29, _x30) {
          return _processAttachment2.apply(this, arguments);
        }

        return _processAttachment;
      }()
    }, {
      key: "attachBulk",
      value: function () {
        var _attachBulk = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(type, entry, attachments, options) {
          var attachOptions, _i5, attachment, addAttachmentOptions, _i6;

          return regeneratorRuntime.wrap(function _callee21$(_context21) {
            while (1) {
              switch (_context21.prev = _context21.next) {
                case 0:
                  if (attachments.length) {
                    _context21.next = 2;
                    break;
                  }

                  return _context21.abrupt("return", null);

                case 2:
                  if (!(attachments.length === 1)) {
                    _context21.next = 4;
                    break;
                  }

                  return _context21.abrupt("return", this.attach(type, entry, attachments[0], options));

                case 4:
                  _context21.next = 6;
                  return this.__ready;

                case 6:
                  attachOptions = createOptions(options, 'attach');
                  _context21.prev = 7;
                  _i5 = 0;

                case 9:
                  if (!(_i5 < attachments.length)) {
                    _context21.next = 16;
                    break;
                  }

                  attachment = attachments[_i5];

                  if (this._processAttachment(type, attachment)) {
                    _context21.next = 13;
                    break;
                  }

                  return _context21.abrupt("return", null);

                case 13:
                  _i5++;
                  _context21.next = 9;
                  break;

                case 16:
                  _context21.next = 18;
                  return this.get(entry, {
                    fromCache: true,
                    fallback: true
                  });

                case 18:
                  entry = _context21.sent;
                  addAttachmentOptions = createOptions(options, 'addAttachment');
                  _context21.next = 22;
                  return this.addAttachment(entry, attachments, addAttachmentOptions);

                case 22:
                  entry = _context21.sent;
                  _i6 = 0;

                case 24:
                  if (!(_i6 < attachments.length)) {
                    _context21.next = 30;
                    break;
                  }

                  _context21.next = 27;
                  return this.processor.process(type, entry.$content, attachments[_i6]);

                case 27:
                  _i6++;
                  _context21.next = 24;
                  break;

                case 30:
                  this.typeUrl(entry.$content, entry);
                  _context21.next = 33;
                  return this.update(entry);

                case 33:
                  _context21.next = 38;
                  break;

                case 35:
                  _context21.prev = 35;
                  _context21.t0 = _context21["catch"](7);
                  return _context21.abrupt("return", handleError(this, attachOptions)(_context21.t0));

                case 38:
                  handleSuccess(this, attachOptions)(entry);
                  return _context21.abrupt("return", entry);

                case 40:
                case "end":
                  return _context21.stop();
              }
            }
          }, _callee21, this, [[7, 35]]);
        }));

        function attachBulk(_x31, _x32, _x33, _x34) {
          return _attachBulk.apply(this, arguments);
        }

        return attachBulk;
      }()
    }, {
      key: "attach",
      value: function () {
        var _attach = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(type, entry, attachment, options) {
          var attachOptions, ok, addAttachmentOptions;
          return regeneratorRuntime.wrap(function _callee22$(_context22) {
            while (1) {
              switch (_context22.prev = _context22.next) {
                case 0:
                  _context22.next = 2;
                  return this.__ready;

                case 2:
                  attachOptions = createOptions(options, 'attach');
                  _context22.prev = 3;
                  ok = this._processAttachment(type, attachment);

                  if (ok) {
                    _context22.next = 7;
                    break;
                  }

                  return _context22.abrupt("return", null);

                case 7:
                  _context22.next = 9;
                  return this.get(entry, {
                    fromCache: true,
                    fallback: true
                  });

                case 9:
                  entry = _context22.sent;
                  addAttachmentOptions = createOptions(options, 'addAttachment');
                  _context22.next = 13;
                  return this.addAttachment(entry, attachment, addAttachmentOptions);

                case 13:
                  entry = _context22.sent;

                  if (this.processor) {
                    _context22.next = 16;
                    break;
                  }

                  throw new Error('no processor');

                case 16:
                  _context22.next = 18;
                  return this.processor.process(type, entry.$content, attachment, attachOptions.customMetadata);

                case 18:
                  this.typeUrl(entry.$content, entry);
                  _context22.next = 21;
                  return this.update(entry);

                case 21:
                  _context22.next = 26;
                  break;

                case 23:
                  _context22.prev = 23;
                  _context22.t0 = _context22["catch"](3);
                  return _context22.abrupt("return", handleError(this, attachOptions)(_context22.t0));

                case 26:
                  handleSuccess(this, attachOptions)(entry);
                  return _context22.abrupt("return", entry);

                case 28:
                case "end":
                  return _context22.stop();
              }
            }
          }, _callee22, this, [[3, 23]]);
        }));

        function attach(_x35, _x36, _x37, _x38) {
          return _attach.apply(this, arguments);
        }

        return attach;
      }()
    }, {
      key: "discardLocal",
      value: function () {
        var _discardLocal = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(entry) {
          var uuid, serverEntry;
          return regeneratorRuntime.wrap(function _callee23$(_context23) {
            while (1) {
              switch (_context23.prev = _context23.next) {
                case 0:
                  // entry or uuid
                  uuid = getUuid(entry); // Make sure the data change is not tracked

                  this.unbindChangeByUuid(uuid); // Get from server again

                  _context23.next = 4;
                  return this.get(entry);

                case 4:
                  serverEntry = _context23.sent;

                  this._updateByUuid(entry._id, serverEntry, {
                    updateServerString: true
                  });

                  _context23.prev = 6;
                  _context23.next = 9;
                  return idb["delete"](uuid);

                case 9:
                  _context23.next = 13;
                  break;

                case 11:
                  _context23.prev = 11;
                  _context23.t0 = _context23["catch"](6);

                case 13:
                  // Track data again
                  this.bindChangeByUuid(uuid);
                  if (entry.triggerChange) entry.triggerChange();
                  return _context23.abrupt("return", serverEntry);

                case 16:
                case "end":
                  return _context23.stop();
              }
            }
          }, _callee23, this, [[6, 11]]);
        }));

        function discardLocal(_x39) {
          return _discardLocal.apply(this, arguments);
        }

        return discardLocal;
      }()
    }, {
      key: "getAttachment",
      value: function () {
        var _getAttachment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(entry, name, options) {
          var cdb;
          return regeneratorRuntime.wrap(function _callee24$(_context24) {
            while (1) {
              switch (_context24.prev = _context24.next) {
                case 0:
                  _context24.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'getAttachment');
                  cdb = this._getCdb(entry);
                  return _context24.abrupt("return", cdb.get(name, options)["catch"](handleError(this, options)));

                case 5:
                case "end":
                  return _context24.stop();
              }
            }
          }, _callee24, this);
        }));

        function getAttachment(_x40, _x41, _x42) {
          return _getAttachment.apply(this, arguments);
        }

        return getAttachment;
      }()
    }, {
      key: "getAttachmentList",
      value: function () {
        var _getAttachmentList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(entry) {
          var cdb;
          return regeneratorRuntime.wrap(function _callee25$(_context25) {
            while (1) {
              switch (_context25.prev = _context25.next) {
                case 0:
                  _context25.next = 2;
                  return this.__ready;

                case 2:
                  cdb = this._getCdb(entry);
                  return _context25.abrupt("return", cdb.list());

                case 4:
                case "end":
                  return _context25.stop();
              }
            }
          }, _callee25, this);
        }));

        function getAttachmentList(_x43) {
          return _getAttachmentList.apply(this, arguments);
        }

        return getAttachmentList;
      }()
    }, {
      key: "updateAttachmentList",
      value: function () {
        var _updateAttachmentList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(entry) {
          var cdb;
          return regeneratorRuntime.wrap(function _callee26$(_context26) {
            while (1) {
              switch (_context26.prev = _context26.next) {
                case 0:
                  _context26.next = 2;
                  return this.__ready;

                case 2:
                  cdb = this._getCdb(entry);
                  _context26.next = 5;
                  return cdb.list();

                case 5:
                  entry.attachmentList = _context26.sent;

                case 6:
                case "end":
                  return _context26.stop();
              }
            }
          }, _callee26, this);
        }));

        function updateAttachmentList(_x44) {
          return _updateAttachmentList.apply(this, arguments);
        }

        return updateAttachmentList;
      }()
    }, {
      key: "addAttachment",
      value: function () {
        var _addAttachment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(entry, attachments, options) {
          var filename, fallback, cdb, data;
          return regeneratorRuntime.wrap(function _callee27$(_context27) {
            while (1) {
              switch (_context27.prev = _context27.next) {
                case 0:
                  options = options || {};
                  filename = true;
                  _context27.next = 4;
                  return this.__ready;

                case 4:
                  attachments = DataObject.resurrect(attachments);

                  if (attachments.length === 1) {
                    attachments = attachments[0];
                  }

                  if (Array.isArray(attachments)) {
                    _context27.next = 21;
                    break;
                  }

                  if (attachments.filename) {
                    _context27.next = 20;
                    break;
                  }

                  _context27.next = 10;
                  return ui.enterValue('Enter a filename');

                case 10:
                  filename = _context27.sent;
                  if (filename) attachments.filename = filename;

                  if (attachments.filename) {
                    _context27.next = 14;
                    break;
                  }

                  return _context27.abrupt("return", null);

                case 14:
                  // If we had to ask for a filename, resolve content type
                  fallback = attachments.contentType;
                  attachments.contentType = undefined;
                  setContentType(attachments, fallback);
                  attachments = [attachments];
                  _context27.next = 21;
                  break;

                case 20:
                  attachments = [attachments];

                case 21:
                  attachments.forEach(function (attachment) {
                    setContentType(attachment);
                  });

                  if (filename) {
                    _context27.next = 24;
                    break;
                  }

                  return _context27.abrupt("return", null);

                case 24:
                  options = createOptions(options, 'addAttachment');
                  _context27.next = 27;
                  return this.get(entry, {
                    fromCache: true,
                    fallback: true
                  });

                case 27:
                  entry = _context27.sent;
                  _context27.prev = 28;
                  cdb = this._getCdb(entry);
                  _context27.next = 32;
                  return cdb.inlineUploads(attachments, {
                    noRefresh: true
                  });

                case 32:
                  _context27.next = 34;
                  return this.get(entry, {
                    noUpdate: true
                  });

                case 34:
                  data = _context27.sent;
                  entry._rev = data._rev;
                  entry._attachments = data._attachments;
                  entry.$creationDate = data.$creationDate;
                  entry.$modificationDate = data.$modificationDate;
                  _context27.next = 41;
                  return this.updateAttachmentList(entry);

                case 41:
                  if (entry.triggerChange && !options.noTrigger) {
                    entry.triggerChange();
                  }

                  _context27.next = 47;
                  break;

                case 44:
                  _context27.prev = 44;
                  _context27.t0 = _context27["catch"](28);
                  return _context27.abrupt("return", handleError(this, options)(_context27.t0));

                case 47:
                  handleSuccess(this, options)(entry);
                  return _context27.abrupt("return", entry);

                case 49:
                case "end":
                  return _context27.stop();
              }
            }
          }, _callee27, this, [[28, 44]]);
        }));

        function addAttachment(_x45, _x46, _x47) {
          return _addAttachment.apply(this, arguments);
        }

        return addAttachment;
      }()
    }, {
      key: "addAttachmentById",
      value: function () {
        var _addAttachmentById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(id, attachment, options) {
          var doc;
          return regeneratorRuntime.wrap(function _callee28$(_context28) {
            while (1) {
              switch (_context28.prev = _context28.next) {
                case 0:
                  options = options || {};
                  _context28.next = 3;
                  return this.__ready;

                case 3:
                  doc = this._findById(id);

                  if (doc) {
                    _context28.next = 6;
                    break;
                  }

                  return _context28.abrupt("return", null);

                case 6:
                  return _context28.abrupt("return", this.addAttachment(doc._id, attachment, options));

                case 7:
                case "end":
                  return _context28.stop();
              }
            }
          }, _callee28, this);
        }));

        function addAttachmentById(_x48, _x49, _x50) {
          return _addAttachmentById.apply(this, arguments);
        }

        return addAttachmentById;
      }()
    }, {
      key: "getTokens",
      value: function () {
        var _getTokens = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(options) {
          var tokenUrl;
          return regeneratorRuntime.wrap(function _callee29$(_context29) {
            while (1) {
              switch (_context29.prev = _context29.next) {
                case 0:
                  _context29.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'getTokens');
                  tokenUrl = new URI(this.databaseUrl).segment('token').normalize().href();
                  return _context29.abrupt("return", superagent.get(tokenUrl).withCredentials().then(handleSuccess(this, options)).then(function (res) {
                    return res.body;
                  })["catch"](handleError(this, options)));

                case 5:
                case "end":
                  return _context29.stop();
              }
            }
          }, _callee29, this);
        }));

        function getTokens(_x51) {
          return _getTokens.apply(this, arguments);
        }

        return getTokens;
      }()
    }, {
      key: "getToken",
      value: function () {
        var _getToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(token, options) {
          var tokenId, tokenUrl;
          return regeneratorRuntime.wrap(function _callee30$(_context30) {
            while (1) {
              switch (_context30.prev = _context30.next) {
                case 0:
                  _context30.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'getToken');
                  tokenId = getTokenId(token);
                  tokenUrl = new URI(this.databaseUrl).segment("token/".concat(tokenId)).normalize().href();
                  return _context30.abrupt("return", superagent.get(tokenUrl).withCredentials().then(handleSuccess(this, options)).then(function (res) {
                    return res.body;
                  })["catch"](handleError(this, options)));

                case 6:
                case "end":
                  return _context30.stop();
              }
            }
          }, _callee30, this);
        }));

        function getToken(_x52, _x53) {
          return _getToken.apply(this, arguments);
        }

        return getToken;
      }()
    }, {
      key: "createToken",
      value: function () {
        var _createToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(entry, options) {
          var uuid, request, rights;
          return regeneratorRuntime.wrap(function _callee31$(_context31) {
            while (1) {
              switch (_context31.prev = _context31.next) {
                case 0:
                  _context31.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'createToken');
                  uuid = getUuid(entry);
                  request = superagent.post("".concat(this.entryUrl, "/").concat(uuid, "/_token")).withCredentials();

                  if (options.rights) {
                    rights = options.rights;

                    if (Array.isArray(rights)) {
                      rights = options.rights.join(',');
                    }

                    request.query({
                      rights: rights
                    });
                  }

                  return _context31.abrupt("return", request.then(handleSuccess(this, options)).then(function (res) {
                    return res.body;
                  })["catch"](handleError(this, options)));

                case 7:
                case "end":
                  return _context31.stop();
              }
            }
          }, _callee31, this);
        }));

        function createToken(_x54, _x55) {
          return _createToken.apply(this, arguments);
        }

        return createToken;
      }()
    }, {
      key: "createUserToken",
      value: function () {
        var _createUserToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32(options) {
          var request, rights;
          return regeneratorRuntime.wrap(function _callee32$(_context32) {
            while (1) {
              switch (_context32.prev = _context32.next) {
                case 0:
                  _context32.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'createUserToken');
                  request = superagent.post("".concat(this.databaseUrl, "/user/_me/token")).withCredentials();

                  if (options.rights) {
                    rights = options.rights;

                    if (Array.isArray(rights)) {
                      rights = options.rights.join(',');
                    }

                    request.query({
                      rights: rights
                    });
                  }

                  return _context32.abrupt("return", request.then(handleSuccess(this, options)).then(function (res) {
                    return res.body;
                  })["catch"](handleError(this, options)));

                case 6:
                case "end":
                  return _context32.stop();
              }
            }
          }, _callee32, this);
        }));

        function createUserToken(_x56) {
          return _createUserToken.apply(this, arguments);
        }

        return createUserToken;
      }()
    }, {
      key: "deleteToken",
      value: function () {
        var _deleteToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(token, options) {
          var tokenId, tokenUrl;
          return regeneratorRuntime.wrap(function _callee33$(_context33) {
            while (1) {
              switch (_context33.prev = _context33.next) {
                case 0:
                  _context33.next = 2;
                  return this.__ready;

                case 2:
                  options = createOptions(options, 'deleteToken');
                  tokenId = getTokenId(token);
                  tokenUrl = new URI(this.databaseUrl).segment("token/".concat(tokenId)).normalize().href();
                  return _context33.abrupt("return", superagent.del(tokenUrl).withCredentials().then(handleSuccess(this, options)).then(function (res) {
                    return res.body;
                  })["catch"](handleError(this, options)));

                case 6:
                case "end":
                  return _context33.stop();
              }
            }
          }, _callee33, this);
        }));

        function deleteToken(_x57, _x58) {
          return _deleteToken.apply(this, arguments);
        }

        return deleteToken;
      }()
    }, {
      key: "addGroup",
      value: function () {
        var _addGroup = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34(entry, group, options, remove) {
          var _this7 = this;

          var uuid, eventEmmitter, method;
          return regeneratorRuntime.wrap(function _callee34$(_context34) {
            while (1) {
              switch (_context34.prev = _context34.next) {
                case 0:
                  uuid = getUuid(entry);
                  eventEmmitter = eventEmitters[uuid];

                  if (!(eventEmmitter && eventEmmitter.isSync === false)) {
                    _context34.next = 4;
                    break;
                  }

                  throw new Error('Cannot update group while entry is edited');

                case 4:
                  method = remove ? 'del' : 'put';
                  _context34.next = 7;
                  return this.__ready;

                case 7:
                  options = createOptions(options, remove ? 'deleteGroup' : 'addGroup');
                  return _context34.abrupt("return", superagent[method]("".concat(this.entryUrl, "/").concat(uuid, "/_owner/").concat(String(group))).withCredentials().then(handleSuccess(this, options)).then(function (res) {
                    if (!options.noUpdate) {
                      return _this7.get(uuid).then(function () {
                        return res.body;
                      });
                    } else {
                      return res.body;
                    }
                  })["catch"](handleError(this, options)));

                case 9:
                case "end":
                  return _context34.stop();
              }
            }
          }, _callee34, this);
        }));

        function addGroup(_x59, _x60, _x61, _x62) {
          return _addGroup.apply(this, arguments);
        }

        return addGroup;
      }()
    }, {
      key: "deleteGroup",
      value: function deleteGroup(entry, group, options) {
        return this.addGroup(entry, group, options, true);
      }
    }, {
      key: "delete",
      value: function () {
        var _delete2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35(entry, options) {
          var _this8 = this;

          var uuid;
          return regeneratorRuntime.wrap(function _callee35$(_context35) {
            while (1) {
              switch (_context35.prev = _context35.next) {
                case 0:
                  _context35.next = 2;
                  return this.__ready;

                case 2:
                  uuid = getUuid(entry);
                  options = createOptions(options, 'delete');
                  return _context35.abrupt("return", superagent.del("".concat(this.entryUrl, "/").concat(uuid)).withCredentials().then(handleSuccess(this, options)).then(function (res) {
                    if (res.body && res.status === 200) {
                      for (var _key3 in _this8.variables) {
                        var idx = _this8._findIndexByUuid(uuid, _key3);

                        if (idx !== -1) {
                          _this8.variables[_key3].data.splice(idx, 1);

                          if (!options.noTrigger) {
                            _this8.variables[_key3].data.triggerChange();
                          }
                        }
                      }
                    }

                    return res.body;
                  })["catch"](handleError(this, options)));

                case 5:
                case "end":
                  return _context35.stop();
              }
            }
          }, _callee35, this);
        }));

        function _delete(_x63, _x64) {
          return _delete2.apply(this, arguments);
        }

        return _delete;
      }()
    }, {
      key: "remove",
      value: function remove(entry, options) {
        return this["delete"](entry, options);
      } // Private

    }, {
      key: "_getCdb",
      value: function _getCdb(entry) {
        var uuid;
        var type = DataObject.getType(entry);

        if (type === 'object') {
          uuid = String(entry._id);
        } else {
          throw new Error('Bad arguments, entry can only be an object');
        }

        var docUrl = "".concat(this.entryUrl, "/").concat(String(uuid));
        var cdb = new CDB(docUrl);
        cdb.setDoc(entry);
        return cdb;
      }
    }, {
      key: "_findByUuid",
      value: function _findByUuid(uuid, key) {
        if (key === undefined) {
          var result; // Return the first one found (they are all supposed to be the same...)

          for (var _key4 in this.variables) {
            result = this._findByUuid(uuid, _key4);
            if (result) return result;
          }

          return null;
        }

        if (!this.variables[key]) return null;

        if (this.variables[key].type === 'view') {
          return this.variables[key].data.find(function (entry) {
            return String(entry._id) === String(uuid);
          });
        } else if (this.variables[key].type === 'document') {
          if (String(this.variables[key].data._id) === String(uuid)) {
            return this.variables[key].data;
          }
        }

        return null;
      }
    }, {
      key: "_findById",
      value: function _findById(id, key) {
        if (key === undefined) {
          var result;

          for (var _key5 in this.variables) {
            result = this._findById(id, _key5);
            if (result) return result;
          }

          return null;
        }

        if (!this.variables[key]) return null;
        id = DataObject.resurrect(id);

        if (this.variables[key].type === 'document' && _.isEqual(DataObject.resurrect(this.variables[key].data.$id), id)) {
          return this.variables[key].data;
        } else if (this.variables[key].type === 'view') {
          return this.variables[key].data.find(function (entry) {
            return _.isEqual(id, DataObject.resurrect(entry.$id));
          });
        }

        return null;
      }
    }, {
      key: "_findIndexByUuid",
      value: function _findIndexByUuid(uuid, key) {
        if (!this.variables[key]) return -1;

        if (this.variables[key].type === 'document') {
          return -1;
        } else if (this.variables[key].type === 'view') {
          return this.variables[key].data.findIndex(function (entry) {
            return String(entry._id) === String(uuid);
          });
        } else if (this.variables[key].type === 'query') {
          return this.variables[key].data.findIndex(function (entry) {
            return String(entry.id) === String(uuid);
          });
        }

        return -1;
      }
    }, {
      key: "_updateByUuid",
      value: function _updateByUuid(uuid, data, options) {
        for (var _key6 in this.variables) {
          if (this.variables[_key6].type === 'view') {
            var idx = this._findIndexByUuid(uuid, _key6);

            if (idx !== -1) {
              this.typeUrl(data.$content, data); // this.variables[key].data.setChildSync([idx], data);

              var row = this.variables[_key6].data.getChildSync([idx]);

              this._updateDocument(row, data, options);
            }
          } else if (this.variables[_key6].type === 'document') {
            uuid = String(uuid);
            var _id = this.variables[_key6].data._id;

            if (uuid === _id) {
              // var newData = DataObject.resurrect(data);
              this.typeUrl(data.$content, data);
              var doc = this.variables[_key6].data;

              if (options.updateServerString) {
                this.variables[_key6].serverJsonString = JSON.stringify(doc.$content);

                this._emitSync(uuid, true);
              }

              this._updateDocument(doc, data, options);
            }
          } else if (this.variables[_key6].type === 'query' && this.queryAutoRefresh) {
            var _idx = this._findIndexByUuid(uuid, _key6);

            if (_idx !== -1) {
              // Redo the same query
              this.query(this.variables[_key6].viewName, this.variables[_key6].options);
            }
          }
        }
      }
    }, {
      key: "_updateDocument",
      value: function _updateDocument(doc, data, options) {
        if (doc && data) {
          var _keys = Object.keys(data);

          for (var _i7 = 0; _i7 < _keys.length; _i7++) {
            var _key7 = _keys[_i7];
            doc[_key7] = data[_key7];
          }

          if (doc.triggerChange && !options.noTrigger) {
            doc.triggerChange();
          }
        }
      }
    }, {
      key: "_defaults",
      value: function _defaults(content) {
        if (this.processor) {
          var kind = this.kind;

          if (kind) {
            this.processor.defaults(kind, content);
          }
        }
      }
    }, {
      key: "_traverseFilename",
      value: function _traverseFilename(v, cb) {
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
    }, {
      key: "_findFilename",
      value: function _findFilename(v, filename) {
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
    }, {
      key: "_deleteFilename",
      value: function _deleteFilename(v, filename) {
        var hasDeleted = false;

        var filenames = this._findFilename(v, filename);

        for (var i = 0; i < filenames.length; i++) {
          hasDeleted = true;
          delete filenames[i].filename;
        }

        return hasDeleted;
      }
    }, {
      key: "untypeUrl",
      value: function untypeUrl(v) {
        this._traverseFilename(v, function (v) {
          if (v.data && v.data.url) {
            delete v.data;
          }
        });
      }
    }, {
      key: "typeUrl",
      value: function typeUrl(content, entry) {
        var _this9 = this;

        this._traverseFilename(content, function (v) {
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
          var dUrl = "".concat(_this9.entryUrl, "/").concat(entry._id, "/").concat(encodeURIComponent(v.filename));
          v.data[prop] = dUrl;
          Object.defineProperty(v, 'dUrl', {
            value: dUrl,
            enumerable: false,
            writable: true
          });
        });
      }
    }]);

    return Roc;
  }();

  function createOptions(options, type, custom) {
    var messages = Object.assign({}, defaultOptions.messages, messagesByType[type], options && options.messages);
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
      } // Propagate error


      throw err;
    };
  }

  function handleSuccess(ctx, options) {
    return function (data) {
      if (!options.mute && !options.muteSuccess) {
        if (data.status) {
          handleSuperagentSuccess(data, ctx, options);
        } else if (options.type && options.type.match(/attachment/i)) {
          handleSuperagentSuccess({
            status: 200
          }, ctx, options);
        }
      }

      return data;
    };
  }

  function handleSuperagentSuccess(data, ctx, options) {
    var message = options.messages[data.status] || ctx.messages[data.status];

    if (message && !options.disableNotification) {
      ui.showNotification(message, 'success');
    }
  }

  function handleSuperagentError(err, ctx, options) {
    var message = options.messages[err.status] || ctx.messages[err.status];

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
    ui.showNotification("Error: ".concat(err.message), 'error');
    Debug.error(err, err.stack);
  }

  function setContentType(attachment, fallback) {
    fallback = fallback || 'application/octet-stream';
    var filename = attachment.filename;
    var contentType = attachment.contentType;

    if (contentType && contentType !== 'application/octet-stream') {
      return;
    } // Ideally jcamp extensions should be handled by mime-types


    attachment.contentType = mimeTypes.lookup(filename, fallback) || fallback;
  }

  function addSearch(requestUrl, options) {
    for (var _i8 = 0; _i8 < viewSearchJsonify.length; _i8++) {
      if (options[viewSearchJsonify[_i8]]) {
        requestUrl.addSearch(viewSearchJsonify[_i8], JSON.stringify(options[viewSearchJsonify[_i8]]));
      }
    }

    for (var _i9 = 0; _i9 < viewSearch.length; _i9++) {
      if (options[viewSearch[_i9]]) {
        requestUrl.addSearch(viewSearch[_i9], options[viewSearch[_i9]]);
      }
    }
  }

  var typeValue = ['gif', 'tiff', 'jpeg', 'jpg', 'png'];
  return Roc;
});