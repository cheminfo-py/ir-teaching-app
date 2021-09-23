import SD from '../libs/SD';


export default function toHTML(value) {
  var acsString = '';
  if (value && value.range) {
    var ranges = new SD.Ranges(value.range);
    var nucleus = '1H';
    if (!Array.isArray(value.nucleus)) nucleus = [value.nucleus];
    acsString += ranges.getACS({
      nucleus,
      solvent: value.solvent,
      frequencyObserved: value.frequency
    });
  }
  return acsString;
}
