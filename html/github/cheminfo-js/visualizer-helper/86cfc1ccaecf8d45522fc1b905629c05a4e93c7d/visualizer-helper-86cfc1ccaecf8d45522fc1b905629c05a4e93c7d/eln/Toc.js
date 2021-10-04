"use strict";

define(["module", "src/util/api", "src/util/versioning"], function (module, _api, _versioning) {
  var _api2 = _interopRequireDefault(_api);

  var _versioning2 = _interopRequireDefault(_versioning);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var defaultOptions = {
    group: 'all',
    varName: 'sampleToc',
    viewName: 'sample_toc',
    filter: function filter(entry) {
      return !entry.value.hidden;
    },
    sort: function sort(a, b) {
      if (a.value.modified && a.value.modified > b.value.modified) {
        return -1;
      } else if (a.value.modificationDate && a.value.modificationDate > b.value.modificationDate) {
        return -1;
      } else if (a.value.modified && a.value.modified < b.value.modified) {
        return 1;
      } else if (a.value.modificationDate && a.value.modificationDate < b.value.modificationDate) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  var Toc = function () {
    /**
     * Create an object managing the Toc
     * @param {object} [options={}]
     * @param {object} [roc=undefined]
     * @param {string} [options.group='mine'] Group to retrieve products. mine, all of a specific group name
     * @param {string} [options.varName='sampleToc']
     * @param {string} [options.viewName='sample_toc']
     * @param {function} [options.sort] Callback, by default sort by reverse date
     * @param {function} [options.filter] Callback to filter the result
     */
    function Toc(roc) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Toc);

      this.roc = roc;
      this.options = Object.assign({}, defaultOptions, options);
    }

    _createClass(Toc, [{
      key: "setFilter",
      value: function setFilter(filter) {
        this.options.filter = filter;
        return this.refresh();
      }
    }, {
      key: "refresh",
      value: function refresh() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _Object$assign = Object.assign({}, this.options, options),
            group = _Object$assign.group,
            sort = _Object$assign.sort,
            filter = _Object$assign.filter,
            viewName = _Object$assign.viewName;

        var mine = 0;
        var groups = '';
        group = String(group);

        if (group === 'mine') {
          mine = 1;
        } else if (group !== 'all') {
          groups = group;
        }

        console.log('refresh', {
          groups: groups,
          mine: mine,
          filter: filter
        });
        return this.roc.query(viewName, {
          groups: groups,
          mine: mine,
          sort: sort,
          filter: filter,
          varName: this.options.varName
        }).then(function (entries) {
          if (_this.options.callback) {
            entries.forEach(_this.options.callback);
          }

          return entries;
        });
      }
    }, {
      key: "initializeGroupForm",
      value: function () {
        var _initializeGroupForm = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var _this2 = this;

          var options,
              _options$schemaVarNam,
              schemaVarName,
              _options$varName,
              varName,
              _options$cookieName,
              cookieName,
              filter,
              _options$autoRefresh,
              autoRefresh,
              _options$listAllGroup,
              listAllGroups,
              groups,
              possibleGroups,
              defaultGroup,
              schema,
              groupForm,
              mainData,
              _args = arguments;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                  _options$schemaVarNam = options.schemaVarName, schemaVarName = _options$schemaVarNam === void 0 ? 'groupFormSchema' : _options$schemaVarNam, _options$varName = options.varName, varName = _options$varName === void 0 ? 'groupForm' : _options$varName, _options$cookieName = options.cookieName, cookieName = _options$cookieName === void 0 ? 'eln-default-sample-group' : _options$cookieName, filter = options.filter, _options$autoRefresh = options.autoRefresh, autoRefresh = _options$autoRefresh === void 0 ? true : _options$autoRefresh, _options$listAllGroup = options.listAllGroups, listAllGroups = _options$listAllGroup === void 0 ? false : _options$listAllGroup;
                  groups = [];

                  if (!listAllGroups) {
                    _context.next = 9;
                    break;
                  }

                  _context.next = 6;
                  return this.roc.getGroupsInfo();

                case 6:
                  groups = _context.sent.map(function (g) {
                    return g.name;
                  });
                  _context.next = 12;
                  break;

                case 9:
                  _context.next = 11;
                  return this.roc.getGroupMembership();

                case 11:
                  groups = _context.sent.map(function (g) {
                    return g.name;
                  });

                case 12:
                  possibleGroups = ['all', 'mine'].concat(groups);
                  defaultGroup = localStorage.getItem(cookieName);

                  if (possibleGroups.indexOf(defaultGroup) === -1) {
                    defaultGroup = 'all';
                  }

                  schema = {
                    type: 'object',
                    properties: {
                      group: {
                        type: 'string',
                        "enum": possibleGroups,
                        "default": defaultGroup,
                        required: true
                      }
                    }
                  };

                  _api2["default"].createData(schemaVarName, schema);

                  _context.next = 19;
                  return _api2["default"].createData(varName, {
                    group: defaultGroup
                  });

                case 19:
                  groupForm = _context.sent;
                  this.options.group = groupForm.group;

                  if (!autoRefresh) {
                    _context.next = 24;
                    break;
                  }

                  _context.next = 24;
                  return this.refresh(filter);

                case 24:
                  mainData = _versioning2["default"].getData();
                  mainData.onChange(function (evt) {
                    if (evt.jpath[0] === varName) {
                      localStorage.setItem(cookieName, groupForm.group);
                      _this2.options.group = String(groupForm.group);

                      _this2.refresh();
                    }
                  });
                  return _context.abrupt("return", groupForm);

                case 27:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function initializeGroupForm() {
          return _initializeGroupForm.apply(this, arguments);
        }

        return initializeGroupForm;
      }()
    }]);

    return Toc;
  }();

  module.exports = Toc;
});