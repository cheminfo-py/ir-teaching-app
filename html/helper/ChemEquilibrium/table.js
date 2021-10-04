
module.exports = function getTable(sol) {
  var result = [];
  result.push(`x\t${sol.species.join('\t')}`);
  for (var i = 0; i < sol.x.length; i++) {
    var line = [];
    line.push(sol.x[i]);
    for (var specie of sol.species) {
      line.push(sol.solutions[i][specie]);
    }
    result.push(line.join('\t'));
  }
  return result.join('\r\n');
};
