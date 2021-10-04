export function explodeNucleic(nucleic) {
  const result = [];
  if (!nucleic) return result;
  for (let i = 0; i < nucleic.length; i++) {
    const { seq, ...otherFeatures } = nucleic[i];
    for (let j = 0; j < seq.length; j++) {
      result.push({
        ...otherFeatures,
        seq: seq[j]
      });
    }
  }
  return result;
}
