"use strict";

define(["module", "src/util/api", "../rest-on-couch/Roc"], function (module, _api, _Roc) {
  var _api2 = _interopRequireDefault(_api);

  var _Roc2 = _interopRequireDefault(_Roc);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  if (typeof IframeBridge === 'undefined') {
    throw new Error('IB not loaded');
  }

  var IB = self.IframeBridge;

  function onRocInit(data) {
    if (data.type === 'tab.data') {
      var couchDB = data.message.couchDB;

      if (!couchDB) {
        console.error('couchDB configuration was not passed'); // eslint-disable-line no-console

        return false;
      }

      var uuid = data.message.uuid;

      _api2["default"].cache('couchDB', couchDB);

      _api2["default"].cache('uuid', uuid);

      var roc = new _Roc2["default"](couchDB);

      _api2["default"].cache('roc', roc);

      _api2["default"].doAction('rocInit');

      return true;
    }

    return false;
  }

  function onDataFocus(dataId, tabId, type) {
    return function (data) {
      if (data.type === 'tab.focus') {
        var _data;

        if (type === 'data') _data = _api2["default"].getData(dataId);else if (type === 'cache') _data = _api2["default"].cache(dataId);
        IB.postMessage('tab.message', {
          id: tabId,
          message: _data
        });
      }
    };
  }

  module.exports = {
    rocInit: function rocInit() {
      return new Promise(function (resolve) {
        IB.onMessage(function (data) {
          if (onRocInit(data)) {
            resolve();
          }
        });
      });
    },
    sendCacheOnFocus: function sendCacheOnFocus(dataId, tabId) {
      IB.onMessage(onDataFocus(dataId, tabId, 'cache'));
    },
    sendDataOnFocus: function sendDataOnFocus(dataId, tabId) {
      IB.onMessage(onDataFocus(dataId, tabId, 'data'));
    },
    sendVariableOnChange: function sendVariableOnChange(data, tabId) {
      data.onChange(function (event) {
        IB.postMessage('tab.message', {
          id: tabId,
          message: {
            event: event,
            data: data
          }
        });
      });
    },
    ready: function ready() {
      IB.ready();
    },
    openTab: function openTab(data) {
      IB.postMessage('tab.open', data);
    },
    onMessage: function onMessage(cb) {
      IB.onMessage(function (data) {
        if (data.type === 'tab.message') {
          cb(data.message);
        }
      });
    },
    sendMessage: function sendMessage(tabId, data) {
      IB.postMessage('tab.message', {
        id: tabId,
        message: data
      });
    }
  };
});