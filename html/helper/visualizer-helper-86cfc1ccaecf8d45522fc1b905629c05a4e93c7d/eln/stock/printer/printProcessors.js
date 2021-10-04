define([
  'src/main/datas',
  'src/util/ui',
  'browserified/twig/twig',
  'canvg',
  '../../libs/Image',
  'openchemlib/openchemlib-core'
], function (Datas, UI, twig, canvg, IJS, OCL) {
  IJS = IJS.default;
  const DataObject = Datas.DataObject;
  let chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  // Use a lookup table to find the index.
  let lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }
  return {
    twig: async function (printFormat, data, options) {
      if (printFormat.customFields && printFormat.customFields.length) {
        if (options.creation) {
          printFormat.customFields.forEach((field) => {
            data[field.name] = field.label;
          });
        } else {
          const res = await fillFields(printFormat.customFields, data);
          if (res === null) return null;
        }
      }
      if (!printFormat.twig) {
        throw new Error('twig processor expect twig property in format');
      }
      var template = twig.twig({
        data: DataObject.resurrect(printFormat.twig)
      });
      // Render molfile if exists
      var text = template.render(DataObject.resurrect(data));
      if (
        data.debug &&
        printFormat.dimensions.height &&
        printFormat.dimensions.width
      ) {
        text = enhanceDebug(printFormat, text);
      }
      if (
        data.molfile &&
        printFormat.molfileOptions &&
        printFormat.molfileOptions.width > 100 &&
        printFormat.molfileOptions.height > 100
      ) {
        if (printFormat.printerType === 'zebra') {
          return enhanceZebraFormat(printFormat, text, data);
        } else {
          return enhanceCognitiveFormat(printFormat, text, data);
        }
      } else {
        return Promise.resolve(text);
      }
    },
    getMolImage
  };

  function checkIfMolfile(data) {
    if (data.molfile && data.molfile.split(/[\r\n]+/).length > 5) {
      return true;
    }
    return false;
  }

  async function enhanceZebraFormat(printFormat, text, data) {
    if (!checkIfMolfile(data)) return text;
    const renderingScale = printFormat.molfileOptions.renderingScale || 1;
    const width = Math.ceil(printFormat.molfileOptions.width / 8) * 8;
    const height = Math.ceil(printFormat.molfileOptions.height / 8) * 8;
    const molfileOptions = Object.assign({}, printFormat.molfileOptions, {
      width,
      height,
      renderingScale
    });
    let image = await getMolImage(data.molfile, molfileOptions);
    image = image.invert(); // Why do we need to invert here but not when encoding in BMP?
    const hexa = await dataToHexa(image.data);
    const totalBytes = (image.width * image.height) / 8;
    const bytesPerRow = image.width / 8;
    text = text.replace(
      /\^XZ[\r\n]+$/,
      `^FO${printFormat.molfileOptions.x || 0},${
        printFormat.molfileOptions.y || 0
      }^XGR:SAMPLE.GRF,1,1\r\n^XZ`
    );
    return `~DGR:SAMPLE.GRF,${totalBytes},${bytesPerRow},${hexa}\r\n${text}`;
  }

  async function enhanceCognitiveFormat(printFormat, text, data) {
    if (!checkIfMolfile(data)) {
      return concatenate(Uint8Array, encoder.encode(text));
    }
    const encoder = new TextEncoder();
    text = text.replace(/END\s*$/, '');
    text += `GRAPHIC BMP ${printFormat.molfileOptions.x || 0} ${
      printFormat.molfileOptions.y || 0
    }\n`;
    const mol = await getMolBmp(data.molfile, printFormat.molfileOptions);
    const end = '\n!+ 0 100 200 1\nEND\n';
    return concatenate(
      Uint8Array,
      encoder.encode(text),
      mol,
      encoder.encode(end)
    );
  }

  function enhanceDebug(printFormat, text) {
    // convert milimiters to dots
    const dpi = printFormat.dpi || 300;
    const { width, height } = printFormat.dimensions;
    const dotsW = Math.floor((width / 25.4) * dpi);
    const dotsH = Math.floor((height / 25.4) * dpi);
    text = text.replace(
      /\^XZ[\r\n]+$/,
      `
^FO0,0
^GB${dotsW},${dotsH},5^FS\r\n
^XZ\r\n`
    );
    return text;
  }

  async function getMolImage(molfile, options = {}) {
    const defaultMolOptions = {
      width: 100
    };
    const renderingScale = options.renderingScale || 1;
    options = Object.assign({}, defaultMolOptions, options);
    if (!options.height) options.height = options.width;
    const mol = OCL.Molecule.fromMolfile(molfile);
    const svgString = mol.toSVG(
      options.width / renderingScale,
      options.height / renderingScale,
      '',
      {
        noImplicitAtomLabelColors: true,
        suppressChiralText: true,
        suppressESR: true,
        suppressCIPParity: true,
        noStereoProblem: true,
        fontWeight: 'bold',
        strokeWidth: 1.5,
        factorTextSize: 1.4
      }
    );
    const canvas = document.createElement('canvas');
    canvas.height = options.height;
    canvas.width = options.width;
    canvg(canvas, svgString, {
      ignoreDimensions: true,
      log: true,
      scaleWidth: options.width,
      scaleHeight: options.height
    });

    var pngUrl = canvas.toDataURL('png');

    var image = await IJS.load(pngUrl);

    var mask = image.grey({ keepAlpha: true }).mask({ threshold: 0.9 });
    return mask;
  }

  async function getMolBmp(molfile, options) {
    const mask = await getMolImage(molfile, options);
    const bmp = mask.toBase64('bmp');
    return decode(bmp);
  }

  function concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (let arr of arrays) {
      totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }

  function decode(base64) {
    let bufferLength = base64.length * 0.75;
    let len = base64.length;
    let i;
    let p = 0;
    let encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === '=') {
      bufferLength--;
      if (base64[base64.length - 2] === '=') {
        bufferLength--;
      }
    }

    const bytes = new Uint8Array(bufferLength);

    for (i = 0; i < len; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i + 1)];
      encoded3 = lookup[base64.charCodeAt(i + 2)];
      encoded4 = lookup[base64.charCodeAt(i + 3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return bytes;
  }

  function dataToHexa(arr) {
    return Array.prototype.map
      .call(arr, function (n) {
        let hex = n.toString(16);
        if (hex.length === 1) hex = `0${hex}`;
        return hex;
      })
      .join('');
  }

  function fillFields(fields, data) {
    // if all the fields are already defined we don't ask for the values
    let allDefined = true;
    for (let field of fields) {
      if (data[field.name] === undefined) {
        allDefined = false;
      }
    }
    if (allDefined) return data;

    return UI.form(
      `
            <div>
                <form>
                <table>
                    ${fields.map(renderField)}
                </table>
                <input type="submit"/>
                </form>
            </div>
    `,
      data
    );
  }

  function renderField(field) {
    return `
            <tr>
                <td>${field.label}</td>
                <td>
                    <input type="text" name="${field.name}" />   
                </td>
            </tr>
        `;
  }
});
