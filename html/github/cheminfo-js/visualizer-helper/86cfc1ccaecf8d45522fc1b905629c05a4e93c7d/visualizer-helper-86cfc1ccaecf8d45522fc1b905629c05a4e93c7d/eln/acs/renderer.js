"use strict";

define(["exports", "src/util/typerenderer", "./ea", "./ir", "./raman", "./uv", "./nmr", "./mass"], function (exports, _typerenderer, _ea, _ir, _raman, _uv, _nmr, _mass) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.add = add;

  var _typerenderer2 = _interopRequireDefault(_typerenderer);

  var _ea2 = _interopRequireDefault(_ea);

  var _ir2 = _interopRequireDefault(_ir);

  var _raman2 = _interopRequireDefault(_raman);

  var _uv2 = _interopRequireDefault(_uv);

  var _nmr2 = _interopRequireDefault(_nmr);

  var _mass2 = _interopRequireDefault(_mass);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function add() {
    _typerenderer2["default"].addType('acsir', {
      toscreen: function toscreen($element, val, root) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        $element.html((0, _ir2["default"])(val, options));
      }
    });

    _typerenderer2["default"].addType('acsraman', {
      toscreen: function toscreen($element, val, root) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        $element.html((0, _raman2["default"])(val, options));
      }
    });

    _typerenderer2["default"].addType('acsuv', {
      toscreen: function toscreen($element, val, root) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        $element.html((0, _uv2["default"])(val, options));
      }
    });

    _typerenderer2["default"].addType('acsnmr', {
      toscreen: function toscreen($element, val, root) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        $element.html((0, _nmr2["default"])(val, options));
      }
    });

    _typerenderer2["default"].addType('acsms', {
      toscreen: function toscreen($element, val, root) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        $element.html((0, _mass2["default"])(val, options));
      }
    });

    _typerenderer2["default"].addType('acsea', {
      toscreen: function toscreen($element, val, root) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        $element.html((0, _ea2["default"])(val, options));
      }
    });
  }
});