"use strict";

define(["module", './data'], function (module, data) {
  module.exports = {
    run: run,
    scoringMatrix: data.scoringMatrix
  };
  /**
   * Find the optimal alignment between two strings using the
   * Needleman and Wunsch algorithm
   * @param {string} v
   * @param {string} w
   * @param {object} options { indel, scoringMatrix }
   * @return {object} alignment { score, vAligned, wAligned }
   */

  function run(v, w) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var S = options.scoringMatrix || data.scoringMatrix({
      v: v,
      w: w
    });
    var indel = options.indel || -1;
    var sigma = options.sigma || indel;
    var epsilon = options.epsilon || indel;
    var shouldReturnMatrix = options.matrix || false;
    var middle = data.createTable(v, w);
    var lower = JSON.parse(JSON.stringify(middle));
    var upper = JSON.parse(JSON.stringify(middle));
    var n = middle.length;
    var m = middle[0].length;
    var B = JSON.parse(JSON.stringify(middle));
    var i;
    var j; // Fill in borders

    for (i = 1; i < n; i++) {
      middle[i][0] = sigma + (i - 1) * epsilon;
      lower[i][0] = sigma + (i - 1) * epsilon;
      upper[i][0] = -1e9;
    }

    for (j = 1; j < m; j++) {
      middle[0][j] = sigma + (j - 1) * epsilon;
      lower[0][j] = -1e9;
      upper[0][j] = sigma + (j - 1) * epsilon;
    } // Traverse the grid


    for (i = 1; i < n; i++) {
      for (j = 1; j < m; j++) {
        var matrixScore = void 0;

        try {
          matrixScore = S[v[i - 1]][w[j - 1]];
        } catch (e) {
          // e.g. a letter is not found in the matrix
          matrixScore = indel;
        }

        var match = middle[i - 1][j - 1] + matrixScore;
        upper[i][j] = Math.max(upper[i][j - 1] + epsilon, middle[i][j - 1] + sigma);
        lower[i][j] = Math.max(lower[i - 1][j] + epsilon, middle[i - 1][j] + sigma);
        middle[i][j] = [match, upper[i][j], lower[i][j]].reduce(function (a, b) {
          return Math.max(a, b);
        }); // Keep arrows for easier backtracking

        if (middle[i][j] === match) {
          B[i][j] = '\\';
        } else if (middle[i][j] === upper[i][j]) {
          B[i][j] = '-';
        } else {
          B[i][j] = '|';
        }
      }
    }

    var score = middle[i - 1][j - 1]; // String alignment

    var vAligned = '';
    var wAligned = '';
    i = n - 1;
    j = m - 1;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && B[i][j] === '\\') {
        vAligned = v[i - 1] + vAligned;
        wAligned = w[j - 1] + wAligned;
        i--;
        j--;
      } else if (j > 0 && B[i][j] === '-') {
        vAligned = "-".concat(vAligned);
        wAligned = w[j - 1] + wAligned;
        j--;
      } else {
        vAligned = v[i - 1] + vAligned;
        wAligned = "-".concat(wAligned);
        i--;
      }
    }

    var matrix = shouldReturnMatrix ? middle : null;
    return {
      score: score,
      vAligned: vAligned,
      wAligned: wAligned,
      matrix: matrix
    };
  }
});