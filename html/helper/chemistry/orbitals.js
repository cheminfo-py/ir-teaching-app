
define(['https://www.lactame.com/github/adobe-webplatform/Snap.svg/84fbff7d512c8145c522b71fc9c872cb0bcae49a/dist/snap.svg-min.js'], function (Snap) {
  var exports = {};

  var defaultOptions = {
    width: 1000,
    height: 600,
    leftRightMargin: 4,
    topBottomMargin: 4,
    fontSize: 30,
    rectWidth: 40,
    rectHeight: 25,
    rectMargin: 10,
    spinOuterMarginRatio: 1 / 4,
    arrowStrokeWidth: 3,
    arrowHeadSize: 3
  };


  var paper, svg, svgModifier;


  // Create svg
  function createSvg(electronicConfiguration, opts) {
    opts = Object.assign({}, defaultOptions, opts);

    // User defined
    var width = opts.width;
    var height = opts.height;
    var leftRightMargin = opts.leftRightMargin;
    var topBottomMargin = opts.topBottomMargin;
    var fontSize = opts.fontSize;
    var rectWidth = opts.rectWidth;
    var rectHeight = opts.rectHeight;
    var rectMargin = opts.rectMargin;
    var spinOuterMarginRatio = opts.spinOuterMarginRatio;
    var arrowStrokeWidth = opts.arrowStrokeWidth;
    var arrowHeadSize = opts.arrowHeadSize;

    // Calculated
    var drawWidth = width - 2 * leftRightMargin;
    var drawHeight = height - 2 * topBottomMargin;
    var levelHeight = fontSize + rectHeight;
    var sSpace = (drawHeight - levelHeight) / 6;
    var labelOffset = rectHeight + fontSize + 5;
    var columnOffset = (drawWidth - 16 * rectWidth - 12 * rectMargin) / 3;
    var pOffset = [sSpace / 4, null, sSpace * 5 - sSpace / 3, rectWidth + columnOffset];
    var dOffset = [2 * sSpace / 4, null, sSpace * 3 - sSpace / 3, 4 * rectWidth + 2 * rectMargin + 2 * columnOffset];
    var fOffset = [-1 / 4 * sSpace, null, 3 / 4 * sSpace, 9 * rectWidth + 6 * rectMargin + 3 * columnOffset];
    var spinOuterMargin = rectWidth * spinOuterMarginRatio;
    var spinInnerMargin = rectWidth * (1 - 2 * spinOuterMarginRatio);

    function drawElectrons(elConfig) {
      elConfig = parseelConfig(elConfig);
      for (var i = 0; i < elConfig.length; i++) {
        var layer = elConfig[i].layer;
        var electrons = elConfig[i].electrons;
        for (var j = 0; j < electrons; j++) {
          drawElectron(layer, j);
        }
      }
    }

    function drawElectron(layer, electron) {
      var group = getElectronGroup(layer, electron);
      var spin = getElectronSpin(layer, electron);
      var p;
      if (spin > 0) {
        p = `M${spinOuterMargin},${rectHeight - 1} ${spinOuterMargin},${2 * arrowHeadSize + 1}`;
      } else {
        var margin = spinOuterMargin + spinInnerMargin;
        p = `M${margin},2 ${margin},${rectHeight - (2 * arrowHeadSize + 1)}`;
      }

      if (group) {
        paper.path(p).attr({
          style: 'marker-end: url(#svgarrow);',
          strokeWidth: arrowStrokeWidth,
          stroke: '#000000',
          dataClass: 'spin'
        }).appendTo(group);
      }
    }

    function drawRect(posx, posy, id) {
      var rectId = getRectId(id);
      paper.g().attr({
        transform: `translate(${posx},${posy})`,
        id: `g${rectId}`
      }).rect(0, 0, rectWidth, rectHeight).attr({
        fill: 'white',
        stroke: 'grey',
        strokeWidth: 1,
        id: rectId,
        class: 'elecRect'
      });

      svgModifier.push({
        selector: `#${rectId}`,
        info: {
          quanticNumbers: getQuanticNumbers(id)
        }
      });
    }

    function drawText(posx, posy, text) {
      paper.text(posx, posy, text).attr({
        fontSize,
        textAnchor: 'middle',
        dataTest: 'abc'
      });
    }

    svgModifier = [];
    paper = Snap(width, height);

    paper.path('M 0 0 L 10 4 L 0 8 z').marker(0, 0, arrowHeadSize, arrowHeadSize, 1, 4).attr({
      id: 'svgarrow',
      viewBox: '0 0 10 8'
    });

    var i, j, x, y, label;


    // s
    for (i = 0; i < 7; i++) {
      label = `${7 - i}s`;
      var w = drawHeight - levelHeight;
      drawRect(leftRightMargin, i * w / 6 + topBottomMargin, `${label}1`);
      drawText(leftRightMargin + rectWidth / 2, i * w / 6 + labelOffset, label);
    }


    // p
    for (i = 0; i < 6; i++) {
      label = `${7 - i}p`;
      y = topBottomMargin + pOffset[0] + (i - 1) * (drawHeight - pOffset[0] - (drawHeight - pOffset[2])) / 4;
      for (j = 0; j < 3; j++) {
        x = leftRightMargin + pOffset[3] + j * (rectWidth + rectMargin);
        drawRect(x, y, label + (j + 1));
      }
      x = leftRightMargin + pOffset[3] + 1.5 * (rectWidth + rectMargin);
      drawText(x, y + labelOffset, label);
    }

    // d
    for (i = 0; i < 4; i++) {
      label = `${6 - i}d`;
      y = topBottomMargin + dOffset[0] + (i - 1) * (drawHeight - dOffset[0] - (drawHeight - dOffset[2])) / 2;
      for (j = 0; j < 5; j++) {
        x = leftRightMargin + dOffset[3] + j * (rectWidth + rectMargin);
        drawRect(x, y, label + (j + 1));
      }
      x = leftRightMargin + dOffset[3] + 2.5 * (rectWidth + rectMargin);
      drawText(x, y + labelOffset, label);
    }

    // f
    for (i = 0; i < 2; i++) {
      label = `${5 - i}f`;
      y = topBottomMargin + fOffset[0] + i * (drawHeight - fOffset[0] - (drawHeight - fOffset[2]));
      for (j = 0; j < 7; j++) {
        x = leftRightMargin + fOffset[3] + j * (rectWidth + rectMargin);
        drawRect(x, y, label + (j + 1));
      }
      x = leftRightMargin + fOffset[3] + 3.5 * (rectWidth + rectMargin);
      drawText(x, y + labelOffset, label);
    }

    drawElectrons(electronicConfiguration);

    svg = paper.toString();
    paper.remove();
  }


  // utils
  function getRectId(elConfig) {
    var q = getQuanticNumbers(elConfig);
    return `l${q.l}_m${q.m}_n${q.n}`;
  }

  function parseelConfig(elConfig) {
    elConfig = elConfig.split(' ');
    elConfig = elConfig.map(function (o) {
      var m = o.match(/^(\d\w)(\d+)/);
      return {
        layer: m[1],
        electrons: +m[2]
      };
    });
    return elConfig;
  }


  function getQuanticNumbers(elConfig) {
    elConfig = elConfig.split(' ');
    elConfig = elConfig[elConfig.length - 1];
    var ma = elConfig.match(/^(\d)(\w)(\d+)/);
    var n = +ma[1];
    var l = ma[2];
    var m = +ma[3];

    switch (l) {
      case 's':
        l = 0;
        break;
      case 'p':
        l = 1;
        break;
      case 'd':
        l = 2;
        break;
      case 'f':
        l = 3;
        break;
      default:
        throw new Error(`Unexpected l: ${l}`);
    }

    var num = l * 2 + 1;
    m = (m - 1) % num - l;
    return { l, m, n };
  }

  function getLayerNum(layer) {
    var l = layer[layer.length - 1].toLowerCase();
    switch (l) {
      case 's':
        return 1;
      case 'p':
        return 3;
      case 'd':
        return 5;
      case 'f':
        return 7;
      default:
        throw new Error(`Wrong layer: ${l}`);
    }
  }

  function getElectronGroup(layer, electron) {
    var id = getRectId(layer + (electron + 1));
    return paper.select(`#g${id}`);
  }

  function getElectronSpin(layer, electron) {
    var num = getLayerNum(layer);
    return Math.floor(electron / num) === 0 ? 1 : -1;
  }


  exports.getSvg = function (...args) {
    createSvg(args);
    return svg;
  };
  exports.getSvgAndModifier = function (...args) {
    createSvg(args);
    return { svg, svgModifier };
  };

  exports.getQuanticNumbers = getQuanticNumbers;

  return exports;
});

