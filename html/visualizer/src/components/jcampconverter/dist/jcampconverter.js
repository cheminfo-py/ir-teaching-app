/**
 * jcampconverter - Parse and convert JCAMP data
 * @version v7.3.0
 * @link https://github.com/cheminfo-js/jcampconverter#readme
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.JcampConverter = {}));
}(this, (function (exports) { 'use strict';

  function createTree(jcamp, options = {}) {
    const {
      flatten = false
    } = options;

    if (typeof jcamp !== 'string') {
      throw new TypeError('the JCAMP should be a string');
    }

    let lines = jcamp.split(/[\r\n]+/);
    let flat = [];
    let stack = [];
    let result = [];
    let current;
    let ntupleLevel = 0;
    let spaces = jcamp.includes('## ');

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let labelLine = spaces ? line.replace(/ /g, '') : line;

      if (labelLine.substring(0, 9) === '##NTUPLES') {
        ntupleLevel++;
      }

      if (labelLine.substring(0, 7) === '##TITLE') {
        let title = [labelLine.substring(8).trim()];

        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].startsWith('##')) {
            break;
          } else {
            title.push(lines[j].trim());
          }
        }

        stack.push({
          title: title.join('\n'),
          jcamp: `${line}\n`,
          children: []
        });
        current = stack[stack.length - 1];
        flat.push(current);
      } else if (labelLine.substring(0, 5) === '##END' && ntupleLevel === 0) {
        current.jcamp += `${line}\n`;
        let finished = stack.pop();

        if (stack.length !== 0) {
          current = stack[stack.length - 1];
          current.children.push(finished);
        } else {
          current = undefined;
          result.push(finished);
        }
      } else if (current && current.jcamp) {
        current.jcamp += `${line}\n`;
        let match = labelLine.match(/^##(.*?)=(.+)/);

        if (match) {
          let canonicDataLabel = match[1].replace(/[ _-]/g, '').toUpperCase();

          if (canonicDataLabel === 'DATATYPE') {
            current.dataType = match[2].trim();
          }
        }
      }

      if (labelLine.substring(0, 5) === '##END' && ntupleLevel > 0) {
        ntupleLevel--;
      }
    }

    if (flatten) {
      flat.forEach(entry => {
        entry.children = undefined;
      });
      return flat;
    } else {
      return result;
    }
  }

  const GC_MS_FIELDS = ['TIC', '.RIC', 'SCANNUMBER'];
  function complexChromatogram(result) {
    let spectra = result.spectra;
    let length = spectra.length;
    let chromatogram = {
      times: new Array(length),
      series: {
        ms: {
          dimension: 2,
          data: new Array(length)
        }
      }
    };
    let existingGCMSFields = [];

    for (let i = 0; i < GC_MS_FIELDS.length; i++) {
      let label = convertMSFieldToLabel(GC_MS_FIELDS[i]);

      if (spectra[0][label]) {
        existingGCMSFields.push(label);
        chromatogram.series[label] = {
          dimension: 1,
          data: new Array(length)
        };
      }
    }

    for (let i = 0; i < length; i++) {
      let spectrum = spectra[i];
      chromatogram.times[i] = spectrum.pageValue;

      for (let j = 0; j < existingGCMSFields.length; j++) {
        chromatogram.series[existingGCMSFields[j]].data[i] = parseFloat(spectrum[existingGCMSFields[j]]);
      }

      if (spectrum.data) {
        chromatogram.series.ms.data[i] = [spectrum.data.x, spectrum.data.y];
      }
    }

    result.chromatogram = chromatogram;
  }
  function isMSField(canonicDataLabel) {
    return GC_MS_FIELDS.indexOf(canonicDataLabel) !== -1;
  }
  function convertMSFieldToLabel(value) {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function convertToFloatArray(stringArray) {
    let floatArray = [];

    for (let i = 0; i < stringArray.length; i++) {
      floatArray.push(parseFloat(stringArray[i]));
    }

    return floatArray;
  }

  function fastParseXYData(spectrum, value) {
    // TODO need to deal with result
    //  console.log(value);
    // we check if deltaX is defined otherwise we calculate it
    let yFactor = spectrum.yFactor;
    let deltaX = spectrum.deltaX;
    spectrum.isXYdata = true;
    let currentData = {
      x: [],
      y: []
    };
    spectrum.data = currentData;
    let currentX = spectrum.firstX;
    let currentY = spectrum.firstY; // we skip the first line
    //

    let endLine = false;
    let ascii;
    let i = 0;

    for (; i < value.length; i++) {
      ascii = value.charCodeAt(i);

      if (ascii === 13 || ascii === 10) {
        endLine = true;
      } else {
        if (endLine) break;
      }
    } // we proceed taking the i after the first line


    let newLine = true;
    let isDifference = false;
    let isLastDifference = false;
    let lastDifference = 0;
    let isDuplicate = false;
    let inComment = false;
    let currentValue = 0; // can be a difference or a duplicate

    let lastValue = 0; // must be the real last value

    let isNegative = false;
    let inValue = false;
    let skipFirstValue = false;
    let decimalPosition = 0;

    for (; i <= value.length; i++) {
      if (i === value.length) ascii = 13;else ascii = value.charCodeAt(i);

      if (inComment) {
        // we should ignore the text if we are after $$
        if (ascii === 13 || ascii === 10) {
          newLine = true;
          inComment = false;
        }
      } else {
        // when is it a new value ?
        // when it is not a digit, . or comma
        // it is a number that is either new or we continue
        if (ascii <= 57 && ascii >= 48) {
          // a number
          inValue = true;

          if (decimalPosition > 0) {
            currentValue += (ascii - 48) / Math.pow(10, decimalPosition++);
          } else {
            currentValue *= 10;
            currentValue += ascii - 48;
          }
        } else if (ascii === 44 || ascii === 46) {
          // a "," or "."
          inValue = true;
          decimalPosition++;
        } else {
          if (inValue) {
            // need to process the previous value
            if (newLine) {
              newLine = false; // we don't check the X value
              // console.log("NEW LINE",isDifference, lastDifference);
              // if new line and lastDifference, the first value is just a check !
              // that we don't check ...

              if (isLastDifference) skipFirstValue = true;
            } else {
              // need to deal with duplicate and differences
              if (skipFirstValue) {
                skipFirstValue = false;
              } else {
                if (isDifference) {
                  lastDifference = isNegative ? 0 - currentValue : currentValue;
                  isLastDifference = true;
                  isDifference = false;
                } else if (!isDuplicate) {
                  lastValue = isNegative ? 0 - currentValue : currentValue;
                }

                let duplicate = isDuplicate ? currentValue - 1 : 1;

                for (let j = 0; j < duplicate; j++) {
                  if (isLastDifference) {
                    currentY += lastDifference;
                  } else {
                    currentY = lastValue;
                  }

                  currentData.x.push(currentX);
                  currentData.y.push(currentY * yFactor);
                  currentX += deltaX;
                }
              }
            }

            isNegative = false;
            currentValue = 0;
            decimalPosition = 0;
            inValue = false;
            isDuplicate = false;
          } // positive SQZ digits @ A B C D E F G H I (ascii 64-73)


          if (ascii < 74 && ascii > 63) {
            inValue = true;
            isLastDifference = false;
            currentValue = ascii - 64;
          } else if (ascii > 96 && ascii < 106) {
            // negative SQZ digits a b c d e f g h i (ascii 97-105)
            inValue = true;
            isLastDifference = false;
            currentValue = ascii - 96;
            isNegative = true;
          } else if (ascii === 115) {
            // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
            inValue = true;
            isDuplicate = true;
            currentValue = 9;
          } else if (ascii > 82 && ascii < 91) {
            inValue = true;
            isDuplicate = true;
            currentValue = ascii - 82;
          } else if (ascii > 73 && ascii < 83) {
            // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
            inValue = true;
            isDifference = true;
            currentValue = ascii - 73;
          } else if (ascii > 105 && ascii < 115) {
            // negative DIF digits j k l m n o p q r (ascii 106-114)
            inValue = true;
            isDifference = true;
            currentValue = ascii - 105;
            isNegative = true;
          } else if (ascii === 36 && value.charCodeAt(i + 1) === 36) {
            // $ sign, we need to check the next one
            inValue = true;
            inComment = true;
          } else if (ascii === 37) {
            // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
            inValue = true;
            isDifference = true;
            currentValue = 0;
            isNegative = false;
          } else if (ascii === 45) {
            // a "-"
            // check if after there is a number, decimal or comma
            let ascii2 = value.charCodeAt(i + 1);

            if (ascii2 >= 48 && ascii2 <= 57 || ascii2 === 44 || ascii2 === 46) {
              inValue = true;
              if (!newLine) isLastDifference = false;
              isNegative = true;
            }
          } else if (ascii === 13 || ascii === 10) {
            newLine = true;
            inComment = false;
          } // and now analyse the details ... space or tabulation
          // if "+" we just don't care

        }
      }
    }
  }

  const removeCommentRegExp = /\$\$.*/;
  const peakTableSplitRegExp = /[,\t ]+/;
  function parsePeakTable(spectrum, value, result) {
    spectrum.isPeaktable = true;

    if (!spectrum.variables || Object.keys(spectrum.variables) === 2) {
      parseXY(spectrum, value, result);
    } else {
      parseXYZ(spectrum, value, result);
    } // we will add the data in the variables


    if (spectrum.variables) {
      for (let key in spectrum.variables) {
        spectrum.variables[key].data = spectrum.data[key];
      }
    }
  }

  function parseXY(spectrum, value, result) {
    let currentData = {
      x: [],
      y: []
    };
    spectrum.data = currentData; // counts for around 20% of the time

    let lines = value.split(/,? *,?[;\r\n]+ */);

    for (let i = 1; i < lines.length; i++) {
      let values = lines[i].trim().replace(removeCommentRegExp, '').split(peakTableSplitRegExp);

      if (values.length % 2 === 0) {
        for (let j = 0; j < values.length; j = j + 2) {
          // takes around 40% of the time to add and parse the 2 values nearly exclusively because of parseFloat
          currentData.x.push(parseFloat(values[j]) * spectrum.xFactor);
          currentData.y.push(parseFloat(values[j + 1]) * spectrum.yFactor);
        }
      } else {
        result.logs.push(`Format error: ${values}`);
      }
    }
  }

  function parseXYZ(spectrum, value, result) {
    let currentData = {};
    let variables = Object.keys(spectrum.variables);
    let numberOfVariables = variables.length;
    variables.forEach(variable => currentData[variable] = []);
    spectrum.data = currentData; // counts for around 20% of the time

    let lines = value.split(/,? *,?[;\r\n]+ */);

    for (let i = 1; i < lines.length; i++) {
      let values = lines[i].trim().replace(removeCommentRegExp, '').split(peakTableSplitRegExp);

      if (values.length % numberOfVariables === 0) {
        for (let j = 0; j < values.length; j++) {
          // todo should try to find a xFactor (y, ...)
          currentData[variables[j % numberOfVariables]].push(parseFloat(values[j]));
        }
      } else {
        result.logs.push(`Format error: ${values}`);
      }
    }
  }

  function parseXYA(spectrum, value) {
    let removeSymbolRegExp = /(\(+|\)+|<+|>+|\s+)/g;
    spectrum.isXYAdata = true;
    let values;
    let currentData = {
      x: [],
      y: []
    };
    spectrum.data = currentData;
    let lines = value.split(/,? *,?[;\r\n]+ */);

    for (let i = 1; i < lines.length; i++) {
      values = lines[i].trim().replace(removeSymbolRegExp, '').split(',');
      currentData.x.push(parseFloat(values[0]));
      currentData.y.push(parseFloat(values[1]));
    }
  }

  const toString = Object.prototype.toString;

  function isAnyArray(object) {
    return toString.call(object).endsWith('Array]');
  }

  var src = isAnyArray;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var medianQuickselect_min = createCommonjsModule(function (module) {
    (function () {
      function a(d) {
        for (var e = 0, f = d.length - 1, g = void 0, h = void 0, i = void 0, j = c(e, f); !0;) {
          if (f <= e) return d[j];
          if (f == e + 1) return d[e] > d[f] && b(d, e, f), d[j];

          for (g = c(e, f), d[g] > d[f] && b(d, g, f), d[e] > d[f] && b(d, e, f), d[g] > d[e] && b(d, g, e), b(d, g, e + 1), h = e + 1, i = f; !0;) {
            do h++; while (d[e] > d[h]);

            do i--; while (d[i] > d[e]);

            if (i < h) break;
            b(d, h, i);
          }

          b(d, e, i), i <= j && (e = h), i >= j && (f = i - 1);
        }
      }

      var b = function b(d, e, f) {
        var _ref;

        return _ref = [d[f], d[e]], d[e] = _ref[0], d[f] = _ref[1], _ref;
      },
          c = function c(d, e) {
        return ~~((d + e) / 2);
      };

       module.exports ? module.exports = a : window.median = a;
    })();
  });

  /**
   * Computes the median of the given values
   * @param {Array<number>} input
   * @return {number}
   */

  function median(input) {
    if (!src(input)) {
      throw new TypeError('input must be an array');
    }

    if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    return medianQuickselect_min(input.slice());
  }

  function convertTo3DZ(spectra) {
    let minZ = spectra[0].data.y[0];
    let maxZ = minZ;
    let ySize = spectra.length;
    let xSize = spectra[0].data.x.length;
    let z = new Array(ySize);

    for (let i = 0; i < ySize; i++) {
      z[i] = spectra[i].data.y;

      for (let j = 0; j < xSize; j++) {
        let value = z[i][j];
        if (value < minZ) minZ = value;
        if (value > maxZ) maxZ = value;
      }
    }

    const firstX = spectra[0].data.x[0];
    const lastX = spectra[0].data.x[spectra[0].data.x.length - 1]; // has to be -2 because it is a 1D array [x,y,x,y,...]

    const firstY = spectra[0].pageValue;
    const lastY = spectra[ySize - 1].pageValue; // Because the min / max value are the only information about the matrix if we invert
    // min and max we need to invert the array

    if (firstX > lastX) {
      for (let spectrum of z) {
        spectrum.reverse();
      }
    }

    if (firstY > lastY) {
      z.reverse();
    }

    return {
      z: z,
      minX: Math.min(firstX, lastX),
      maxX: Math.max(firstX, lastX),
      minY: Math.min(firstY, lastY),
      maxY: Math.max(firstY, lastY),
      minZ: minZ,
      maxZ: maxZ,
      noise: median(z[0].map(Math.abs))
    };
  }

  function generateContourLines(zData, options) {
    let noise = zData.noise;
    let z = zData.z;
    let povarHeight0, povarHeight1, povarHeight2, povarHeight3;
    let isOver0, isOver1, isOver2, isOver3;
    let nbSubSpectra = z.length;
    let nbPovars = z[0].length;
    let pAx, pAy, pBx, pBy;
    let x0 = zData.minX;
    let xN = zData.maxX;
    let dx = (xN - x0) / (nbPovars - 1);
    let y0 = zData.minY;
    let yN = zData.maxY;
    let dy = (yN - y0) / (nbSubSpectra - 1);
    let minZ = zData.minZ;
    let maxZ = zData.maxZ; // System.out.prvarln('y0 '+y0+' yN '+yN);
    // -------------------------
    // Povars attribution
    //
    // 0----1
    // |  / |
    // | /  |
    // 2----3
    //
    // ---------------------d------

    let iter = options.nbContourLevels * 2;
    let contourLevels = new Array(iter);
    let lineZValue;

    for (let level = 0; level < iter; level++) {
      // multiply by 2 for positif and negatif
      let contourLevel = {};
      contourLevels[level] = contourLevel;
      let side = level % 2;
      let factor = (maxZ - options.noiseMultiplier * noise) * Math.exp((level >> 1) - options.nbContourLevels);

      if (side === 0) {
        lineZValue = factor + options.noiseMultiplier * noise;
      } else {
        lineZValue = 0 - factor - options.noiseMultiplier * noise;
      }

      let lines = [];
      contourLevel.zValue = lineZValue;
      contourLevel.lines = lines;
      if (lineZValue <= minZ || lineZValue >= maxZ) continue;

      for (let iSubSpectra = 0; iSubSpectra < nbSubSpectra - 1; iSubSpectra++) {
        let subSpectra = z[iSubSpectra];
        let subSpectraAfter = z[iSubSpectra + 1];

        for (let povar = 0; povar < nbPovars - 1; povar++) {
          povarHeight0 = subSpectra[povar];
          povarHeight1 = subSpectra[povar + 1];
          povarHeight2 = subSpectraAfter[povar];
          povarHeight3 = subSpectraAfter[povar + 1];
          isOver0 = povarHeight0 > lineZValue;
          isOver1 = povarHeight1 > lineZValue;
          isOver2 = povarHeight2 > lineZValue;
          isOver3 = povarHeight3 > lineZValue; // Example povar0 is over the plane and povar1 and
          // povar2 are below, we find the varersections and add
          // the segment

          if (isOver0 !== isOver1 && isOver0 !== isOver2) {
            pAx = povar + (lineZValue - povarHeight0) / (povarHeight1 - povarHeight0);
            pAy = iSubSpectra;
            pBx = povar;
            pBy = iSubSpectra + (lineZValue - povarHeight0) / (povarHeight2 - povarHeight0);
            lines.push(pAx * dx + x0);
            lines.push(pAy * dy + y0);
            lines.push(pBx * dx + x0);
            lines.push(pBy * dy + y0);
          } // remove push does not help !!!!


          if (isOver3 !== isOver1 && isOver3 !== isOver2) {
            pAx = povar + 1;
            pAy = iSubSpectra + 1 - (lineZValue - povarHeight3) / (povarHeight1 - povarHeight3);
            pBx = povar + 1 - (lineZValue - povarHeight3) / (povarHeight2 - povarHeight3);
            pBy = iSubSpectra + 1;
            lines.push(pAx * dx + x0);
            lines.push(pAy * dy + y0);
            lines.push(pBx * dx + x0);
            lines.push(pBy * dy + y0);
          } // test around the diagonal


          if (isOver1 !== isOver2) {
            pAx = (povar + 1 - (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) * dx + x0;
            pAy = (iSubSpectra + (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) * dy + y0;

            if (isOver1 !== isOver0) {
              pBx = povar + 1 - (lineZValue - povarHeight1) / (povarHeight0 - povarHeight1);
              pBy = iSubSpectra;
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }

            if (isOver2 !== isOver0) {
              pBx = povar;
              pBy = iSubSpectra + 1 - (lineZValue - povarHeight2) / (povarHeight0 - povarHeight2);
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }

            if (isOver1 !== isOver3) {
              pBx = povar + 1;
              pBy = iSubSpectra + (lineZValue - povarHeight1) / (povarHeight3 - povarHeight1);
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }

            if (isOver2 !== isOver3) {
              pBx = povar + (lineZValue - povarHeight2) / (povarHeight3 - povarHeight2);
              pBy = iSubSpectra + 1;
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }
          }
        }
      }
    }

    return {
      minX: zData.minX,
      maxX: zData.maxX,
      minY: zData.minY,
      maxY: zData.maxY,
      segments: contourLevels
    };
  }

  function add2D(result, options) {
    let zData = convertTo3DZ(result.spectra);

    if (!options.noContour) {
      result.contourLines = generateContourLines(zData, options);
      delete zData.z;
    }

    result.minMax = zData;
  }

  function profiling(result, action, options) {
    if (result.profiling) {
      result.profiling.push({
        action,
        time: Date.now() - options.start
      });
    }
  }

  function simpleChromatogram(result) {
    let data = result.spectra[0].data;
    result.chromatogram = {
      times: data.x.slice(),
      series: {
        intensity: {
          dimension: 1,
          data: data.y.slice()
        }
      }
    };
  }

  var toStr = Object.prototype.toString;

  var isArguments = function isArguments(value) {
    var str = toStr.call(value);
    var isArgs = str === '[object Arguments]';

    if (!isArgs) {
      isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
    }

    return isArgs;
  };

  var has = Object.prototype.hasOwnProperty;
  var toStr$1 = Object.prototype.toString;
  var slice = Array.prototype.slice;
  var isEnumerable = Object.prototype.propertyIsEnumerable;
  var hasDontEnumBug = !isEnumerable.call({
    toString: null
  }, 'toString');
  var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
  var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];

  var equalsConstructorPrototype = function (o) {
    var ctor = o.constructor;
    return ctor && ctor.prototype === o;
  };

  var excludedKeys = {
    $applicationCache: true,
    $console: true,
    $external: true,
    $frame: true,
    $frameElement: true,
    $frames: true,
    $innerHeight: true,
    $innerWidth: true,
    $outerHeight: true,
    $outerWidth: true,
    $pageXOffset: true,
    $pageYOffset: true,
    $parent: true,
    $scrollLeft: true,
    $scrollTop: true,
    $scrollX: true,
    $scrollY: true,
    $self: true,
    $webkitIndexedDB: true,
    $webkitStorageInfo: true,
    $window: true
  };

  var hasAutomationEqualityBug = function () {
    /* global window */
    if (typeof window === 'undefined') {
      return false;
    }

    for (var k in window) {
      try {
        if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
          try {
            equalsConstructorPrototype(window[k]);
          } catch (e) {
            return true;
          }
        }
      } catch (e) {
        return true;
      }
    }

    return false;
  }();

  var equalsConstructorPrototypeIfNotBuggy = function (o) {
    /* global window */
    if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
      return equalsConstructorPrototype(o);
    }

    try {
      return equalsConstructorPrototype(o);
    } catch (e) {
      return false;
    }
  };

  var keysShim = function keys(object) {
    var isObject = object !== null && typeof object === 'object';
    var isFunction = toStr$1.call(object) === '[object Function]';
    var isArguments$1 = isArguments(object);
    var isString = isObject && toStr$1.call(object) === '[object String]';
    var theKeys = [];

    if (!isObject && !isFunction && !isArguments$1) {
      throw new TypeError('Object.keys called on a non-object');
    }

    var skipProto = hasProtoEnumBug && isFunction;

    if (isString && object.length > 0 && !has.call(object, 0)) {
      for (var i = 0; i < object.length; ++i) {
        theKeys.push(String(i));
      }
    }

    if (isArguments$1 && object.length > 0) {
      for (var j = 0; j < object.length; ++j) {
        theKeys.push(String(j));
      }
    } else {
      for (var name in object) {
        if (!(skipProto && name === 'prototype') && has.call(object, name)) {
          theKeys.push(String(name));
        }
      }
    }

    if (hasDontEnumBug) {
      var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

      for (var k = 0; k < dontEnums.length; ++k) {
        if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
          theKeys.push(dontEnums[k]);
        }
      }
    }

    return theKeys;
  };

  keysShim.shim = function shimObjectKeys() {
    if (Object.keys) {
      var keysWorksWithArguments = function () {
        // Safari 5.0 bug
        return (Object.keys(arguments) || '').length === 2;
      }(1, 2);

      if (!keysWorksWithArguments) {
        var originalKeys = Object.keys;

        Object.keys = function keys(object) {
          // eslint-disable-line func-name-matching
          if (isArguments(object)) {
            return originalKeys(slice.call(object));
          } else {
            return originalKeys(object);
          }
        };
      }
    } else {
      Object.keys = keysShim;
    }

    return Object.keys || keysShim;
  };

  var objectKeys = keysShim;

  var getKeys = objectKeys.shim(); // COPY ERROR //

  // TYPED ARRAY FUNCTIONS //

  /**
  * Create functions for copying typed arrays.
  */


  var typedArrays = {
    'Int8Array': null,
    'Uint8Array': null,
    'Uint8ClampedArray': null,
    'Int16Array': null,
    'Uint16Array': null,
    'Int32Array': null,
    'Uint32Array': null,
    'Float32Array': null,
    'Float64Array': null
  };

  (function createTypedArrayFcns() {
    /* jshint evil:true */
    var keys = objectKeys(typedArrays);
    var len = keys.length;
    var key;
    var i;

    for (i = 0; i < len; i++) {
      key = keys[i];
      typedArrays[key] = new Function('arr', 'return new ' + key + '( arr );');
    }
  })(); // EXPORTS //

  var d3Array = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
       factory(exports) ;
    })(commonjsGlobal, function (exports) {

      function ascending(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
      }

      function bisector(compare) {
        if (compare.length === 1) compare = ascendingComparator(compare);
        return {
          left: function (a, x, lo, hi) {
            if (lo == null) lo = 0;
            if (hi == null) hi = a.length;

            while (lo < hi) {
              var mid = lo + hi >>> 1;
              if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
            }

            return lo;
          },
          right: function (a, x, lo, hi) {
            if (lo == null) lo = 0;
            if (hi == null) hi = a.length;

            while (lo < hi) {
              var mid = lo + hi >>> 1;
              if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
            }

            return lo;
          }
        };
      }

      function ascendingComparator(f) {
        return function (d, x) {
          return ascending(f(d), x);
        };
      }

      var ascendingBisect = bisector(ascending);
      var bisectRight = ascendingBisect.right;
      var bisectLeft = ascendingBisect.left;

      function descending(a, b) {
        return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
      }

      function number$1(x) {
        return x === null ? NaN : +x;
      }

      function variance(array, f) {
        var n = array.length,
            m = 0,
            a,
            d,
            s = 0,
            i = -1,
            j = 0;

        if (f == null) {
          while (++i < n) {
            if (!isNaN(a = number$1(array[i]))) {
              d = a - m;
              m += d / ++j;
              s += d * (a - m);
            }
          }
        } else {
          while (++i < n) {
            if (!isNaN(a = number$1(f(array[i], i, array)))) {
              d = a - m;
              m += d / ++j;
              s += d * (a - m);
            }
          }
        }

        if (j > 1) return s / (j - 1);
      }

      function deviation(array, f) {
        var v = variance(array, f);
        return v ? Math.sqrt(v) : v;
      }

      function extent(array, f) {
        var i = -1,
            n = array.length,
            a,
            b,
            c;

        if (f == null) {
          while (++i < n) if ((b = array[i]) != null && b >= b) {
            a = c = b;
            break;
          }

          while (++i < n) if ((b = array[i]) != null) {
            if (a > b) a = b;
            if (c < b) c = b;
          }
        } else {
          while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) {
            a = c = b;
            break;
          }

          while (++i < n) if ((b = f(array[i], i, array)) != null) {
            if (a > b) a = b;
            if (c < b) c = b;
          }
        }

        return [a, c];
      }

      function constant(x) {
        return function () {
          return x;
        };
      }

      function identity(x) {
        return x;
      }

      function range(start, stop, step) {
        start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
        var i = -1,
            n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
            range = new Array(n);

        while (++i < n) {
          range[i] = start + i * step;
        }

        return range;
      }

      var e10 = Math.sqrt(50);
      var e5 = Math.sqrt(10);
      var e2 = Math.sqrt(2);

      function ticks(start, stop, count) {
        var step = tickStep(start, stop, count);
        return range(Math.ceil(start / step) * step, Math.floor(stop / step) * step + step / 2, // inclusive
        step);
      }

      function tickStep(start, stop, count) {
        var step0 = Math.abs(stop - start) / Math.max(0, count),
            step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
            error = step0 / step1;
        if (error >= e10) step1 *= 10;else if (error >= e5) step1 *= 5;else if (error >= e2) step1 *= 2;
        return stop < start ? -step1 : step1;
      }

      function sturges(values) {
        return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
      }

      function number(x) {
        return +x;
      }

      function histogram() {
        var value = identity,
            domain = extent,
            threshold = sturges;

        function histogram(data) {
          var i,
              n = data.length,
              x,
              values = new Array(n); // Coerce values to numbers.

          for (i = 0; i < n; ++i) {
            values[i] = +value(data[i], i, data);
          }

          var xz = domain(values),
              x0 = +xz[0],
              x1 = +xz[1],
              tz = threshold(values, x0, x1); // Convert number of thresholds into uniform thresholds.

          if (!Array.isArray(tz)) tz = ticks(x0, x1, +tz); // Coerce thresholds to numbers, ignoring any outside the domain.

          var m = tz.length;

          for (i = 0; i < m; ++i) tz[i] = +tz[i];

          while (tz[0] <= x0) tz.shift(), --m;

          while (tz[m - 1] >= x1) tz.pop(), --m;

          var bins = new Array(m + 1),
              bin; // Initialize bins.

          for (i = 0; i <= m; ++i) {
            bin = bins[i] = [];
            bin.x0 = i > 0 ? tz[i - 1] : x0;
            bin.x1 = i < m ? tz[i] : x1;
          } // Assign data to bins by value, ignoring any outside the domain.


          for (i = 0; i < n; ++i) {
            x = values[i];

            if (x0 <= x && x <= x1) {
              bins[bisectRight(tz, x, 0, m)].push(data[i]);
            }
          }

          return bins;
        }

        histogram.value = function (_) {
          return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), histogram) : value;
        };

        histogram.domain = function (_) {
          return arguments.length ? (domain = typeof _ === "function" ? _ : constant([+_[0], +_[1]]), histogram) : domain;
        };

        histogram.thresholds = function (_) {
          if (!arguments.length) return threshold;
          threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(Array.prototype.map.call(_, number)) : constant(+_);
          return histogram;
        };

        return histogram;
      }

      function quantile(array, p, f) {
        if (f == null) f = number$1;
        if (!(n = array.length)) return;
        if ((p = +p) <= 0 || n < 2) return +f(array[0], 0, array);
        if (p >= 1) return +f(array[n - 1], n - 1, array);
        var n,
            h = (n - 1) * p,
            i = Math.floor(h),
            a = +f(array[i], i, array),
            b = +f(array[i + 1], i + 1, array);
        return a + (b - a) * (h - i);
      }

      function freedmanDiaconis(values, min, max) {
        values.sort(ascending);
        return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(values.length, -1 / 3)));
      }

      function scott(values, min, max) {
        return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
      }

      function max(array, f) {
        var i = -1,
            n = array.length,
            a,
            b;

        if (f == null) {
          while (++i < n) if ((b = array[i]) != null && b >= b) {
            a = b;
            break;
          }

          while (++i < n) if ((b = array[i]) != null && b > a) a = b;
        } else {
          while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) {
            a = b;
            break;
          }

          while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
        }

        return a;
      }

      function mean(array, f) {
        var s = 0,
            n = array.length,
            a,
            i = -1,
            j = n;

        if (f == null) {
          while (++i < n) if (!isNaN(a = number$1(array[i]))) s += a;else --j;
        } else {
          while (++i < n) if (!isNaN(a = number$1(f(array[i], i, array)))) s += a;else --j;
        }

        if (j) return s / j;
      }

      function median(array, f) {
        var numbers = [],
            n = array.length,
            a,
            i = -1;

        if (f == null) {
          while (++i < n) if (!isNaN(a = number$1(array[i]))) numbers.push(a);
        } else {
          while (++i < n) if (!isNaN(a = number$1(f(array[i], i, array)))) numbers.push(a);
        }

        return quantile(numbers.sort(ascending), 0.5);
      }

      function merge(arrays) {
        var n = arrays.length,
            m,
            i = -1,
            j = 0,
            merged,
            array;

        while (++i < n) j += arrays[i].length;

        merged = new Array(j);

        while (--n >= 0) {
          array = arrays[n];
          m = array.length;

          while (--m >= 0) {
            merged[--j] = array[m];
          }
        }

        return merged;
      }

      function min(array, f) {
        var i = -1,
            n = array.length,
            a,
            b;

        if (f == null) {
          while (++i < n) if ((b = array[i]) != null && b >= b) {
            a = b;
            break;
          }

          while (++i < n) if ((b = array[i]) != null && a > b) a = b;
        } else {
          while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) {
            a = b;
            break;
          }

          while (++i < n) if ((b = f(array[i], i, array)) != null && a > b) a = b;
        }

        return a;
      }

      function pairs(array) {
        var i = 0,
            n = array.length - 1,
            p = array[0],
            pairs = new Array(n < 0 ? 0 : n);

        while (i < n) pairs[i] = [p, p = array[++i]];

        return pairs;
      }

      function permute(array, indexes) {
        var i = indexes.length,
            permutes = new Array(i);

        while (i--) permutes[i] = array[indexes[i]];

        return permutes;
      }

      function scan(array, compare) {
        if (!(n = array.length)) return;
        var i = 0,
            n,
            j = 0,
            xi,
            xj = array[j];
        if (!compare) compare = ascending;

        while (++i < n) if (compare(xi = array[i], xj) < 0 || compare(xj, xj) !== 0) xj = xi, j = i;

        if (compare(xj, xj) === 0) return j;
      }

      function shuffle(array, i0, i1) {
        var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
            t,
            i;

        while (m) {
          i = Math.random() * m-- | 0;
          t = array[m + i0];
          array[m + i0] = array[i + i0];
          array[i + i0] = t;
        }

        return array;
      }

      function sum(array, f) {
        var s = 0,
            n = array.length,
            a,
            i = -1;

        if (f == null) {
          while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.

        } else {
          while (++i < n) if (a = +f(array[i], i, array)) s += a;
        }

        return s;
      }

      function transpose(matrix) {
        if (!(n = matrix.length)) return [];

        for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
          for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
            row[j] = matrix[j][i];
          }
        }

        return transpose;
      }

      function length(d) {
        return d.length;
      }

      function zip() {
        return transpose(arguments);
      }

      var version = "0.7.1";
      exports.version = version;
      exports.bisect = bisectRight;
      exports.bisectRight = bisectRight;
      exports.bisectLeft = bisectLeft;
      exports.ascending = ascending;
      exports.bisector = bisector;
      exports.descending = descending;
      exports.deviation = deviation;
      exports.extent = extent;
      exports.histogram = histogram;
      exports.thresholdFreedmanDiaconis = freedmanDiaconis;
      exports.thresholdScott = scott;
      exports.thresholdSturges = sturges;
      exports.max = max;
      exports.mean = mean;
      exports.median = median;
      exports.merge = merge;
      exports.min = min;
      exports.pairs = pairs;
      exports.permute = permute;
      exports.quantile = quantile;
      exports.range = range;
      exports.scan = scan;
      exports.shuffle = shuffle;
      exports.sum = sum;
      exports.ticks = ticks;
      exports.tickStep = tickStep;
      exports.transpose = transpose;
      exports.variance = variance;
      exports.zip = zip;
    });
  });

  var fftlib = createCommonjsModule(function (module, exports) {
    /**
     * Fast Fourier Transform module
     * 1D-FFT/IFFT, 2D-FFT/IFFT (radix-2)
     */
    var FFT = function () {
      var FFT;

      {
        FFT = exports; // for CommonJS
      }

      var version = {
        release: '0.3.0',
        date: '2013-03'
      };

      FFT.toString = function () {
        return "version " + version.release + ", released " + version.date;
      }; // core operations


      var _n = 0,
          // order
      _bitrev = null,
          // bit reversal table
      _cstb = null; // sin/cos table

      var core = {
        init: function (n) {
          if (n !== 0 && (n & n - 1) === 0) {
            _n = n;

            core._initArray();

            core._makeBitReversalTable();

            core._makeCosSinTable();
          } else {
            throw new Error("init: radix-2 required");
          }
        },
        // 1D-FFT
        fft1d: function (re, im) {
          core.fft(re, im, 1);
        },
        // 1D-IFFT
        ifft1d: function (re, im) {
          var n = 1 / _n;
          core.fft(re, im, -1);

          for (var i = 0; i < _n; i++) {
            re[i] *= n;
            im[i] *= n;
          }
        },
        // 1D-IFFT
        bt1d: function (re, im) {
          core.fft(re, im, -1);
        },
        // 2D-FFT Not very useful if the number of rows have to be equal to cols
        fft2d: function (re, im) {
          var tre = [],
              tim = [],
              i = 0; // x-axis

          for (var y = 0; y < _n; y++) {
            i = y * _n;

            for (var x1 = 0; x1 < _n; x1++) {
              tre[x1] = re[x1 + i];
              tim[x1] = im[x1 + i];
            }

            core.fft1d(tre, tim);

            for (var x2 = 0; x2 < _n; x2++) {
              re[x2 + i] = tre[x2];
              im[x2 + i] = tim[x2];
            }
          } // y-axis


          for (var x = 0; x < _n; x++) {
            for (var y1 = 0; y1 < _n; y1++) {
              i = x + y1 * _n;
              tre[y1] = re[i];
              tim[y1] = im[i];
            }

            core.fft1d(tre, tim);

            for (var y2 = 0; y2 < _n; y2++) {
              i = x + y2 * _n;
              re[i] = tre[y2];
              im[i] = tim[y2];
            }
          }
        },
        // 2D-IFFT
        ifft2d: function (re, im) {
          var tre = [],
              tim = [],
              i = 0; // x-axis

          for (var y = 0; y < _n; y++) {
            i = y * _n;

            for (var x1 = 0; x1 < _n; x1++) {
              tre[x1] = re[x1 + i];
              tim[x1] = im[x1 + i];
            }

            core.ifft1d(tre, tim);

            for (var x2 = 0; x2 < _n; x2++) {
              re[x2 + i] = tre[x2];
              im[x2 + i] = tim[x2];
            }
          } // y-axis


          for (var x = 0; x < _n; x++) {
            for (var y1 = 0; y1 < _n; y1++) {
              i = x + y1 * _n;
              tre[y1] = re[i];
              tim[y1] = im[i];
            }

            core.ifft1d(tre, tim);

            for (var y2 = 0; y2 < _n; y2++) {
              i = x + y2 * _n;
              re[i] = tre[y2];
              im[i] = tim[y2];
            }
          }
        },
        // core operation of FFT
        fft: function (re, im, inv) {
          var d,
              h,
              ik,
              m,
              tmp,
              wr,
              wi,
              xr,
              xi,
              n4 = _n >> 2; // bit reversal

          for (var l = 0; l < _n; l++) {
            m = _bitrev[l];

            if (l < m) {
              tmp = re[l];
              re[l] = re[m];
              re[m] = tmp;
              tmp = im[l];
              im[l] = im[m];
              im[m] = tmp;
            }
          } // butterfly operation


          for (var k = 1; k < _n; k <<= 1) {
            h = 0;
            d = _n / (k << 1);

            for (var j = 0; j < k; j++) {
              wr = _cstb[h + n4];
              wi = inv * _cstb[h];

              for (var i = j; i < _n; i += k << 1) {
                ik = i + k;
                xr = wr * re[ik] + wi * im[ik];
                xi = wr * im[ik] - wi * re[ik];
                re[ik] = re[i] - xr;
                re[i] += xr;
                im[ik] = im[i] - xi;
                im[i] += xi;
              }

              h += d;
            }
          }
        },
        // initialize the array (supports TypedArray)
        _initArray: function () {
          if (typeof Uint32Array !== 'undefined') {
            _bitrev = new Uint32Array(_n);
          } else {
            _bitrev = [];
          }

          if (typeof Float64Array !== 'undefined') {
            _cstb = new Float64Array(_n * 1.25);
          } else {
            _cstb = [];
          }
        },
        // zero padding
        _paddingZero: function () {// TODO
        },
        // makes bit reversal table
        _makeBitReversalTable: function () {
          var i = 0,
              j = 0,
              k = 0;
          _bitrev[0] = 0;

          while (++i < _n) {
            k = _n >> 1;

            while (k <= j) {
              j -= k;
              k >>= 1;
            }

            j += k;
            _bitrev[i] = j;
          }
        },
        // makes trigonometiric function table
        _makeCosSinTable: function () {
          var n2 = _n >> 1,
              n4 = _n >> 2,
              n8 = _n >> 3,
              n2p4 = n2 + n4,
              t = Math.sin(Math.PI / _n),
              dc = 2 * t * t,
              ds = Math.sqrt(dc * (2 - dc)),
              c = _cstb[n4] = 1,
              s = _cstb[0] = 0;
          t = 2 * dc;

          for (var i = 1; i < n8; i++) {
            c -= dc;
            dc += t * c;
            s += ds;
            ds -= t * s;
            _cstb[i] = s;
            _cstb[n4 - i] = c;
          }

          if (n8 !== 0) {
            _cstb[n8] = Math.sqrt(0.5);
          }

          for (var j = 0; j < n4; j++) {
            _cstb[n2 - j] = _cstb[j];
          }

          for (var k = 0; k < n2p4; k++) {
            _cstb[k + n2] = -_cstb[k];
          }
        }
      }; // aliases (public APIs)

      var apis = ['init', 'fft1d', 'ifft1d', 'fft2d', 'ifft2d'];

      for (var i = 0; i < apis.length; i++) {
        FFT[apis[i]] = core[apis[i]];
      }

      FFT.bt = core.bt1d;
      FFT.fft = core.fft1d;
      FFT.ifft = core.ifft1d;
      return FFT;
    }.call(commonjsGlobal);
  });

  var array = createCommonjsModule(function (module, exports) {

    function compareNumbers(a, b) {
      return a - b;
    }
    /**
     * Computes the sum of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.sum = function sum(values) {
      var sum = 0;

      for (var i = 0; i < values.length; i++) {
        sum += values[i];
      }

      return sum;
    };
    /**
     * Computes the maximum of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.max = function max(values) {
      var max = values[0];
      var l = values.length;

      for (var i = 1; i < l; i++) {
        if (values[i] > max) max = values[i];
      }

      return max;
    };
    /**
     * Computes the minimum of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.min = function min(values) {
      var min = values[0];
      var l = values.length;

      for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
      }

      return min;
    };
    /**
     * Computes the min and max of the given values
     * @param {Array} values
     * @returns {{min: number, max: number}}
     */


    exports.minMax = function minMax(values) {
      var min = values[0];
      var max = values[0];
      var l = values.length;

      for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
        if (values[i] > max) max = values[i];
      }

      return {
        min: min,
        max: max
      };
    };
    /**
     * Computes the arithmetic mean of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.arithmeticMean = function arithmeticMean(values) {
      var sum = 0;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        sum += values[i];
      }

      return sum / l;
    };
    /**
     * {@link arithmeticMean}
     */


    exports.mean = exports.arithmeticMean;
    /**
     * Computes the geometric mean of the given values
     * @param {Array} values
     * @returns {number}
     */

    exports.geometricMean = function geometricMean(values) {
      var mul = 1;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        mul *= values[i];
      }

      return Math.pow(mul, 1 / l);
    };
    /**
     * Computes the mean of the log of the given values
     * If the return value is exponentiated, it gives the same result as the
     * geometric mean.
     * @param {Array} values
     * @returns {number}
     */


    exports.logMean = function logMean(values) {
      var lnsum = 0;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        lnsum += Math.log(values[i]);
      }

      return lnsum / l;
    };
    /**
     * Computes the weighted grand mean for a list of means and sample sizes
     * @param {Array} means - Mean values for each set of samples
     * @param {Array} samples - Number of original values for each set of samples
     * @returns {number}
     */


    exports.grandMean = function grandMean(means, samples) {
      var sum = 0;
      var n = 0;
      var l = means.length;

      for (var i = 0; i < l; i++) {
        sum += samples[i] * means[i];
        n += samples[i];
      }

      return sum / n;
    };
    /**
     * Computes the truncated mean of the given values using a given percentage
     * @param {Array} values
     * @param {number} percent - The percentage of values to keep (range: [0,1])
     * @param {boolean} [alreadySorted=false]
     * @returns {number}
     */


    exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
      if (alreadySorted === undefined) alreadySorted = false;

      if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
      }

      var l = values.length;
      var k = Math.floor(l * percent);
      var sum = 0;

      for (var i = k; i < l - k; i++) {
        sum += values[i];
      }

      return sum / (l - 2 * k);
    };
    /**
     * Computes the harmonic mean of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.harmonicMean = function harmonicMean(values) {
      var sum = 0;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        if (values[i] === 0) {
          throw new RangeError('value at index ' + i + 'is zero');
        }

        sum += 1 / values[i];
      }

      return l / sum;
    };
    /**
     * Computes the contraharmonic mean of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.contraHarmonicMean = function contraHarmonicMean(values) {
      var r1 = 0;
      var r2 = 0;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        r1 += values[i] * values[i];
        r2 += values[i];
      }

      if (r2 < 0) {
        throw new RangeError('sum of values is negative');
      }

      return r1 / r2;
    };
    /**
     * Computes the median of the given values
     * @param {Array} values
     * @param {boolean} [alreadySorted=false]
     * @returns {number}
     */


    exports.median = function median(values, alreadySorted) {
      if (alreadySorted === undefined) alreadySorted = false;

      if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
      }

      var l = values.length;
      var half = Math.floor(l / 2);

      if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
      } else {
        return values[half];
      }
    };
    /**
     * Computes the variance of the given values
     * @param {Array} values
     * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
     * @returns {number}
     */


    exports.variance = function variance(values, unbiased) {
      if (unbiased === undefined) unbiased = true;
      var theMean = exports.mean(values);
      var theVariance = 0;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        var x = values[i] - theMean;
        theVariance += x * x;
      }

      if (unbiased) {
        return theVariance / (l - 1);
      } else {
        return theVariance / l;
      }
    };
    /**
     * Computes the standard deviation of the given values
     * @param {Array} values
     * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
     * @returns {number}
     */


    exports.standardDeviation = function standardDeviation(values, unbiased) {
      return Math.sqrt(exports.variance(values, unbiased));
    };

    exports.standardError = function standardError(values) {
      return exports.standardDeviation(values) / Math.sqrt(values.length);
    };
    /**
     * IEEE Transactions on biomedical engineering, vol. 52, no. 1, january 2005, p. 76-
     * Calculate the standard deviation via the Median of the absolute deviation
     *  The formula for the standard deviation only holds for Gaussian random variables.
     * @returns {{mean: number, stdev: number}}
     */


    exports.robustMeanAndStdev = function robustMeanAndStdev(y) {
      var mean = 0,
          stdev = 0;
      var length = y.length,
          i = 0;

      for (i = 0; i < length; i++) {
        mean += y[i];
      }

      mean /= length;
      var averageDeviations = new Array(length);

      for (i = 0; i < length; i++) averageDeviations[i] = Math.abs(y[i] - mean);

      averageDeviations.sort(compareNumbers);

      if (length % 2 === 1) {
        stdev = averageDeviations[(length - 1) / 2] / 0.6745;
      } else {
        stdev = 0.5 * (averageDeviations[length / 2] + averageDeviations[length / 2 - 1]) / 0.6745;
      }

      return {
        mean: mean,
        stdev: stdev
      };
    };

    exports.quartiles = function quartiles(values, alreadySorted) {
      if (typeof alreadySorted === 'undefined') alreadySorted = false;

      if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
      }

      var quart = values.length / 4;
      var q1 = values[Math.ceil(quart) - 1];
      var q2 = exports.median(values, true);
      var q3 = values[Math.ceil(quart * 3) - 1];
      return {
        q1: q1,
        q2: q2,
        q3: q3
      };
    };

    exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
      return Math.sqrt(exports.pooledVariance(samples, unbiased));
    };

    exports.pooledVariance = function pooledVariance(samples, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var sum = 0;
      var length = 0,
          l = samples.length;

      for (var i = 0; i < l; i++) {
        var values = samples[i];
        var vari = exports.variance(values);
        sum += (values.length - 1) * vari;
        if (unbiased) length += values.length - 1;else length += values.length;
      }

      return sum / length;
    };

    exports.mode = function mode(values) {
      var l = values.length,
          itemCount = new Array(l),
          i;

      for (i = 0; i < l; i++) {
        itemCount[i] = 0;
      }

      var itemArray = new Array(l);
      var count = 0;

      for (i = 0; i < l; i++) {
        var index = itemArray.indexOf(values[i]);
        if (index >= 0) itemCount[index]++;else {
          itemArray[count] = values[i];
          itemCount[count] = 1;
          count++;
        }
      }

      var maxValue = 0,
          maxIndex = 0;

      for (i = 0; i < count; i++) {
        if (itemCount[i] > maxValue) {
          maxValue = itemCount[i];
          maxIndex = i;
        }
      }

      return itemArray[maxIndex];
    };

    exports.covariance = function covariance(vector1, vector2, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var mean1 = exports.mean(vector1);
      var mean2 = exports.mean(vector2);
      if (vector1.length !== vector2.length) throw 'Vectors do not have the same dimensions';
      var cov = 0,
          l = vector1.length;

      for (var i = 0; i < l; i++) {
        var x = vector1[i] - mean1;
        var y = vector2[i] - mean2;
        cov += x * y;
      }

      if (unbiased) return cov / (l - 1);else return cov / l;
    };

    exports.skewness = function skewness(values, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var theMean = exports.mean(values);
      var s2 = 0,
          s3 = 0,
          l = values.length;

      for (var i = 0; i < l; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s3 += dev * dev * dev;
      }

      var m2 = s2 / l;
      var m3 = s3 / l;
      var g = m3 / Math.pow(m2, 3 / 2.0);

      if (unbiased) {
        var a = Math.sqrt(l * (l - 1));
        var b = l - 2;
        return a / b * g;
      } else {
        return g;
      }
    };

    exports.kurtosis = function kurtosis(values, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var theMean = exports.mean(values);
      var n = values.length,
          s2 = 0,
          s4 = 0;

      for (var i = 0; i < n; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s4 += dev * dev * dev * dev;
      }

      var m2 = s2 / n;
      var m4 = s4 / n;

      if (unbiased) {
        var v = s2 / (n - 1);
        var a = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
        var b = s4 / (v * v);
        var c = (n - 1) * (n - 1) / ((n - 2) * (n - 3));
        return a * b - 3 * c;
      } else {
        return m4 / (m2 * m2) - 3;
      }
    };

    exports.entropy = function entropy(values, eps) {
      if (typeof eps === 'undefined') eps = 0;
      var sum = 0,
          l = values.length;

      for (var i = 0; i < l; i++) sum += values[i] * Math.log(values[i] + eps);

      return -sum;
    };

    exports.weightedMean = function weightedMean(values, weights) {
      var sum = 0,
          l = values.length;

      for (var i = 0; i < l; i++) sum += values[i] * weights[i];

      return sum;
    };

    exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
      return Math.sqrt(exports.weightedVariance(values, weights));
    };

    exports.weightedVariance = function weightedVariance(values, weights) {
      var theMean = exports.weightedMean(values, weights);
      var vari = 0,
          l = values.length;
      var a = 0,
          b = 0;

      for (var i = 0; i < l; i++) {
        var z = values[i] - theMean;
        var w = weights[i];
        vari += w * (z * z);
        b += w;
        a += w * w;
      }

      return vari * (b / (b * b - a));
    };

    exports.center = function center(values, inPlace) {
      if (typeof inPlace === 'undefined') inPlace = false;
      var result = values;
      if (!inPlace) result = [].concat(values);
      var theMean = exports.mean(result),
          l = result.length;

      for (var i = 0; i < l; i++) result[i] -= theMean;
    };

    exports.standardize = function standardize(values, standardDev, inPlace) {
      if (typeof standardDev === 'undefined') standardDev = exports.standardDeviation(values);
      if (typeof inPlace === 'undefined') inPlace = false;
      var l = values.length;
      var result = inPlace ? values : new Array(l);

      for (var i = 0; i < l; i++) result[i] = values[i] / standardDev;

      return result;
    };

    exports.cumulativeSum = function cumulativeSum(array) {
      var l = array.length;
      var result = new Array(l);
      result[0] = array[0];

      for (var i = 1; i < l; i++) result[i] = result[i - 1] + array[i];

      return result;
    };
  });
  var array_1 = array.sum;
  var array_2 = array.max;
  var array_3 = array.min;
  var array_4 = array.minMax;
  var array_5 = array.arithmeticMean;
  var array_6 = array.mean;
  var array_7 = array.geometricMean;
  var array_8 = array.logMean;
  var array_9 = array.grandMean;
  var array_10 = array.truncatedMean;
  var array_11 = array.harmonicMean;
  var array_12 = array.contraHarmonicMean;
  var array_13 = array.median;
  var array_14 = array.variance;
  var array_15 = array.standardDeviation;
  var array_16 = array.standardError;
  var array_17 = array.robustMeanAndStdev;
  var array_18 = array.quartiles;
  var array_19 = array.pooledStandardDeviation;
  var array_20 = array.pooledVariance;
  var array_21 = array.mode;
  var array_22 = array.covariance;
  var array_23 = array.skewness;
  var array_24 = array.kurtosis;
  var array_25 = array.entropy;
  var array_26 = array.weightedMean;
  var array_27 = array.weightedStandardDeviation;
  var array_28 = array.weightedVariance;
  var array_29 = array.center;
  var array_30 = array.standardize;
  var array_31 = array.cumulativeSum;

  var matrix = createCommonjsModule(function (module, exports) {

    function compareNumbers(a, b) {
      return a - b;
    }

    exports.max = function max(matrix) {
      var max = -Infinity;

      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] > max) max = matrix[i][j];
        }
      }

      return max;
    };

    exports.min = function min(matrix) {
      var min = Infinity;

      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] < min) min = matrix[i][j];
        }
      }

      return min;
    };

    exports.minMax = function minMax(matrix) {
      var min = Infinity;
      var max = -Infinity;

      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] < min) min = matrix[i][j];
          if (matrix[i][j] > max) max = matrix[i][j];
        }
      }

      return {
        min: min,
        max: max
      };
    };

    exports.entropy = function entropy(matrix, eps) {
      if (typeof eps === 'undefined') {
        eps = 0;
      }

      var sum = 0,
          l1 = matrix.length,
          l2 = matrix[0].length;

      for (var i = 0; i < l1; i++) {
        for (var j = 0; j < l2; j++) {
          sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
        }
      }

      return -sum;
    };

    exports.mean = function mean(matrix, dimension) {
      if (typeof dimension === 'undefined') {
        dimension = 0;
      }

      var rows = matrix.length,
          cols = matrix[0].length,
          theMean,
          N,
          i,
          j;

      if (dimension === -1) {
        theMean = [0];
        N = rows * cols;

        for (i = 0; i < rows; i++) {
          for (j = 0; j < cols; j++) {
            theMean[0] += matrix[i][j];
          }
        }

        theMean[0] /= N;
      } else if (dimension === 0) {
        theMean = new Array(cols);
        N = rows;

        for (j = 0; j < cols; j++) {
          theMean[j] = 0;

          for (i = 0; i < rows; i++) {
            theMean[j] += matrix[i][j];
          }

          theMean[j] /= N;
        }
      } else if (dimension === 1) {
        theMean = new Array(rows);
        N = cols;

        for (j = 0; j < rows; j++) {
          theMean[j] = 0;

          for (i = 0; i < cols; i++) {
            theMean[j] += matrix[j][i];
          }

          theMean[j] /= N;
        }
      } else {
        throw new Error('Invalid dimension');
      }

      return theMean;
    };

    exports.sum = function sum(matrix, dimension) {
      if (typeof dimension === 'undefined') {
        dimension = 0;
      }

      var rows = matrix.length,
          cols = matrix[0].length,
          theSum,
          i,
          j;

      if (dimension === -1) {
        theSum = [0];

        for (i = 0; i < rows; i++) {
          for (j = 0; j < cols; j++) {
            theSum[0] += matrix[i][j];
          }
        }
      } else if (dimension === 0) {
        theSum = new Array(cols);

        for (j = 0; j < cols; j++) {
          theSum[j] = 0;

          for (i = 0; i < rows; i++) {
            theSum[j] += matrix[i][j];
          }
        }
      } else if (dimension === 1) {
        theSum = new Array(rows);

        for (j = 0; j < rows; j++) {
          theSum[j] = 0;

          for (i = 0; i < cols; i++) {
            theSum[j] += matrix[j][i];
          }
        }
      } else {
        throw new Error('Invalid dimension');
      }

      return theSum;
    };

    exports.product = function product(matrix, dimension) {
      if (typeof dimension === 'undefined') {
        dimension = 0;
      }

      var rows = matrix.length,
          cols = matrix[0].length,
          theProduct,
          i,
          j;

      if (dimension === -1) {
        theProduct = [1];

        for (i = 0; i < rows; i++) {
          for (j = 0; j < cols; j++) {
            theProduct[0] *= matrix[i][j];
          }
        }
      } else if (dimension === 0) {
        theProduct = new Array(cols);

        for (j = 0; j < cols; j++) {
          theProduct[j] = 1;

          for (i = 0; i < rows; i++) {
            theProduct[j] *= matrix[i][j];
          }
        }
      } else if (dimension === 1) {
        theProduct = new Array(rows);

        for (j = 0; j < rows; j++) {
          theProduct[j] = 1;

          for (i = 0; i < cols; i++) {
            theProduct[j] *= matrix[j][i];
          }
        }
      } else {
        throw new Error('Invalid dimension');
      }

      return theProduct;
    };

    exports.standardDeviation = function standardDeviation(matrix, means, unbiased) {
      var vari = exports.variance(matrix, means, unbiased),
          l = vari.length;

      for (var i = 0; i < l; i++) {
        vari[i] = Math.sqrt(vari[i]);
      }

      return vari;
    };

    exports.variance = function variance(matrix, means, unbiased) {
      if (typeof unbiased === 'undefined') {
        unbiased = true;
      }

      means = means || exports.mean(matrix);
      var rows = matrix.length;
      if (rows === 0) return [];
      var cols = matrix[0].length;
      var vari = new Array(cols);

      for (var j = 0; j < cols; j++) {
        var sum1 = 0,
            sum2 = 0,
            x = 0;

        for (var i = 0; i < rows; i++) {
          x = matrix[i][j] - means[j];
          sum1 += x;
          sum2 += x * x;
        }

        if (unbiased) {
          vari[j] = (sum2 - sum1 * sum1 / rows) / (rows - 1);
        } else {
          vari[j] = (sum2 - sum1 * sum1 / rows) / rows;
        }
      }

      return vari;
    };

    exports.median = function median(matrix) {
      var rows = matrix.length,
          cols = matrix[0].length;
      var medians = new Array(cols);

      for (var i = 0; i < cols; i++) {
        var data = new Array(rows);

        for (var j = 0; j < rows; j++) {
          data[j] = matrix[j][i];
        }

        data.sort(compareNumbers);
        var N = data.length;

        if (N % 2 === 0) {
          medians[i] = (data[N / 2] + data[N / 2 - 1]) * 0.5;
        } else {
          medians[i] = data[Math.floor(N / 2)];
        }
      }

      return medians;
    };

    exports.mode = function mode(matrix) {
      var rows = matrix.length,
          cols = matrix[0].length,
          modes = new Array(cols),
          i,
          j;

      for (i = 0; i < cols; i++) {
        var itemCount = new Array(rows);

        for (var k = 0; k < rows; k++) {
          itemCount[k] = 0;
        }

        var itemArray = new Array(rows);
        var count = 0;

        for (j = 0; j < rows; j++) {
          var index = itemArray.indexOf(matrix[j][i]);

          if (index >= 0) {
            itemCount[index]++;
          } else {
            itemArray[count] = matrix[j][i];
            itemCount[count] = 1;
            count++;
          }
        }

        var maxValue = 0,
            maxIndex = 0;

        for (j = 0; j < count; j++) {
          if (itemCount[j] > maxValue) {
            maxValue = itemCount[j];
            maxIndex = j;
          }
        }

        modes[i] = itemArray[maxIndex];
      }

      return modes;
    };

    exports.skewness = function skewness(matrix, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var means = exports.mean(matrix);
      var n = matrix.length,
          l = means.length;
      var skew = new Array(l);

      for (var j = 0; j < l; j++) {
        var s2 = 0,
            s3 = 0;

        for (var i = 0; i < n; i++) {
          var dev = matrix[i][j] - means[j];
          s2 += dev * dev;
          s3 += dev * dev * dev;
        }

        var m2 = s2 / n;
        var m3 = s3 / n;
        var g = m3 / Math.pow(m2, 3 / 2);

        if (unbiased) {
          var a = Math.sqrt(n * (n - 1));
          var b = n - 2;
          skew[j] = a / b * g;
        } else {
          skew[j] = g;
        }
      }

      return skew;
    };

    exports.kurtosis = function kurtosis(matrix, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var means = exports.mean(matrix);
      var n = matrix.length,
          m = matrix[0].length;
      var kurt = new Array(m);

      for (var j = 0; j < m; j++) {
        var s2 = 0,
            s4 = 0;

        for (var i = 0; i < n; i++) {
          var dev = matrix[i][j] - means[j];
          s2 += dev * dev;
          s4 += dev * dev * dev * dev;
        }

        var m2 = s2 / n;
        var m4 = s4 / n;

        if (unbiased) {
          var v = s2 / (n - 1);
          var a = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
          var b = s4 / (v * v);
          var c = (n - 1) * (n - 1) / ((n - 2) * (n - 3));
          kurt[j] = a * b - 3 * c;
        } else {
          kurt[j] = m4 / (m2 * m2) - 3;
        }
      }

      return kurt;
    };

    exports.standardError = function standardError(matrix) {
      var samples = matrix.length;
      var standardDeviations = exports.standardDeviation(matrix);
      var l = standardDeviations.length;
      var standardErrors = new Array(l);
      var sqrtN = Math.sqrt(samples);

      for (var i = 0; i < l; i++) {
        standardErrors[i] = standardDeviations[i] / sqrtN;
      }

      return standardErrors;
    };

    exports.covariance = function covariance(matrix, dimension) {
      return exports.scatter(matrix, undefined, dimension);
    };

    exports.scatter = function scatter(matrix, divisor, dimension) {
      if (typeof dimension === 'undefined') {
        dimension = 0;
      }

      if (typeof divisor === 'undefined') {
        if (dimension === 0) {
          divisor = matrix.length - 1;
        } else if (dimension === 1) {
          divisor = matrix[0].length - 1;
        }
      }

      var means = exports.mean(matrix, dimension);
      var rows = matrix.length;

      if (rows === 0) {
        return [[]];
      }

      var cols = matrix[0].length,
          cov,
          i,
          j,
          s,
          k;

      if (dimension === 0) {
        cov = new Array(cols);

        for (i = 0; i < cols; i++) {
          cov[i] = new Array(cols);
        }

        for (i = 0; i < cols; i++) {
          for (j = i; j < cols; j++) {
            s = 0;

            for (k = 0; k < rows; k++) {
              s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
            }

            s /= divisor;
            cov[i][j] = s;
            cov[j][i] = s;
          }
        }
      } else if (dimension === 1) {
        cov = new Array(rows);

        for (i = 0; i < rows; i++) {
          cov[i] = new Array(rows);
        }

        for (i = 0; i < rows; i++) {
          for (j = i; j < rows; j++) {
            s = 0;

            for (k = 0; k < cols; k++) {
              s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
            }

            s /= divisor;
            cov[i][j] = s;
            cov[j][i] = s;
          }
        }
      } else {
        throw new Error('Invalid dimension');
      }

      return cov;
    };

    exports.correlation = function correlation(matrix) {
      var means = exports.mean(matrix),
          standardDeviations = exports.standardDeviation(matrix, true, means),
          scores = exports.zScores(matrix, means, standardDeviations),
          rows = matrix.length,
          cols = matrix[0].length,
          i,
          j;
      var cor = new Array(cols);

      for (i = 0; i < cols; i++) {
        cor[i] = new Array(cols);
      }

      for (i = 0; i < cols; i++) {
        for (j = i; j < cols; j++) {
          var c = 0;

          for (var k = 0, l = scores.length; k < l; k++) {
            c += scores[k][j] * scores[k][i];
          }

          c /= rows - 1;
          cor[i][j] = c;
          cor[j][i] = c;
        }
      }

      return cor;
    };

    exports.zScores = function zScores(matrix, means, standardDeviations) {
      means = means || exports.mean(matrix);
      if (typeof standardDeviations === 'undefined') standardDeviations = exports.standardDeviation(matrix, true, means);
      return exports.standardize(exports.center(matrix, means, false), standardDeviations, true);
    };

    exports.center = function center(matrix, means, inPlace) {
      means = means || exports.mean(matrix);
      var result = matrix,
          l = matrix.length,
          i,
          j,
          jj;

      if (!inPlace) {
        result = new Array(l);

        for (i = 0; i < l; i++) {
          result[i] = new Array(matrix[i].length);
        }
      }

      for (i = 0; i < l; i++) {
        var row = result[i];

        for (j = 0, jj = row.length; j < jj; j++) {
          row[j] = matrix[i][j] - means[j];
        }
      }

      return result;
    };

    exports.standardize = function standardize(matrix, standardDeviations, inPlace) {
      if (typeof standardDeviations === 'undefined') standardDeviations = exports.standardDeviation(matrix);
      var result = matrix,
          l = matrix.length,
          i,
          j,
          jj;

      if (!inPlace) {
        result = new Array(l);

        for (i = 0; i < l; i++) {
          result[i] = new Array(matrix[i].length);
        }
      }

      for (i = 0; i < l; i++) {
        var resultRow = result[i];
        var sourceRow = matrix[i];

        for (j = 0, jj = resultRow.length; j < jj; j++) {
          if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
            resultRow[j] = sourceRow[j] / standardDeviations[j];
          }
        }
      }

      return result;
    };

    exports.weightedVariance = function weightedVariance(matrix, weights) {
      var means = exports.mean(matrix);
      var rows = matrix.length;
      if (rows === 0) return [];
      var cols = matrix[0].length;
      var vari = new Array(cols);

      for (var j = 0; j < cols; j++) {
        var sum = 0;
        var a = 0,
            b = 0;

        for (var i = 0; i < rows; i++) {
          var z = matrix[i][j] - means[j];
          var w = weights[i];
          sum += w * (z * z);
          b += w;
          a += w * w;
        }

        vari[j] = sum * (b / (b * b - a));
      }

      return vari;
    };

    exports.weightedMean = function weightedMean(matrix, weights, dimension) {
      if (typeof dimension === 'undefined') {
        dimension = 0;
      }

      var rows = matrix.length;
      if (rows === 0) return [];
      var cols = matrix[0].length,
          means,
          i,
          ii,
          j,
          w,
          row;

      if (dimension === 0) {
        means = new Array(cols);

        for (i = 0; i < cols; i++) {
          means[i] = 0;
        }

        for (i = 0; i < rows; i++) {
          row = matrix[i];
          w = weights[i];

          for (j = 0; j < cols; j++) {
            means[j] += row[j] * w;
          }
        }
      } else if (dimension === 1) {
        means = new Array(rows);

        for (i = 0; i < rows; i++) {
          means[i] = 0;
        }

        for (j = 0; j < rows; j++) {
          row = matrix[j];
          w = weights[j];

          for (i = 0; i < cols; i++) {
            means[j] += row[i] * w;
          }
        }
      } else {
        throw new Error('Invalid dimension');
      }

      var weightSum = array.sum(weights);

      if (weightSum !== 0) {
        for (i = 0, ii = means.length; i < ii; i++) {
          means[i] /= weightSum;
        }
      }

      return means;
    };

    exports.weightedCovariance = function weightedCovariance(matrix, weights, means, dimension) {
      dimension = dimension || 0;
      means = means || exports.weightedMean(matrix, weights, dimension);
      var s1 = 0,
          s2 = 0;

      for (var i = 0, ii = weights.length; i < ii; i++) {
        s1 += weights[i];
        s2 += weights[i] * weights[i];
      }

      var factor = s1 / (s1 * s1 - s2);
      return exports.weightedScatter(matrix, weights, means, factor, dimension);
    };

    exports.weightedScatter = function weightedScatter(matrix, weights, means, factor, dimension) {
      dimension = dimension || 0;
      means = means || exports.weightedMean(matrix, weights, dimension);

      if (typeof factor === 'undefined') {
        factor = 1;
      }

      var rows = matrix.length;

      if (rows === 0) {
        return [[]];
      }

      var cols = matrix[0].length,
          cov,
          i,
          j,
          k,
          s;

      if (dimension === 0) {
        cov = new Array(cols);

        for (i = 0; i < cols; i++) {
          cov[i] = new Array(cols);
        }

        for (i = 0; i < cols; i++) {
          for (j = i; j < cols; j++) {
            s = 0;

            for (k = 0; k < rows; k++) {
              s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
            }

            cov[i][j] = s * factor;
            cov[j][i] = s * factor;
          }
        }
      } else if (dimension === 1) {
        cov = new Array(rows);

        for (i = 0; i < rows; i++) {
          cov[i] = new Array(rows);
        }

        for (i = 0; i < rows; i++) {
          for (j = i; j < rows; j++) {
            s = 0;

            for (k = 0; k < cols; k++) {
              s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
            }

            cov[i][j] = s * factor;
            cov[j][i] = s * factor;
          }
        }
      } else {
        throw new Error('Invalid dimension');
      }

      return cov;
    };
  });
  var matrix_1 = matrix.max;
  var matrix_2 = matrix.min;
  var matrix_3 = matrix.minMax;
  var matrix_4 = matrix.entropy;
  var matrix_5 = matrix.mean;
  var matrix_6 = matrix.sum;
  var matrix_7 = matrix.product;
  var matrix_8 = matrix.standardDeviation;
  var matrix_9 = matrix.variance;
  var matrix_10 = matrix.median;
  var matrix_11 = matrix.mode;
  var matrix_12 = matrix.skewness;
  var matrix_13 = matrix.kurtosis;
  var matrix_14 = matrix.standardError;
  var matrix_15 = matrix.covariance;
  var matrix_16 = matrix.scatter;
  var matrix_17 = matrix.correlation;
  var matrix_18 = matrix.zScores;
  var matrix_19 = matrix.center;
  var matrix_20 = matrix.standardize;
  var matrix_21 = matrix.weightedVariance;
  var matrix_22 = matrix.weightedMean;
  var matrix_23 = matrix.weightedCovariance;
  var matrix_24 = matrix.weightedScatter;

  var fftlib$1 = createCommonjsModule(function (module, exports) {
    /**
     * Fast Fourier Transform module
     * 1D-FFT/IFFT, 2D-FFT/IFFT (radix-2)
     */
    var FFT = function () {
      var FFT;

      {
        FFT = exports; // for CommonJS
      }

      var version = {
        release: '0.3.0',
        date: '2013-03'
      };

      FFT.toString = function () {
        return "version " + version.release + ", released " + version.date;
      }; // core operations


      var _n = 0,
          // order
      _bitrev = null,
          // bit reversal table
      _cstb = null; // sin/cos table

      var core = {
        init: function (n) {
          if (n !== 0 && (n & n - 1) === 0) {
            _n = n;

            core._initArray();

            core._makeBitReversalTable();

            core._makeCosSinTable();
          } else {
            throw new Error("init: radix-2 required");
          }
        },
        // 1D-FFT
        fft1d: function (re, im) {
          core.fft(re, im, 1);
        },
        // 1D-IFFT
        ifft1d: function (re, im) {
          var n = 1 / _n;
          core.fft(re, im, -1);

          for (var i = 0; i < _n; i++) {
            re[i] *= n;
            im[i] *= n;
          }
        },
        // 1D-IFFT
        bt1d: function (re, im) {
          core.fft(re, im, -1);
        },
        // 2D-FFT Not very useful if the number of rows have to be equal to cols
        fft2d: function (re, im) {
          var tre = [],
              tim = [],
              i = 0; // x-axis

          for (var y = 0; y < _n; y++) {
            i = y * _n;

            for (var x1 = 0; x1 < _n; x1++) {
              tre[x1] = re[x1 + i];
              tim[x1] = im[x1 + i];
            }

            core.fft1d(tre, tim);

            for (var x2 = 0; x2 < _n; x2++) {
              re[x2 + i] = tre[x2];
              im[x2 + i] = tim[x2];
            }
          } // y-axis


          for (var x = 0; x < _n; x++) {
            for (var y1 = 0; y1 < _n; y1++) {
              i = x + y1 * _n;
              tre[y1] = re[i];
              tim[y1] = im[i];
            }

            core.fft1d(tre, tim);

            for (var y2 = 0; y2 < _n; y2++) {
              i = x + y2 * _n;
              re[i] = tre[y2];
              im[i] = tim[y2];
            }
          }
        },
        // 2D-IFFT
        ifft2d: function (re, im) {
          var tre = [],
              tim = [],
              i = 0; // x-axis

          for (var y = 0; y < _n; y++) {
            i = y * _n;

            for (var x1 = 0; x1 < _n; x1++) {
              tre[x1] = re[x1 + i];
              tim[x1] = im[x1 + i];
            }

            core.ifft1d(tre, tim);

            for (var x2 = 0; x2 < _n; x2++) {
              re[x2 + i] = tre[x2];
              im[x2 + i] = tim[x2];
            }
          } // y-axis


          for (var x = 0; x < _n; x++) {
            for (var y1 = 0; y1 < _n; y1++) {
              i = x + y1 * _n;
              tre[y1] = re[i];
              tim[y1] = im[i];
            }

            core.ifft1d(tre, tim);

            for (var y2 = 0; y2 < _n; y2++) {
              i = x + y2 * _n;
              re[i] = tre[y2];
              im[i] = tim[y2];
            }
          }
        },
        // core operation of FFT
        fft: function (re, im, inv) {
          var d,
              h,
              ik,
              m,
              tmp,
              wr,
              wi,
              xr,
              xi,
              n4 = _n >> 2; // bit reversal

          for (var l = 0; l < _n; l++) {
            m = _bitrev[l];

            if (l < m) {
              tmp = re[l];
              re[l] = re[m];
              re[m] = tmp;
              tmp = im[l];
              im[l] = im[m];
              im[m] = tmp;
            }
          } // butterfly operation


          for (var k = 1; k < _n; k <<= 1) {
            h = 0;
            d = _n / (k << 1);

            for (var j = 0; j < k; j++) {
              wr = _cstb[h + n4];
              wi = inv * _cstb[h];

              for (var i = j; i < _n; i += k << 1) {
                ik = i + k;
                xr = wr * re[ik] + wi * im[ik];
                xi = wr * im[ik] - wi * re[ik];
                re[ik] = re[i] - xr;
                re[i] += xr;
                im[ik] = im[i] - xi;
                im[i] += xi;
              }

              h += d;
            }
          }
        },
        // initialize the array (supports TypedArray)
        _initArray: function () {
          if (typeof Uint32Array !== 'undefined') {
            _bitrev = new Uint32Array(_n);
          } else {
            _bitrev = [];
          }

          if (typeof Float64Array !== 'undefined') {
            _cstb = new Float64Array(_n * 1.25);
          } else {
            _cstb = [];
          }
        },
        // zero padding
        _paddingZero: function () {// TODO
        },
        // makes bit reversal table
        _makeBitReversalTable: function () {
          var i = 0,
              j = 0,
              k = 0;
          _bitrev[0] = 0;

          while (++i < _n) {
            k = _n >> 1;

            while (k <= j) {
              j -= k;
              k >>= 1;
            }

            j += k;
            _bitrev[i] = j;
          }
        },
        // makes trigonometiric function table
        _makeCosSinTable: function () {
          var n2 = _n >> 1,
              n4 = _n >> 2,
              n8 = _n >> 3,
              n2p4 = n2 + n4,
              t = Math.sin(Math.PI / _n),
              dc = 2 * t * t,
              ds = Math.sqrt(dc * (2 - dc)),
              c = _cstb[n4] = 1,
              s = _cstb[0] = 0;
          t = 2 * dc;

          for (var i = 1; i < n8; i++) {
            c -= dc;
            dc += t * c;
            s += ds;
            ds -= t * s;
            _cstb[i] = s;
            _cstb[n4 - i] = c;
          }

          if (n8 !== 0) {
            _cstb[n8] = Math.sqrt(0.5);
          }

          for (var j = 0; j < n4; j++) {
            _cstb[n2 - j] = _cstb[j];
          }

          for (var k = 0; k < n2p4; k++) {
            _cstb[k + n2] = -_cstb[k];
          }
        }
      }; // aliases (public APIs)

      var apis = ['init', 'fft1d', 'ifft1d', 'fft2d', 'ifft2d'];

      for (var i = 0; i < apis.length; i++) {
        FFT[apis[i]] = core[apis[i]];
      }

      FFT.bt = core.bt1d;
      FFT.fft = core.fft1d;
      FFT.ifft = core.ifft1d;
      return FFT;
    }.call(commonjsGlobal);
  });

  // source: https://en.wikipedia.org/wiki/Gyromagnetic_ratio
  const gyromagneticRatio = {
    '1H': 267.52218744e6,
    '2H': 41.065e6,
    '3H': 285.3508e6,
    '3He': -203.789e6,
    '7Li': 103.962e6,
    '13C': 67.28284e6,
    '14N': 19.331e6,
    '15N': -27.116e6,
    '17O': -36.264e6,
    '19F': 251.662e6,
    '23Na': 70.761e6,
    '27Al': 69.763e6,
    '29Si': -53.19e6,
    '31P': 108.291e6,
    '57Fe': 8.681e6,
    '63Cu': 71.118e6,
    '67Zn': 16.767e6,
    '129Xe': -73.997e6
  };

  function postProcessingNMR(entriesFlat) {
    // specific NMR functions
    let observeFrequency = 0;
    let shiftOffsetVal = 0;

    for (let entry of entriesFlat) {
      for (let spectrum of entry.spectra) {
        if (entry.ntuples && entry.ntuples.symbol) {
          if (!observeFrequency && spectrum.observeFrequency) {
            observeFrequency = spectrum.observeFrequency;
          }

          if (!shiftOffsetVal && spectrum.shiftOffsetVal) {
            shiftOffsetVal = spectrum.shiftOffsetVal;
          }
        } else {
          observeFrequency = spectrum.observeFrequency;
          shiftOffsetVal = spectrum.shiftOffsetVal;
        }

        if (observeFrequency) {
          if (spectrum.xUnits && spectrum.xUnits.toUpperCase().includes('HZ')) {
            spectrum.xUnits = 'PPM';
            spectrum.xFactor = spectrum.xFactor / observeFrequency;
            spectrum.firstX = spectrum.firstX / observeFrequency;
            spectrum.lastX = spectrum.lastX / observeFrequency;
            spectrum.deltaX = spectrum.deltaX / observeFrequency;

            for (let i = 0; i < spectrum.data.x.length; i++) {
              spectrum.data.x[i] /= observeFrequency;
            }
          }
        }

        if (shiftOffsetVal) {
          let shift = spectrum.firstX - shiftOffsetVal;
          spectrum.firstX = spectrum.firstX - shift;
          spectrum.lastX = spectrum.lastX - shift;

          for (let i = 0; i < spectrum.data.x.length; i++) {
            spectrum.data.x[i] -= shift;
          }
        }

        if (observeFrequency && entry.ntuples && entry.ntuples.symbol && entry.ntuples.nucleus) {
          let unit = '';
          let pageSymbolIndex = entry.ntuples.symbol.indexOf(spectrum.pageSymbol);

          if (entry.ntuples.units && entry.ntuples.units[pageSymbolIndex]) {
            unit = entry.ntuples.units[pageSymbolIndex];
          }

          if (unit !== 'PPM') {
            if (pageSymbolIndex !== 0) {
              throw Error('Not sure about this ntuples format');
            }

            let ratio0 = gyromagneticRatio[entry.ntuples.nucleus[0]];
            let ratio1 = gyromagneticRatio[entry.ntuples.nucleus[1]];

            if (!ratio0 || !ratio1) {
              throw Error('Problem with determination of gyromagnetic ratio');
            }

            let ratio = ratio0 / ratio1 * observeFrequency;
            spectrum.pageValue /= ratio;
          }
        }
      }
    }
  }

  function postProcessing(entriesFlat, result, options) {
    // converting Hz to ppm
    postProcessingNMR(entriesFlat);

    for (let entry of entriesFlat) {
      if (Object.keys(entry.ntuples).length > 0) {
        let newNtuples = [];
        let keys = Object.keys(entry.ntuples);

        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          let values = entry.ntuples[key];

          for (let j = 0; j < values.length; j++) {
            if (!newNtuples[j]) newNtuples[j] = {};
            newNtuples[j][key] = values[j];
          }
        }

        entry.ntuples = newNtuples;
      }

      if (entry.twoD && options.wantXY) {
        add2D(entry, options);
        profiling(result, 'Finished countour plot calculation', options);

        if (!options.keepSpectra) {
          delete entry.spectra;
        }
      } // maybe it is a GC (HPLC) / MS. In this case we add a new format


      if (options.chromatogram) {
        if (entry.spectra.length > 1) {
          complexChromatogram(entry);
        } else {
          simpleChromatogram(entry);
        }

        profiling(result, 'Finished chromatogram calculation', options);
      }
    }
  }

  function prepareNtuplesDatatable(currentEntry, spectrum, kind) {
    let xIndex = -1;
    let yIndex = -1;
    let firstVariable = '';
    let secondVariable = '';

    if (kind.indexOf('++') > 0) {
      firstVariable = kind.replace(/.*\(([a-zA-Z0-9]+)\+\+.*/, '$1');
      secondVariable = kind.replace(/.*\.\.([a-zA-Z0-9]+).*/, '$1');
    } else {
      kind = kind.replace(/[^a-zA-Z]/g, '');
      firstVariable = kind.charAt(0);
      secondVariable = kind.charAt(1);
      spectrum.variables = {};

      for (let symbol of kind) {
        let index = currentEntry.ntuples.symbol.indexOf(symbol);
        if (index === -1) throw Error(`Symbol undefined: ${symbol}`);
        spectrum.variables[symbol] = {};

        for (let key in currentEntry.ntuples) {
          if (currentEntry.ntuples[key][index]) {
            spectrum.variables[symbol][key.replace(/^var/, '')] = currentEntry.ntuples[key][index];
          }
        }
      }
    }

    xIndex = currentEntry.ntuples.symbol.indexOf(firstVariable);
    yIndex = currentEntry.ntuples.symbol.indexOf(secondVariable);
    if (xIndex === -1) xIndex = 0;
    if (yIndex === -1) yIndex = 0;

    if (currentEntry.ntuples.first) {
      if (currentEntry.ntuples.first.length > xIndex) {
        spectrum.firstX = currentEntry.ntuples.first[xIndex];
      }

      if (currentEntry.ntuples.first.length > yIndex) {
        spectrum.firstY = currentEntry.ntuples.first[yIndex];
      }
    }

    if (currentEntry.ntuples.last) {
      if (currentEntry.ntuples.last.length > xIndex) {
        spectrum.lastX = currentEntry.ntuples.last[xIndex];
      }

      if (currentEntry.ntuples.last.length > yIndex) {
        spectrum.lastY = currentEntry.ntuples.last[yIndex];
      }
    }

    if (currentEntry.ntuples.vardim && currentEntry.ntuples.vardim.length > xIndex) {
      spectrum.nbPoints = currentEntry.ntuples.vardim[xIndex];
    }

    if (currentEntry.ntuples.factor) {
      if (currentEntry.ntuples.factor.length > xIndex) {
        spectrum.xFactor = currentEntry.ntuples.factor[xIndex];
      }

      if (currentEntry.ntuples.factor.length > yIndex) {
        spectrum.yFactor = currentEntry.ntuples.factor[yIndex];
      }
    }

    if (currentEntry.ntuples.units) {
      if (currentEntry.ntuples.units.length > xIndex) {
        if (currentEntry.ntuples.varname && currentEntry.ntuples.varname[xIndex]) {
          spectrum.xUnits = `${currentEntry.ntuples.varname[xIndex]} [${currentEntry.ntuples.units[xIndex]}]`;
        } else {
          spectrum.xUnits = currentEntry.ntuples.units[xIndex];
        }
      }

      if (currentEntry.ntuples.units.length > yIndex) {
        if (currentEntry.ntuples.varname && currentEntry.ntuples.varname[yIndex]) {
          spectrum.yUnits = `${currentEntry.ntuples.varname[yIndex]} [${currentEntry.ntuples.units[yIndex]}]`;
        } else {
          spectrum.yUnits = currentEntry.ntuples.units[yIndex];
        }
      }
    }
  }

  function prepareSpectrum(spectrum) {
    if (!spectrum.xFactor) spectrum.xFactor = 1;
    if (!spectrum.yFactor) spectrum.yFactor = 1;
  }

  const ntuplesSeparator = /[ \t]*,[ \t]*/;

  class Spectrum {}

  const defaultOptions = {
    keepRecordsRegExp: /^$/,
    canonicDataLabels: true,
    canonicMetadataLabels: false,
    dynamicTyping: true,
    withoutXY: false,
    chromatogram: false,
    keepSpectra: false,
    noContour: false,
    nbContourLevels: 7,
    noiseMultiplier: 5,
    profiling: false
  };
  /**
   *
   * @param {text} jcamp
   * @param {object} [options]
   * @param {number} [options.keepRecordsRegExp=/^$/] By default we don't keep meta information
   * @param {number} [options.canonicDataLabels=true] Canonize the Labels (uppercase without symbol)
   * @param {number} [options.canonicMetadataLabels=false] Canonize the metadata Labels (uppercase without symbol)
   * @param {number} [options.dynamicTyping=false] Convert numbers to Number
   * @param {number} [options.withoutXY=false] Remove the XY data
   * @param {number} [options.chromatogram=false] Special post-processing for GC / HPLC / MS
   * @param {number} [options.keepSpectra=false] Force to keep the spectra in case of 2D
   * @param {number} [options.noContour=false] Don't calculate countour in case of 2D
   * @param {number} [options.nbContourLevels=7] Number of positive / negative contour levels to calculate
   * @param {number} [options.noiseMultiplier=5] Define for 2D the level as 5 times the median as default
   * @param {number} [options.profiling=false] Add profiling information
   */

  function convert(jcamp, options = {}) {
    options = Object.assign({}, defaultOptions, options);
    options.wantXY = !options.withoutXY;
    options.start = Date.now();
    let entriesFlat = [];
    let result = {
      profiling: options.profiling ? [] : false,
      logs: [],
      entries: []
    };
    let tmpResult = {
      children: []
    };
    let currentEntry = tmpResult;
    let parentsStack = [];
    let spectrum = new Spectrum();

    if (typeof jcamp !== 'string') {
      throw new TypeError('the JCAMP should be a string');
    }

    profiling(result, 'Before split to LDRS', options);
    let ldrs = jcamp.replace(/[\r\n]+##/g, '\n##').split('\n##');
    profiling(result, 'Split to LDRS', options);
    if (ldrs[0]) ldrs[0] = ldrs[0].replace(/^[\r\n ]*##/, '');

    for (let ldr of ldrs) {
      // This is a new LDR
      let position = ldr.indexOf('=');
      let dataLabel = position > 0 ? ldr.substring(0, position) : ldr;
      let dataValue = position > 0 ? ldr.substring(position + 1).trim() : '';
      let canonicDataLabel = dataLabel.replace(/[_ -]/g, '').toUpperCase();

      if (canonicDataLabel === 'DATATABLE') {
        let endLine = dataValue.indexOf('\n');
        if (endLine === -1) endLine = dataValue.indexOf('\r');

        if (endLine > 0) {
          // ##DATA TABLE= (X++(I..I)), XYDATA
          // We need to find the variables
          let infos = dataValue.substring(0, endLine).split(/[ ,;\t]+/);
          prepareNtuplesDatatable(currentEntry, spectrum, infos[0]);
          spectrum.datatable = infos[0];

          if (infos[1] && infos[1].indexOf('PEAKS') > -1) {
            canonicDataLabel = 'PEAKTABLE';
          } else if (infos[1] && (infos[1].indexOf('XYDATA') || infos[0].indexOf('++') > 0)) {
            canonicDataLabel = 'XYDATA';
            spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
          }
        }
      }

      if (canonicDataLabel === 'XYDATA') {
        if (options.wantXY) {
          prepareSpectrum(spectrum); // well apparently we should still consider it is a PEAK TABLE if there are no '++' after

          if (dataValue.match(/.*\+\+.*/)) {
            // ex: (X++(Y..Y))
            if (!spectrum.deltaX) {
              spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
            }

            fastParseXYData(spectrum, dataValue);
          } else {
            parsePeakTable(spectrum, dataValue, result);
          }

          currentEntry.spectra.push(spectrum);
          spectrum = new Spectrum();
        }

        continue;
      } else if (canonicDataLabel === 'PEAKTABLE') {
        if (options.wantXY) {
          prepareSpectrum(spectrum);
          parsePeakTable(spectrum, dataValue, result);
          currentEntry.spectra.push(spectrum);
          spectrum = new Spectrum();
        }

        continue;
      }

      if (canonicDataLabel === 'PEAKASSIGNMENTS') {
        if (options.wantXY) {
          if (dataValue.match(/.*(XYA).*/)) {
            // ex: (XYA)
            parseXYA(spectrum, dataValue);
          }

          currentEntry.spectra.push(spectrum);
          spectrum = new Spectrum();
        }

        continue;
      }

      if (canonicDataLabel === 'TITLE') {
        let parentEntry = currentEntry;

        if (!parentEntry.children) {
          parentEntry.children = [];
        }

        currentEntry = {
          spectra: [],
          ntuples: {},
          info: {},
          meta: {}
        };
        parentEntry.children.push(currentEntry);
        parentsStack.push(parentEntry);
        entriesFlat.push(currentEntry);
        currentEntry.title = dataValue;
      } else if (canonicDataLabel === 'DATATYPE') {
        currentEntry.dataType = dataValue;

        if (dataValue.toLowerCase().indexOf('nd') > -1) {
          currentEntry.twoD = true;
        }
      } else if (canonicDataLabel === 'NTUPLES') {
        if (dataValue.toLowerCase().indexOf('nd') > -1) {
          currentEntry.twoD = true;
        }
      } else if (canonicDataLabel === 'DATACLASS') {
        currentEntry.dataClass = dataValue;
      } else if (canonicDataLabel === 'XUNITS') {
        spectrum.xUnits = dataValue;
      } else if (canonicDataLabel === 'YUNITS') {
        spectrum.yUnits = dataValue;
      } else if (canonicDataLabel === 'FIRSTX') {
        spectrum.firstX = parseFloat(dataValue);
      } else if (canonicDataLabel === 'LASTX') {
        spectrum.lastX = parseFloat(dataValue);
      } else if (canonicDataLabel === 'FIRSTY') {
        spectrum.firstY = parseFloat(dataValue);
      } else if (canonicDataLabel === 'LASTY') {
        spectrum.lastY = parseFloat(dataValue);
      } else if (canonicDataLabel === 'NPOINTS') {
        spectrum.nbPoints = parseFloat(dataValue);
      } else if (canonicDataLabel === 'XFACTOR') {
        spectrum.xFactor = parseFloat(dataValue);
      } else if (canonicDataLabel === 'YFACTOR') {
        spectrum.yFactor = parseFloat(dataValue);
      } else if (canonicDataLabel === 'MAXX') {
        spectrum.maxX = parseFloat(dataValue);
      } else if (canonicDataLabel === 'MINX') {
        spectrum.minX = parseFloat(dataValue);
      } else if (canonicDataLabel === 'MAXY') {
        spectrum.maxY = parseFloat(dataValue);
      } else if (canonicDataLabel === 'MINY') {
        spectrum.minY = parseFloat(dataValue);
      } else if (canonicDataLabel === 'DELTAX') {
        spectrum.deltaX = parseFloat(dataValue);
      } else if (canonicDataLabel === '.OBSERVEFREQUENCY' || canonicDataLabel === '$SFO1') {
        if (!spectrum.observeFrequency) {
          spectrum.observeFrequency = parseFloat(dataValue);
        }
      } else if (canonicDataLabel === '.OBSERVENUCLEUS') {
        if (!spectrum.xType) {
          currentEntry.xType = dataValue.replace(/[^a-zA-Z0-9]/g, '');
        }
      } else if (canonicDataLabel === '$OFFSET') {
        // OFFSET for Bruker spectra
        currentEntry.shiftOffsetNum = 0;

        if (!spectrum.shiftOffsetVal) {
          spectrum.shiftOffsetVal = parseFloat(dataValue);
        }
      } else if (canonicDataLabel === '$REFERENCEPOINT') ; else if (canonicDataLabel === 'VARNAME') {
        currentEntry.ntuples.varname = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'SYMBOL') {
        currentEntry.ntuples.symbol = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'VARTYPE') {
        currentEntry.ntuples.vartype = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'VARFORM') {
        currentEntry.ntuples.varform = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'VARDIM') {
        currentEntry.ntuples.vardim = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'UNITS') {
        currentEntry.ntuples.units = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'FACTOR') {
        currentEntry.ntuples.factor = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'FIRST') {
        currentEntry.ntuples.first = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'LAST') {
        currentEntry.ntuples.last = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'MIN') {
        currentEntry.ntuples.min = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'MAX') {
        currentEntry.ntuples.max = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === '.NUCLEUS') {
        if (currentEntry.ntuples) {
          currentEntry.ntuples.nucleus = dataValue.split(ntuplesSeparator);
        }

        if (currentEntry.twoD) {
          currentEntry.yType = dataValue.split(ntuplesSeparator)[0];
        }
      } else if (canonicDataLabel === 'PAGE') {
        spectrum.page = dataValue.trim();
        spectrum.pageValue = parseFloat(dataValue.replace(/^.*=/, ''));
        spectrum.pageSymbol = spectrum.page.replace(/[=].*/, '');
      } else if (canonicDataLabel === 'RETENTIONTIME') {
        spectrum.pageValue = parseFloat(dataValue);
      } else if (isMSField(canonicDataLabel)) {
        spectrum[convertMSFieldToLabel(canonicDataLabel)] = dataValue;
      } else if (canonicDataLabel === 'SAMPLEDESCRIPTION') {
        spectrum.sampleDescription = dataValue;
      } else if (canonicDataLabel === 'END') {
        currentEntry = parentsStack.pop();
      }

      if (currentEntry && currentEntry.info && currentEntry.meta && canonicDataLabel.match(options.keepRecordsRegExp)) {
        let value = dataValue.trim();
        let target, label;

        if (dataLabel.startsWith('$')) {
          label = options.canonicMetadataLabels ? canonicDataLabel.substring(1) : dataLabel.substring(1);
          target = currentEntry.meta;
        } else {
          label = options.canonicDataLabels ? canonicDataLabel : dataLabel;
          target = currentEntry.info;
        }

        if (options.dynamicTyping) {
          let parsedValue = Number.parseFloat(value);
          if (!Number.isNaN(parsedValue)) value = parsedValue;
        }

        if (target[label]) {
          if (!Array.isArray(target[label])) {
            target[label] = [target[label]];
          }

          target[label].push(value);
        } else {
          target[label] = value;
        }
      }
    }

    profiling(result, 'Finished parsing', options);
    postProcessing(entriesFlat, result, options);
    profiling(result, 'Total time', options);
    /*
    if (result.children && result.children.length>0) {
      result = { ...result, ...result.children[0] };
    }
    */

    result.entries = tmpResult.children;
    result.flatten = entriesFlat;
    return result;
  }

  exports.convert = convert;
  exports.createTree = createTree;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=jcampconverter.js.map
