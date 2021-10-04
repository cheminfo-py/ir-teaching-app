const data = require('./data');

module.exports = {
  run,
  scoringMatrix: data.scoringMatrix,
};

/**
 * Find the optimal alignment between two strings using the
 * Needleman and Wunsch algorithm
 * @param {string} v
 * @param {string} w
 * @param {object} options { indel, scoringMatrix }
 * @return {object} alignment { score, vAligned, wAligned }
 */
function run(v, w, options = {}) {
  let S = options.scoringMatrix || data.scoringMatrix({ v, w });
  let indel = options.indel || -1;
  let sigma = options.sigma || indel;
  let epsilon = options.epsilon || indel;
  let shouldReturnMatrix = options.matrix || false;

  let middle = data.createTable(v, w);
  let lower = JSON.parse(JSON.stringify(middle));
  let upper = JSON.parse(JSON.stringify(middle));
  let n = middle.length;
  let m = middle[0].length;
  let B = JSON.parse(JSON.stringify(middle));

  let i;
  let j;

  // Fill in borders
  for (i = 1; i < n; i++) {
    middle[i][0] = sigma + (i - 1) * epsilon;
    lower[i][0] = sigma + (i - 1) * epsilon;
    upper[i][0] = -1e9;
  }

  for (j = 1; j < m; j++) {
    middle[0][j] = sigma + (j - 1) * epsilon;
    lower[0][j] = -1e9;
    upper[0][j] = sigma + (j - 1) * epsilon;
  }

  // Traverse the grid
  for (i = 1; i < n; i++) {
    for (j = 1; j < m; j++) {
      let matrixScore;
      try {
        matrixScore = S[v[i - 1]][w[j - 1]];
      } catch (e) {
        // e.g. a letter is not found in the matrix
        matrixScore = indel;
      }

      let match = middle[i - 1][j - 1] + matrixScore;
      upper[i][j] = Math.max(
        upper[i][j - 1] + epsilon,
        middle[i][j - 1] + sigma,
      );
      lower[i][j] = Math.max(
        lower[i - 1][j] + epsilon,
        middle[i - 1][j] + sigma,
      );
      middle[i][j] = [match, upper[i][j], lower[i][j]].reduce((a, b) =>
        Math.max(a, b),
      );

      // Keep arrows for easier backtracking
      if (middle[i][j] === match) {
        B[i][j] = '\\';
      } else if (middle[i][j] === upper[i][j]) {
        B[i][j] = '-';
      } else {
        B[i][j] = '|';
      }
    }
  }

  let score = middle[i - 1][j - 1];

  // String alignment
  let vAligned = '';
  let wAligned = '';
  i = n - 1;
  j = m - 1;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && B[i][j] === '\\') {
      vAligned = v[i - 1] + vAligned;
      wAligned = w[j - 1] + wAligned;
      i--;
      j--;
    } else if (j > 0 && B[i][j] === '-') {
      vAligned = `-${vAligned}`;
      wAligned = w[j - 1] + wAligned;
      j--;
    } else {
      vAligned = v[i - 1] + vAligned;
      wAligned = `-${wAligned}`;
      i--;
    }
  }

  let matrix = shouldReturnMatrix ? middle : null;
  return { score, vAligned, wAligned, matrix };
}
