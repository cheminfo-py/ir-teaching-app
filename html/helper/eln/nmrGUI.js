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
  let isChanged = false;
  if (ranges && Array.isArray(ranges)) {
    for (let range of ranges) {
      if (!range._highlight) {
        Object.defineProperty(range, '_highlight', {
          value: [],
          enumerable: false,
          writable: true
        });
      }
      // assignment can only be done at the level of a signal !
      if (range.signal) {
        let newHighlight = [];

        for (let signal of range.signal) {
          if (!signal._highlight) {
            Object.defineProperty(signal, '_highlight', {
              enumerable: false,
              writable: true
            });
          }
          signal._highlight = signal.diaID;
          if (signal.diaID) {
            if (Array.isArray(signal.diaID)) {
              for (let diaID of signal.diaID) {
                newHighlight.push(diaID);
              }
            } else {
              newHighlight.push(signal.diaID);
            }
          }
        }
        // there is some newHighlight and before it was just a random number
        // or the highlight changed
        if (
          (newHighlight.length > 0 &&
            range._highlight.length > 0 &&
            range._highlight[0].match(/^[0-9.]+$/)) ||
          (newHighlight.length !== 0 &&
            range._highlight.join('.') !== newHighlight.join('.')) ||
          (newHighlight.length === 0 &&
            range._highlight.length > 0 &&
            !range._highlight[0].match(/^[0-9.]+$/))
        ) {
          range._highlight = newHighlight;
          isChanged = true;
        }
      }
      // is there is still no highlight ... we just add a random number
      if (range._highlight.length === 0) {
        range._highlight.push(String(Math.random()));
        isChanged = true;
      }
    }
  }
  return isChanged;
}

function annotations1D(ranges, optionsG) {
  var options = Object.assign({}, options1D, optionsG);
  let { height, line, dy = [0, 0], y } = options;
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
      for (let signal of currentRange.signal) {
        if (signal._highlight) {
          if (signal._highlight instanceof Array) {
            annotation._highlight.push(...signal._highlight);
          } else {
            annotation._highlight.push(signal._highlight);
          }
        }
      }
    }

    if (
      (typeof currentRange.to === 'undefined' ||
        typeof currentRange.from === 'undefined' ||
        currentRange.to === currentRange.from) &&
      (currentRange.signal && currentRange.signal.length > 0)
    ) {
      annotation.position = [
        {
          x: currentRange.signal[0].delta - options.width,
          y: `${options.line * height}px`
        },
        {
          x: currentRange.signal[0].delta + options.width,
          y: `${options.line * height + 8}px`
        }
      ];
    } else {
      annotation.position = [
        {
          x: currentRange.to,
          y: y ? y[0] : `${options.line * height}px`,
          dy: dy[0]
        },
        {
          x: currentRange.from,
          y: y ? y[1] : `${options.line * height + 5}px`,
          dy: dy[1]
        }
      ];
    }

    annotation.type = options.type;
    let labelColor = 'lightgrey';
    if (!options.noLabel && currentRange.integral) {
      if (
        !currentRange.kind ||
        (String(currentRange.kind) !== 'solvent' &&
          String(currentRange.kind) !== 'reference' &&
          String(currentRange.kind) !== 'impurity' &&
          String(currentRange.kind) !== 'standard')
      ) {
        labelColor = options.labelColor;
      }

      annotation.label = {
        text: Number(currentRange.integral).toFixed(options.toFixed),
        size: '11px',
        anchor: 'middle',
        color: labelColor,
        position: {
          x: (annotation.position[0].x + annotation.position[1].x) / 2,
          dy: `${height + 20}px`
        }
      };
    }
    annotation.selectable = options.selectable;
    annotation.strokeColor = options.strokeColor;
    annotation.strokeWidth = options.strokeWidth;
    annotation.fillColor = options.fillColor;
  }

  // we could shift the annotations to prevent overlap
  if (options.zigzag) {
    annotations.sort((a, b) => b.position[0].x - a.position[0].x);
    annotations.forEach((a, i) => {
      a.position[0].dy = `${25 * (i % 2)}px;`;
      a.position[1].dy = `${25 * (i % 2)}px;`;
      if (a.label) {
        a.label.position.dy = `${25 * (i % 2) + height + 20}px`;
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

    annotation.position = [
      {
        x: signal.fromTo[0].from - 0.01,
        y: signal.fromTo[1].from - 0.01,
        dx: options.width,
        dy: options.height
      },
      { x: signal.fromTo[0].to + 0.01, y: signal.fromTo[1].to + 0.01 }
    ];
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

export { annotations2D, annotations1D, ensureRangesHighlight };
