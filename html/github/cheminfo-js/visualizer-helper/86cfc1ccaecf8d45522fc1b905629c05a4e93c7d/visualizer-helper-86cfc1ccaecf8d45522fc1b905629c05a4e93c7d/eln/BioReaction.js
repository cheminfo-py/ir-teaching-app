"use strict";

define(["module", "src/main/datas", "src/util/api", "src/util/ui", "../rest-on-couch/Roc", "./jpaths", "./libs/elnPlugin"], function (module, _datas, _api, _ui, _Roc, _jpaths, _elnPlugin) {
  var _datas2 = _interopRequireDefault(_datas);

  var _api2 = _interopRequireDefault(_api);

  var _ui2 = _interopRequireDefault(_ui);

  var _Roc2 = _interopRequireDefault(_Roc);

  var _elnPlugin2 = _interopRequireDefault(_elnPlugin);

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

  var DataObject = _datas2["default"].DataObject;
  var defaultOptions = {
    varName: 'sample',
    track: false,
    bindChange: true
  };

  var BioReaction = function () {
    function BioReaction(couchDB, uuid, options) {
      _classCallCheck(this, BioReaction);

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

      this._loadInstanceInVisualizer();
    }

    _createClass(BioReaction, [{
      key: "_loadInstanceInVisualizer",
      value: function () {
        var _loadInstanceInVisualizer2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var sampleVar;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.roc.document(this.uuid, this.options);

                case 2:
                  this.sample = _context.sent;

                  if (!this.sample.$content.general) {
                    this.sample.$content.general = {};
                  }

                  sampleVar = _api2["default"].getVar(this.options.varName);
                  (0, _jpaths.createVar)(sampleVar, 'reactionCode');
                  (0, _jpaths.createVar)(sampleVar, 'creationDate');
                  (0, _jpaths.createVar)(sampleVar, 'modificationDate');
                  (0, _jpaths.createVar)(sampleVar, 'procedure');
                  (0, _jpaths.createVar)(sampleVar, 'products');
                  (0, _jpaths.createVar)(sampleVar, 'reagents');
                  (0, _jpaths.createVar)(sampleVar, 'attachments');

                  this.onChange = function (event) {
                    switch (event.jpath.join('.')) {
                      default:
                        break;
                      // ignore
                    }
                  };

                  this.bindChange();

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function _loadInstanceInVisualizer() {
          return _loadInstanceInVisualizer2.apply(this, arguments);
        }

        return _loadInstanceInVisualizer;
      }()
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
        var _handleOverview = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(variableName) {
          var data, file;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  data = _api2["default"].getData(variableName);

                  if (!(data && data.file && data.file[0])) {
                    _context2.next = 15;
                    break;
                  }

                  file = data.file[0];
                  _context2.t0 = file.mimetype;
                  _context2.next = _context2.t0 === 'image/png' ? 6 : _context2.t0 === 'image/jpeg' ? 8 : _context2.t0 === 'image/svg+xml' ? 10 : 12;
                  break;

                case 6:
                  file.filename = 'overview.png';
                  return _context2.abrupt("break", 14);

                case 8:
                  file.filename = 'overview.jpg';
                  return _context2.abrupt("break", 14);

                case 10:
                  file.filename = 'overview.svg';
                  return _context2.abrupt("break", 14);

                case 12:
                  _ui2["default"].showNotification('For overview only the following formats are allowed: png, jpg and svg.', 'error');

                  return _context2.abrupt("return", undefined);

                case 14:
                  return _context2.abrupt("return", this.handleDrop(variableName, false));

                case 15:
                  return _context2.abrupt("return", undefined);

                case 16:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function handleOverview(_x) {
          return _handleOverview.apply(this, arguments);
        }

        return handleOverview;
      }()
    }, {
      key: "handleDrop",
      value: function () {
        var _handleDrop = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(name, askType) {
          var type, types, droppedDatas;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (name) {
                    _context3.next = 2;
                    break;
                  }

                  throw new Error('handleDrop expects a variable name');

                case 2:
                  name = String(name);

                  if (askType) {
                    _context3.next = 10;
                    break;
                  }

                  types = {
                    droppedNmr: 'nmr',
                    droppedIR: 'ir',
                    droppedMS: 'mass',
                    droppedXray: 'xray',
                    droppedOverview: 'image',
                    droppedImage: 'image',
                    droppedGenbank: 'genbank'
                  };

                  if (types[name]) {
                    _context3.next = 7;
                    break;
                  }

                  throw new Error('Unexpected variable name');

                case 7:
                  type = types[name];
                  _context3.next = 15;
                  break;

                case 10:
                  _context3.next = 12;
                  return _ui2["default"].choose({
                    xray: 'Xray (cif, pdb)',
                    image: 'Images (jpg, png or tiff)',
                    other: 'Other'
                  }, {
                    noConfirmation: true,
                    columns: [{
                      id: 'description',
                      name: 'description',
                      field: 'description'
                    }]
                  });

                case 12:
                  type = _context3.sent;

                  if (type) {
                    _context3.next = 15;
                    break;
                  }

                  return _context3.abrupt("return");

                case 15:
                  droppedDatas = _api2["default"].getData(name);
                  droppedDatas = droppedDatas.file || droppedDatas.str;

                  if (!(type === 'other')) {
                    _context3.next = 22;
                    break;
                  }

                  _context3.next = 20;
                  return this.roc.addAttachment(this.sample, droppedDatas);

                case 20:
                  _context3.next = 24;
                  break;

                case 22:
                  _context3.next = 24;
                  return this.attachFiles(droppedDatas, type);

                case 24:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function handleDrop(_x2, _x3) {
          return _handleDrop.apply(this, arguments);
        }

        return handleDrop;
      }()
    }, {
      key: "handleAction",
      value: function () {
        var _handleAction = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(action) {
          var attachment, tempType, type, droppedDatas, ok;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  if (action) {
                    _context4.next = 2;
                    break;
                  }

                  return _context4.abrupt("return");

                case 2:
                  _context4.t0 = action.name;
                  _context4.next = _context4.t0 === 'save' ? 5 : _context4.t0 === 'deleteAttachment' ? 8 : _context4.t0 === 'unattach' ? 12 : _context4.t0 === 'attachNMR' ? 15 : _context4.t0 === 'attachIR' ? 15 : _context4.t0 === 'attachMass' ? 15 : _context4.t0 === 'refresh' ? 22 : 32;
                  break;

                case 5:
                  _context4.next = 7;
                  return this.roc.update(this.sample);

                case 7:
                  return _context4.abrupt("break", 33);

                case 8:
                  attachment = action.value.name;
                  _context4.next = 11;
                  return this.roc.deleteAttachment(this.sample, attachment);

                case 11:
                  return _context4.abrupt("break", 33);

                case 12:
                  _context4.next = 14;
                  return this.roc.unattach(this.sample, action.value);

                case 14:
                  return _context4.abrupt("break", 33);

                case 15:
                  tempType = action.name.replace('attach', '');
                  type = tempType.charAt(0).toLowerCase() + tempType.slice(1);
                  droppedDatas = action.value;
                  droppedDatas = droppedDatas.file || droppedDatas.str;
                  _context4.next = 21;
                  return this.attachFiles(droppedDatas, type);

                case 21:
                  return _context4.abrupt("break", 33);

                case 22:
                  _context4.next = 24;
                  return _ui2["default"].confirm('Are you sure you want to refresh? This will discard your local modifications.');

                case 24:
                  ok = _context4.sent;

                  if (ok) {
                    _context4.next = 27;
                    break;
                  }

                  return _context4.abrupt("return");

                case 27:
                  this.unbindChange();
                  _context4.next = 30;
                  return this.roc.discardLocal(this.sample);

                case 30:
                  this.bindChange();
                  return _context4.abrupt("break", 33);

                case 32:
                  return _context4.abrupt("break", 33);

                case 33:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function handleAction(_x4) {
          return _handleAction.apply(this, arguments);
        }

        return handleAction;
      }()
    }, {
      key: "attachFiles",
      value: function () {
        var _attachFiles = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(files, type) {
          var i, data;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (!(!files || !type)) {
                    _context5.next = 2;
                    break;
                  }

                  return _context5.abrupt("return");

                case 2:
                  if (!Array.isArray(files)) {
                    files = [files];
                  }

                  i = 0;

                case 4:
                  if (!(i < files.length)) {
                    _context5.next = 11;
                    break;
                  }

                  data = DataObject.resurrect(files[i]);
                  _context5.next = 8;
                  return this.roc.attach(type, this.sample, data);

                case 8:
                  i++;
                  _context5.next = 4;
                  break;

                case 11:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function attachFiles(_x5, _x6) {
          return _attachFiles.apply(this, arguments);
        }

        return attachFiles;
      }()
    }]);

    return BioReaction;
  }();

  module.exports = BioReaction;
});