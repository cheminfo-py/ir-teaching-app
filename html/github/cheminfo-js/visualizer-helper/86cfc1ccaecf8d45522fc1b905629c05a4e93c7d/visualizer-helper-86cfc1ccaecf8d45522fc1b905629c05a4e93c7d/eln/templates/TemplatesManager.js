"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(['../../rest-on-couch/Roc', '../../rest-on-couch/getChangedGroups', 'src/util/api', 'vh/rest-on-couch/showRecordInfo', 'src/util/ui'], function (Roc, getChangedGroups, API, showRecordInfo, UI) {
  var TemplatesManager = /*#__PURE__*/function () {
    /**
     *
     * @param {*} couchDB
     * @param {object} [options={}]
     * @param {string} [options.basename='']
     * @param {Array} [options.categories=[{value: 'chemical', description: 'Chemical'}]]
     */
    function TemplatesManager(couchDB) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, TemplatesManager);

      this.roc = new Roc(_objectSpread(_objectSpread({}, couchDB), {}, {
        database: 'templates'
      }));
      this.roc.getGroupMembership().then(function (groups) {
        return _this.allGroups = groups;
      });
      this.basename = options.basename || '';
      if (this.basename && !this.basename.endsWith('.')) this.basename += '.';
      this.categories = options.categories || [{
        value: 'chemical',
        description: 'Chemical'
      }];
      this.refreshTemplates();
    }

    _createClass(TemplatesManager, [{
      key: "updateTemplate",
      value: function () {
        var _updateTemplate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var template;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  console.log('UPDATE TEMPLATE');
                  template = API.getData('currentTemplate');
                  _context.next = 4;
                  return this.roc.update(template.value);

                case 4:
                  this.refreshTemplates();

                case 5:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function updateTemplate() {
          return _updateTemplate.apply(this, arguments);
        }

        return updateTemplate;
      }()
    }, {
      key: "deleteTemplate",
      value: function () {
        var _deleteTemplate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(template) {
          var result;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return UI.confirm('Are you sure you want to delete this template ?', 'Delete', 'Cancel', {});

                case 2:
                  result = _context2.sent;

                  if (result) {
                    _context2.next = 5;
                    break;
                  }

                  return _context2.abrupt("return");

                case 5:
                  _context2.next = 7;
                  return this.roc["delete"](template.id);

                case 7:
                  this.refreshTemplates();

                case 8:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function deleteTemplate(_x) {
          return _deleteTemplate.apply(this, arguments);
        }

        return deleteTemplate;
      }()
    }, {
      key: "createTemplate",
      value: function () {
        var _createTemplate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
          var options,
              _options$defaultTwig,
              defaultTwig,
              form,
              templateEntry,
              template,
              _args3 = arguments;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
                  _options$defaultTwig = options.defaultTwig, defaultTwig = _options$defaultTwig === void 0 ? '' : _options$defaultTwig;
                  _context3.next = 4;
                  return UI.form("\n          <div>\n          <form>\n              <table>\n              <tr>\n              <th align=right>Category<br><span style='font-size: smaller'>Reaction code</span></th>\n              <td>\n                  <select name=\"category\">\n\t\t  ".concat(this.categories.map(function (category) {
                    return "<option value=\"".concat(category.value, "\">").concat(category.description, "</option>");
                  }), "\n                  </select>\n                  <i>\n                      The sample category (currently only 'chemical')\n                  </i>\n              </td>\n              </tr>\n              <tr>\n              <th align=right>Name<br><span style='font-size: smaller'>Template name</span></th>\n              <td>\n                  <input type=\"text\" name=\"name\" pattern=\"[A-Za-z0-9 ,-]*\"/><br>\n                  <i>\n                      Only letters, numbers, space, comma and dash\n                  </i>\n              </td>\n              </tr>\n              </table>\n              <input type=\"submit\" value=\"Create template\"/>\n          </form>\n          </div>\n      "), {});

                case 4:
                  form = _context3.sent;

                  if (!(!form || !form.name || form.category == null)) {
                    _context3.next = 7;
                    break;
                  }

                  return _context3.abrupt("return");

                case 7:
                  templateEntry = {
                    $id: Math.random().toString(36).replace('0.', ''),
                    $kind: 'template',
                    $content: {
                      title: '',
                      description: '',
                      twig: defaultTwig,
                      category: [{
                        value: this.basename + form.category + '.' + form.name
                      }]
                    }
                  };
                  _context3.next = 10;
                  return this.roc.create(templateEntry);

                case 10:
                  template = _context3.sent;
                  _context3.next = 13;
                  return this.refreshTemplates();

                case 13:
                  console.log(template);
                  return _context3.abrupt("return", template);

                case 15:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function createTemplate() {
          return _createTemplate.apply(this, arguments);
        }

        return createTemplate;
      }()
    }, {
      key: "refreshTemplates",
      value: function () {
        var _refreshTemplates = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
          var _this2 = this;

          var filter, templates, allTemplates, _iterator, _step, _loop;

          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  filter = function filter(template) {
                    return template.value.category && template.value.category.find(function (category) {
                      return category.value && category.value.startsWith(_this2.basename);
                    });
                  };

                  _context4.next = 3;
                  return this.roc.query('toc', {
                    mine: true,
                    filter: filter
                  });

                case 3:
                  templates = _context4.sent;
                  templates.forEach(function (template) {
                    return template.readWrite = true;
                  });
                  _context4.next = 7;
                  return this.roc.query('toc', {
                    filter: filter
                  });

                case 7:
                  allTemplates = _context4.sent;
                  _iterator = _createForOfIteratorHelper(allTemplates);

                  try {
                    _loop = function _loop() {
                      var newTemplate = _step.value;

                      if (!templates.find(function (template) {
                        return template.id === newTemplate.id;
                      })) {
                        newTemplate.readWrite = false;
                        templates.push(newTemplate);
                      }
                    };

                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                      _loop();
                    }
                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }

                  templates = templates.sort(function (a, b) {
                    return b.value.modificationDate - a.value.modificationDate;
                  });
                  _context4.next = 13;
                  return API.createData('templates', templates);

                case 13:
                  setTimeout(function () {
                    API.doAction('setSelectedTemplate', 0);
                  });
                  return _context4.abrupt("return", templates);

                case 15:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function refreshTemplates() {
          return _refreshTemplates.apply(this, arguments);
        }

        return refreshTemplates;
      }()
    }, {
      key: "doAction",
      value: function () {
        var _doAction = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(action, options) {
          var actionName, actionValue;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (action) {
                    _context5.next = 2;
                    break;
                  }

                  return _context5.abrupt("return");

                case 2:
                  actionName = action.name;
                  actionValue = action.value;
                  console.log('ACTION:', actionName, actionValue);
                  _context5.t0 = actionName;
                  _context5.next = _context5.t0 === 'createTemplate' ? 8 : _context5.t0 === 'updateTemplate' ? 9 : _context5.t0 === 'deleteTemplate' ? 10 : _context5.t0 === 'getTemplate' ? 11 : _context5.t0 === 'showTemplateInfo' ? 12 : _context5.t0 === 'editTemplateAccess' ? 13 : _context5.t0 === 'refreshTemplates' ? 14 : 15;
                  break;

                case 8:
                  return _context5.abrupt("return", this.createTemplate(options));

                case 9:
                  return _context5.abrupt("return", this.updateTemplate(actionValue));

                case 10:
                  return _context5.abrupt("return", this.deleteTemplate(actionValue));

                case 11:
                  return _context5.abrupt("return", this.getTemplate(actionValue));

                case 12:
                  return _context5.abrupt("return", this.showTemplateInfo(actionValue));

                case 13:
                  return _context5.abrupt("return", this.editTemplateAccess(actionValue));

                case 14:
                  return _context5.abrupt("return", this.refreshTemplates());

                case 15:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function doAction(_x2, _x3) {
          return _doAction.apply(this, arguments);
        }

        return doAction;
      }()
    }, {
      key: "editTemplateAccess",
      value: function () {
        var _editTemplateAccess = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(entry) {
          var record, changed, _iterator2, _step2, group, _iterator3, _step3, _group;

          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return this.roc.get(entry.id);

                case 2:
                  record = _context6.sent;
                  _context6.next = 5;
                  return getChangedGroups(record, this.allGroups);

                case 5:
                  changed = _context6.sent;

                  if (changed) {
                    _context6.next = 8;
                    break;
                  }

                  return _context6.abrupt("return");

                case 8:
                  _context6.prev = 8;
                  _iterator2 = _createForOfIteratorHelper(changed.add);
                  _context6.prev = 10;

                  _iterator2.s();

                case 12:
                  if ((_step2 = _iterator2.n()).done) {
                    _context6.next = 18;
                    break;
                  }

                  group = _step2.value;
                  _context6.next = 16;
                  return this.roc.addGroup(record, group);

                case 16:
                  _context6.next = 12;
                  break;

                case 18:
                  _context6.next = 23;
                  break;

                case 20:
                  _context6.prev = 20;
                  _context6.t0 = _context6["catch"](10);

                  _iterator2.e(_context6.t0);

                case 23:
                  _context6.prev = 23;

                  _iterator2.f();

                  return _context6.finish(23);

                case 26:
                  _iterator3 = _createForOfIteratorHelper(changed.remove);
                  _context6.prev = 27;

                  _iterator3.s();

                case 29:
                  if ((_step3 = _iterator3.n()).done) {
                    _context6.next = 35;
                    break;
                  }

                  _group = _step3.value;
                  _context6.next = 33;
                  return this.roc.deleteGroup(record, _group);

                case 33:
                  _context6.next = 29;
                  break;

                case 35:
                  _context6.next = 40;
                  break;

                case 37:
                  _context6.prev = 37;
                  _context6.t1 = _context6["catch"](27);

                  _iterator3.e(_context6.t1);

                case 40:
                  _context6.prev = 40;

                  _iterator3.f();

                  return _context6.finish(40);

                case 43:
                  _context6.next = 48;
                  break;

                case 45:
                  _context6.prev = 45;
                  _context6.t2 = _context6["catch"](8);
                  UI.showNotification(_context6.t2.message, 'error');

                case 48:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this, [[8, 45], [10, 20, 23, 26], [27, 37, 40, 43]]);
        }));

        function editTemplateAccess(_x4) {
          return _editTemplateAccess.apply(this, arguments);
        }

        return editTemplateAccess;
      }()
    }, {
      key: "showTemplateInfo",
      value: function () {
        var _showTemplateInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(entry) {
          var record;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return this.roc.get(entry.id);

                case 2:
                  record = _context7.sent;
                  console.log('got record');
                  console.log({
                    record: record
                  });
                  return _context7.abrupt("return", showRecordInfo(record));

                case 6:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function showTemplateInfo(_x5) {
          return _showTemplateInfo.apply(this, arguments);
        }

        return showTemplateInfo;
      }()
    }]);

    return TemplatesManager;
  }();

  return TemplatesManager;
});