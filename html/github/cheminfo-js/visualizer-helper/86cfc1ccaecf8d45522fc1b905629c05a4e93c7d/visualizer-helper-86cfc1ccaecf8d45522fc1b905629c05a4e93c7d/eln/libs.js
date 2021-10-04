"use strict";

define(["exports", "./libs/OCLE", "./libs/OCLUtils", "./libs/SD", "./libs/elnPlugin", "./libs/Image", "./libs/MolecularFormula", "./libs/convertToJcamp", "./libs/parseXY", "./libs/jcampconverter"], function (exports, _OCLE, _OCLUtils, _SD, _elnPlugin, _Image, _MolecularFormula, _convertToJcamp, _parseXY, _jcampconverter) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "OCLE", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_OCLE).default;
    }
  });
  Object.defineProperty(exports, "OCLUtils", {
    enumerable: true,
    get: function () {
      return _OCLUtils.OCLUtils;
    }
  });
  Object.defineProperty(exports, "OCL", {
    enumerable: true,
    get: function () {
      return _OCLUtils.OCL;
    }
  });
  Object.defineProperty(exports, "SD", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_SD).default;
    }
  });
  Object.defineProperty(exports, "elnPlugin", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_elnPlugin).default;
    }
  });
  Object.defineProperty(exports, "Image", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_Image).default;
    }
  });
  Object.defineProperty(exports, "MolecularFormula", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_MolecularFormula).default;
    }
  });
  Object.defineProperty(exports, "convertToJcamp", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_convertToJcamp).default;
    }
  });
  Object.defineProperty(exports, "parseXY", {
    enumerable: true,
    get: function () {
      return _parseXY.parseXY;
    }
  });
  Object.defineProperty(exports, "convert", {
    enumerable: true,
    get: function () {
      return _jcampconverter.convert;
    }
  });

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});