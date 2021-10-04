"use strict";

define(["exports", "../libs/SD"], function (exports, _SD) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toHTML;

  var _SD2 = _interopRequireDefault(_SD);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function toHTML(value) {
    var acsString = '';

    if (value && value.range) {
      var ranges = new _SD2["default"].Ranges(value.range);
      var nucleus = '1H';
      if (!Array.isArray(value.nucleus)) nucleus = [value.nucleus];
      acsString += ranges.getACS({
        nucleus: nucleus,
        solvent: value.solvent,
        frequencyObserved: value.frequency
      });
    }

    return acsString;
  }
});