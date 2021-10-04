"use strict";

define(["module", "src/util/api", "src/util/IDBKeyValue", "./ExpandableMolecule", "./MF", "./libs/elnPlugin"], function (module, _api, _IDBKeyValue, _ExpandableMolecule, _MF, _elnPlugin) {
  var _api2 = _interopRequireDefault(_api);

  var _IDBKeyValue2 = _interopRequireDefault(_IDBKeyValue);

  var _ExpandableMolecule2 = _interopRequireDefault(_ExpandableMolecule);

  var _MF2 = _interopRequireDefault(_MF);

  var _elnPlugin2 = _interopRequireDefault(_elnPlugin);

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

  var idb = new _IDBKeyValue2["default"]('external-samples');
  var defaultOptions = {
    varName: 'sample'
  };

  var Sample = function () {
    function Sample(sample, options) {
      _classCallCheck(this, Sample);

      // make sure we don't copy attachment metadata
      var s = sample.$content ? {
        $content: {
          general: sample.$content.general,
          spectra: {
            nmr: [],
            mass: [],
            ir: [],
            chromatogram: []
          },
          identifier: sample.$content.identifier,
          stock: sample.$content.stock
        }
      } : {
        $content: {
          general: {
            title: '',
            description: '',
            mf: '',
            molfile: ''
          },
          spectra: {
            nmr: [],
            mass: [],
            ir: [],
            chromatogram: []
          },
          image: []
        }
      };
      this.sample = JSON.parse(JSON.stringify(s));
      this.options = Object.assign({}, defaultOptions, options);
      Object.assign(this.sample, this.options.sample);

      this._init();
    }

    _createClass(Sample, [{
      key: "_loadSample",
      value: function _loadSample(sample) {
        var _this = this;

        this.sample = sample;

        var sampleVar = _api2["default"].getVar(this.options.varName);

        _api2["default"].setVariable('sampleCode', sampleVar, ['$id', 0]);

        _api2["default"].setVariable('batchCode', sampleVar, ['$id', 1]);

        _api2["default"].setVariable('content', sampleVar, ['$content']);

        _api2["default"].setVariable('general', sampleVar, ['$content', 'general']);

        _api2["default"].setVariable('molfile', sampleVar, ['$content', 'general', 'molfile']);

        _api2["default"].setVariable('mf', sampleVar, ['$content', 'general', 'mf']);

        _api2["default"].setVariable('mw', sampleVar, ['$content', 'general', 'mw']);

        _api2["default"].setVariable('em', sampleVar, ['$content', 'general', 'em']);

        _api2["default"].setVariable('mass', sampleVar, ['$content', 'spectra', 'mass']);

        _api2["default"].setVariable('nmr', sampleVar, ['$content', 'spectra', 'nmr']);

        _api2["default"].setVariable('ir', sampleVar, ['$content', 'spectra', 'ir']);

        _api2["default"].setVariable('chromatogram', sampleVar, ['$content', 'spectra', 'chromatogram']);

        _api2["default"].setVariable('description', sampleVar, ['$content', 'general', 'description']);

        _api2["default"].setVariable('title', sampleVar, ['$content', 'general', 'title']);

        _api2["default"].setVariable('iupac', sampleVar, ['$content', 'general', 'iupac']);

        _api2["default"].setVariable('image', sampleVar, ['$content', 'image']);

        this.expandableMolecule = new _ExpandableMolecule2["default"](this.sample, this.options);
        this.mf = new _MF2["default"](this.sample);
        this.mf.fromMF();

        this.onChange = function (event) {
          var jpathStr = event.jpath.join('.');

          if (jpathStr.replace(/\.\d+\..*/, '') === '$content.spectra.nmr') {
            _this.nmr1dManager.updateIntegralOptions();
          }

          switch (event.jpath.join('.')) {
            case '$content.general.molfile':
              _this.mf.fromMolfile();

              break;

            case '$content.general.mf':
              try {
                _this.mf.fromMF();
              } catch (e) {// ignore
              }

              break;

            default:
              break;
          }

          var contentString = JSON.stringify(_this.sample);

          if (contentString !== _this.contentString && _this.options.trackId) {
            _this.contentString = contentString;
            idb.set(_this.options.trackId, JSON.parse(contentString));
          }
        };

        this.bindChange();
      }
    }, {
      key: "_init",
      value: function () {
        var _init2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
          var _this2 = this;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  this._initialized = new Promise(function () {
                    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(resolve) {
                      var sample;
                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              if (!_this2.options.trackId) {
                                _context.next = 12;
                                break;
                              }

                              _context.prev = 1;
                              _context.next = 4;
                              return idb.get(_this2.options.trackId);

                            case 4:
                              sample = _context.sent;
                              _context.next = 12;
                              break;

                            case 7:
                              _context.prev = 7;
                              _context.t0 = _context["catch"](1);
                              // eslint-disable-next-line no-console
                              console.error(_context.t0);
                              sample = _this2.sample;
                              _this2.options.trackId = false;

                            case 12:
                              _context.next = 14;
                              return _api2["default"].createData(_this2.options.varName, sample || _this2.sample);

                            case 14:
                              sample = _context.sent;

                              if (sample.$content.general.molfile) {
                                // Let the mf be calculated from the molfile
                                delete sample.$content.general.mf;
                              } else {
                                sample.$content.general.molfile = ''; // can not be edited otherwise
                              }

                              _this2._loadSample(sample);

                              resolve();

                            case 18:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee, null, [[1, 7]]);
                    }));

                    return function (_x) {
                      return _ref.apply(this, arguments);
                    };
                  }());

                case 1:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function _init() {
          return _init2.apply(this, arguments);
        }

        return _init;
      }()
    }, {
      key: "bindChange",
      value: function bindChange() {
        this.sample.unbindChange(this.onChange);
        this.sample.onChange(this.onChange);
      }
    }, {
      key: "unbindChange",
      value: function unbindChange() {
        this.sample.unbindChange(this.onChange);
      }
    }, {
      key: "handleDrop",
      value: function () {
        var _handleDrop = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(name, askType) {
          var _types;

          var options,
              _options$converters,
              converters,
              autoJcamp,
              autoKind,
              types,
              droppedDatas,
              _iterator,
              _step,
              droppedData,
              extension,
              kind,
              converted,
              i,
              _args3 = arguments;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  options = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
                  _options$converters = options.converters, converters = _options$converters === void 0 ? {} : _options$converters, autoJcamp = options.autoJcamp, autoKind = options.autoKind;

                  if (name) {
                    _context3.next = 4;
                    break;
                  }

                  throw new Error('handleDrop expects a variable name');

                case 4:
                  name = String(name); // maps name of variable to type of data

                  types = (_types = {
                    droppedNmr: 'nmr',
                    droppedIR: 'ir',
                    droppedUV: 'uv',
                    droppedIV: 'iv',
                    droppedMS: 'mass',
                    droppedChrom: 'chromatogram',
                    droppedXray: 'xray',
                    droppedXRD: 'xrd',
                    droppedXPS: 'xps',
                    droppedTGA: 'thermogravimetricAnalysis',
                    droppedDSC: 'differentialScanningCalorimetry',
                    droppedHg: 'hgPorosimetry',
                    droppedDCS: 'differentialCentrifugalSedimentation'
                  }, _defineProperty(_types, "droppedXray", 'xray'), _defineProperty(_types, "droppedXRD", 'xrd'), _defineProperty(_types, "droppedXRF", 'xrf'), _defineProperty(_types, "droppedXPS", 'xps'), _defineProperty(_types, "droppedImage", 'image'), _defineProperty(_types, "droppedGenbank", 'genbank'), _types);

                  if (types[name]) {
                    _context3.next = 8;
                    break;
                  }

                  throw new Error('Unexpected variable name');

                case 8:
                  droppedDatas = _api2["default"].getData(name);
                  droppedDatas = droppedDatas.file || droppedDatas.str;
                  _iterator = _createForOfIteratorHelper(droppedDatas);
                  _context3.prev = 11;

                  _iterator.s();

                case 13:
                  if ((_step = _iterator.n()).done) {
                    _context3.next = 34;
                    break;
                  }

                  droppedData = _step.value;
                  if (!droppedData.filename.includes('.')) droppedData.filename += '.txt';
                  extension = droppedData.filename.replace(/.*\./, '').toLowerCase();
                  kind = extension;

                  if (autoKind) {
                    kind = autoKind(droppedData) || kind;
                  }

                  if (!converters[kind]) {
                    _context3.next = 31;
                    break;
                  }

                  autoJcamp = false;
                  _context3.next = 23;
                  return converters[kind](droppedData.content);

                case 23:
                  converted = _context3.sent;

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

                case 31:
                  _elnPlugin2["default"].process(types[name], this.sample.$content, droppedData, {}, {
                    keepContent: true
                  });

                case 32:
                  _context3.next = 13;
                  break;

                case 34:
                  _context3.next = 39;
                  break;

                case 36:
                  _context3.prev = 36;
                  _context3.t0 = _context3["catch"](11);

                  _iterator.e(_context3.t0);

                case 39:
                  _context3.prev = 39;

                  _iterator.f();

                  return _context3.finish(39);

                case 42:
                  this.sample.triggerChange();

                case 43:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[11, 36, 39, 42]]);
        }));

        function handleDrop(_x2, _x3) {
          return _handleDrop.apply(this, arguments);
        }

        return handleDrop;
      }()
    }, {
      key: "handleAction",
      value: function handleAction(action) {
        if (!action) return;

        switch (action.name) {
          case 'unattach':
            {
              var value = action.value;

              if (value && value.__parent) {
                for (var i = 0; i < value.__parent.length; i++) {
                  var row = value.__parent[i];

                  if (row === value) {
                    value.__parent.splice(i, 1);

                    value.__parent.triggerChange();

                    return;
                  }
                }
              }
            }
            break;

          default:
        }

        if (this.expandableMolecule) {
          this.expandableMolecule.handleAction(action);
        }
      }
    }]);

    return Sample;
  }();

  module.exports = Sample;
});