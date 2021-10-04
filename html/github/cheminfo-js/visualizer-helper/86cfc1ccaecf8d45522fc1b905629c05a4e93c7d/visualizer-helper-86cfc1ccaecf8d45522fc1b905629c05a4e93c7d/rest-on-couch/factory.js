"use strict";

define(['./Roc'], function (Roc) {
  return function (opts, cb) {
    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }

    if (typeof IframeBridge !== 'undefined') {
      self.IframeBridge.onMessage(function (data) {
        if (data.type === 'tab.data') {
          if (data.message.couchDB) {
            var options = Object.assign({}, data.message.couchDB, opts);
            var roc = new Roc(options);
            cb(roc, data.message.couchDB);
          }
        }
      });
    } else {
      cb(null);
    }
  };
});