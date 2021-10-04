"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(['../util/getViewInfo', 'src/util/api', 'src/util/couchdbAttachments'], function (getViewInfo, API) {
  var UserAnalysisResults = /*#__PURE__*/function () {
    function UserAnalysisResults(roc, sampleID) {
      var _this = this;

      _classCallCheck(this, UserAnalysisResults);

      this.roc = roc;
      this.sampleID = sampleID;
      this.viewID = undefined;
      getViewInfo().then(function (result) {
        _this.viewID = result._id;
      });
    }

    _createClass(UserAnalysisResults, [{
      key: "setSampleID",
      value: function setSampleID(sampleID) {
        this.sampleID = sampleID;
      }
    }, {
      key: "refresh",
      value: function () {
        var _refresh = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var analysisResults, analysisTemplates;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.loadResults();

                case 2:
                  analysisResults = _context.sent;
                  API.createData('analysisResults', analysisResults);
                  _context.next = 6;
                  return this.loadTemplates();

                case 6:
                  analysisTemplates = _context.sent;
                  API.createData('analysisTemplates', analysisTemplates);

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function refresh() {
          return _refresh.apply(this, arguments);
        }

        return refresh;
      }()
    }, {
      key: "loadTemplates",
      value: function () {
        var _loadTemplates = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(key) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (this.roc) {
                    _context2.next = 8;
                    break;
                  }

                  _context2.t0 = this.viewID;

                  if (_context2.t0) {
                    _context2.next = 6;
                    break;
                  }

                  _context2.next = 5;
                  return getViewInfo();

                case 5:
                  _context2.t0 = _context2.sent._id;

                case 6:
                  this.viewID = _context2.t0;
                  return _context2.abrupt("return", loadTemplatesFromLocalStorage(this.viewID));

                case 8:
                  return _context2.abrupt("return", this.loadResults(key, {
                    sampleID: ''
                  }));

                case 9:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function loadTemplates(_x) {
          return _loadTemplates.apply(this, arguments);
        }

        return loadTemplates;
      }()
      /**
       * Retrieve all the analytical results for a sample in a view
       * @param {string} key
       */

    }, {
      key: "loadResults",
      value: function () {
        var _loadResults = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(key) {
          var options,
              _options$sampleID,
              sampleID,
              queryOptions,
              entries,
              _args3 = arguments;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};

                  if (this.roc) {
                    _context3.next = 4;
                    break;
                  }

                  console.log('Can not retrieve results, not connected to roc');
                  return _context3.abrupt("return");

                case 4:
                  _options$sampleID = options.sampleID, sampleID = _options$sampleID === void 0 ? this.sampleID : _options$sampleID;
                  _context3.t0 = this.viewID;

                  if (_context3.t0) {
                    _context3.next = 10;
                    break;
                  }

                  _context3.next = 9;
                  return getViewInfo();

                case 9:
                  _context3.t0 = _context3.sent._id;

                case 10:
                  this.viewID = _context3.t0;
                  // var user = await this.roc.getUser();
                  queryOptions = key ? {
                    key: ['userAnalysisResults', this.viewID, sampleID, key]
                  } : {
                    startkey: ['userAnalysisResults', this.viewID, sampleID, "\0"],
                    endkey: ['userAnalysisResults', this.viewID, sampleID, "\uFFFF"]
                  };
                  queryOptions.mine = false;
                  _context3.next = 15;
                  return this.roc.query('userAnalysisToc', queryOptions);

                case 15:
                  entries = _context3.sent;

                  /* if (sampleID) {
                    return entries.filter((entry) => entry.$id[2].match(/^[0-9a-f]{32}$/i));
                  }*/
                  console.log({
                    entries: entries
                  });
                  return _context3.abrupt("return", entries);

                case 18:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function loadResults(_x2) {
          return _loadResults.apply(this, arguments);
        }

        return loadResults;
      }()
    }, {
      key: "delete",
      value: function _delete(entry) {
        entry._id = entry._id || entry.id;
        return this.roc["delete"](entry);
      }
      /**
       * Result is stored in an attachment called result.json
       * @param {*} entry
       */

    }, {
      key: "loadResult",
      value: function () {
        var _loadResult = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(entry) {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  entry._id = entry._id || entry.id;

                  if (this.roc) {
                    _context4.next = 3;
                    break;
                  }

                  return _context4.abrupt("return", loadTemplateFromLocalStorage(this.viewID, String(entry._id)));

                case 3:
                  this.lastEntry = entry;
                  console.log(this.lastEntry);
                  return _context4.abrupt("return", this.roc.getAttachment(entry, 'result.json'));

                case 6:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function loadResult(_x3) {
          return _loadResult.apply(this, arguments);
        }

        return loadResult;
      }()
    }, {
      key: "saveTemplate",
      value: function () {
        var _saveTemplate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(key, meta, result) {
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (this.roc) {
                    _context5.next = 4;
                    break;
                  }

                  return _context5.abrupt("return", saveTemplateToLocalStorage(this.viewID, key, result));

                case 4:
                  return _context5.abrupt("return", this.save(key, meta, result, {
                    sampleID: ''
                  }));

                case 5:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function saveTemplate(_x4, _x5, _x6) {
          return _saveTemplate.apply(this, arguments);
        }

        return saveTemplate;
      }()
    }, {
      key: "deleteTemplate",
      value: function () {
        var _deleteTemplate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(entry) {
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  if (this.roc) {
                    _context6.next = 4;
                    break;
                  }

                  return _context6.abrupt("return", deleteTemplateFromLocalStorage(this.viewID, entry._id));

                case 4:
                  return _context6.abrupt("return", this["delete"](entry));

                case 5:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function deleteTemplate(_x7) {
          return _deleteTemplate.apply(this, arguments);
        }

        return deleteTemplate;
      }()
    }, {
      key: "save",
      value: function () {
        var _save = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(key, meta, result) {
          var options,
              _options$sampleID2,
              sampleID,
              entry,
              attachments,
              _args7 = arguments;

          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  options = _args7.length > 3 && _args7[3] !== undefined ? _args7[3] : {};
                  _options$sampleID2 = options.sampleID, sampleID = _options$sampleID2 === void 0 ? this.sampleID : _options$sampleID2;
                  _context7.t0 = this.viewID;

                  if (_context7.t0) {
                    _context7.next = 7;
                    break;
                  }

                  _context7.next = 6;
                  return getViewInfo();

                case 6:
                  _context7.t0 = _context7.sent._id;

                case 7:
                  this.viewID = _context7.t0;
                  _context7.next = 10;
                  return this.loadResults(key, {
                    sampleID: sampleID
                  });

                case 10:
                  entry = _context7.sent[0];

                  if (!entry) {
                    _context7.next = 22;
                    break;
                  }

                  if (!entry._id) entry._id = entry.id;
                  _context7.next = 15;
                  return this.roc.get(entry);

                case 15:
                  entry = _context7.sent;
                  entry.$content = meta;
                  console.log({
                    entry: entry
                  });
                  _context7.next = 20;
                  return this.roc.update(entry);

                case 20:
                  _context7.next = 25;
                  break;

                case 22:
                  _context7.next = 24;
                  return this.roc.create({
                    $id: ['userAnalysisResults', this.viewID, sampleID, key],
                    $content: meta,
                    $kind: 'userAnalysisResults'
                  });

                case 24:
                  entry = _context7.sent;

                case 25:
                  if (!result) {
                    _context7.next = 29;
                    break;
                  }

                  attachments = [{
                    filename: 'result.json',
                    data: JSON.stringify(result),
                    contentType: 'application/json'
                  }];
                  _context7.next = 29;
                  return this.roc.addAttachment(entry, attachments);

                case 29:
                  return _context7.abrupt("return", entry);

                case 30:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function save(_x8, _x9, _x10) {
          return _save.apply(this, arguments);
        }

        return save;
      }()
    }]);

    return UserAnalysisResults;
  }();

  return UserAnalysisResults;
});

function loadTemplatesFromLocalStorage(viewID) {
  return (JSON.parse(localStorage.getItem("templates-".concat(viewID))) || []).filter(function (template) {
    return template.value && template.value.name;
  });
}

function loadTemplateFromLocalStorage(viewID, name) {
  var templates = loadTemplatesFromLocalStorage(viewID);

  var _iterator = _createForOfIteratorHelper(templates),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var template = _step.value;

      if (template.id === String(name)) {
        return template.data;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return {};
}

function deleteTemplateFromLocalStorage(viewID, name) {
  var templates = loadTemplatesFromLocalStorage(viewID);
  var currentTemplates = templates.filter(function (entry) {
    return entry.id !== String(name);
  });
  localStorage.setItem("templates-".concat(viewID), JSON.stringify(currentTemplates));
}

function saveTemplateToLocalStorage(viewID, name, data) {
  var templates = loadTemplatesFromLocalStorage(viewID);
  var template = templates.filter(function (entry) {
    return entry._id === String(name);
  })[0];

  if (!template) {
    template = {
      id: name,
      value: {
        name: name
      }
    };
    templates.push(template);
  }

  template.data = data;
  localStorage.setItem("templates-".concat(viewID), JSON.stringify(templates));
}