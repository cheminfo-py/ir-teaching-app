module.exports = {
  async getNextID(roc, prefix) {
    var v = await roc.view('sampleId', {
      reduce: true
    });

    if (!v.length || !v[0].value || !v[0].value[prefix]) {
      return `${prefix}-000001-${getCheckDigit(1)}`;
    }

    var id = v[0].value[prefix];
    var current = Number(id);
    var nextID = current + 1;
    var check = getCheckDigit(nextID);
    var nextIDStr = String(nextID);
    return `${prefix}-${'0'.repeat(6 - nextIDStr.length)}${nextIDStr}-${check}`;
  }
};

function getCheckDigit(number) {
  var str = number.toString();
  var strlen = str.length;
  var idx = 1;
  var total = 0;
  for (var i = strlen - 1; i >= 0; i--) {
    var el = +str.charAt(i);
    total += el * idx++;
  }
  var checkDigit = total % 10;
  return checkDigit;
}
