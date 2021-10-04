"use strict";

define(["module", "./ZebraPrintServer", "./PrintServer"], function (module, _ZebraPrintServer, _PrintServer) {
  var _ZebraPrintServer2 = _interopRequireDefault(_ZebraPrintServer);

  var _PrintServer2 = _interopRequireDefault(_PrintServer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = function printServerFactory(s, opts) {
    if (String(s.kind) === 'zebra') {
      return new _ZebraPrintServer2["default"](s, opts);
    } else {
      return new _PrintServer2["default"](s, opts);
    }
  };
});