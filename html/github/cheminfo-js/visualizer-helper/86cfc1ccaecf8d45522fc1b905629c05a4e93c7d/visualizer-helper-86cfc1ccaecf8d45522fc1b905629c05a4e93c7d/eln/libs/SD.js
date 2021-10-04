"use strict";

define(["exports", "../../../../../../../../lib/spectra-data/3.7.2/spectra-data.min"], function (exports, _spectraData) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SD = exports.Ranges = exports.NMR2D = exports.NMR = exports.GUI = exports.default = undefined;

  var SDLib = _interopRequireWildcard(_spectraData);

  function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();

    _getRequireWildcardCache = function () {
      return cache;
    };

    return cache;
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }

    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return {
        default: obj
      };
    }

    var cache = _getRequireWildcardCache();

    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }

    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }

    newObj.default = obj;

    if (cache) {
      cache.set(obj, newObj);
    }

    return newObj;
  }

  var GUI = SDLib.GUI,
      NMR = SDLib.NMR,
      NMR2D = SDLib.NMR2D,
      Ranges = SDLib.Ranges,
      SD = SDLib.SD;
  exports.default = SDLib;
  exports.GUI = GUI;
  exports.NMR = NMR;
  exports.NMR2D = NMR2D;
  exports.Ranges = Ranges;
  exports.SD = SD;
});