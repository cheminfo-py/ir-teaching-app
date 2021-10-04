"use strict";

define(["exports", "../../../../../../../../lib/openchemlib-utils/1.5.0/openchemlib-utils", "openchemlib/openchemlib-core"], function (exports, _openchemlibUtils, _openchemlibCore) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OCL = exports.OCLUtils = undefined;

  var OCLUtils = _interopRequireWildcard(_openchemlibUtils);

  var _openchemlibCore2 = _interopRequireDefault(_openchemlibCore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  exports.OCLUtils = OCLUtils;
  exports.OCL = _openchemlibCore2["default"];
});