
import API from 'src/util/api';

import Roc from '../rest-on-couch/Roc';

if ((typeof IframeBridge) !== 'undefined') {
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
    API.cache('couchDB', couchDB);
    API.cache('uuid', uuid);
    var roc = new Roc(couchDB);
    API.cache('roc', roc);
    API.doAction('rocInit');
  }
}
