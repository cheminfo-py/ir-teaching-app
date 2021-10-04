"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/main/datas', 'src/util/ui', 'browserified/twig/twig', 'canvg', '../../libs/Image', 'openchemlib/openchemlib-core'], function (Datas, UI, _twig, canvg, IJS, OCL) {
  IJS = IJS["default"];
  var DataObject = Datas.DataObject;
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; // Use a lookup table to find the index.

  var lookup = new Uint8Array(256);

  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  return {
    twig: function () {
      var _twig2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(printFormat, data, options) {
        var res, template, text;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(printFormat.customFields && printFormat.customFields.length)) {
                  _context.next = 10;
                  break;
                }

                if (!options.creation) {
                  _context.next = 5;
                  break;
                }

                printFormat.customFields.forEach(function (field) {
                  data[field.name] = field.label;
                });
                _context.next = 10;
                break;

              case 5:
                _context.next = 7;
                return fillFields(printFormat.customFields, data);

              case 7:
                res = _context.sent;

                if (!(res === null)) {
                  _context.next = 10;
                  break;
                }

                return _context.abrupt("return", null);

              case 10:
                if (printFormat.twig) {
                  _context.next = 12;
                  break;
                }

                throw new Error('twig processor expect twig property in format');

              case 12:
                template = _twig.twig({
                  data: DataObject.resurrect(printFormat.twig)
                }); // Render molfile if exists

                text = template.render(DataObject.resurrect(data));

                if (data.debug && printFormat.dimensions.height && printFormat.dimensions.width) {
                  text = enhanceDebug(printFormat, text);
                }

                if (!(data.molfile && printFormat.molfileOptions && printFormat.molfileOptions.width > 100 && printFormat.molfileOptions.height > 100)) {
                  _context.next = 23;
                  break;
                }

                if (!(printFormat.printerType === 'zebra')) {
                  _context.next = 20;
                  break;
                }

                return _context.abrupt("return", enhanceZebraFormat(printFormat, text, data));

              case 20:
                return _context.abrupt("return", enhanceCognitiveFormat(printFormat, text, data));

              case 21:
                _context.next = 24;
                break;

              case 23:
                return _context.abrupt("return", Promise.resolve(text));

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function twig(_x, _x2, _x3) {
        return _twig2.apply(this, arguments);
      }

      return twig;
    }(),
    getMolImage: getMolImage
  };

  function checkIfMolfile(data) {
    if (data.molfile && data.molfile.split(/[\r\n]+/).length > 5) {
      return true;
    }

    return false;
  }

  function enhanceZebraFormat(_x4, _x5, _x6) {
    return _enhanceZebraFormat.apply(this, arguments);
  }

  function _enhanceZebraFormat() {
    _enhanceZebraFormat = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(printFormat, text, data) {
      var renderingScale, width, height, molfileOptions, image, hexa, totalBytes, bytesPerRow;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (checkIfMolfile(data)) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", text);

            case 2:
              renderingScale = printFormat.molfileOptions.renderingScale || 1;
              width = Math.ceil(printFormat.molfileOptions.width / 8) * 8;
              height = Math.ceil(printFormat.molfileOptions.height / 8) * 8;
              molfileOptions = Object.assign({}, printFormat.molfileOptions, {
                width: width,
                height: height,
                renderingScale: renderingScale
              });
              _context2.next = 8;
              return getMolImage(data.molfile, molfileOptions);

            case 8:
              image = _context2.sent;
              image = image.invert(); // Why do we need to invert here but not when encoding in BMP?

              _context2.next = 12;
              return dataToHexa(image.data);

            case 12:
              hexa = _context2.sent;
              totalBytes = image.width * image.height / 8;
              bytesPerRow = image.width / 8;
              text = text.replace(/\^XZ[\r\n]+$/, "^FO".concat(printFormat.molfileOptions.x || 0, ",").concat(printFormat.molfileOptions.y || 0, "^XGR:SAMPLE.GRF,1,1\r\n^XZ"));
              return _context2.abrupt("return", "~DGR:SAMPLE.GRF,".concat(totalBytes, ",").concat(bytesPerRow, ",").concat(hexa, "\r\n").concat(text));

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _enhanceZebraFormat.apply(this, arguments);
  }

  function enhanceCognitiveFormat(_x7, _x8, _x9) {
    return _enhanceCognitiveFormat.apply(this, arguments);
  }

  function _enhanceCognitiveFormat() {
    _enhanceCognitiveFormat = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(printFormat, text, data) {
      var encoder, mol, end;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (checkIfMolfile(data)) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt("return", concatenate(Uint8Array, encoder.encode(text)));

            case 2:
              encoder = new TextEncoder();
              text = text.replace(/END\s*$/, '');
              text += "GRAPHIC BMP ".concat(printFormat.molfileOptions.x || 0, " ").concat(printFormat.molfileOptions.y || 0, "\n");
              _context3.next = 7;
              return getMolBmp(data.molfile, printFormat.molfileOptions);

            case 7:
              mol = _context3.sent;
              end = '\n!+ 0 100 200 1\nEND\n';
              return _context3.abrupt("return", concatenate(Uint8Array, encoder.encode(text), mol, encoder.encode(end)));

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _enhanceCognitiveFormat.apply(this, arguments);
  }

  function enhanceDebug(printFormat, text) {
    // convert milimiters to dots
    var dpi = printFormat.dpi || 300;
    var _printFormat$dimensio = printFormat.dimensions,
        width = _printFormat$dimensio.width,
        height = _printFormat$dimensio.height;
    var dotsW = Math.floor(width / 25.4 * dpi);
    var dotsH = Math.floor(height / 25.4 * dpi);
    text = text.replace(/\^XZ[\r\n]+$/, "\n^FO0,0\n^GB".concat(dotsW, ",").concat(dotsH, ",5^FS\r\n\n^XZ\r\n"));
    return text;
  }

  function getMolImage(_x10) {
    return _getMolImage.apply(this, arguments);
  }

  function _getMolImage() {
    _getMolImage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(molfile) {
      var options,
          defaultMolOptions,
          renderingScale,
          mol,
          svgString,
          canvas,
          pngUrl,
          image,
          mask,
          _args4 = arguments;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              options = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
              defaultMolOptions = {
                width: 100
              };
              renderingScale = options.renderingScale || 1;
              options = Object.assign({}, defaultMolOptions, options);
              if (!options.height) options.height = options.width;
              mol = OCL.Molecule.fromMolfile(molfile);
              svgString = mol.toSVG(options.width / renderingScale, options.height / renderingScale, '', {
                noImplicitAtomLabelColors: true,
                suppressChiralText: true,
                suppressESR: true,
                suppressCIPParity: true,
                noStereoProblem: true,
                fontWeight: 'bold',
                strokeWidth: 1.5,
                factorTextSize: 1.4
              });
              canvas = document.createElement('canvas');
              canvas.height = options.height;
              canvas.width = options.width;
              canvg(canvas, svgString, {
                ignoreDimensions: true,
                log: true,
                scaleWidth: options.width,
                scaleHeight: options.height
              });
              pngUrl = canvas.toDataURL('png');
              _context4.next = 14;
              return IJS.load(pngUrl);

            case 14:
              image = _context4.sent;
              mask = image.grey({
                keepAlpha: true
              }).mask({
                threshold: 0.9
              });
              return _context4.abrupt("return", mask);

            case 17:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _getMolImage.apply(this, arguments);
  }

  function getMolBmp(_x11, _x12) {
    return _getMolBmp.apply(this, arguments);
  }

  function _getMolBmp() {
    _getMolBmp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(molfile, options) {
      var mask, bmp;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return getMolImage(molfile, options);

            case 2:
              mask = _context5.sent;
              bmp = mask.toBase64('bmp');
              return _context5.abrupt("return", decode(bmp));

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _getMolBmp.apply(this, arguments);
  }

  function concatenate(resultConstructor) {
    var totalLength = 0;

    for (var _len = arguments.length, arrays = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      arrays[_key - 1] = arguments[_key];
    }

    for (var _i = 0, _arrays = arrays; _i < _arrays.length; _i++) {
      var arr = _arrays[_i];
      totalLength += arr.length;
    }

    var result = new resultConstructor(totalLength);
    var offset = 0;

    for (var _i2 = 0, _arrays2 = arrays; _i2 < _arrays2.length; _i2++) {
      var _arr = _arrays2[_i2];
      result.set(_arr, offset);
      offset += _arr.length;
    }

    return result;
  }

  function decode(base64) {
    var bufferLength = base64.length * 0.75;
    var len = base64.length;
    var i;
    var p = 0;
    var encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === '=') {
      bufferLength--;

      if (base64[base64.length - 2] === '=') {
        bufferLength--;
      }
    }

    var bytes = new Uint8Array(bufferLength);

    for (i = 0; i < len; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i + 1)];
      encoded3 = lookup[base64.charCodeAt(i + 2)];
      encoded4 = lookup[base64.charCodeAt(i + 3)];
      bytes[p++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }

    return bytes;
  }

  function dataToHexa(arr) {
    return Array.prototype.map.call(arr, function (n) {
      var hex = n.toString(16);
      if (hex.length === 1) hex = "0".concat(hex);
      return hex;
    }).join('');
  }

  function fillFields(fields, data) {
    // if all the fields are already defined we don't ask for the values
    var allDefined = true;

    var _iterator = _createForOfIteratorHelper(fields),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var field = _step.value;

        if (data[field.name] === undefined) {
          allDefined = false;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (allDefined) return data;
    return UI.form("\n            <div>\n                <form>\n                <table>\n                    ".concat(fields.map(renderField), "\n                </table>\n                <input type=\"submit\"/>\n                </form>\n            </div>\n    "), data);
  }

  function renderField(field) {
    return "\n            <tr>\n                <td>".concat(field.label, "</td>\n                <td>\n                    <input type=\"text\" name=\"").concat(field.name, "\" />   \n                </td>\n            </tr>\n        ");
  }
});