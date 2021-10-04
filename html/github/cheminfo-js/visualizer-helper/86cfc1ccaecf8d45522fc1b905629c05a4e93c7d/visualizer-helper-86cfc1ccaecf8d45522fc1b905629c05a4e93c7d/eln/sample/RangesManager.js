"use strict";

define(["module", "exports", "src/util/api"], function (module, exports, _api) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RangesManager = undefined;

  var _api2 = _interopRequireDefault(_api);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
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

  var RangesManager = exports.RangesManager = function () {
    function RangesManager(ranges) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, RangesManager);

      this.ranges = ranges;
      this.currentRange = undefined;
      this.ensureLabel = options.ensureLabel;
    }

    _createClass(RangesManager, [{
      key: "processAction",
      value: function processAction(action) {
        if (!action.value.event.altKey || action.value.event.shiftKey || action.value.event.ctrlKey) {
          return;
        }

        var track;

        if (action.value && action.value.data) {
          var firstChart = Object.keys(action.value.data)[0];

          if (firstChart) {
            track = action.value.data[firstChart];
          }
        }

        if (!track) return;

        switch (action.name) {
          case 'trackClicked':
            this.updateRange(track);
            break;

          case 'trackMove':
            this.updateAnnotations(track);
            break;

          default:
        }
      }
    }, {
      key: "updateAnnotations",
      value: function updateAnnotations(track) {
        if (!this.ranges || this.ranges.length === 0) {
          _api2["default"].createData('rangeAnnotations', []);

          return;
        }

        var annotations = [];
        var updateHighlight = false;

        var _iterator = _createForOfIteratorHelper(this.ranges),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var range = _step.value;

            if (!range._highlight) {
              updateHighlight = true;
              Object.defineProperty(range, '_highlight', {
                enumerable: false,
                value: Math.random()
              });
            }

            if (range.to) {
              var annotation = {
                position: [{
                  x: range.from,
                  y: '15px'
                }, {
                  x: range.to,
                  y: '20px'
                }],
                type: 'rect',
                fillColor: 'red',
                strokeColor: 'red',
                _highlight: [range._highlight],
                info: range
              };

              if (range.label) {
                annotation.label = [{
                  text: range.label,
                  size: '18px',
                  anchor: 'middle',
                  color: 'red',
                  position: {
                    x: (range.from + range.to) / 2,
                    y: '10px'
                  }
                }];
              }

              annotations.push(annotation);
            }

            if (updateHighlight) {
              _api2["default"].getData('ranges').triggerChange();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (track && this.currentRange && !this.currentRange.to) {
          annotations.push({
            position: [{
              x: this.currentRange.from,
              y: '15px'
            }, {
              x: track.xClosest,
              y: '20px'
            }],
            type: 'rect',
            fillColor: 'green',
            strokeColor: 'green'
          });
        }

        _api2["default"].createData('rangeAnnotations', annotations);
      }
    }, {
      key: "setLabel",
      value: function setLabel(currentRange) {
        // look for the first letter not used
        var current = 65;

        label: while (current < 91) {
          var _iterator2 = _createForOfIteratorHelper(this.ranges),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var range = _step2.value;

              if (range.label && range.label.charCodeAt(0) === current) {
                current++;
                continue label;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          currentRange.label = String.fromCharCode(current);
          return;
        }
      }
    }, {
      key: "updateRange",
      value: function updateRange(track) {
        if (this.currentRange) {
          this.currentRange.to = track.xClosest;
          checkFromTo(this.currentRange);
          this.currentRange = undefined;
        } else {
          var range = {};
          this.ranges.push(range);
          this.currentRange = range;
          range.from = track.xClosest;
        }

        if (this.ensureLabel && this.currentRange && !this.currentRange.label) {
          this.setLabel(this.currentRange);
        }

        this.ranges.triggerChange();
        this.updateAnnotations();
      }
    }, {
      key: "addRanges",
      value: function addRanges(ranges) {
        var _iterator3 = _createForOfIteratorHelper(ranges),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var range = _step3.value;
            checkFromTo(range);

            if (!range.label) {
              this.manager.setLabel(range);
            }

            this.ranges.push(range);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        this.ranges.triggerChange();
        this.updateAnnotations();
      }
    }]);

    return RangesManager;
  }();

  function checkFromTo(range) {
    if (range.to === undefined) return;

    if (range.from > range.to) {
      var _ref = [range.to, range.from];
      range.from = _ref[0];
      range.to = _ref[1];
    }
  }

  module.exports = RangesManager;
});