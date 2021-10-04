"use strict";

define(['https://www.lactame.com/lib/chemcalc/3.0.6/chemcalc.js', 'https://www.lactame.com/lib/ml/1.0.0/ml.js'], function (CC, ml) {
  var exports = {};

  exports.findCoefficients = function (reagents, products) {
    var atoms = {};
    var nbCoeff = reagents.length + products.length;
    var matrix = new Array(nbCoeff);

    for (var i = 0; i < nbCoeff; i++) {
      matrix[i] = [];
    }

    for (i = 0; i < reagents.length; i++) {
      var c = CC.analyseMF(reagents[i]);
      var part = c.parts[0];

      for (var k = 0; k < part.ea.length; k++) {
        var ea = part.ea[k];
        atoms[ea.element] = true;
        var idx = Object.keys(atoms).indexOf(ea.element);
        matrix[i][idx] = part.ea[k].number;
      }
    }

    for (i = reagents.length; i < nbCoeff; i++) {
      c = CC.analyseMF(products[i - reagents.length]);
      part = c.parts[0];

      for (k = 0; k < part.ea.length; k++) {
        ea = part.ea[k];
        atoms[ea.element] = true;
        idx = Object.keys(atoms).indexOf(ea.element);
        matrix[i][idx] = part.ea[k].number;
      }
    }

    var nbAtoms = Object.keys(atoms).length;

    for (i = 0; i < nbCoeff; i++) {
      for (var j = 0; j < nbAtoms; j++) {
        if (matrix[i][j] === undefined) {
          matrix[i][j] = 0;
        }

        if (i >= reagents.length) {
          matrix[i][j] = -matrix[i][j];
        }
      }
    }

    matrix = new ml.Matrix(matrix).transpose();
    var result;

    if (!matrix.isSquare()) {
      if (matrix.rows - matrix.columns === -1) {
        var trivialRow = new Array(matrix.columns).fill(0);
        trivialRow[0] = 1;
        var e = new Array(matrix.columns).fill([0]);
        e[matrix.columns - 1] = [1];
        matrix.addRow(matrix.rows, trivialRow);
        result = matrix.solve(e);
      } else {
        console.warn('cannot solve'); // eslint-disable-line no-console
      }
    } else {
      var LU = ml.Matrix.Decompositions.LU(matrix);

      if (LU.isSingular()) {
        var diag0Pos = findDiag0Pos(LU.LU);
        idx = LU.pivotVector.indexOf(diag0Pos);
        trivialRow = new Array(matrix.columns).fill(0);
        trivialRow[idx] = 1;
        e = new Array(matrix.columns).fill([0]);
        e[idx] = [1];
        matrix.setRow(idx, trivialRow);
        result = matrix.solve(e);
      } else {
        console.warn('cannot solve this case'); // eslint-disable-line no-console
      }
    }

    if (!result) return null;
    result = result.map(function (r) {
      return r[0];
    });
    return result;
  };

  exports.formatResult = function (reagents, products, result) {
    var rstr = reagents.map(function (value, index) {
      return "<span style=\"color:red;\">".concat(result[index], "</span>").concat(value);
    }).join(' + ');
    var pstr = products.map(function (value, index) {
      return "<span style=\"color:red;\">".concat(result[reagents.length + index], "</span>").concat(value);
    }).join(' + ');
    var str = "".concat(rstr, " \u2192 ").concat(pstr);
    return str;
  };

  function findDiag0Pos(matrix) {
    for (var i = 0; i < matrix.rows; i++) {
      // eslint-disable-next-line no-compare-neg-zero
      if (matrix[i][i] === 0 || matrix[i][i] === -0) return i;
    }

    return null;
  }

  return exports;
});