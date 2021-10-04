"use strict";

define(["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
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

  var options1D = {
    type: 'rect',
    line: 0,
    lineLabel: 1,
    labelColor: 'red',
    strokeColor: 'red',
    strokeWidth: '1px',
    fillColor: 'green',
    width: 0.05,
    height: 10,
    toFixed: 1,
    maxLines: Number.MAX_VALUE,
    selectable: true,
    fromToc: false
  };
  var options2D = {
    type: 'rect',
    labelColor: 'red',
    strokeColor: 'red',
    strokeWidth: '1px',
    fillColor: 'green',
    width: '6px',
    height: '6px'
  };
  /**
   * Add missing highlight in ranges array
   * A range must have highlights to link the various modules in the visualizer
   * If there is no assignment, highlight will be a random number
   * If there is an assignment, we will take it from the signals
   * @param {Array} ranges - An array of ranges
   * @return {boolean}
   */

  function ensureRangesHighlight(ranges) {
    var isChanged = false;

    if (ranges && Array.isArray(ranges)) {
      var _iterator = _createForOfIteratorHelper(ranges),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var range = _step.value;

          if (!range._highlight) {
            Object.defineProperty(range, '_highlight', {
              value: [],
              enumerable: false,
              writable: true
            });
          } // assignment can only be done at the level of a signal !


          if (range.signal) {
            var newHighlight = [];

            var _iterator2 = _createForOfIteratorHelper(range.signal),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var signal = _step2.value;

                if (!signal._highlight) {
                  Object.defineProperty(signal, '_highlight', {
                    enumerable: false,
                    writable: true
                  });
                }

                signal._highlight = signal.diaID;

                if (signal.diaID) {
                  if (Array.isArray(signal.diaID)) {
                    var _iterator3 = _createForOfIteratorHelper(signal.diaID),
                        _step3;

                    try {
                      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                        var diaID = _step3.value;
                        newHighlight.push(diaID);
                      }
                    } catch (err) {
                      _iterator3.e(err);
                    } finally {
                      _iterator3.f();
                    }
                  } else {
                    newHighlight.push(signal.diaID);
                  }
                }
              } // there is some newHighlight and before it was just a random number
              // or the highlight changed

            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            if (newHighlight.length > 0 && range._highlight.length > 0 && range._highlight[0].match(/^[0-9.]+$/) || newHighlight.length !== 0 && range._highlight.join('.') !== newHighlight.join('.') || newHighlight.length === 0 && range._highlight.length > 0 && !range._highlight[0].match(/^[0-9.]+$/)) {
              range._highlight = newHighlight;
              isChanged = true;
            }
          } // is there is still no highlight ... we just add a random number


          if (range._highlight.length === 0) {
            range._highlight.push(String(Math.random()));

            isChanged = true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    return isChanged;
  }

  function annotations1D(ranges, optionsG) {
    var options = Object.assign({}, options1D, optionsG);
    var height = options.height,
        line = options.line,
        _options$dy = options.dy,
        dy = _options$dy === void 0 ? [0, 0] : _options$dy,
        y = options.y;
    var annotations = [];

    for (var i = 0; i < ranges.length; i++) {
      var currentRange = ranges[i];
      var annotation = {};
      annotation.info = ranges[i];
      annotations.push(annotation);
      annotation.line = line;
      annotation._highlight = options._highlight || currentRange._highlight;

      if (!annotation._highlight && currentRange.signal) {
        annotation._highlight = [];

        var _iterator4 = _createForOfIteratorHelper(currentRange.signal),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var signal = _step4.value;

            if (signal._highlight) {
              if (signal._highlight instanceof Array) {
                var _annotation$_highligh;

                (_annotation$_highligh = annotation._highlight).push.apply(_annotation$_highligh, _toConsumableArray(signal._highlight));
              } else {
                annotation._highlight.push(signal._highlight);
              }
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }

      if ((typeof currentRange.to === 'undefined' || typeof currentRange.from === 'undefined' || currentRange.to === currentRange.from) && currentRange.signal && currentRange.signal.length > 0) {
        annotation.position = [{
          x: currentRange.signal[0].delta - options.width,
          y: "".concat(options.line * height, "px")
        }, {
          x: currentRange.signal[0].delta + options.width,
          y: "".concat(options.line * height + 8, "px")
        }];
      } else {
        annotation.position = [{
          x: currentRange.to,
          y: y ? y[0] : "".concat(options.line * height, "px"),
          dy: dy[0]
        }, {
          x: currentRange.from,
          y: y ? y[1] : "".concat(options.line * height + 5, "px"),
          dy: dy[1]
        }];
      }

      annotation.type = options.type;
      var labelColor = 'lightgrey';

      if (!options.noLabel && currentRange.integral) {
        if (!currentRange.kind || String(currentRange.kind) !== 'solvent' && String(currentRange.kind) !== 'reference' && String(currentRange.kind) !== 'impurity' && String(currentRange.kind) !== 'standard') {
          labelColor = options.labelColor;
        }

        annotation.label = {
          text: Number(currentRange.integral).toFixed(options.toFixed),
          size: '11px',
          anchor: 'middle',
          color: labelColor,
          position: {
            x: (annotation.position[0].x + annotation.position[1].x) / 2,
            dy: "".concat(height + 20, "px")
          }
        };
      }

      annotation.selectable = options.selectable;
      annotation.strokeColor = options.strokeColor;
      annotation.strokeWidth = options.strokeWidth;
      annotation.fillColor = options.fillColor;
    } // we could shift the annotations to prevent overlap


    if (options.zigzag) {
      annotations.sort(function (a, b) {
        return b.position[0].x - a.position[0].x;
      });
      annotations.forEach(function (a, i) {
        a.position[0].dy = "".concat(25 * (i % 2), "px;");
        a.position[1].dy = "".concat(25 * (i % 2), "px;");

        if (a.label) {
          a.label.position.dy = "".concat(25 * (i % 2) + height + 20, "px");
        }
      });
    }

    return annotations;
  }

  function annotations2D(zones, optionsG) {
    var options = Object.assign({}, options2D, optionsG);
    var annotations = [];

    for (var k = zones.length - 1; k >= 0; k--) {
      var signal = zones[k];
      var annotation = {};
      annotation.type = options.type;
      annotation._highlight = signal._highlight;

      if (!annotation._highlight || annotation._highlight.length === 0) {
        annotation._highlight = [signal.signalID];
      }

      signal._highlight = annotation._highlight;
      annotation.position = [{
        x: signal.fromTo[0].from - 0.01,
        y: signal.fromTo[1].from - 0.01,
        dx: options.width,
        dy: options.height
      }, {
        x: signal.fromTo[0].to + 0.01,
        y: signal.fromTo[1].to + 0.01
      }];
      annotation.fillColor = options.fillColor;
      annotation.label = {
        text: signal.remark,
        position: {
          x: signal.signal[0].delta[0],
          y: signal.signal[0].delta[1] - 0.025
        }
      };

      if (signal.integral === 1) {
        annotation.strokeColor = options.strokeColor;
      } else {
        annotation.strokeColor = 'rgb(0,128,0)';
      }

      annotation.strokeWidth = options.strokeWidth;
      annotation.width = options.width;
      annotation.height = options.height;
      annotation.info = signal;
      annotations.push(annotation);
    }

    return annotations;
  }

  exports.annotations2D = annotations2D;
  exports.annotations1D = annotations1D;
  exports.ensureRangesHighlight = ensureRangesHighlight;
});