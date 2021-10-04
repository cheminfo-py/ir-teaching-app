"use strict";

define(["exports", "https://www.lactame.com/lib/NtSeq/HEAD/NtSeq.js"], function (exports, _NtSeq) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getFiltered = getFiltered;
  exports.matchDistribution = matchDistribution;

  var _NtSeq2 = _interopRequireDefault(_NtSeq);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var MAX_MISMATCH = 3;

  function getFiltered(data, selection, keys) {
    return data.filter(function (d) {
      loop1: for (var i = 0; i < selection.length; i++) {
        for (var j = 0; j < keys.length; j++) {
          if (String(d[keys[j]]) !== String(selection[i][keys[j]])) continue loop1;
        }

        return true;
      }

      return false;
    });
  }

  function matchDistribution(posSeq, negSeq, useNtSeq) {
    var allSeq = posSeq.concat(negSeq);
    var primerSet = getPrimers(allSeq, 20);
    var result = new Array(primerSet.size);
    var counter = 0;
    var fn;

    if (!useNtSeq) {
      fn = getMatchDistribution;
    } else {
      posSeq = posSeq.map(function (seq) {
        return new _NtSeq2["default"].Seq().read(seq);
      });
      negSeq = negSeq.map(function (seq) {
        return new _NtSeq2["default"].Seq().read(seq);
      });
      primerSet = primerSet.map(function (p) {
        return new _NtSeq2["default"].Seq().read(p);
      });
      fn = getMatchDistributionNtSeq;
    }

    primerSet.forEach(function (primer) {
      var pos = fn(primer, posSeq);
      var neg = fn(primer, negSeq);
      var r = {};
      r.pos = pos.bestMatches;
      r.neg = neg.bestMatches;
      r.posDistribution = pos.distribution;
      r.negDistribution = neg.distribution;
      r.primer = primer;
      result[counter] = r;
      counter++;
    }); // sort result

    result.sort(function (a, b) {
      for (var i = 0; i < MAX_MISMATCH + 1; i++) {
        var diff = a.pos[i] - a.neg[i] - (b.pos[i] - b.neg[i]);
        if (diff < 0) return 1;else if (diff > 0) return -1;
      }

      return 0;
    });
    return result;
  } // Seq comparison functions


  function getPrimers(sequences, primerLength) {
    var s = new Set();

    for (var i = 0; i < sequences.length; i++) {
      processSequence(s, sequences[i], primerLength);
    }

    return Array.from(s);
  }

  function processSequence(s, seq, primerLength) {
    for (var i = 0; i < seq.length - primerLength + 1; i++) {
      var primer = seq.substr(i, primerLength);
      s.add(primer);
    }
  }

  function findBestMatch(primer, seq) {
    var mismatches = MAX_MISMATCH + 1;
    var positions;

    for (var i = 0; i < seq.length - primer.length + 1; i++) {
      var subseq = seq.substr(i, primer.length);
      var m = countMismatches(subseq, primer);

      if (m < mismatches) {
        mismatches = m;
        positions = [i];
      } else if (m === mismatches && mismatches <= MAX_MISMATCH) {
        positions = positions || [];
        positions.push(i);
      }
    }

    return {
      mismatches: mismatches,
      positions: positions
    };
  }

  function getMatchDistribution(primer, sequences) {
    var bestMatches = sequences.map(function (seq, idx) {
      var bestMatch = findBestMatch(primer, seq);
      bestMatch.geneIdx = idx;
      return bestMatch;
    });
    var distribution = new Array(MAX_MISMATCH + 2).fill(0);
    bestMatches.forEach(function (best) {
      distribution[best.mismatches]++;
    });
    distribution = distribution.map(function (d) {
      return d / bestMatches.length;
    });
    return {
      distribution: distribution,
      bestMatches: bestMatches
    };
  }

  function getMatchDistributionNtSeq(primer, sequences) {
    return sequences.map(function (seq) {
      return seq.mapSequence(primer).__orderedResults[0];
    });
  }

  function countMismatches(seq1, seq2) {
    var mismatch = 0;

    for (var i = 0; i < seq1.length; i++) {
      if (seq1[i] !== seq2[i]) {
        mismatch++;
        if (mismatch === MAX_MISMATCH) return mismatch + 1;
      }
    }

    return mismatch;
  }
});