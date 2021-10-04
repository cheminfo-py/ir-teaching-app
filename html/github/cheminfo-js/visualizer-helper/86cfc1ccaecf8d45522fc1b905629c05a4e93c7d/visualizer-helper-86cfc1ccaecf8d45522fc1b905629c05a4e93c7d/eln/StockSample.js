"use strict";

define(["module", "src/util/api", "./ExpandableMolecule", "./MF"], function (module, _api, _ExpandableMolecule, _MF) {
  var _api2 = _interopRequireDefault(_api);

  var _ExpandableMolecule2 = _interopRequireDefault(_ExpandableMolecule);

  var _MF2 = _interopRequireDefault(_MF);

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
    varName: 'sample'
  };

  var Sample = function () {
    function Sample(sample, options) {
      _classCallCheck(this, Sample);

      // make sure we don't copy attachment metadata
      this.sample = sample || {
        $content: {
          general: {}
        }
      };
      this.options = Object.assign({}, defaultOptions, options);

      this._init();
    }

    _createClass(Sample, [{
      key: "_loadSample",
      value: function _loadSample() {
        var _this = this;

        var sampleVar = _api2["default"].getVar(this.options.varName);

        _api2["default"].setVariable('sampleCode', sampleVar, ['$id', 0]);

        _api2["default"].setVariable('batchCode', sampleVar, ['$id', 1]);

        _api2["default"].setVariable('content', sampleVar, ['$content']);

        _api2["default"].setVariable('general', sampleVar, ['$content', 'general']);

        _api2["default"].setVariable('molfile', sampleVar, ['$content', 'general', 'molfile']);

        _api2["default"].setVariable('mf', sampleVar, ['$content', 'general', 'mf']);

        _api2["default"].setVariable('mw', sampleVar, ['$content', 'general', 'mw']);

        _api2["default"].setVariable('em', sampleVar, ['$content', 'general', 'em']);

        _api2["default"].setVariable('description', sampleVar, ['$content', 'general', 'description']);

        _api2["default"].setVariable('iupac', sampleVar, ['$content', 'general', 'iupac']);

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
                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return _api2["default"].createData(_this2.options.varName, _this2.sample);

                            case 2:
                              _this2.sample = _context.sent;

                              _this2._loadSample();

                              resolve();

                            case 5:
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
      key: "handleAction",
      value: function handleAction(action) {
        if (!action) return;

        if (this.expandableMolecule) {
          this.expandableMolecule.handleAction(action);
        }
      }
    }, {
      key: "updateSample",
      value: function updateSample(sample) {
        var general = sample.$content.general;
        var stock = sample.$content.stock;
        var identifier = sample.$content.identifier; // This part will handle the mf and mw

        this.expandableMolecule.setMolfile(general.molfile);

        if (general) {
          this.sample.setChildSync(['$content', 'general', 'description'], general.description);
          this.sample.setChildSync(['$content', 'general', 'name'], general.name);
        }

        if (identifier) {
          this.sample.setChildSync(['$content', 'identifier', 'cas'], identifier.cas);
        }

        if (stock) {
          this.sample.setChildSync(['$content', 'stock', 'catalogNumber'], stock.catalogNumber);
          this.sample.setChildSync(['$content', 'stock', 'quantity'], stock.quantity);
          this.sample.setChildSync(['$content', 'general', 'purity'], stock.purity);
          this.sample.setChildSync(['$content', 'stock', 'supplier'], stock.supplier);
        }
      }
    }]);

    return Sample;
  }();

  module.exports = Sample;
});