"use strict";

define(["exports", "src/util/typerenderer", "./color"], function (exports, _typerenderer, _color) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.add = add;

  var _typerenderer2 = _interopRequireDefault(_typerenderer);

  var _color2 = _interopRequireDefault(_color);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function add() {
    _typerenderer2["default"].addType('reactionStatus', {
      toscreen: function toscreen($element, val) {
        var label = _color2["default"].getLabel(val);

        var color = _color2["default"].getColor(val);

        $element.css('background-color', color);
        $element.html(label);
      }
    });
  }
});