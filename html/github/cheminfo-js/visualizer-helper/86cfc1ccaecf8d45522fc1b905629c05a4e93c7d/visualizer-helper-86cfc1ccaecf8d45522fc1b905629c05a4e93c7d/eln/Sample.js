"use strict";

define(["module", "src/main/datas", "src/util/api", "src/util/ui", "../rest-on-couch/Roc", "./ExpandableMolecule", "./Nmr1dManager", "./MF", "./jpaths", "./libs/elnPlugin", "./Sequence", "./libs/convertToJcamp"], function (module, _datas, _api, _ui, _Roc, _ExpandableMolecule, _Nmr1dManager, _MF, _jpaths, _elnPlugin, _Sequence, _convertToJcamp) {
  var _datas2 = _interopRequireDefault(_datas);

  var _api2 = _interopRequireDefault(_api);

  var _ui2 = _interopRequireDefault(_ui);

  var _Roc2 = _interopRequireDefault(_Roc);

  var _ExpandableMolecule2 = _interopRequireDefault(_ExpandableMolecule);

  var _Nmr1dManager2 = _interopRequireDefault(_Nmr1dManager);

  var _MF2 = _interopRequireDefault(_MF);

  var _elnPlugin2 = _interopRequireDefault(_elnPlugin);

  var _Sequence2 = _interopRequireDefault(_Sequence);

  var _convertToJcamp2 = _interopRequireDefault(_convertToJcamp);

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

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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

  var DataObject = _datas2["default"].DataObject;
  var defaultOptions = {
    varName: 'sample',
    track: false,
    bindChange: true
  };

  var Sample = function () {
    function Sample(couchDB, uuid, options) {
      var _this = this;

      _classCallCheck(this, Sample);

      this.options = Object.assign({}, defaultOptions, options);

      var roc = _api2["default"].cache('roc');

      if (!roc) {
        roc = new _Roc2["default"]({
          url: couchDB.url,
          database: couchDB.database,
          processor: _elnPlugin2["default"],
          kind: couchDB.kind
        });

        _api2["default"].cache('roc', roc);
      }

      this.roc = roc;

      if (options.onSync) {
        var emitter = this.roc.getDocumentEventEmitter(uuid);
        emitter.on('sync', function () {
          return options.onSync(true);
        });
        emitter.on('unsync', function () {
          return options.onSync(false);
        });
      }

      this.uuid = uuid;

      if (!this.uuid) {
        _ui2["default"].showNotification('Cannot create an editable sample without an uuid', 'error');

        return;
      }

      this.sample = this.roc.document(this.uuid, this.options).then(function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(sample) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _this.sample = sample;

                  _this.updateOtherAttachments();

                  _this._loadInstanceInVisualizer();

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());

      this._checkServerChanges();
    }

    _createClass(Sample, [{
      key: "waitSampleLoaded",
      value: function waitSampleLoaded() {
        return this.sample;
      }
    }, {
      key: "getToc",
      value: function () {
        var _getToc = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
          var _this2 = this;

          var id, result;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  id = DataObject.resurrect(this.sample.$id).join(' ');
                  _context2.next = 3;
                  return this.roc.query('sample_toc', {
                    key: id,
                    filter: function filter(entry) {
                      return entry.id === _this2.uuid;
                    }
                  });

                case 3:
                  result = _context2.sent;

                  if (!(result.length === 0)) {
                    _context2.next = 8;
                    break;
                  }

                  _context2.next = 7;
                  return this.roc.query('sample_toc', {
                    key: id.trimEnd(' '),
                    filter: function filter(entry) {
                      return entry.id === _this2.uuid;
                    }
                  });

                case 7:
                  result = _context2.sent;

                case 8:
                  return _context2.abrupt("return", result[0]);

                case 9:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function getToc() {
          return _getToc.apply(this, arguments);
        }

        return getToc;
      }()
    }, {
      key: "_checkServerChanges",
      value: function _checkServerChanges() {
        var _this3 = this;

        window.setInterval(_asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
          var uuid, rev, headers, remoteRev, target, remoteHasChangedDiv, alertDiv;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(_this3.sample && _this3.sample._rev)) {
                    _context3.next = 11;
                    break;
                  }

                  uuid = _this3.sample._id;
                  rev = _this3.sample._rev;
                  _context3.next = 5;
                  return _this3.roc.getHeader(uuid);

                case 5:
                  headers = _context3.sent;

                  if (!(!headers || !headers.etag)) {
                    _context3.next = 8;
                    break;
                  }

                  return _context3.abrupt("return");

                case 8:
                  remoteRev = String(headers.etag).replace(/"/g, '');
                  target = document.getElementById('modules-grid');

                  if (remoteRev && rev !== remoteRev && _this3.options.track) {
                    remoteHasChangedDiv = document.getElementById('remoteHasChanged');

                    if (!remoteHasChangedDiv) {
                      alertDiv = document.createElement('DIV');
                      alertDiv.innerHTML = "<p id=\"remoteHasChanged\" style=\"font-weight: bold; color: red; font-size: 3em; background-color: yellow\">\nThis entry has changed on the server, please reload the sample.<br>\nYour local changes will be lost.</p>";
                      alertDiv.style.zIndex = 99;
                      alertDiv.style.position = 'fixed';
                      target.prepend(alertDiv);
                    } else {
                      remoteHasChangedDiv.style.display = 'block';
                    }

                    _this3.remoteChanged = true;
                  }

                case 11:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        })), 60 * 1000);
      }
    }, {
      key: "createVariables",
      value: function createVariables() {
        var sampleVar = _api2["default"].getVar(this.options.varName);

        (0, _jpaths.createVar)(sampleVar, 'sampleCode');
        (0, _jpaths.createVar)(sampleVar, 'batchCode');
        (0, _jpaths.createVar)(sampleVar, 'creationDate');
        (0, _jpaths.createVar)(sampleVar, 'modificationDate');
        (0, _jpaths.createVar)(sampleVar, 'content');
        (0, _jpaths.createVar)(sampleVar, 'general');
        (0, _jpaths.createVar)(sampleVar, 'molfile');
        (0, _jpaths.createVar)(sampleVar, 'firstPeptide');
        (0, _jpaths.createVar)(sampleVar, 'firstNucleotide');
        (0, _jpaths.createVar)(sampleVar, 'mf');
        (0, _jpaths.createVar)(sampleVar, 'mw');
        (0, _jpaths.createVar)(sampleVar, 'em');
        (0, _jpaths.createVar)(sampleVar, 'title');
        (0, _jpaths.createVar)(sampleVar, 'description');
        (0, _jpaths.createVar)(sampleVar, 'keyword');
        (0, _jpaths.createVar)(sampleVar, 'meta');
        (0, _jpaths.createVar)(sampleVar, 'name');
        (0, _jpaths.createVar)(sampleVar, 'physical');
        (0, _jpaths.createVar)(sampleVar, 'bp');
        (0, _jpaths.createVar)(sampleVar, 'nd');
        (0, _jpaths.createVar)(sampleVar, 'mp');
        (0, _jpaths.createVar)(sampleVar, 'density');
        (0, _jpaths.createVar)(sampleVar, 'stockHistory');
        (0, _jpaths.createVar)(sampleVar, 'stock');
        (0, _jpaths.createVar)(sampleVar, 'lastStock');
        (0, _jpaths.createVar)(sampleVar, 'supplier');
        (0, _jpaths.createVar)(sampleVar, 'ir');
        (0, _jpaths.createVar)(sampleVar, 'uv');
        (0, _jpaths.createVar)(sampleVar, 'raman');
        (0, _jpaths.createVar)(sampleVar, 'mass');
        (0, _jpaths.createVar)(sampleVar, 'nmr');
        (0, _jpaths.createVar)(sampleVar, 'iv');
        (0, _jpaths.createVar)(sampleVar, 'xray');
        (0, _jpaths.createVar)(sampleVar, 'chromatogram');
        (0, _jpaths.createVar)(sampleVar, 'thermogravimetricAnalysis');
        (0, _jpaths.createVar)(sampleVar, 'hgPorosimetry');
        (0, _jpaths.createVar)(sampleVar, 'differentialCentrifugalSedimentation');
        (0, _jpaths.createVar)(sampleVar, 'isotherm');
        (0, _jpaths.createVar)(sampleVar, 'pelletHardness');
        (0, _jpaths.createVar)(sampleVar, 'oan');
        (0, _jpaths.createVar)(sampleVar, 'xrd');
        (0, _jpaths.createVar)(sampleVar, 'xrf');
        (0, _jpaths.createVar)(sampleVar, 'xps');
        (0, _jpaths.createVar)(sampleVar, 'cyclicVoltammetry');
        (0, _jpaths.createVar)(sampleVar, 'elementalAnalysis');
        (0, _jpaths.createVar)(sampleVar, 'differentialScanningCalorimetry');
        (0, _jpaths.createVar)(sampleVar, 'image');
        (0, _jpaths.createVar)(sampleVar, 'video');
        (0, _jpaths.createVar)(sampleVar, 'sampleCode');
        (0, _jpaths.createVar)(sampleVar, 'attachments');
        (0, _jpaths.createVar)(sampleVar, 'nucleic');
        (0, _jpaths.createVar)(sampleVar, 'peptidic');
        (0, _jpaths.createVar)(sampleVar, 'biology');
      }
    }, {
      key: "_loadInstanceInVisualizer",
      value: function () {
        var _loadInstanceInVisualizer2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
          var _this4 = this;

          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  updateSample(this.sample);
                  this.createVariables();

                  this._initializeObjects();

                  this.onChange = function (event) {
                    var jpathStr = event.jpath.join('.');

                    if (jpathStr.match(/\$content.spectra.nmr.[0-9]+.range/)) {
                      _this4.nmr1dManager.rangesHasChanged();
                    }

                    switch (jpathStr) {
                      case '$content.general.molfile':
                        _this4.mf.fromMolfile();

                        _this4.nmr1dManager.handleAction({
                          name: 'clearAllAssignments'
                        });

                        break;

                      case '$content.general.mf':
                        _this4.mf.fromMF();

                        _this4.nmr1dManager.updateIntegralOptionsFromMF();

                        break;

                      case '$content.biology':
                        break;

                      case '$content.general.sequence':
                        throw new Error('Trying to change old sequence, this is a bug');

                      default:
                        break;
                      // ignore
                    }
                  };

                  this.bindChange();

                case 5:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function _loadInstanceInVisualizer() {
          return _loadInstanceInVisualizer2.apply(this, arguments);
        }

        return _loadInstanceInVisualizer;
      }()
    }, {
      key: "updateOtherAttachments",
      value: function updateOtherAttachments() {
        var otherAttachments = this.sample.attachmentList.filter(function (entry) {
          return !entry.name.includes('/');
        });

        _api2["default"].createData('otherAttachments', otherAttachments);
      }
    }, {
      key: "_initializeObjects",
      value: function _initializeObjects() {
        this.expandableMolecule = new _ExpandableMolecule2["default"](this.sample, this.options);
        this.nmr1dManager = new _Nmr1dManager2["default"](this.sample);
        this.mf = new _MF2["default"](this.sample);
        this.mf.fromMF();
      }
    }, {
      key: "bindChange",
      value: function bindChange() {
        if (this.options.bindChange) {
          this.sample.unbindChange(this.onChange);
          this.sample.onChange(this.onChange);
        }
      }
    }, {
      key: "unbindChange",
      value: function unbindChange() {
        if (this.options.bindChange) this.sample.unbindChange(this.onChange);
      }
    }, {
      key: "handleOverview",
      value: function () {
        var _handleOverview = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(variableName) {
          var data, file;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  data = _api2["default"].getData(variableName);

                  if (!(data && data.file && data.file[0])) {
                    _context5.next = 15;
                    break;
                  }

                  file = data.file[0];
                  _context5.t0 = file.mimetype;
                  _context5.next = _context5.t0 === 'image/png' ? 6 : _context5.t0 === 'image/jpeg' ? 8 : _context5.t0 === 'image/svg+xml' ? 10 : 12;
                  break;

                case 6:
                  file.filename = 'overview.png';
                  return _context5.abrupt("break", 14);

                case 8:
                  file.filename = 'overview.jpg';
                  return _context5.abrupt("break", 14);

                case 10:
                  file.filename = 'overview.svg';
                  return _context5.abrupt("break", 14);

                case 12:
                  _ui2["default"].showNotification('For overview only the following formats are allowed: png, jpg and svg.', 'error');

                  return _context5.abrupt("return", undefined);

                case 14:
                  return _context5.abrupt("return", this.handleDrop(variableName, false));

                case 15:
                  return _context5.abrupt("return", undefined);

                case 16:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function handleOverview(_x2) {
          return _handleOverview.apply(this, arguments);
        }

        return handleOverview;
      }()
    }, {
      key: "handleDrop",
      value: function () {
        var _handleDrop = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(variableName, askType) {
          var options,
              converters,
              autoJcamp,
              autoKind,
              type,
              types,
              _UI$choose,
              droppedDatas,
              newData,
              _iterator,
              _step,
              droppedData,
              extension,
              kind,
              converted,
              i,
              jcampTypes,
              _iterator2,
              _step2,
              _droppedData,
              _extension,
              info,
              meta,
              content,
              decoder,
              _args6 = arguments;

          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  options = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : {};
                  converters = options.converters, autoJcamp = options.autoJcamp, autoKind = options.autoKind;

                  if (variableName) {
                    _context6.next = 4;
                    break;
                  }

                  throw new Error('handleDrop expects a variable name');

                case 4:
                  variableName = String(variableName);

                  if (askType) {
                    _context6.next = 12;
                    break;
                  }

                  types = {
                    droppedNmr: 'nmr',
                    droppedIR: 'ir',
                    droppedUV: 'uv',
                    droppedIV: 'iv',
                    droppedMS: 'mass',
                    droppedRaman: 'raman',
                    droppedChrom: 'chromatogram',
                    droppedCV: 'cyclicVoltammetry',
                    droppedTGA: 'thermogravimetricAnalysis',
                    droppedIsotherm: 'isotherm',
                    droppedDSC: 'differentialScanningCalorimetry',
                    droppedHg: 'hgPorosimetry',
                    droppedPelletHardness: 'pelletHardness',
                    droppedOAN: 'oan',
                    droppedDCS: 'differentialCentrifugalSedimentation',
                    droppedXray: 'xray',
                    droppedXRD: 'xrd',
                    droppedXRF: 'xrf',
                    droppedXPS: 'xps',
                    droppedOverview: 'image',
                    droppedImage: 'image',
                    droppedVideo: 'video',
                    droppedGenbank: 'genbank',
                    droppedOther: 'other'
                  };

                  if (types[variableName]) {
                    _context6.next = 9;
                    break;
                  }

                  throw new Error('Unexpected variable name');

                case 9:
                  type = types[variableName];
                  _context6.next = 17;
                  break;

                case 12:
                  _context6.next = 14;
                  return _ui2["default"].choose((_UI$choose = {
                    nmr: 'NMR (csv, tsv, txt, jcamp, pdf)',
                    mass: 'Mass (csv, tsv, txt, jcamp, pdf, netcdf, xml)',
                    ir: 'Infrared (csv, tsv, txt, jcamp, pdf)',
                    raman: 'Raman (csv, tsv, txt, jcamp, pdf)',
                    uv: 'UV (csv, tsv, txt, jcamp, pdf)',
                    iv: 'IV (csv, tsv, txt, jcamp, pdf)',
                    chromatogram: 'Chromatogram LC, GC, LC/MS, GC/MS (csv, tsv, txt, jcamp, pdf, netcdf, xml)',
                    thermogravimetricAnalysis: 'Thermogravimetric Analysis (csv, tsv, txt, jcamp)',
                    xrd: 'Powder XRD (csv, tsv, txt, jcamp)'
                  }, _defineProperty(_UI$choose, "xrd", 'Powder XRD Analysis (csv, tsv, txt, jcamp)'), _defineProperty(_UI$choose, "xrf", 'Xray fluoresence (csv, tsv, txt, jcamp)'), _defineProperty(_UI$choose, "xps", 'XPS (csv, tsv, txt, jcamp)'), _defineProperty(_UI$choose, "differentialCentrifugalSedimentation", 'Differential Centrifugal Sedimentation (csv, tsv, txt, jcamp)'), _defineProperty(_UI$choose, "hgPorosimetry", 'Hg porosimetry (csv, tsv, txt, jcamp)'), _defineProperty(_UI$choose, "isotherm", 'Isotherm (csv, tsv, txt, jcamp, xls)'), _defineProperty(_UI$choose, "cyclicVoltammetry", 'Cyclic voltammetry (csv, tsv, txt, jcamp, pdf)'), _defineProperty(_UI$choose, "differentialScanningCalorimetry", 'Differential Scanning Calorimetry (csv, tsv, txt, jcamp)'), _defineProperty(_UI$choose, "xray", 'Crystal structure (cif, pdb)'), _defineProperty(_UI$choose, "image", 'Images (jpg, png or tiff)'), _defineProperty(_UI$choose, "video", 'Videos (mp4, m4a, avi, wav)'), _defineProperty(_UI$choose, "other", 'Other'), _UI$choose), {
                    noConfirmation: true,
                    columns: [{
                      id: 'description',
                      name: 'description',
                      field: 'description'
                    }]
                  });

                case 14:
                  type = _context6.sent;

                  if (type) {
                    _context6.next = 17;
                    break;
                  }

                  return _context6.abrupt("return");

                case 17:
                  droppedDatas = _api2["default"].getData(variableName);
                  droppedDatas = droppedDatas.file || droppedDatas.str;

                  if (!converters) {
                    _context6.next = 53;
                    break;
                  }

                  newData = [];
                  _iterator = _createForOfIteratorHelper(droppedDatas);
                  _context6.prev = 22;

                  _iterator.s();

                case 24:
                  if ((_step = _iterator.n()).done) {
                    _context6.next = 44;
                    break;
                  }

                  droppedData = _step.value;

                  if (!droppedData.filename.includes('.')) {
                    droppedData.filename += '.txt';
                  }

                  extension = droppedData.filename.replace(/.*\./, '').toLowerCase();
                  kind = extension;

                  if (autoKind) {
                    kind = autoKind(droppedData) || kind;
                  }

                  if (!converters[kind]) {
                    _context6.next = 42;
                    break;
                  }

                  autoJcamp = false;
                  _context6.next = 34;
                  return converters[kind](droppedData.content);

                case 34:
                  converted = _context6.sent;

                  if (!Array.isArray(converted)) {
                    converted = [converted];
                  }

                  for (i = 1; i < converted.length; i++) {
                    newData.push({
                      filename: droppedData.filename.replace('.' + extension, '_' + i + '.jdx'),
                      mimetype: 'chemical/x-jcamp-dx',
                      contentType: 'chemical/x-jcamp-dx',
                      encoding: 'utf8',
                      content: converted[i]
                    });
                  }

                  droppedData.filename = droppedData.filename.replace('.' + extension, '.jdx');
                  droppedData.mimetype = 'chemical/x-jcamp-dx';
                  droppedData.contentType = 'chemical/x-jcamp-dx';
                  droppedData.encoding = 'utf8';
                  droppedData.content = converted[0];

                case 42:
                  _context6.next = 24;
                  break;

                case 44:
                  _context6.next = 49;
                  break;

                case 46:
                  _context6.prev = 46;
                  _context6.t0 = _context6["catch"](22);

                  _iterator.e(_context6.t0);

                case 49:
                  _context6.prev = 49;

                  _iterator.f();

                  return _context6.finish(49);

                case 52:
                  droppedDatas = droppedDatas.concat(newData);

                case 53:
                  console.log({
                    droppedDatas: droppedDatas
                  });
                  /*
                    Possible autoconvertion of text file to jcamp
                    * if filename ends with TXT, TSV or CSV
                    * use convert-to-jcamp
                  */

                  if (!autoJcamp) {
                    _context6.next = 100;
                    break;
                  }

                  jcampTypes = {
                    nmr: {
                      type: 'NMR SPECTRUM',
                      xUnit: 'Delta [ppm]',
                      yUnit: 'Relative'
                    },
                    ir: {
                      type: 'IR SPECTRUM',
                      xUnit: 'wavelength [cm-1]',
                      yUnit: ['Transmittance (%)', 'Absorbance']
                    },
                    raman: {
                      type: 'RAMAN SPECTRUM',
                      xUnit: 'wavelength [cm-1]',
                      yUnit: 'Absorbance'
                    },
                    iv: {
                      type: 'IV SPECTRUM',
                      xUnit: ['Potential vs Fc/Fc+ [V]', 'Potential vs Ag/AgNO3 [V]', 'Potential vs Ag/AgCl/KCl [V]', 'Potential vs Ag/AgCl/NaCl [V]', 'Potential vs SCE [V]', 'Potential vs NHE [V]', 'Potential vs SSCE [V]', 'Potential vs Hg/Hg2SO4/K2SO4 [V]'],
                      yUnit: ['Current [mA]', 'Current [µA]']
                    },
                    uv: {
                      type: 'UV SPECTRUM',
                      xUnit: 'wavelength [nm]',
                      yUnit: 'Absorbance'
                    },
                    mass: {
                      type: 'MASS SPECTRUM',
                      xUnit: 'm/z [Da]',
                      yUnit: 'Relative'
                    },
                    cyclicVoltammetry: {
                      type: 'Cyclic voltammetry',
                      xUnit: 'Ewe [V]',
                      yUnit: 'I [mA]'
                    },
                    thermogravimetricAnalysis: {
                      type: 'Thermogravimetric analysis',
                      xUnit: 'Temperature [°C]',
                      yUnit: 'Weight [mg]'
                    },
                    hgPorosimetry: {
                      type: 'Hg porosimetry',
                      xUnit: 'Pressure [MPa]',
                      yUnit: 'Volume [mm³/g]'
                    },
                    differentialCentrifugalSedimentation: {
                      type: 'Differential Centrifugal Sedimentation',
                      xUnit: 'Diameter [nm]',
                      yUnit: 'Quantity'
                    },
                    differentialScanningCalorimetry: {
                      type: 'Differentical scanning calorimetry',
                      xUnit: 'I [mA]',
                      yUnit: 'Ewe [V]'
                    },
                    isotherm: {
                      type: 'Isotherm',
                      xUnit: ['p/p0', 'p / kPa'],
                      yUnit: ['excess adsorption mmol/g', 'adsorbed volume cm3/g']
                    },
                    xrd: {
                      type: 'X-ray powder diffraction',
                      xUnit: '2ϴ [°]',
                      yUnit: 'counts'
                    },
                    xrf: {
                      type: 'X-ray fluoresence',
                      xUnit: 'Energy [keV]',
                      yUnit: 'Intensity'
                    }
                  };
                  _iterator2 = _createForOfIteratorHelper(droppedDatas);
                  _context6.prev = 57;

                  _iterator2.s();

                case 59:
                  if ((_step2 = _iterator2.n()).done) {
                    _context6.next = 92;
                    break;
                  }

                  _droppedData = _step2.value;
                  if (!_droppedData.filename.includes('.')) _droppedData.filename += '.txt';
                  _extension = _droppedData.filename.replace(/.*\./, '').toLowerCase();

                  if (!(_extension === 'txt' || _extension === 'csv' || _extension === 'tsv')) {
                    _context6.next = 90;
                    break;
                  }

                  info = jcampTypes[type];

                  if (!info) {
                    _context6.next = 89;
                    break;
                  }

                  info.filename = "".concat(_droppedData.filename.replace(/\.[^.]*$/, ''), ".jdx"); // we will ask for meta information

                  _context6.next = 69;
                  return _ui2["default"].form("\n              <style>\n                  #jcamp {\n                      zoom: 1.5;\n                  }\n              </style>\n              <div id='jcamp'>\n                  <b>Automatic conversion of text file to jcamp</b>\n                  <form>\n                  <table>\n                  <tr>\n                    <th>Kind</th>\n                    <td><input type=\"text\" readonly name=\"type\" value=\"".concat(info.type, "\"></td>\n                  </tr>\n                  <tr>\n                    <th>Filename (ending with .jdx)</th>\n                    <td><input type=\"text\" pattern=\".*\\.jdx$\" name=\"filename\" size=40 value=\"").concat(info.filename, "\"></td>\n                  </tr>\n                  <tr>\n                    <th>xUnit (horizon axis)</th>\n                    ").concat(info.xUnit instanceof Array ? "<td><select name=\"xUnit\">".concat(info.xUnit.map(function (xUnit) {
                    return "<option value=\"".concat(xUnit, "\">").concat(xUnit, "</option>");
                  }), "</select></td>") : "<td><input type=\"text\" readonly name=\"xUnit\" value=\"".concat(info.xUnit, "\"></td>"), "\n                  </tr>\n                  <tr>\n                  <th>yUnit (vectical axis)</th>\n                  ").concat(info.yUnit instanceof Array ? "<td><select name=\"yUnit\">".concat(info.yUnit.map(function (yUnit) {
                    return "<option value=\"".concat(yUnit, "\">").concat(yUnit, "</option>");
                  }), "</select></td>") : "<td><input type=\"text\" readonly name=\"yUnit\" value=\"".concat(info.yUnit, "\"></td>"), "\n                </tr>\n                  </table>\n                    <input type=\"submit\" value=\"Submit\"/>\n                  </form>\n              </div>\n            "), {}, {
                    dialog: {
                      width: 600
                    }
                  });

                case 69:
                  meta = _context6.sent;

                  if (meta) {
                    _context6.next = 72;
                    break;
                  }

                  return _context6.abrupt("return");

                case 72:
                  _droppedData.filename = "".concat(meta.filename);
                  _droppedData.mimetype = 'chemical/x-jcamp-dx';
                  _droppedData.contentType = 'chemical/x-jcamp-dx';
                  content = _droppedData.content;
                  _context6.t1 = _droppedData.encoding;
                  _context6.next = _context6.t1 === 'base64' ? 79 : _context6.t1 === 'buffer' ? 82 : 86;
                  break;

                case 79:
                  content = atob(_droppedData.content);
                  _droppedData.encoding = 'text';
                  return _context6.abrupt("break", 86);

                case 82:
                  decoder = new TextDecoder();
                  content = decoder.decode(_droppedData.content);
                  _droppedData.encoding = 'text';
                  return _context6.abrupt("break", 86);

                case 86:
                  _droppedData.content = (0, _convertToJcamp2["default"])(content, {
                    meta: meta
                  });
                  _context6.next = 90;
                  break;

                case 89:
                  // eslint-disable-next-line no-console
                  console.log('Could not convert to jcamp file: ', type);

                case 90:
                  _context6.next = 59;
                  break;

                case 92:
                  _context6.next = 97;
                  break;

                case 94:
                  _context6.prev = 94;
                  _context6.t2 = _context6["catch"](57);

                  _iterator2.e(_context6.t2);

                case 97:
                  _context6.prev = 97;

                  _iterator2.f();

                  return _context6.finish(97);

                case 100:
                  if (!(type === 'other')) {
                    _context6.next = 106;
                    break;
                  }

                  _context6.next = 103;
                  return this.roc.addAttachment(this.sample, droppedDatas);

                case 103:
                  this.updateOtherAttachments();
                  _context6.next = 108;
                  break;

                case 106:
                  _context6.next = 108;
                  return this.attachFiles(droppedDatas, type, options);

                case 108:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this, [[22, 46, 49, 52], [57, 94, 97, 100]]);
        }));

        function handleDrop(_x3, _x4) {
          return _handleDrop.apply(this, arguments);
        }

        return handleDrop;
      }()
    }, {
      key: "handleAction",
      value: function () {
        var _handleAction = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(action) {
          var advancedOptions1H, ok, attachment, tempType, type, droppedDatas, _ok, remoteHasChangedDiv;

          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  if (action) {
                    _context7.next = 2;
                    break;
                  }

                  return _context7.abrupt("return");

                case 2:
                  if (!(this.expandableMolecule && this.expandableMolecule.handleAction(action))) {
                    _context7.next = 4;
                    break;
                  }

                  return _context7.abrupt("return");

                case 4:
                  if (!(this.nmr1dManager && this.nmr1dManager.handleAction(action))) {
                    _context7.next = 6;
                    break;
                  }

                  return _context7.abrupt("return");

                case 6:
                  _context7.t0 = action.name;
                  _context7.next = _context7.t0 === 'save' ? 9 : _context7.t0 === 'explodeSequences' ? 12 : _context7.t0 === 'calculateMFFromSequence' ? 14 : _context7.t0 === 'calculateMFFromPeptidic' ? 16 : _context7.t0 === 'calculateMFFromNucleic' ? 18 : _context7.t0 === 'translateNucleic' ? 20 : _context7.t0 === 'createOptions' ? 22 : _context7.t0 === 'recreateVariables' ? 25 : _context7.t0 === 'deleteAttachment' ? 26 : _context7.t0 === 'deleteNmr' ? 36 : _context7.t0 === 'unattach' ? 36 : _context7.t0 === 'attachNMR' ? 39 : _context7.t0 === 'attachIR' ? 39 : _context7.t0 === 'attachRaman' ? 39 : _context7.t0 === 'attachMass' ? 39 : _context7.t0 === 'refresh' ? 46 : 62;
                  break;

                case 9:
                  _context7.next = 11;
                  return this.roc.update(this.sample);

                case 11:
                  return _context7.abrupt("break", 63);

                case 12:
                  _Sequence2["default"].explodeSequences(this.sample);

                  return _context7.abrupt("break", 63);

                case 14:
                  _Sequence2["default"].calculateMFFromSequence(this.sample);

                  return _context7.abrupt("break", 63);

                case 16:
                  _Sequence2["default"].calculateMFFromPeptidic(this.sample);

                  return _context7.abrupt("break", 63);

                case 18:
                  _Sequence2["default"].calculateMFFromNucleic(this.sample);

                  return _context7.abrupt("break", 63);

                case 20:
                  _Sequence2["default"].translateNucleic(this.sample);

                  return _context7.abrupt("break", 63);

                case 22:
                  advancedOptions1H = _api2["default"].cache('nmr1hAdvancedOptions');

                  if (advancedOptions1H) {
                    _api2["default"].createData('nmr1hOndeTemplate', _api2["default"].cache('nmr1hOndeTemplates').full);
                  } else {
                    _api2["default"].createData('nmr1hOndeTemplate', _api2["default"].cache('nmr1hOndeTemplates')["short"]);
                  }

                  return _context7.abrupt("break", 63);

                case 25:
                  this.createVariables();

                case 26:
                  _context7.next = 28;
                  return _ui2["default"].confirm('Are you sure you want to delete the attachment?');

                case 28:
                  ok = _context7.sent;

                  if (ok) {
                    _context7.next = 31;
                    break;
                  }

                  return _context7.abrupt("return");

                case 31:
                  attachment = action.value.name;
                  _context7.next = 34;
                  return this.roc.deleteAttachment(this.sample, attachment);

                case 34:
                  this.updateOtherAttachments();
                  return _context7.abrupt("break", 63);

                case 36:
                  _context7.next = 38;
                  return this.roc.unattach(this.sample, action.value);

                case 38:
                  return _context7.abrupt("break", 63);

                case 39:
                  tempType = action.name.replace('attach', '');
                  type = tempType.charAt(0).toLowerCase() + tempType.slice(1);
                  droppedDatas = action.value;
                  droppedDatas = droppedDatas.file || droppedDatas.str;
                  _context7.next = 45;
                  return this.attachFiles(droppedDatas, type);

                case 45:
                  return _context7.abrupt("break", 63);

                case 46:
                  _context7.next = 48;
                  return _ui2["default"].confirm('Are you sure you want to refresh? This will discard your local modifications.');

                case 48:
                  _ok = _context7.sent;

                  if (_ok) {
                    _context7.next = 51;
                    break;
                  }

                  return _context7.abrupt("return");

                case 51:
                  this.unbindChange();
                  this.expandableMolecule.unbindChange();
                  _context7.next = 55;
                  return this.roc.discardLocal(this.sample);

                case 55:
                  this._initializeObjects();

                  this.bindChange();
                  this.remoteChanged = false;
                  remoteHasChangedDiv = document.getElementById('remoteHasChanged');

                  if (remoteHasChangedDiv) {
                    remoteHasChangedDiv.style.display = 'none';
                  }

                  this.nmr1dManager.handleAction({
                    name: 'nmrChanged'
                  });
                  return _context7.abrupt("break", 63);

                case 62:
                  return _context7.abrupt("break", 63);

                case 63:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function handleAction(_x5) {
          return _handleAction.apply(this, arguments);
        }

        return handleAction;
      }()
    }, {
      key: "attachFiles",
      value: function () {
        var _attachFiles = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(files, type, options) {
          var i, data;
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  if (!(!files || !type)) {
                    _context8.next = 2;
                    break;
                  }

                  return _context8.abrupt("return");

                case 2:
                  if (!Array.isArray(files)) {
                    files = [files];
                  }

                  i = 0;

                case 4:
                  if (!(i < files.length)) {
                    _context8.next = 11;
                    break;
                  }

                  data = DataObject.resurrect(files[i]);
                  _context8.next = 8;
                  return this.roc.attach(type, this.sample, data, options);

                case 8:
                  i++;
                  _context8.next = 4;
                  break;

                case 11:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));

        function attachFiles(_x6, _x7, _x8) {
          return _attachFiles.apply(this, arguments);
        }

        return attachFiles;
      }()
    }]);

    return Sample;
  }();

  function updateSample(sample) {
    if (!sample.$content.general) {
      sample.$content.general = {};
    }
    /** This is the old place we used to put the sequence.
     * By default we expect it is a peptidic sequence
     */


    if (sample.$content.general.sequence) {
      // eslint-disable-next-line no-console
      console.log('Migrating sequence', sample.$content.general.sequence);
      if (!sample.$content.biology) sample.$content.biology = {};

      if (!sample.$content.biology.peptidic) {
        sample.$content.biology.peptidic = [];
      }

      if (!sample.$content.biology.peptidic.length > 0) {
        sample.$content.biology.peptidic[0] = {};
      }

      if (!sample.$content.biology.peptidic[0].seq) {
        sample.$content.biology.peptidic[0].seq = [];
      }

      if (!sample.$content.biology.peptidic[0].seq.length > 0) {
        sample.$content.biology.peptidic[0].seq[0] = {};
      }

      sample.setChildSync(['$content', 'biology', 'peptidic', 0, 'seq', 0, 'sequence'], sample.$content.general.sequence);
      sample.$content.general.sequence = undefined;
    }
  }

  module.exports = Sample;
});