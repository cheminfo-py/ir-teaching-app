"use strict";

define(function () {
  function toTypedUrl(documents, couchUrl, database) {
    if (!Array.isArray(documents)) throw new Error('Array expected');

    for (var i = 0; i < documents.length; i++) {
      var content = documents[i].$content;
      processObject(content, documents[i]);
    }

    function processObject(obj, documents) {
      if (obj instanceof Object) {
        if (typeof obj.filename === 'string' && typeof obj.type === 'string') {
          obj.url = "".concat(couchUrl, "/db/").concat(database, "/").concat(documents._id, "/").concat(obj.filename);
        }

        for (var key in obj) {
          processObject(obj[key], documents);
        }
      } else if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          processObject(obj[i], documents);
        }
      }
    }

    return documents;
  }

  return toTypedUrl;
});