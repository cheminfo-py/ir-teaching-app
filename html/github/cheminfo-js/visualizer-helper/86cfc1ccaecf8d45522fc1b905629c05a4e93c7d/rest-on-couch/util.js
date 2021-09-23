
module.exports = {
  async getNextId(roc, viewName, type) {
    const v = await roc.view(viewName, {
      reduce: true
    });

    if (!v.length || !v[0].value || !v[0].value[type]) {
      return `${type}-000001-${getCheckDigit(1)}`;
    }

    var id = v[0].value[type];
    var current = Number(id);
    var nextID = current + 1;
    return numberToId(nextID, type);
  },
  numberToId
};

function numberToId(num, type) {
  var check = getCheckDigit(num);
  var numStr = String(num);
  return `${type}-${'0'.repeat(6 - numStr.length)}${numStr}-${check}`;
}

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
