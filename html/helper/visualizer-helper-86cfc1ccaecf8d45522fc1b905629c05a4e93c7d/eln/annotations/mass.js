function toAnnotations(peaks, options = {}) {
  var {
    fillColor = 'green',
    strokeColor = 'red',
    yPosition = undefined,
  } = options;

  if (!peaks) return [];
  let shouldRefresh = false;

  const annotations = [];
  for (const peak of peaks) {
    if (!peak._highlight) {
      Object.defineProperty(peak, '_highlight', {
        enumerable: false,
        writable: true,
      });
      peak._highlight = Math.random();
      shouldRefresh = true;
    }

    var annotation = {
      line: 1,
      _highlight: [peak._highlight],
      type: 'rect',
      strokeColor: strokeColor,
      strokeWidth: 0,
      fillColor: fillColor,
    };
    annotation.label = [
      {
        text: Number(peak.mass).toFixed(1),
        size: '18px',
        anchor: 'middle',
        color: 'red',
        position: {
          x: peak.mass,
          y: yPosition === undefined ? peak.intensity : yPosition,
          dy: '-22px',
        },
      },
    ];
    annotation.position = [
      {
        x: peak.mass - 1,
        y: yPosition === undefined ? peak.intensity : yPosition,
        dy: '-20px',
      },
      {
        x: peak.mass + 1,
        y: yPosition === undefined ? peak.intensity : yPosition,
        dy: '-10px',
      },
    ];

    if (peak.assignment) {
      annotation.label.push({
        text: peak.assignment,
        size: '18px',
        anchor: 'left',
        color: 'green',
        position: {
          x: peak.mass,
          y: yPosition === undefined ? peak.intensity : yPosition,
          dy: '2px',
        },
      });
    }

    annotations.push(annotation);
  }

  if (shouldRefresh) {
    peaks.triggerChange();
  }

  return annotations;
}

module.exports = toAnnotations;
