"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(['../util/getViewInfo'], function (getViewInfo) {
  var UserViewPrefs = /*#__PURE__*/function () {
    function UserViewPrefs(roc) {
      _classCallCheck(this, UserViewPrefs);

      this.roc = roc;
    }
    /**
     * Retrieves user preferences related to the current view
     * @param {*} prefID
     * @return {object} preferences
     */


    _createClass(UserViewPrefs, [{
      key: "get",
      value: function () {
        var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(prefID) {
          var record;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.getRecord(prefID);

                case 2:
                  record = _context.sent;

                  if (!(record && record.$content)) {
                    _context.next = 5;
                    break;
                  }

                  return _context.abrupt("return", record.$content);

                case 5:
                  return _context.abrupt("return", undefined);

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function get(_x) {
          return _get.apply(this, arguments);
        }

        return get;
      }()
    }, {
      key: "getRecord",
      value: function () {
        var _getRecord = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(prefID) {
          var user, firstEntry;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (prefID) {
                    _context2.next = 4;
                    break;
                  }

                  _context2.next = 3;
                  return getViewInfo();

                case 3:
                  prefID = _context2.sent._id;

                case 4:
                  _context2.next = 6;
                  return this.roc.getUser();

                case 6:
                  user = _context2.sent;

                  if (!(!user || !user.username)) {
                    _context2.next = 9;
                    break;
                  }

                  return _context2.abrupt("return", undefined);

                case 9:
                  _context2.next = 11;
                  return this.roc.view('entryByOwnerAndId', {
                    key: [user.username, ['userViewPrefs', prefID]]
                  });

                case 11:
                  firstEntry = _context2.sent[0];
                  return _context2.abrupt("return", firstEntry);

                case 13:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function getRecord(_x2) {
          return _getRecord.apply(this, arguments);
        }

        return getRecord;
      }()
    }, {
      key: "set",
      value: function () {
        var _set = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(value, prefID) {
          var record;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (prefID) {
                    _context3.next = 4;
                    break;
                  }

                  _context3.next = 3;
                  return getViewInfo();

                case 3:
                  prefID = _context3.sent._id;

                case 4:
                  _context3.next = 6;
                  return this.getRecord(prefID);

                case 6:
                  record = _context3.sent;

                  if (!record) {
                    _context3.next = 12;
                    break;
                  }

                  record.$content = value;
                  return _context3.abrupt("return", this.roc.update(record));

                case 12:
                  return _context3.abrupt("return", this.roc.create({
                    $id: ['userViewPrefs', prefID],
                    $content: value,
                    $kind: 'userViewPrefs'
                  }));

                case 13:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function set(_x3, _x4) {
          return _set.apply(this, arguments);
        }

        return set;
      }()
    }]);

    return UserViewPrefs;
  }();

  return UserViewPrefs;
});