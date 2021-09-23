define([
  'https://www.lactame.com/github/adobe-webplatform/Snap.svg/84fbff7d512c8145c522b71fc9c872cb0bcae49a/dist/snap.svg-min.js',
  './sequenceSplitter'
], function (Snap, sequenceSplitter) {
  function getSVG(sequence, analysisResult, options) {
    const {
      width = 600,
      leftRightBorders = 20,
      spaceBetweenResidues = 20,
      spaceBetweenInteralLines = 10,
      strokeWidth = 2,
      labelFontFamily = 'Verdana',
      labelSize = 8,
      verticalShiftForTerminalAnnotations = 20,
      showLabels = true
    } = options;

    var residues = [];
    var mfParts = sequenceSplitter(sequence);
    var results = JSON.parse(JSON.stringify(analysisResult));

    var xPos = leftRightBorders;
    var xOld = xPos;

    var line = 0;
    // we create a temporary paper in order to get the width of the text blocs
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
        line,
        usedSlots: [],
        topPosition: 0,
        bottomPosition: 0
      });
      xPos += spaceBetweenResidues;
      xOld = xPos;
    }
    tempPaper.clear();

    // we calculate all the lines based on the results
    for (let result of results) {
      // internal fragment ?
      var parts = result.type.split(/(?=[a-z])/);
      var firstPart = parts[0];
      var secondPart = parts[1];

      if ('abc'.indexOf(firstPart.charAt(0)) > -1) {
        // n-terminal fragment
        result.to = firstPart.substr(1) * 1 - 1;
        if (secondPart) {
          result.internal = true;
        } else {
          result.fromNTerm = true;
        }
      } else {
        result.to = residues.length - 1;
        secondPart = firstPart;
        result.fromCTerm = true;
      }
      if (!secondPart) {
        result.from = 0;
      } else {
        result.from = residues.length - secondPart.substr(1) * 1 - 1;
      }
      result.length = result.to - result.from + 1;

      if (result.fromCTerm) result.color = 'red';
      if (result.fromNTerm) result.color = 'blue';
      if (result.internal) {
        switch (result.type.substring(0, 1)) {
          case 'a':
            result.color = 'green';
            break;
          case 'b':
            result.color = 'orange';
            break;
          case 'c':
            result.color = 'cyan';
            break;
          default:
            result.color = 'green';
        }
      }
      if (result.similarity > 95) {
        result.textColor = 'black';
      } else if (result.similarity > 90) {
        result.textColor = '#333';
      } else if (result.similariy > 80) {
        result.textColor = '#666';
      } else {
        result.textColor = '#999';
      }
    }
    // sort by residue length
    results.sort((a, b) => a.length - b.length);

    // for each line (internal fragment) we calculate the vertical position
    // where it should be drawn as well and the maximal number of lines
    var maxNumberLines = 0;
    for (var result of results) {
      if (result.internal) {
        result.slot = assignSlot(result.from, result.to);
        if (result.slot > maxNumberLines) maxNumberLines = result.slot;
      }
    }

    var rowHeight =
      verticalShiftForTerminalAnnotations +
      spaceBetweenInteralLines * (maxNumberLines + 6);
    var height =
      rowHeight * (line + 1) + 50 + verticalShiftForTerminalAnnotations;

    // We start to create the SVG and create the paper
    var paper = Snap(width, height);

    addScript(paper);

    residues.forEach(function (residue) {
      residue.y = (residue.line + 1) * rowHeight;
      var text = paper.text(residue.xFrom, residue.y, residue.label);
      text.attr({ id: `residue-${residue.nTer}` });
      text.attr({
        'font-family': labelFontFamily,
        'font-weight': 'bold',
        'font-size': 12
      });
    });

    drawInternals();
    drawTerminals();

    var svg = paper
      .toString()
      .replace(/>/g, '>\r')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    paper.clear();
    return svg;

    // we need to define the height of the line.
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
      for (let i = from; i < to; i++) {
        residues[i].usedSlots[counter] = true;
      }
      return counter;
    }

    function drawTerminals() {
      for (var result of results) {
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
          const line = paper.line(
            residue.xTo + spaceBetweenResidues / 2,
            residue.y,
            residue.xTo + spaceBetweenResidues / 2,
            residue.y - 8
          );
          line.attr({ stroke: result.color, 'stroke-width': strokeWidth });
          if (nTerminal) {
            const line = paper.line(
              residue.xTo + spaceBetweenResidues / 2,
              residue.y,
              residue.xTo + spaceBetweenResidues / 2 - 5,
              residue.y + 5
            );
            line.attr({ stroke: result.color, 'stroke-width': strokeWidth });
            drawLabel(
              result,
              residue.xTo + spaceBetweenResidues / 2 - 15,
              residue.y + 12 + residue.bottomPosition * labelSize
            );
            residue.bottomPosition++;
          } else {
            const line = paper.line(
              residue.xTo + spaceBetweenResidues / 2,
              residue.y - 8,
              residue.xTo + spaceBetweenResidues / 2 + 5,
              residue.y - 13
            );
            line.attr({ stroke: result.color, 'stroke-width': strokeWidth });
            drawLabel(
              result,
              residue.xTo + spaceBetweenResidues / 2,
              residue.y - 15 - residue.topPosition * labelSize
            );
            residue.topPosition++;
          }
        }
      }
    }

    function drawLabel(result, x, y) {
      if (!showLabels) return;
      var label = result.type;
      var similarity = Math.round(result.similarity);
      var charge = result.charge > 0 ? `+${result.charge}` : result.charge;
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
      for (var result of results) {
        if (result.internal) {
          var fromResidue = residues[result.from + 1];
          var toResidue = residues[result.to];
          // var charge = result.charge > 0 ? '+' + result.charge : result.charge;
          // var label = result.type + ' (' + charge + ', ' + Math.round(result.similarity) + '%)';
          // we need to check on how many lines we are
          var fromX, toX, y;
          for (var line = fromResidue.line; line <= toResidue.line; line++) {
            y =
              -10 -
              result.slot * spaceBetweenInteralLines +
              (line + 1) * rowHeight -
              verticalShiftForTerminalAnnotations;
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
              id: `line${fromResidue.nTer}-${toResidue.nTer}`
            });
            drawLine.attr({
              stroke: result.color,
              'stroke-width': strokeWidth
            });

            drawLabel(result, (fromX + toX) / 2 - 10, y - 2);

            // label = result.type + ' (' + Math.round(result.similarity) + '%)';
          }
        }
      }
    }

    function addScript(paper) {
      var script = ` // <![CDATA[
        function mouseOver(evt) {
            var targetRange=evt.target.id.replace(/^line/,'');
            var from=targetRange.replace(/-.*/,'')*1;
            var to=targetRange.replace(/.*-/,'')*1;
            var children=evt.target.parentNode.children;
            for (var child of children) {
                if (child.nodeName === 'text' && child.id.startsWith("residue")) {
                    var residueNumber=child.id.replace(/residue-/,'')*1;
                    if (residueNumber>=from && residueNumber<=to) {
                        child.setAttribute('fill','red');
                    }
                }
            }
        }
        function mouseOut(evt) {
            var children=evt.target.parentNode.children;
            for (var child of children) {
                if (child.nodeName === 'text' && child.id.startsWith("residue")) {
                    child.setAttribute('fill','black');
                }
            }
        }
     // ]]>
    `;
      var scriptElement = paper.el('script', {
        type: 'application/ecmascript'
      });
      scriptElement.node.textContent = script;
    }
  }

  return getSVG;
});
