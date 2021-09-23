
import API from 'src/util/api';

import Roc from '../rest-on-couch/Roc';

if (typeof IframeBridge === 'undefined') {
  throw new Error('IB not loaded');
}

const IB = self.IframeBridge;

function onRocInit(data) {
  if (data.type === 'tab.data') {
    var couchDB = data.message.couchDB;
    if (!couchDB) {
      console.error('couchDB configuration was not passed'); // eslint-disable-line no-console
      return false;
    }
    var uuid = data.message.uuid;
    API.cache('couchDB', couchDB);
    API.cache('uuid', uuid);
    var roc = new Roc(couchDB);
    API.cache('roc', roc);
    API.doAction('rocInit');
    return true;
  }
  return false;
}

function onDataFocus(dataId, tabId, type) {
  return function (data) {
    if (data.type === 'tab.focus') {
      let data;
      if (type === 'data') data = API.getData(dataId);
      else if (type === 'cache') data = API.cache(dataId);
      IB.postMessage('tab.message', {
        id: tabId,
        message: data
      });
    }
  };
}


module.exports = {
  rocInit() {
    return new Promise((resolve) => {
      IB.onMessage((data) => {
        if (onRocInit(data)) {
          resolve();
        }
      });
    });
  },
  sendCacheOnFocus(dataId, tabId) {
    IB.onMessage(onDataFocus(dataId, tabId, 'cache'));
  },
  sendDataOnFocus(dataId, tabId) {
    IB.onMessage(onDataFocus(dataId, tabId, 'data'));
  },
  sendVariableOnChange(data, tabId) {
    data.onChange((event) => {
      IB.postMessage('tab.message', {
        id: tabId,
        message: {
          event: event,
          data: data
        }
      });
    });
  },
  ready() {
    IB.ready();
  },
  openTab(data) {
    IB.postMessage('tab.open', data);
  },
  // register callback to handle message of type 'message', without info about the sender
  onMessage(cb) {
    IB.onMessage(function (data) {
      if (data.type === 'tab.message') {
        cb(data.message);
      }
    });
  },
  // Send a message of type 'message'
  sendMessage(tabId, data) {
    IB.postMessage('tab.message', {
      id: tabId,
      message: data
    });
  }
};
