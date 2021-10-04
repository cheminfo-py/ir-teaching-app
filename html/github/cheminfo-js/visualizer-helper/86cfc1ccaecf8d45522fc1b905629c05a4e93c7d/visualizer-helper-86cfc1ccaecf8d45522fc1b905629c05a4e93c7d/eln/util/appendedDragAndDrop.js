"use strict";

define(["exports", "src/util/api", "../libs/elnPlugin"], function (exports, _api, _elnPlugin) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appendedDragAndDrop = appendedDragAndDrop;

  var _api2 = _interopRequireDefault(_api);

  var _elnPlugin2 = _interopRequireDefault(_elnPlugin);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  /**
   * Append a list of drag and dropped files to a given variable
   * @param {Array|object} experimentalFiles
   * @param {string} targetName
   * @return {Array<object>}
   */
  function appendedDragAndDrop(experimentalFiles, targetName) {
    var target = _api2["default"].getData(targetName);

    var newTarget = false;

    if (!target) {
      target = [];
      newTarget = true;
    }

    if (!Array.isArray(experimentalFiles)) {
      experimentalFiles = [experimentalFiles];
    }

    var _iterator = _createForOfIteratorHelper(experimentalFiles),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var file = _step.value;

        if (file.filename && String(file.filename) !== '') {
          // handle from drag and drop
          var property = _elnPlugin2["default"].util.getTargetProperty(String(file.filename));

          if (property !== 'file') {
            target.push(_defineProperty({}, property, file));
          } else if (String(file.encoding) === 'text') {
            target.push({
              text: file
            });
          } else {
            target.push({
              file: file
            });
          }
        } else {
          var type;

          if (String(file.encoding) === 'text') {
            type = getTargetType(String(file.content));
          } else {
            var first = firstCharacters(String(file.content));
            type = getTargetType(first);
          }

          file.filename = target.length + 1;
          target.push(_defineProperty({}, type, file));
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (newTarget) {
      _api2["default"].createData(targetName, target);
    } else {
      target.triggerChange();
    }

    return target;
  }

  function getTargetType(content) {
    if (content[0] === '#') {
      return 'jcamp';
    }

    if (content[0] === '<') {
      return 'xml';
    }

    if (content.slice(0, 3) === 'CDF') {
      return 'cdf';
    }

    return 'text';
  } // https://stackoverflow.com/questions/36487636/javascript-convert-array-buffer-to-string


  function firstCharacters(arrayBuffer) {
    var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
    var byteArray = new Uint8Array(arrayBuffer);
    var str = '';
    var charCode = 0;
    var numBytes = 0;

    for (var i = 0; i < len; ++i) {
      var v = byteArray[i];

      if (numBytes > 0) {
        // 2 bit determining that this is a tailing byte + 6 bit of payload
        if ((charCode & 192) === 192) {
          // processing tailing-bytes
          charCode = charCode << 6 | v & 63;
        } else {
          throw new Error('this is no tailing-byte');
        }
      } else if (v < 128) {
        // single-byte
        numBytes = 1;
        charCode = v;
      } else if (v < 192) {
        // these are tailing-bytes
        throw new Error('invalid byte, this is a tailing-byte');
      } else if (v < 224) {
        // 3 bits of header + 5bits of payload
        numBytes = 2;
        charCode = v & 31;
      } else if (v < 240) {
        // 4 bits of header + 4bit of payload
        numBytes = 3;
        charCode = v & 15;
      } else {
        // UTF-8 theoretically supports up to 8 bytes containing up to 42bit of payload
        // but JS can only handle 16bit.
        throw new Error('invalid encoding, value out of range');
      }

      if (--numBytes === 0) {
        str += String.fromCharCode(charCode);
      }
    }

    return str;
  }
});