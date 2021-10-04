"use strict";

define(["exports", "src/util/ui", "../../rest-on-couch/Roc", "./Status", "./processAction"], function (exports, _ui, _Roc, _Status, _processAction) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _Roc2 = _interopRequireDefault(_Roc);

  var _Status2 = _interopRequireDefault(_Status);

  var _processAction2 = _interopRequireDefault(_processAction);

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

  var muteSuccess = {
    muteSuccess: true
  };

  var RequestManager = function () {
    function RequestManager(couchDB, options) {
      _classCallCheck(this, RequestManager);

      options = options || {};
      this.roc = new _Roc2["default"]({
        url: couchDB.url,
        database: couchDB.database,
        kind: 'analysisRequest'
      });
      this.sampleRoc = options.sampleRoc || null;
      this.servicesRoc = options.servicesRoc || null;
      this.servicesView = null;
    }

    _createClass(RequestManager, [{
      key: "getStatus",
      value: function getStatus(request) {
        return request.$content.status[0];
      }
    }, {
      key: "getStatusCode",
      value: function getStatusCode(request) {
        return Number(this.getStatus(request).status);
      }
    }, {
      key: "cancel",
      value: function () {
        var _cancel = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(this.getStatusCode(request) === 0)) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt("return", null);

                case 2:
                  _context.next = 4;
                  return (0, _ui.confirm)('cancel request?');

                case 4:
                  if (!_context.sent) {
                    _context.next = 6;
                    break;
                  }

                  return _context.abrupt("return", this.setStatus(request, 0));

                case 6:
                  return _context.abrupt("return", null);

                case 7:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function cancel(_x) {
          return _cancel.apply(this, arguments);
        }

        return cancel;
      }()
    }, {
      key: "setStatus",
      value: function () {
        var _setStatus = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(request, status) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (typeof status !== 'number') {
                    status = _Status2["default"].getStatusCode(status);
                  }

                  if (!(this.getStatusCode(request) === status)) {
                    _context2.next = 3;
                    break;
                  }

                  return _context2.abrupt("return");

                case 3:
                  request.$content.status.unshift({
                    date: Date.now(),
                    status: status
                  });
                  _context2.next = 6;
                  return this.roc.update(request, muteSuccess);

                case 6:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function setStatus(_x2, _x3) {
          return _setStatus.apply(this, arguments);
        }

        return setStatus;
      }()
    }, {
      key: "createCustomRequest",
      value: function () {
        var _createCustomRequest = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(sample) {
          var options,
              groups,
              kind,
              data,
              disableNotification,
              _iterator,
              _step,
              group,
              requestObject,
              _args3 = arguments;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
                  groups = options.groups || [];
                  if (typeof groups === 'string') groups = [groups];
                  kind = options.kind || '';
                  data = options.data || {};
                  disableNotification = options.disableNotification;
                  _iterator = _createForOfIteratorHelper(groups);
                  _context3.prev = 7;

                  _iterator.s();

                case 9:
                  if ((_step = _iterator.n()).done) {
                    _context3.next = 15;
                    break;
                  }

                  group = _step.value;
                  _context3.next = 13;
                  return this.sampleRoc.addGroup(sample, group, disableNotification);

                case 13:
                  _context3.next = 9;
                  break;

                case 15:
                  _context3.next = 20;
                  break;

                case 17:
                  _context3.prev = 17;
                  _context3.t0 = _context3["catch"](7);

                  _iterator.e(_context3.t0);

                case 20:
                  _context3.prev = 20;

                  _iterator.f();

                  return _context3.finish(20);

                case 23:
                  requestObject = {
                    $content: {
                      productUuid: String(sample._id),
                      productId: sample.$id,
                      analysis: {
                        kind: kind,
                        data: data
                      },
                      status: [{
                        date: Date.now(),
                        status: 10
                      }]
                    },
                    $owners: groups
                  };
                  return _context3.abrupt("return", this.roc.create(requestObject, disableNotification));

                case 25:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[7, 17, 20, 23]]);
        }));

        function createCustomRequest(_x4) {
          return _createCustomRequest.apply(this, arguments);
        }

        return createCustomRequest;
      }()
    }, {
      key: "createRequests",
      value: function () {
        var _createRequests = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(sample, list) {
          var groups, _i, _groups, group, _iterator2, _step2, req, requestObject;

          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  groups = Array.from(new Set(list.map(function (el) {
                    return el.kind;
                  })));
                  _i = 0, _groups = groups;

                case 2:
                  if (!(_i < _groups.length)) {
                    _context4.next = 9;
                    break;
                  }

                  group = _groups[_i];
                  _context4.next = 6;
                  return this.sampleRoc.addGroup(sample, group, muteSuccess);

                case 6:
                  _i++;
                  _context4.next = 2;
                  break;

                case 9:
                  _iterator2 = _createForOfIteratorHelper(list);
                  _context4.prev = 10;

                  _iterator2.s();

                case 12:
                  if ((_step2 = _iterator2.n()).done) {
                    _context4.next = 19;
                    break;
                  }

                  req = _step2.value;
                  requestObject = {
                    $content: {
                      productUuid: String(sample._id),
                      productId: sample.$id,
                      analysis: req,
                      status: [{
                        date: Date.now(),
                        status: 10
                      }]
                    },
                    $owners: [req.kind]
                  };
                  _context4.next = 17;
                  return this.roc.create(requestObject, muteSuccess);

                case 17:
                  _context4.next = 12;
                  break;

                case 19:
                  _context4.next = 24;
                  break;

                case 21:
                  _context4.prev = 21;
                  _context4.t0 = _context4["catch"](10);

                  _iterator2.e(_context4.t0);

                case 24:
                  _context4.prev = 24;

                  _iterator2.f();

                  return _context4.finish(24);

                case 27:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this, [[10, 21, 24, 27]]);
        }));

        function createRequests(_x5, _x6) {
          return _createRequests.apply(this, arguments);
        }

        return createRequests;
      }()
    }, {
      key: "view",
      value: function () {
        var _view = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(name, options) {
          var viewData;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return this.roc.view(name, options);

                case 2:
                  viewData = _context5.sent;
                  viewData.sort(sortRequestsByStatus);
                  addChangeListener(viewData);
                  return _context5.abrupt("return", viewData);

                case 6:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function view(_x7, _x8) {
          return _view.apply(this, arguments);
        }

        return view;
      }()
    }, {
      key: "initServices",
      value: function () {
        var _initServices = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(name, options) {
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  if (!this.servicesView) {
                    _context6.next = 4;
                    break;
                  }

                  return _context6.abrupt("return", this.servicesView);

                case 4:
                  this.servicesView = this.servicesRoc.view(name, options);
                  return _context6.abrupt("return", this.servicesView);

                case 6:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function initServices(_x9, _x10) {
          return _initServices.apply(this, arguments);
        }

        return initServices;
      }()
    }, {
      key: "getRequest",
      value: function () {
        var _getRequest = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(scan) {
          var uuid;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  uuid = scan.replace(/[^a-z0-9:_]/g, '');

                  if (uuid.includes('_')) {
                    uuid = uuid.replace(/.*_r:([a-z0-9]*).*/, '$1');
                  }

                  if (!(uuid.length === 0)) {
                    _context7.next = 4;
                    break;
                  }

                  return _context7.abrupt("return", undefined);

                case 4:
                  if (!(uuid.length !== 32)) {
                    _context7.next = 6;
                    break;
                  }

                  return _context7.abrupt("return", undefined);

                case 6:
                  return _context7.abrupt("return", this.roc.document(uuid));

                case 7:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function getRequest(_x11) {
          return _getRequest.apply(this, arguments);
        }

        return getRequest;
      }()
    }, {
      key: "getSample",
      value: function () {
        var _getSample = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(request) {
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  return _context8.abrupt("return", this.sampleRoc.document(request.$content.productUuid));

                case 1:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));

        function getSample(_x12) {
          return _getSample.apply(this, arguments);
        }

        return getSample;
      }()
    }, {
      key: "getPrintTemplate",
      value: function () {
        var _getPrintTemplate = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(analysis) {
          var experiment;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  _context9.next = 2;
                  return this.getExperiment(analysis);

                case 2:
                  experiment = _context9.sent;
                  return _context9.abrupt("return", experiment.twig);

                case 4:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        }));

        function getPrintTemplate(_x13) {
          return _getPrintTemplate.apply(this, arguments);
        }

        return getPrintTemplate;
      }()
    }, {
      key: "getExperiment",
      value: function () {
        var _getExperiment = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(analysis) {
          var services, serviceId, instrument, configName;
          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  _context10.next = 2;
                  return this.initServices();

                case 2:
                  services = _context10.sent;
                  serviceId = analysis.kind;
                  instrument = analysis.instrument;
                  configName = analysis.configuration;
                  return _context10.abrupt("return", services.find(function (s) {
                    return String(s.$id) === String(serviceId);
                  }).$content.instruments.find(function (i) {
                    return String(i.name) === String(instrument);
                  }).experiments.find(function (e) {
                    return String(e.name) === String(configName);
                  }));

                case 7:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10, this);
        }));

        function getExperiment(_x14) {
          return _getExperiment.apply(this, arguments);
        }

        return getExperiment;
      }()
    }, {
      key: "getUserInfo",
      value: function () {
        var _getUserInfo = _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  return _context11.abrupt("return", this.roc.getUserInfo());

                case 1:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11, this);
        }));

        function getUserInfo() {
          return _getUserInfo.apply(this, arguments);
        }

        return getUserInfo;
      }()
    }]);

    return RequestManager;
  }();

  exports.default = RequestManager;
  RequestManager.prototype.processAction = _processAction2["default"];

  function addChangeListener(view) {
    var id = view.onChange(function (event, triggerId) {
      if (triggerId !== id) {
        updateView(view, id);
      }
    });
    updateView(view, id);
  }

  function updateView(view, id) {
    view.forEach(updateRequest);
    view.triggerChange(false, id);
  }

  function updateRequest(request) {
    var lastStatus = request.$content.status[0];

    var status = _Status2["default"].getStatus(lastStatus.status);

    request.statusText = status[0];
    request.statusColor = status[1];
  }

  function sortRequestsByStatus(req1, req2) {
    return req1.$content.status[0].status - req2.$content.status[0].status;
  }
});