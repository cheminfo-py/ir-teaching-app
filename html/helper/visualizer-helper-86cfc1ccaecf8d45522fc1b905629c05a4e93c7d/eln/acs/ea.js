import MolecularFormula from '../libs/MolecularFormula';

export default function toHtml(value, options = {}) {
  const { mf, elements = ['C', 'H', 'N', 'S'] } = options;
  if (!mf) {
    return 'Missing theoretical MF';
  }
  let theoretical = [];
  let found = [];
  let mfObject = new MolecularFormula.MF(String(options.mf));
  mfObject.canonize();
  let ea = mfObject.getEA();
  if (Array.isArray(value)) {
    value = findBest(value, ea);
  }

  for (let element of elements) {
    let field = element.toLowerCase();
    if (value[field]) {
      let oneTheoretical = ea.filter((ea) => ea.element === element);
      let th = oneTheoretical.length ? oneTheoretical[0].ratio * 100 : 0;
      theoretical.push(`${element.toUpperCase()}, ${th.toFixed(2)}`);
      found.push(
        `${element.toUpperCase()}, ${(value[field] * 100).toFixed(2)}`
      );
    }
  }
  let result = `Anal. Calcd for ${mfObject.toHtml()}: `;
  result += theoretical.join('; ');
  result += '. Found: ';
  result += found.join('; ');
  result += '.';
  return result;
}

function findBest(eas, theoretical) {
  let bestError = Number.MAX_VALUE;
  let bestEA;
  for (var ea of eas) {
    let error = 0;
    for (let th of theoretical) {
      let key = th.element.toLowerCase();
      if (ea[key]) {
        error += Math.abs(ea[key] - th.ratio);
      }
    }
    if (error < bestError) {
      bestError = error;
      bestEA = ea;
    }
  }
  return bestEA;
}
