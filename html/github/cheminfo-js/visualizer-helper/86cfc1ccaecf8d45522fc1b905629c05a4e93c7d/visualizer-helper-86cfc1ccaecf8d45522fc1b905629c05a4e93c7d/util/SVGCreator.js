"use strict";

define(["module"], function (module) {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function F() {};

        return {
          s: F,
          n: function n() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function e(_e) {
            throw _e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function s() {
        it = o[Symbol.iterator]();
      },
      n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function e(_e2) {
        didErr = true;
        err = _e2;
      },
      f: function f() {
        try {
          if (!normalCompletion && it["return"] != null) it["return"]();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var SVGCreator = function () {
    function SVGCreator(width, height) {
      _classCallCheck(this, SVGCreator);

      this.height = height;
      this.width = width;
      this.children = [];
      this.scripts = [];
    }

    _createClass(SVGCreator, [{
      key: "addScript",
      value: function addScript(script) {
        this.script.push(script);
      }
    }, {
      key: "addText",
      value: function addText(text) {
        var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return _addText(this.children, text, attributes);
      }
    }, {
      key: "add",
      value: function add(kind) {
        var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return _add(this.children, kind, attributes);
      }
    }, {
      key: "toSVG",
      value: function toSVG() {
        var content = "<svg width=\"".concat(this.width, "\" height=\"").concat(this.height, "\">");
        content += getChildrenSVG(this.children);
        content += '</svg>';
        return content;
      }
    }]);

    return SVGCreator;
  }();

  function getChildrenSVG(children) {
    var content = '';

    var _iterator = _createForOfIteratorHelper(children),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var element = _step.value;
        var attributes = [];
        appendAttributes(element.attributes, attributes);
        attributes = attributes.join(' ');

        if (element.children.length > 0) {
          content += "<".concat(element.kind, " ").concat(attributes, ">").concat(getChildrenSVG(element.children), "</").concat(element.kind, ">");
        } else if (element.innerHTML) {
          content += "<".concat(element.kind, " ").concat(attributes, ">").concat(element.innerHTML, "</").concat(element.kind, ">");
        } else {
          content += "<".concat(element.kind, " ").concat(attributes, " />");
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return content;
  }

  var Element = function () {
    function Element() {
      var kind = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var innerHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, Element);

      this.children = [];
      this.kind = kind;
      this.attributes = attributes;
      this.innerHTML = innerHTML;
    }

    _createClass(Element, [{
      key: "addText",
      value: function addText(text) {
        var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return _addText(this.children, text, attributes);
      }
    }, {
      key: "add",
      value: function add(kind) {
        var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return _add(this.children, kind, attributes);
      }
    }]);

    return Element;
  }();

  function encodeText(string) {
    return string.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
      return '&#' + i.charCodeAt(0) + ';';
    });
  }

  function _addText(children, text) {
    var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var element = new Element('text', encodeText(text), attributes);
    children.push(element);
    return element;
  }

  function _add(children, kind) {
    var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var element = new Element(kind, '', attributes);
    children.push(element);
    return element;
  } // attributes may contain objects to organize the properties


  function appendAttributes(newAttributes, attributes) {
    for (var key in newAttributes) {
      if (_typeof(newAttributes[key]) === 'object') {
        appendAttributes(newAttributes[key], attributes);
      } else {
        var newKey = key.replace(/([A-Z])/g, function (match) {
          return '-' + match.toLowerCase();
        });
        attributes.push(newKey + '="' + newAttributes[key] + '"');
      }
    }
  }

  module.exports = SVGCreator;
});