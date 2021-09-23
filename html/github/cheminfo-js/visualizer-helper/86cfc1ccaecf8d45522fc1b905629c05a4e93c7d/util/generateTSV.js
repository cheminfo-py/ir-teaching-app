import _ from 'lodash';

/*
Example:
const array=API.getData('fragments').resurrect().filter( fragment => fragment.display);

let options={
    Type: 'modification',
    MF: 'mf',
    Adduct: 'ionization.mf',
    'MF mass': 'em',
    'm/z': 'ms.em',
    'Δ ppm': 'ms.ppm',
    'z': 'ms.charge',
    'Intensity': 'ms.target.similariy',
    'Similarity': 'ms.similarity.value',
    '%': 'ms.similarity.quantity',
    'Group': 'group.count',
    msEM: 'ms.em',
}
*/

/**
 * Generates a TSV from an array and options (jpath)
 * @param {*} array
 * @param {*} options
 */

export default function generateTSV(array, options) {
  let targets = [];
  for (let key in options) {
    targets.push({
      header: key,
      target: options[key],
      callback: _.property(options[key] || key),
    });
  }

  let lines = [targets.map((entry) => entry.header).join('\t')];
  for (let item of array) {
    lines.push(targets.map((target) => target.callback(item)).join('\t'));
  }
  return lines.join('\n');
}
