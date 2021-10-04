"use strict";

define(["src/util/api", "../rest-on-couch/Roc"], function (_api, _Roc) {
  var _api2 = _interopRequireDefault(_api);

  var _Roc2 = _interopRequireDefault(_Roc);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  if (typeof IframeBridge !== 'undefined') {
    self.IframeBridge.onMessage(onMessage);
    self.IframeBridge.ready();
  } else {
    throw new Error('IframeBridge is not defined');
  }

  function onMessage(data) {
    if (data.type === 'tab.data') {
      var couchDB = data.message.couchDB;

      if (!couchDB) {
        console.error('couchDB configuration was not passed'); // eslint-disable-line no-console

        return;
      }

      var uuid = data.message.uuid;

      _api2["default"].cache('couchDB', couchDB);

      _api2["default"].cache('uuid', uuid);

      var roc = new _Roc2["default"](couchDB);

      _api2["default"].cache('roc', roc);

      _api2["default"].doAction('rocInit');
    }
  }
});