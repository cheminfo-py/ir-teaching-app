"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

define(['https://www.lactame.com/github/adobe-webplatform/Snap.svg/84fbff7d512c8145c522b71fc9c872cb0bcae49a/dist/snap.svg-min.js', './sequenceSplitter'], function (Snap, sequenceSplitter) {
  function getSVG(sequence, analysisResult, options) {
    var _options$width = options.width,
        width = _options$width === void 0 ? 600 : _options$width,
        _options$leftRightBor = options.leftRightBorders,
        leftRightBorders = _options$leftRightBor === void 0 ? 20 : _options$leftRightBor,
        _options$spaceBetween = options.spaceBetweenResidues,
        spaceBetweenResidues = _options$spaceBetween === void 0 ? 20 : _options$spaceBetween,
        _options$spaceBetween2 = options.spaceBetweenInteralLines,
        spaceBetweenInteralLines = _options$spaceBetween2 === void 0 ? 10 : _options$spaceBetween2,
        _options$strokeWidth = options.strokeWidth,
        strokeWidth = _options$strokeWidth === void 0 ? 2 : _options$strokeWidth,
        _options$labelFontFam = options.labelFontFamily,
        labelFontFamily = _options$labelFontFam === void 0 ? 'Verdana' : _options$labelFontFam,
        _options$labelSize = options.labelSize,
        labelSize = _options$labelSize === void 0 ? 8 : _options$labelSize,
        _options$verticalShif = options.verticalShiftForTerminalAnnotations,
        verticalShiftForTerminalAnnotations = _options$verticalShif === void 0 ? 20 : _options$verticalShif,
        _options$showLabels = options.showLabels,
        showLabels = _options$showLabels === void 0 ? true : _options$showLabels;
    var residues = [];
    var mfParts = sequenceSplitter(sequence);
    var results = JSON.parse(JSON.stringify(analysisResult));
    var xPos = leftRightBorders;
    var xOld = xPos;
    var line = 0; // we create a temporary paper in order to get the width of the text blocs

    var tempPaper = Snap(1000, 40);

    for (var i = 0; i < mfParts.length; i++) {
      var part = mfParts[i];
      var text = tempPaper.text(xPos, 20, part);
      text.attr({
        'font-family': labelFontFamily,
        'font-weight': 'bold',
        'font-size': 12
      });
      var textWidth = text.node.getBoundingClientRect().width;
      xPos += textWidth;

      if (xPos > width - leftRightBorders) {
        xOld = leftRightBorders;
        xPos = leftRightBorders + textWidth;
        line++;
      }

      residues.push({
        nTer: i,
        cTer: mfParts.length - i,
        label: part,
        xFrom: xOld,
        xTo: xPos,
        line: line,
        usedSlots: [],
        topPosition: 0,
        bottomPosition: 0
      });
      xPos += spaceBetweenResidues;
      xOld = xPos;
    }

    tempPaper.clear(); // we calculate all the lines based on the results

    var _iterator = _createForOfIteratorHelper(results),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _result = _step.value;

        // internal fragment ?
        var parts = _result.type.split(/(?=[a-z])/);

        var firstPart = parts[0];
        var secondPart = parts[1];

        if ('abc'.indexOf(firstPart.charAt(0)) > -1) {
          // n-terminal fragment
          _result.to = firstPart.substr(1) * 1 - 1;

          if (secondPart) {
            _result.internal = true;
          } else {
            _result.fromNTerm = true;
          }
        } else {
          _result.to = residues.length - 1;
          secondPart = firstPart;
          _result.fromCTerm = true;
        }

        if (!secondPart) {
          _result.from = 0;
        } else {
          _result.from = residues.length - secondPart.substr(1) * 1 - 1;
        }

        _result.length = _result.to - _result.from + 1;
        if (_result.fromCTerm) _result.color = 'red';
        if (_result.fromNTerm) _result.color = 'blue';

        if (_result.internal) {
          switch (_result.type.substring(0, 1)) {
            case 'a':
              _result.color = 'green';
              break;

            case 'b':
              _result.color = 'orange';
              break;

            case 'c':
              _result.color = 'cyan';
              break;

            default:
              _result.color = 'green';
          }
        }

        if (_result.similarity > 95) {
          _result.textColor = 'black';
        } else if (_result.similarity > 90) {
          _result.textColor = '#333';
        } else if (_result.similariy > 80) {
          _result.textColor = '#666';
        } else {
          _result.textColor = '#999';
        }
      } // sort by residue length

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    results.sort(function (a, b) {
      return a.length - b.length;
    }); // for each line (internal fragment) we calculate the vertical position
    // where it should be drawn as well and the maximal number of lines

    var maxNumberLines = 0;

    var _iterator2 = _createForOfIteratorHelper(results),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var result = _step2.value;

        if (result.internal) {
          result.slot = assignSlot(result.from, result.to);
          if (result.slot > maxNumberLines) maxNumberLines = result.slot;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    var rowHeight = verticalShiftForTerminalAnnotations + spaceBetweenInteralLines * (maxNumberLines + 6);
    var height = rowHeight * (line + 1) + 50 + verticalShiftForTerminalAnnotations; // We start to create the SVG and create the paper

    var paper = Snap(width, height);
    addScript(paper);
    residues.forEach(function (residue) {
      residue.y = (residue.line + 1) * rowHeight;
      var text = paper.text(residue.xFrom, residue.y, residue.label);
      text.attr({
        id: "residue-".concat(residue.nTer)
      });
      text.attr({
        'font-family': labelFontFamily,
        'font-weight': 'bold',
        'font-size': 12
      });
    });
    drawInternals();
    drawTerminals();
    var svg = paper.toString().replace(/>/g, '>\r').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    paper.clear();
    return svg; // we need to define the height of the line.
    // we need to find a height that is not yet used.

    function assignSlot(from, to) {
      var used = {};

      for (var i = from; i < to; i++) {
        var residue = residues[i];
        residue.usedSlots.forEach(function (usedSlot, index) {
          used[index] = true;
        });
      }

      var counter = 0;

      while (true) {
        if (!used[counter]) {
          break;
        }

        counter++;
      }

      for (var _i = from; _i < to; _i++) {
        residues[_i].usedSlots[counter] = true;
      }

      return counter;
    }

    function drawTerminals() {
      var _iterator3 = _createForOfIteratorHelper(results),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var result = _step3.value;
          var residue;
          var nTerminal = false;

          if (result.fromNTerm) {
            residue = residues[result.to];
            nTerminal = true;
          }

          if (result.fromCTerm) {
            residue = residues[result.from];
          }

          if (residue) {
            var _line = paper.line(residue.xTo + spaceBetweenResidues / 2, residue.y, residue.xTo + spaceBetweenResidues / 2, residue.y - 8);

            _line.attr({
              stroke: result.color,
              'stroke-width': strokeWidth
            });

            if (nTerminal) {
              var _line2 = paper.line(residue.xTo + spaceBetweenResidues / 2, residue.y, residue.xTo + spaceBetweenResidues / 2 - 5, residue.y + 5);

              _line2.attr({
                stroke: result.color,
                'stroke-width': strokeWidth
              });

              drawLabel(result, residue.xTo + spaceBetweenResidues / 2 - 15, residue.y + 12 + residue.bottomPosition * labelSize);
              residue.bottomPosition++;
            } else {
              var _line3 = paper.line(residue.xTo + spaceBetweenResidues / 2, residue.y - 8, residue.xTo + spaceBetweenResidues / 2 + 5, residue.y - 13);

              _line3.attr({
                stroke: result.color,
                'stroke-width': strokeWidth
              });

              drawLabel(result, residue.xTo + spaceBetweenResidues / 2, residue.y - 15 - residue.topPosition * labelSize);
              residue.topPosition++;
            }
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    function drawLabel(result, x, y) {
      if (!showLabels) return;
      var label = result.type;
      var similarity = Math.round(result.similarity);
      var charge = result.charge > 0 ? "+".concat(result.charge) : result.charge;
      var text = paper.text(x, y, label);
      text.attr({
        fill: result.textColor,
        'font-family': labelFontFamily,
        'font-weight': 'bold',
        'font-size': labelSize
      });
      var textWidth = text.node.getBoundingClientRect().width + 3;
      text = paper.text(x + textWidth, y - labelSize / 2, charge);
      text.attr({
        fill: result.textColor,
        'font-family': labelFontFamily,
        'font-size': labelSize / 2
      });
      text = paper.text(x + textWidth, y, similarity);
      text.attr({
        fill: result.textColor,
        'font-family': labelFontFamily,
        'font-size': labelSize / 2
      });
    }

    function drawInternals() {
      var _iterator4 = _createForOfIteratorHelper(results),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var result = _step4.value;

          if (result.internal) {
            var fromResidue = residues[result.from + 1];
            var toResidue = residues[result.to]; // var charge = result.charge > 0 ? '+' + result.charge : result.charge;
            // var label = result.type + ' (' + charge + ', ' + Math.round(result.similarity) + '%)';
            // we need to check on how many lines we are

            var fromX, toX, y;

            for (var line = fromResidue.line; line <= toResidue.line; line++) {
              y = -10 - result.slot * spaceBetweenInteralLines + (line + 1) * rowHeight - verticalShiftForTerminalAnnotations;

              if (line === fromResidue.line) {
                fromX = fromResidue.xFrom - spaceBetweenResidues / 2;
              } else {
                fromX = 0;
              }

              if (line === toResidue.line) {
                toX = toResidue.xTo + spaceBetweenResidues / 2;
              } else {
                toX = width - 1;
              }

              var drawLine = paper.line(fromX, y, toX, y);
              drawLine.attr({
                onmouseover: 'mouseOver(evt)',
                onmouseout: 'mouseOut(evt)',
                id: "line".concat(fromResidue.nTer, "-").concat(toResidue.nTer)
              });
              drawLine.attr({
                stroke: result.color,
                'stroke-width': strokeWidth
              });
              drawLabel(result, (fromX + toX) / 2 - 10, y - 2); // label = result.type + ' (' + Math.round(result.similarity) + '%)';
            }
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }

    function addScript(paper) {
      var script = " // <![CDATA[\n        function mouseOver(evt) {\n            var targetRange=evt.target.id.replace(/^line/,'');\n            var from=targetRange.replace(/-.*/,'')*1;\n            var to=targetRange.replace(/.*-/,'')*1;\n            var children=evt.target.parentNode.children;\n            for (var child of children) {\n                if (child.nodeName === 'text' && child.id.startsWith(\"residue\")) {\n                    var residueNumber=child.id.replace(/residue-/,'')*1;\n                    if (residueNumber>=from && residueNumber<=to) {\n                        child.setAttribute('fill','red');\n                    }\n                }\n            }\n        }\n        function mouseOut(evt) {\n            var children=evt.target.parentNode.children;\n            for (var child of children) {\n                if (child.nodeName === 'text' && child.id.startsWith(\"residue\")) {\n                    child.setAttribute('fill','black');\n                }\n            }\n        }\n     // ]]>\n    ";
      var scriptElement = paper.el('script', {
        type: 'application/ecmascript'
      });
      scriptElement.node.textContent = script;
    }
  }

  return getSVG;
});