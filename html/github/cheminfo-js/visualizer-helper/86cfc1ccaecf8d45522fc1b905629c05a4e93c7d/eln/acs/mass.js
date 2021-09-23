import MolecularFormula from '../libs/MolecularFormula';

export default function toHTML(value) {
  let results = [];
  let exactMass = formatExactMass(value);
  if (exactMass) results.push(exactMass);
  let peaks = formatPeaks(value);
  if (peaks) results.push(peaks);
  return results.join(', ');
}

function getCharge(charge) {
  if (!charge) charge = 1;
  if (charge > 0) charge = `+${charge}`;
  if (charge === '+1') charge = '+';
  if (charge === -1) charge = '-';
  return `<sup>${charge}</sup>`;
}

function formatPeaks(value) {
  if (!value.peak || !value.peak.length > 0) return '';

  value = DataObject.resurrect(value);

  let experiment = [];
  experiment.push('MS');
  let inParenthesis = [];
  if (value.ionisation) inParenthesis.push(value.ionisation);
  if (value.analyzer) inParenthesis.push(value.analyzer);
  if (inParenthesis.length > 0) experiment.push(`(${inParenthesis.join('/')})`);
  experiment.push('m/z:');

  let peaks = [];
  let maxIntensity = 0;
  value.peak.forEach((peak) => {
    if (peak.intensity > maxIntensity) maxIntensity = peak.intensity;
  });
  let factor = 100 / maxIntensity;
  for (let peak of value.peak) {
    let value = peak.mass.toFixed(0);
    if (peak.intensity && maxIntensity) {
      value += ` (${Math.round(peak.intensity * factor)})`;
    }
    peaks.push(value);
  }

  return `${experiment.join(' ')} ${peaks.join(', ')}`;
}

function formatExactMass(value) {
  if (!value.accurate || !value.accurate.mf || !String(value.accurate.mf)) {
    return '';
  }

  let accurate = value.accurate;
  let mfInfo = new MolecularFormula.MF(
    `${accurate.mf}(${accurate.modification})`,
  ).getInfo();
  let modificationInfo = new MolecularFormula.MF(
    String(accurate.modification),
  ).getInfo();

  let result = [];
  let experiment = [];
  experiment.push('HRMS');
  let inParenthesis = [];
  if (value.ionisation) inParenthesis.push(value.ionisation);
  if (value.analyzer) inParenthesis.push(value.analyzer);
  if (inParenthesis.length > 0) experiment.push(`(${inParenthesis.join('/')})`);
  experiment.push('m/z:');
  result.push(experiment.join(' '));

  var modificationMF = new MolecularFormula.MF(
    modificationInfo.mf.replace(/\(.*/, ''),
  ).toHtml();
  if (modificationMF) {
    result.push(`[M + ${modificationMF}]${getCharge(modificationInfo.charge)}`);
  } else {
    result.push(`[M]${getCharge(modificationInfo.charge)}`);
  }
  result.push('Calcd for');
  var mf = mfInfo.mf
    .replace(/\(.*/, '')
    .replace(/([^+-])([0-9]+)/g, '$1<sub>$2</sub>');

  result.push(mf + getCharge(mfInfo.charge));

  result.push(`${mfInfo.observedMonoisotopicMass.toFixed(4)};`);
  result.push('Found');
  result.push(Number(accurate.value).toFixed(4));

  return `${result.join(' ')}.`;
}
