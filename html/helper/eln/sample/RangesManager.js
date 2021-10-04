import API from 'src/util/api';

export class RangesManager {
  constructor(ranges, options = {}) {
    this.ranges = ranges;
    this.currentRange = undefined;
    this.ensureLabel = options.ensureLabel;
  }

  processAction(action) {
    if (
      !action.value.event.altKey ||
      action.value.event.shiftKey ||
      action.value.event.ctrlKey
    ) {
      return;
    }
    let track;
    if (action.value && action.value.data) {
      let firstChart = Object.keys(action.value.data)[0];
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

  updateAnnotations(track) {
    if (!this.ranges || this.ranges.length === 0) {
      API.createData('rangeAnnotations', []);
      return;
    }
    let annotations = [];
    let updateHighlight = false;
    for (let range of this.ranges) {
      if (!range._highlight) {
        updateHighlight = true;
        Object.defineProperty(range, '_highlight', {
          enumerable: false,
          value: Math.random()
        });
      }
      if (range.to) {
        let annotation = {
          position: [{ x: range.from, y: '15px' }, { x: range.to, y: '20px' }],
          type: 'rect',
          fillColor: 'red',
          strokeColor: 'red',
          _highlight: [range._highlight],
          info: range
        };
        if (range.label) {
          annotation.label = [
            {
              text: range.label,
              size: '18px',
              anchor: 'middle',
              color: 'red',
              position: {
                x: (range.from + range.to) / 2,
                y: '10px'
              }
            }
          ];
        }
        annotations.push(annotation);
      }
      if (updateHighlight) {
        API.getData('ranges').triggerChange();
      }
    }
    if (track && this.currentRange && !this.currentRange.to) {
      annotations.push({
        position: [
          { x: this.currentRange.from, y: '15px' },
          { x: track.xClosest, y: '20px' }
        ],
        type: 'rect',
        fillColor: 'green',
        strokeColor: 'green'
      });
    }
    API.createData('rangeAnnotations', annotations);
  }

  setLabel(currentRange) {
    // look for the first letter not used
    let current = 65;
    label: while (current < 91) {
      for (let range of this.ranges) {
        if (range.label && range.label.charCodeAt(0) === current) {
          current++;
          continue label;
        }
      }
      currentRange.label = String.fromCharCode(current);
      return;
    }
  }

  updateRange(track) {
    if (this.currentRange) {
      this.currentRange.to = track.xClosest;
      checkFromTo(this.currentRange);
      this.currentRange = undefined;
    } else {
      let range = {};
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

  addRanges(ranges) {
    for (let range of ranges) {
      checkFromTo(range);
      if (!range.label) {
        this.manager.setLabel(range);
      }
      this.ranges.push(range);
    }
    this.ranges.triggerChange();
    this.updateAnnotations();
  }
}

function checkFromTo(range) {
  if (range.to === undefined) return;
  if (range.from > range.to) [range.from, range.to] = [range.to, range.from];
}

module.exports = RangesManager;
