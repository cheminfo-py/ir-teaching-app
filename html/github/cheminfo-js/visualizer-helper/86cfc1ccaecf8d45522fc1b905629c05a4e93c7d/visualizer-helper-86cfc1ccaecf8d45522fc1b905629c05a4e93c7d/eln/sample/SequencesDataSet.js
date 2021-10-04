"use strict";

define(["module", "src/util/api", "src/util/ui", "lodash", "src/util/versioning", "src/util/color", "../../util/md5"], function (module, _api, _ui, _lodash, _versioning, _color, _md) {
  var _api2 = _interopRequireDefault(_api);

  var _ui2 = _interopRequireDefault(_ui);

  var _lodash2 = _interopRequireDefault(_lodash);

  var _versioning2 = _interopRequireDefault(_versioning);

  var _color2 = _interopRequireDefault(_color);

  var _md2 = _interopRequireDefault(_md);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function F() {};

        return {
          s: F,
          n: function n() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function e(_e) {
            throw _e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function s() {
        it = o[Symbol.iterator]();
      },
      n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function e(_e2) {
        didErr = true;
        err = _e2;
      },
      f: function f() {
        try {
          if (!normalCompletion && it["return"] != null) it["return"]();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
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

  var SequencesConfigs = {
    Nucleic: {
      tocFilter: function tocFilter(entry) {
        return entry.value.nbNucleic && !entry.value.hidden;
      },
      tocCallback: function tocCallback(entry) {
        entry.value.nbSequences = entry.value.nbNucleic;
      },
      getSequences: function getSequences(sample) {
        if (sample && sample.$content && sample.$content.biology && Array.isArray(sample.$content.biology.nucleic)) {
          var sequences = sample.$content.biology.nucleic;
          return sequences;
        } else {
          return [];
        }
      }
    },
    Peptidic: {
      tocFilter: function tocFilter(entry) {
        return entry.value.nbPeptidic && !entry.value.hidden;
      },
      tocCallback: function tocCallback(entry) {
        entry.value.nbSequences = entry.value.nbPeptidic;
      },
      getSequences: function getSequences(sample) {
        if (sample && sample.$content && sample.$content.biology && Array.isArray(sample.$content.biology.peptidic)) {
          var sequences = sample.$content.biology.peptidic;
          return sequences;
        } else {
          return [];
        }
      }
    }
  };

  var SequencesDataSet = function () {
    function SequencesDataSet(roc, sampleToc) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, SequencesDataSet);

      this.roc = roc;
      this.sampleToc = sampleToc;
      this.spectraConfig = undefined;
      this.defaultAttributes = options.defaultAttributes || {};
    }
    /**
     * @param {object} [options={}]
     * @param {string} [options.varName='analysisKind'] contains the name of the variable containing the form value
     * @param {string} [options.schemaVarName='analysisKindSchema'] contains the name of the variable containing the form schema
     * @return {string} the form to select group}
     */


    _createClass(SequencesDataSet, [{
      key: "initializeAnalysis",
      value: function () {
        var _initializeAnalysis = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var _this = this;

          var options,
              _options$schemaVarNam,
              schemaVarName,
              _options$varName,
              varName,
              _options$cookieName,
              cookieName,
              possibleAnalysis,
              defaultAnalysis,
              schema,
              analysisKind,
              mainData,
              _args = arguments;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                  _options$schemaVarNam = options.schemaVarName, schemaVarName = _options$schemaVarNam === void 0 ? 'analysisKindSchema' : _options$schemaVarNam, _options$varName = options.varName, varName = _options$varName === void 0 ? 'analysisKind' : _options$varName, _options$cookieName = options.cookieName, cookieName = _options$cookieName === void 0 ? 'eln-default-analysis-kind' : _options$cookieName;
                  possibleAnalysis = Object.keys(SequencesConfigs);
                  defaultAnalysis = localStorage.getItem(cookieName);

                  if (possibleAnalysis.indexOf(defaultAnalysis) === -1) {
                    defaultAnalysis = possibleAnalysis[0];
                  }

                  schema = {
                    type: 'object',
                    properties: {
                      analysis: {
                        type: 'string',
                        "enum": possibleAnalysis,
                        "default": defaultAnalysis,
                        required: true
                      }
                    }
                  };

                  _api2["default"].createData(schemaVarName, schema);

                  _context.next = 9;
                  return _api2["default"].createData(varName, {
                    analysis: defaultAnalysis
                  });

                case 9:
                  analysisKind = _context.sent;
                  this.spectraConfig = SequencesConfigs[defaultAnalysis];
                  _context.next = 13;
                  return this.refresh();

                case 13:
                  mainData = _versioning2["default"].getData();
                  mainData.onChange(function (evt) {
                    if (evt.jpath[0] === varName) {
                      localStorage.setItem(cookieName, analysisKind.analysis);

                      var selectedSequences = _api2["default"].getData('selectedSequences');

                      selectedSequences.length = 0;
                      selectedSequences.triggerChange();
                      _this.spectraConfig = SequencesConfigs[String(analysisKind.analysis)];

                      _this.refresh();
                    }
                  });
                  return _context.abrupt("return", analysisKind);

                case 16:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function initializeAnalysis() {
          return _initializeAnalysis.apply(this, arguments);
        }

        return initializeAnalysis;
      }()
    }, {
      key: "refresh",
      value: function refresh() {
        if (!this.sampleToc) return;
        this.sampleToc.options.filter = this.spectraConfig.tocFilter;
        this.sampleToc.options.callback = this.spectraConfig.tocCallback;
        this.sampleToc.refresh();
      }
    }, {
      key: "processAction",
      value: function () {
        var _processAction = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(action) {
          var selectedSequences, _selectedSequences, firstSpectrum, path, jpath, getJpath, _iterator, _step, sequence, _selectedSequences2;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  console.log({
                    action: action
                  });
                  _context2.t0 = action.name;
                  _context2.next = _context2.t0 === 'clickedSample' ? 4 : _context2.t0 === 'refresh' ? 6 : _context2.t0 === 'hideSpectra' ? 8 : _context2.t0 === 'hideAllSpectra' ? 10 : _context2.t0 === 'showOnlySpectra' ? 12 : _context2.t0 === 'forceRecolor' ? 14 : _context2.t0 === 'selectCategory' ? 19 : _context2.t0 === 'showSpectra' ? 32 : _context2.t0 === 'showAllSpectra' ? 34 : _context2.t0 === 'clearSelectedSamples' ? 36 : _context2.t0 === 'addSelectedSamples' ? 40 : _context2.t0 === 'addSample' ? 43 : _context2.t0 === 'addSpectrum' ? 46 : 49;
                  break;

                case 4:
                  this.clickedSample(action.value);
                  return _context2.abrupt("break", 49);

                case 6:
                  this.refresh();
                  return _context2.abrupt("break", 49);

                case 8:
                  this.hideSpectra();
                  return _context2.abrupt("break", 49);

                case 10:
                  this.hideAllSpectra();
                  return _context2.abrupt("break", 49);

                case 12:
                  this.showOnlySpectra();
                  return _context2.abrupt("break", 49);

                case 14:
                  selectedSequences = _api2["default"].getData('selectedSequences');
                  selectedSequences.forEach(function (sequence) {
                    return sequence.color = '';
                  });
                  recolor(selectedSequences);
                  selectedSequences.triggerChange();
                  return _context2.abrupt("break", 49);

                case 19:
                  _selectedSequences = _api2["default"].getData('selectedSequences');
                  firstSpectrum = DataObject.resurrect(_selectedSequences[0]);
                  path = [];

                  if (firstSpectrum.toc && firstSpectrum.toc.value) {
                    firstSpectrum = firstSpectrum.toc.value;
                    path = ['toc', 'value'];
                  }

                  _context2.next = 25;
                  return _ui2["default"].selectJpath(firstSpectrum, undefined, {
                    height: 500
                  });

                case 25:
                  jpath = _context2.sent;

                  if (jpath) {
                    _context2.next = 28;
                    break;
                  }

                  return _context2.abrupt("return");

                case 28:
                  getJpath = _lodash2["default"].property([].concat(_toConsumableArray(path), _toConsumableArray(jpath)));
                  _iterator = _createForOfIteratorHelper(_selectedSequences);

                  try {
                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                      sequence = _step.value;
                      sequence.category = getJpath(sequence);
                    }
                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }

                  _selectedSequences.triggerChange();

                case 32:
                  this.showSpectra();
                  return _context2.abrupt("break", 49);

                case 34:
                  this.showAllSpectra();
                  return _context2.abrupt("break", 49);

                case 36:
                  _selectedSequences2 = _api2["default"].getData('selectedSequences');
                  _selectedSequences2.length = 0;

                  _selectedSequences2.triggerChange();

                  return _context2.abrupt("break", 49);

                case 40:
                  _context2.next = 42;
                  return this.addSelectedSamples(_api2["default"].getData('tocSelected').resurrect());

                case 42:
                  return _context2.abrupt("break", 49);

                case 43:
                  _context2.next = 45;
                  return this.addSelectedSamples([action.value.resurrect()]);

                case 45:
                  return _context2.abrupt("break", 49);

                case 46:
                  _context2.next = 48;
                  return this.addSpectrum(_api2["default"].getData('tocClicked').resurrect(), action.value.resurrect());

                case 48:
                  return _context2.abrupt("break", 49);

                case 49:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function processAction(_x) {
          return _processAction.apply(this, arguments);
        }

        return processAction;
      }()
    }, {
      key: "clickedSample",
      value: function () {
        var _clickedSample = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(samples) {
          var uuid, data, sequences;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(samples.length !== 1)) {
                    _context3.next = 3;
                    break;
                  }

                  _api2["default"].createData('sequences', []);

                  return _context3.abrupt("return");

                case 3:
                  uuid = String(samples[0].id);
                  _context3.next = 6;
                  return this.roc.document(uuid, {
                    varName: 'linkedSample'
                  });

                case 6:
                  data = _context3.sent;
                  sequences = this.spectraConfig.getSequences(data);

                  _api2["default"].createData('sequences', sequences);

                case 9:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function clickedSample(_x2) {
          return _clickedSample.apply(this, arguments);
        }

        return clickedSample;
      }()
    }, {
      key: "showAllSpectra",
      value: function showAllSpectra() {
        var selectedSequences = _api2["default"].getData('selectedSequences');

        var _iterator2 = _createForOfIteratorHelper(selectedSequences),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var sequence = _step2.value;
            sequence.display = true;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        _api2["default"].getData('selectedSequences').triggerChange();
      }
    }, {
      key: "hideAllSpectra",
      value: function hideAllSpectra() {
        var selectedSequences = _api2["default"].getData('selectedSequences');

        var _iterator3 = _createForOfIteratorHelper(selectedSequences),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var sequence = _step3.value;
            sequence.display = false;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        _api2["default"].getData('selectedSequences').triggerChange();
      }
    }, {
      key: "showSpectra",
      value: function showSpectra() {
        var selectedSequences = _api2["default"].getData('selectedSequences');

        var currentlySelectedSpectra = _api2["default"].getData('currentlySelectedSpectra');

        var _iterator4 = _createForOfIteratorHelper(currentlySelectedSpectra),
            _step4;

        try {
          var _loop = function _loop() {
            var currentlySelectedSpectrum = _step4.value;
            var sequence = selectedSequences.filter(function (sequence) {
              return String(sequence.id) === String(currentlySelectedSpectrum.id);
            })[0];
            sequence.display = true;
          };

          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        _api2["default"].getData('selectedSequences').triggerChange();
      }
    }, {
      key: "showOnlySpectra",
      value: function showOnlySpectra() {
        var selectedSequences = _api2["default"].getData('selectedSequences');

        if (!Array.isArray(selectedSequences)) return;

        var _iterator5 = _createForOfIteratorHelper(selectedSequences),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var sequence = _step5.value;
            sequence.display = false;
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        var currentlySelectedSpectra = _api2["default"].getData('currentlySelectedSpectra');

        var _iterator6 = _createForOfIteratorHelper(currentlySelectedSpectra),
            _step6;

        try {
          var _loop2 = function _loop2() {
            var currentlySelectedSpectrum = _step6.value;
            var sequence = selectedSequences.filter(function (sequence) {
              return String(sequence.id) === String(currentlySelectedSpectrum.id);
            })[0];
            sequence.display = true;
          };

          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            _loop2();
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }

        _api2["default"].getData('selectedSequences').triggerChange();
      }
    }, {
      key: "hideSpectra",
      value: function hideSpectra() {
        var selectedSequences = _api2["default"].getData('selectedSequences');

        var currentlySelectedSpectra = _api2["default"].getData('currentlySelectedSpectra');

        var _iterator7 = _createForOfIteratorHelper(currentlySelectedSpectra),
            _step7;

        try {
          var _loop3 = function _loop3() {
            var currentlySelectedSpectrum = _step7.value;
            var sequence = selectedSequences.filter(function (sequence) {
              return String(sequence.id) === String(currentlySelectedSpectrum.id);
            })[0];
            sequence.display = false;
          };

          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            _loop3();
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }

        _api2["default"].getData('selectedSequences').triggerChange();
      }
    }, {
      key: "addSpectrum",
      value: function addSpectrum(tocEntry, sequence) {
        var selectedSequences = _api2["default"].getData('selectedSequences');

        this.addSequenceToSelected(sequence, tocEntry, selectedSequences);
        recolor(selectedSequences);
        selectedSequences.triggerChange();
      }
    }, {
      key: "addSelectedSamples",
      value: function () {
        var _addSelectedSamples = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(tocSelected) {
          var _this2 = this;

          var selectedSequences, promises, _iterator8, _step8, _loop4;

          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  selectedSequences = _api2["default"].getData('selectedSequences');
                  promises = [];
                  _iterator8 = _createForOfIteratorHelper(tocSelected);

                  try {
                    _loop4 = function _loop4() {
                      var tocEntry = _step8.value;
                      promises.push(_this2.roc.document(tocEntry.id).then(function (sample) {
                        var sequences = _this2.spectraConfig.getSequences(sample);

                        console.log({
                          sequences: sequences
                        });

                        var _iterator9 = _createForOfIteratorHelper(sequences),
                            _step9;

                        try {
                          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                            var sequence = _step9.value;

                            if (Array.isArray(sequence.seq)) {
                              var _iterator10 = _createForOfIteratorHelper(sequence.seq),
                                  _step10;

                              try {
                                for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                                  var seq = _step10.value;

                                  _this2.addSequenceToSelected(seq, tocEntry, selectedSequences);
                                }
                              } catch (err) {
                                _iterator10.e(err);
                              } finally {
                                _iterator10.f();
                              }
                            }
                          }
                        } catch (err) {
                          _iterator9.e(err);
                        } finally {
                          _iterator9.f();
                        }
                      }));
                    };

                    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                      _loop4();
                    }
                  } catch (err) {
                    _iterator8.e(err);
                  } finally {
                    _iterator8.f();
                  }

                  _context4.next = 6;
                  return Promise.all(promises);

                case 6:
                  recolor(selectedSequences);
                  console.log(selectedSequences);
                  selectedSequences.triggerChange();

                case 9:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function addSelectedSamples(_x3) {
          return _addSelectedSamples.apply(this, arguments);
        }

        return addSelectedSamples;
      }()
    }, {
      key: "addSequenceToSelected",
      value: function () {
        var _addSequenceToSelected = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(seq, tocEntry, selectedSequences) {
          var hash, sequenceID, sampleID, sequence, key;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (!seq.sequence) {
                    _context5.next = 17;
                    break;
                  }

                  hash = (0, _md2["default"])(seq.sequence).substring(0, 8);
                  sequenceID = String("".concat(tocEntry.value.reference, " / ").concat(hash));
                  sampleID = String(tocEntry.id);

                  if (!(selectedSequences.filter(function (sequence) {
                    return String(sequence.id) === sequenceID;
                  }).length > 0)) {
                    _context5.next = 6;
                    break;
                  }

                  return _context5.abrupt("return");

                case 6:
                  sequence = {
                    sequence: seq.sequence
                  };
                  sequence.sampleID = sampleID;
                  sequence.id = sequenceID;
                  sequence.display = true;

                  for (key in this.defaultAttributes) {
                    sequence[key] = this.defaultAttributes[key];
                  }

                  sequence.sampleCode = tocEntry.key.slice(1).join('_');
                  sequence.toc = tocEntry;
                  sequence.sequence = seq.sequence.replace(/[^A-Za-z]/g, '');
                  sequence.category = sequence.sampleCode;
                  sequence._highlight = sequenceID;
                  selectedSequences.push(sequence);

                case 17:
                  console.log({
                    selectedSequences: selectedSequences
                  });

                case 18:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function addSequenceToSelected(_x4, _x5, _x6) {
          return _addSequenceToSelected.apply(this, arguments);
        }

        return addSequenceToSelected;
      }()
    }]);

    return SequencesDataSet;
  }();

  function recolor(selectedSequences) {
    // need to count the categories
    var categoryColors = {};
    var existingColors = 0;

    var _iterator11 = _createForOfIteratorHelper(selectedSequences),
        _step11;

    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var sequence = _step11.value;
        var category = String(sequence.category);

        if (categoryColors[category] === undefined) {
          if (sequence.color) {
            categoryColors[String(sequence.category)] = sequence.color;
            existingColors++;
          } else {
            categoryColors[String(sequence.category)] = '';
          }
        }
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }

    var nbColors = Math.max(8, 1 << Math.ceil(Math.log2(Object.keys(categoryColors).length)));

    var colors = _color2["default"].getDistinctColorsAsString(nbColors);

    var i = existingColors;

    for (var key in categoryColors) {
      if (!categoryColors[key]) {
        categoryColors[key] = colors[i++];
      }
    }

    var _iterator12 = _createForOfIteratorHelper(selectedSequences),
        _step12;

    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        var _sequence = _step12.value;

        if (!_sequence.color) {
          _sequence.color = categoryColors[String(_sequence.category)];
        }
      }
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }
  }

  module.exports = SequencesDataSet;
});