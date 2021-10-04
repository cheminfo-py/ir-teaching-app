import printer from './printer';

module.exports = function (opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  if (typeof IframeBridge !== 'undefined') {
    self.IframeBridge.onMessage(async function (data) {
      if (data.type === 'tab.data') {
        let optsCopy = Object.assign({}, opts);
        if (data.message.printer && data.message.printer.couchDB) {
          optsCopy.proxy = data.message.printer.proxy;
          const options = Object.assign({}, data.message.printer.couchDB, optsCopy);
          var p = await printer(options);
          cb(p, data.message.printer);
        }
      }
    });
  } else {
    cb(null);
  }
};
