import { convert } from '../eln/libs/jcampconverter';

import { Conrec } from './conrec';

export class Spectrum2D {
  constructor(minMax) {
    this.currentLevelPositive = 10;
    this.currentLevelNegative = 10;
    const xs = getRange(minMax.minX, minMax.maxX, minMax.z[0].length);
    const ys = getRange(minMax.minY, minMax.maxY, minMax.z.length);
    this.conrec = new Conrec(minMax.z, { xs, ys, swapAxes: false });
    this.median = minMax.noise;
    this.minMax = minMax;
  }

  wheel(value) {
    const sign = Math.sign(value);
    if (
      (this.currentLevelPositive > 0 && sign === -1) ||
      (this.currentLevelPositive < 21 && sign === 1)
    ) {
      this.currentLevelPositive += sign;
    }
    if (
      (this.currentLevelNegative > 0 && sign === -1) ||
      (this.currentLevelNegative < 21 && sign === 1)
    ) {
      this.currentLevelNegative += sign;
    }
  }

  shiftWheel(value) {
    const sign = Math.sign(value);
    if (
      (this.currentLevelNegative === 0 && sign === -1) ||
      (this.currentLevelNegative > 20 && sign === 1)
    ) {
      return;
    }
    this.currentLevelNegative += sign;
  }

  createContours(options = {}) {
    const {
      timeout = 1000,
      nbPositiveLevels = 10,
      nbNegativeLevels = 10,
    } = options;
    let zoomPositive = this.currentLevelPositive / 2 + 1;
    let zoomNegative = this.currentLevelNegative / 2 + 1;
    const chart = {
      data: [
        {
          type: 'contour',
          contourLines: this.getContours(zoomPositive, {
            negative: false,
            timeout,
            nbLevels: nbPositiveLevels,
          }),
        },
        {
          type: 'contour',
          contourLines: this.getContours(zoomNegative, {
            negative: true,
            timeout,
            nbLevels: nbNegativeLevels,
          }),
        },
      ],
    };
    return chart;
  }

  getContours(zoomLevel, options = {}) {
    const { negative = false, timeout = 1000, nbLevels = 10 } = options;
    const max = Math.max(
      Math.abs(this.minMax.maxZ),
      Math.abs(this.minMax.minZ),
    );
    let range = getRange(
      this.median * 3 * Math.pow(2, zoomLevel),
      max,
      nbLevels,
      2,
    );
    if (negative) {
      range = range.map((value) => -value);
    }

    const contours = this.conrec.drawContour({
      levels: range,
      timeout: timeout,
    });
    return {
      minX: this.minMax.minX,
      maxX: this.minMax.maxX,
      minY: this.minMax.minY,
      maxY: this.minMax.maxY,
      segments: contours,
    };
  }
}

export async function fromJcamp(jcamp) {
  const parsed = await convert(jcamp, {
    noContour: true,
  }).flatten[0];
  return new Spectrum2D(parsed.minMax);
}

function getRange(min, max, length, exp) {
  if (exp) {
    let factors = [];
    factors[0] = 0;
    for (let i = 1; i <= length; i++) {
      factors[i] = factors[i - 1] + (exp - 1) / Math.pow(exp, i);
    }
    const lastFactor = factors[length];
    var result = new Array(length);
    for (let i = 0; i < length; i++) {
      result[i] = (max - min) * (1 - factors[i + 1] / lastFactor) + min;
    }
    return result;
  } else {
    const step = (max - min) / (length - 1);
    return range(min, max + step / 2, step);
  }
}

function range(from, to, step) {
  const result = [];
  for (let i = from; i < to; i += step) result.push(i);
  return result;
}
