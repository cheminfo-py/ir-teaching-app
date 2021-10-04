"use strict";

define(["exports", "src/util/api", "src/util/ui", "./Status"], function (exports, _api, _ui, _Status) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _api2 = _interopRequireDefault(_api);

  var _ui2 = _interopRequireDefault(_ui);

  var _Status2 = _interopRequireDefault(_Status);

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

  var roc;
  var requestManager;

  function processAction(_x, _x2) {
    return _processAction.apply(this, arguments);
  }

  function _processAction() {
    _processAction = _asyncToGenerator(regeneratorRuntime.mark(function _callee(actionName, actionValue) {
      var request, newStatus;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              roc = this.roc;
              requestManager = this;
              _context.t0 = actionName;
              _context.next = _context.t0 === 'requestFromScan' ? 5 : _context.t0 === 'requestFromUUID' ? 7 : _context.t0 === 'changeStatus' ? 9 : _context.t0 === 'createForm' ? 18 : _context.t0 === 'refreshRequests' ? 20 : _context.t0 === 'updateFilters' ? 22 : _context.t0 === 'bulkChangeStatus' ? 24 : 30;
              break;

            case 5:
              requestFromScan(actionValue);
              return _context.abrupt("break", 31);

            case 7:
              requestFromScan(actionValue);
              return _context.abrupt("break", 31);

            case 9:
              request = _api2["default"].getData('request');
              _context.next = 12;
              return askNewStatus(request);

            case 12:
              newStatus = _context.sent;
              _context.next = 15;
              return prependStatus(request, newStatus);

            case 15:
              request.triggerChange();

              _api2["default"].doAction('refreshRequests');

              return _context.abrupt("break", 31);

            case 18:
              createForm();
              return _context.abrupt("break", 31);

            case 20:
              refreshRequests(_api2["default"].getData('preferences'));
              return _context.abrupt("break", 31);

            case 22:
              refreshRequests(actionValue);
              return _context.abrupt("break", 31);

            case 24:
              _context.next = 26;
              return bulkChangeStatus(_api2["default"].getData('selected'));

            case 26:
              _api2["default"].doAction('refreshRequests');

              _api2["default"].createData('status', []);

              _api2["default"].doAction('setSelected', []);

              return _context.abrupt("break", 31);

            case 30:
              throw Error("the action \"".concat(actionValue, "\" is unknown"));

            case 31:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
    return _processAction.apply(this, arguments);
  }

  function requestFromScan(_x3) {
    return _requestFromScan.apply(this, arguments);
  }

  function _requestFromScan() {
    _requestFromScan = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(scan) {
      var request, requestVar;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return requestManager.getRequest(scan);

            case 2:
              request = _context2.sent;

              if (request) {
                _context2.next = 6;
                break;
              }

              _api2["default"].createData('request', {});

              return _context2.abrupt("return");

            case 6:
              _api2["default"].createData('request', request);

              _context2.next = 9;
              return _api2["default"].getVar('request');

            case 9:
              requestVar = _context2.sent;

              _api2["default"].setVariable('status', requestVar, ['$content', 'status']);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _requestFromScan.apply(this, arguments);
  }

  function refreshRequests(_x4) {
    return _refreshRequests.apply(this, arguments);
  }

  function _refreshRequests() {
    _refreshRequests = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(options) {
      var queryOptions, statusCode, results;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              queryOptions = {
                sort: function sort(a, b) {
                  return a.value.status.date - b.value.status.date;
                }
              };

              if (String(options.group) === 'mine') {
                queryOptions.mine = true;
              } else {
                queryOptions.groups = [String(options.group)];
              }

              if (String(options.status) !== 'any') {
                statusCode = _Status2["default"].getStatusCode(String(options.status));
                queryOptions.startkey = [statusCode];
                queryOptions.endkey = [statusCode];
              }

              _context3.next = 5;
              return roc.query('analysisRequestByKindAndStatus', queryOptions);

            case 5:
              results = _context3.sent;
              results.forEach(function (result) {
                result.color = _Status2["default"].getStatusColor(Number(result.value.status.status));
              });

              _api2["default"].createData('requests', results);

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _refreshRequests.apply(this, arguments);
  }

  function bulkChangeStatus(_x5) {
    return _bulkChangeStatus.apply(this, arguments);
  }

  function _bulkChangeStatus() {
    _bulkChangeStatus = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(selected) {
      var newStatus, _iterator, _step, requestToc, request;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return askNewStatus();

            case 2:
              newStatus = _context4.sent;
              _iterator = _createForOfIteratorHelper(selected);
              _context4.prev = 4;

              _iterator.s();

            case 6:
              if ((_step = _iterator.n()).done) {
                _context4.next = 16;
                break;
              }

              requestToc = _step.value;
              _context4.next = 10;
              return roc.document(String(requestToc.id));

            case 10:
              request = _context4.sent;
              ensureStatus(request);
              _context4.next = 14;
              return prependStatus(request, newStatus);

            case 14:
              _context4.next = 6;
              break;

            case 16:
              _context4.next = 21;
              break;

            case 18:
              _context4.prev = 18;
              _context4.t0 = _context4["catch"](4);

              _iterator.e(_context4.t0);

            case 21:
              _context4.prev = 21;

              _iterator.f();

              return _context4.finish(21);

            case 24:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[4, 18, 21, 24]]);
    }));
    return _bulkChangeStatus.apply(this, arguments);
  }

  function ensureStatus(request) {
    if (!request.$content) request.$content = {};
    if (!request.$content.status) request.$content.status = [];
  }

  function askNewStatus(_x6) {
    return _askNewStatus.apply(this, arguments);
  }

  function _askNewStatus() {
    _askNewStatus = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(request) {
      var currentStatusCode, status, statusArray, currentStatus, newStatus;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              currentStatusCode = '';

              if (request) {
                ensureStatus(request);
                status = request.$content.status;
                currentStatusCode = status.length > 0 ? String(status[0].status) : '';
              }

              statusArray = _Status2["default"].getStatusArray();
              currentStatus = -1;
              statusArray.forEach(function (item, i) {
                if (String(currentStatusCode) === item.code) currentStatus = i;
              });

              if (currentStatus < statusArray.length - 1) {
                currentStatus++;
              }

              _context5.next = 8;
              return _ui2["default"].form("\n        <style>\n            #status {\n                zoom: 1.5;\n            }\n        </style>\n        <div id='status'>\n            <b>Please select the new status</b>\n            <p>&nbsp;</p>\n            <form>\n                <select name=\"status\">\n                    ".concat(statusArray.map(function (item, i) {
                return "<option value=\"".concat(i, "\" ").concat(i === currentStatus ? 'selected' : '', ">").concat(item.description, "</option>");
              }), "\n                </select>\n                <input type=\"submit\" value=\"Submit\"/>\n            </form>\n        </div>\n    "), {});

            case 8:
              newStatus = _context5.sent;
              return _context5.abrupt("return", statusArray[newStatus.status].code);

            case 10:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _askNewStatus.apply(this, arguments);
  }

  function prependStatus(_x7, _x8) {
    return _prependStatus.apply(this, arguments);
  }

  function _prependStatus() {
    _prependStatus = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(request, newStatus) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              request.$content.status.unshift({
                status: Number(newStatus),
                date: Date.now()
              });
              _context6.next = 3;
              return roc.update(request);

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));
    return _prependStatus.apply(this, arguments);
  }

  function createForm() {
    return _createForm.apply(this, arguments);
  }

  function _createForm() {
    _createForm = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
      var groups, possibleGroups, defaultGroup, possibleStatus, schema;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return roc.getGroupMembership();

            case 2:
              groups = _context7.sent.map(function (g) {
                return g.name;
              });
              possibleGroups = ['mine'].concat(groups);
              defaultGroup = window.localStorage.getItem('eln-default-sample-group');

              if (possibleGroups.indexOf(defaultGroup) === -1) {
                defaultGroup = 'all';
              }

              possibleStatus = ['any'].concat(_Status2["default"].getStatusArray().map(function (s) {
                return s.description;
              }));
              schema = {
                type: 'object',
                properties: {
                  group: {
                    type: 'string',
                    "enum": possibleGroups,
                    "default": defaultGroup,
                    required: true
                  },
                  status: {
                    type: 'string',
                    "enum": possibleStatus,
                    "default": '30',
                    required: true
                  }
                }
              };

              _api2["default"].createData('formSchema', schema);

            case 9:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));
    return _createForm.apply(this, arguments);
  }

  exports["default"] = processAction;
});