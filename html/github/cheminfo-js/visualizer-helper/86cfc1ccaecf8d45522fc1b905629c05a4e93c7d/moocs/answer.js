
define(['mathjs'], function (mathjs) {
  var exports = {};

  exports.isCorrect = function (sol, ans, options) {
    sol = String(sol);
    ans = String(ans);
    options = Object.assign({}, options);
    // Absolute error
    // if no units, same units as answer
    options.relativeError = Number(options.relativeError);
    if (options.absoluteError !== undefined) {
      options.absoluteError = String(options.absoluteError);
      try {
        var errorUnit = mathjs.unit(options.absoluteError);
      } catch (e) {
        if (e.message.match(/no units/)) {
          options.absoluteError = +options.absoluteError;
        } else {
          options.absoluteError = null;
        }
      }
    }

    try {
      var solUnit = mathjs.unit(String(sol));
    } catch (e) {
      if (e.message.match(/no units/)) {
        sol = +sol;
        ans = +ans;
        if (isNaN(ans)) {
          return {
            correct: false,
            reason: 'did not expect units in answer'
          };
        } else {
          return isCorrect(sol, ans, options);
        }
      } else {
        return {
          correct: false,
          reason: `in solution: ${e.message}`
        };
      }
    }

    try {
      var ansUnit = mathjs.unit(String(ans));
      var solU = solUnit.formatUnits();
    } catch (e) {
      return {
        correct: false,
        reason: `in answer: ${e.message}`
      };
    }

    if (!solUnit.equalBase(ansUnit)) {
      return {
        correct: false,
        reason: 'answer has wrong units'
      };
    } else {
      sol = solUnit.toNumber(solU);
      ans = ansUnit.toNumber(solU);
      if (errorUnit) {
        options.absoluteError = errorUnit.toNumber(solU);
      }
      return isCorrect(sol, ans, options);
    }
  };

  return exports;
});

function isCorrect(sol, ans, options) {
  var absoluteError = options.absoluteError !== undefined && !isNaN(options.absoluteError) ? options.absoluteError : null;
  var relativeError = options.relativeError !== undefined && !isNaN(options.relativeError) ? options.relativeError : null;
  var order = getOrder(sol, ans);
  if (relativeError !== null) {
    if (Math.abs(sol - ans) > relativeError * sol) {
      return {
        correct: false,
        reason: 'wrong answer (within relative error)',
        order: order
      };
    }
  }

  if (absoluteError !== null) {
    absoluteError = Math.abs(absoluteError);
    var err = Math.abs(sol - ans);
    if (err > absoluteError) {
      return {
        correct: false,
        reason: 'wrong answer (within absolute error)',
        order
      };
    } else {
      return {
        correct: true,
        reason: relativeError === null ? 'correct answer (within absolute error)' : 'correct answer (within relative and absolute error)',
        order
      };
    }
  }

  if (relativeError !== null) {
    return {
      correct: true,
      reason: 'correct answer (within relative error)',
      order
    };
  }

  if (ans !== sol) {
    return {
      correct: false,
      reason: 'wrong answer (not equal)',
      order
    };
  } else {
    return {
      correct: true,
      reason: 'correct answer (is equal)',
      order
    };
  }

  // unreachable
}

function getOrder(sol, ans) {
  var ratio = ans / sol;
  return Math.round(Math.log10(ratio));
}
