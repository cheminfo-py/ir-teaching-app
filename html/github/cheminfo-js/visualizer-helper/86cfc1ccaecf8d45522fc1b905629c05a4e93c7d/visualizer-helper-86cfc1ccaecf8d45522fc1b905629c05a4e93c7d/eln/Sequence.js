"use strict";

define(["module", "../biology/translateDNA", "./libs/MolecularFormula"], function (module, _translateDNA, _MolecularFormula) {
  var _translateDNA2 = _interopRequireDefault(_translateDNA);

  var _MolecularFormula2 = _interopRequireDefault(_MolecularFormula);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function F() {};

        return {
          s: F,
          n: function n() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function e(_e) {
            throw _e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function s() {
        it = o[Symbol.iterator]();
      },
      n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function e(_e2) {
        didErr = true;
        err = _e2;
      },
      f: function f() {
        try {
          if (!normalCompletion && it["return"] != null) it["return"]();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function explodeSequences(sample) {
    var sequencePeptidic = getFirstPeptide(sample);

    if (sequencePeptidic && sequencePeptidic.sequence) {
      sequencePeptidic.sequence = _MolecularFormula2["default"].Peptide.sequenceToMF(String(sequencePeptidic.sequence));
    }

    var sequenceNucleic = getFirstNucleotide(sample);

    if (sequenceNucleic && sequenceNucleic.sequence) {
      sequenceNucleic.sequence = _MolecularFormula2["default"].Nucleotide.sequenceToMF(String(sequenceNucleic.sequence));
    }

    sample.triggerChange();
  }

  function calculateMFFromPeptidic(sample) {
    var sequencePeptidic = getFirstPeptide(sample);

    if (sequencePeptidic) {
      var sequence = _MolecularFormula2["default"].Peptide.sequenceToMF(String(sequencePeptidic.sequence));

      sample.setChildSync(['$content', 'general', 'mf'], sequence);
    }
  }

  function calculateMFFromNucleic(sample) {
    var sequenceNucleic = getFirstNucleotide(sample);

    if (sequenceNucleic) {
      sequenceNucleic = JSON.parse(JSON.stringify(sequenceNucleic));
    } // get rid of datatypes


    if (sequenceNucleic && sequenceNucleic.sequence) {
      var sequence = _MolecularFormula2["default"].Nucleotide.sequenceToMF(sequenceNucleic.sequence, {
        kind: sequenceNucleic.moleculeType,
        circular: sequenceNucleic.circular,
        fivePrime: sequenceNucleic.fivePrime
      });

      sample.setChildSync(['$content', 'general', 'mf'], sequence);
    }
  }

  function calculateMFFromSequence(sample) {
    calculateMFFromNucleic(sample);
    calculateMFFromPeptidic(sample);
  }

  function getSequencesInformation(sample) {
    var biology = sample.getChildSync(['$content', 'biology']);
    var result = {
      nucleic: [],
      peptidic: []
    };

    if (biology.nucleic) {
      var _iterator = _createForOfIteratorHelper(biology.nucleic),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;

          if (entry.seq) {
            var _iterator2 = _createForOfIteratorHelper(entry.seq),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var sequence = _step2.value;

                var mf = _MolecularFormula2["default"].Nucleotide.sequenceToMF(String(sequence.sequence), {
                  kind: sequence.moleculeType,
                  circular: sequence.circular,
                  fivePrime: sequence.fivePrime
                });

                var mfInfo = new _MolecularFormula2["default"].MF(mf).getInfo();
                result.nucleic.push({
                  sequence: sequence,
                  mf: mf,
                  mfInfo: mfInfo
                });
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    if (biology.peptidic) {
      var _iterator3 = _createForOfIteratorHelper(biology.peptidic),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _entry = _step3.value;

          if (_entry.seq) {
            var antibody = {};

            var _iterator4 = _createForOfIteratorHelper(_entry.seq),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var _sequence = _step4.value;

                var _mf2 = _MolecularFormula2["default"].Peptide.sequenceToMF(String(_sequence.sequence));

                if (_sequence.moleculeType.match(/antibody.*light/i)) {
                  antibody.light = _mf2;
                }

                if (_sequence.moleculeType.match(/antibody.*heavy/i)) {
                  antibody.heavy = _mf2;
                }

                var _mfInfo2 = new _MolecularFormula2["default"].MF(_mf2).getInfo();

                result.peptidic.push({
                  sequence: _sequence,
                  mf: _mf2,
                  mfInfo: _mfInfo2,
                  iep: _MolecularFormula2["default"].Peptide.calculateIEP(_mf2)
                });
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }

            if (antibody.light && antibody.heavy) {
              var _mf = antibody.light + antibody.light + antibody.heavy + antibody.heavy;

              var _mfInfo = new _MolecularFormula2["default"].MF(_mf).getInfo();

              result.peptidic.push({
                sequence: {
                  moleculeType: 'Full antibody'
                },
                mf: _mf,
                mfInfo: _mfInfo // iep: MolecularFormula.Peptide.calculateIEP(mf),

              });
            }
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    return result;
  }

  function translateNucleic(sample) {
    var sequenceNucleic = sample.getChildSync(['$content', 'biology', 'nucleic']);
    var sequencePeptidic = [];

    var _iterator5 = _createForOfIteratorHelper(sequenceNucleic),
        _step5;

    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var nucleic = _step5.value;
        var peptidic = [];
        sequencePeptidic.push({
          seq: peptidic
        });

        if (Array.isArray(nucleic.seq)) {
          var _iterator6 = _createForOfIteratorHelper(nucleic.seq),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var entry = _step6.value;
              peptidic.push({
                sequence: (0, _translateDNA2["default"])(entry.sequence)
              });
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
        }
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }

    sample.setChildSync(['$content', 'biology', 'peptidic'], sequencePeptidic);
  }

  function getFirstPeptide(sample) {
    return sample.getChildSync(['$content', 'biology', 'peptidic', '0', 'seq', '0']);
  }

  function getFirstNucleotide(sample) {
    return sample.getChildSync(['$content', 'biology', 'nucleic', '0', 'seq', '0']);
  }

  var sequencesInformationTwigTemplate = "<style>\n#sequenceInfo h1 {\n    font-size: 1.5em;\n    padding-top: 1em;\n    padding-bottom: 0.4em;\n    color: darkblue;\n}\n#sequenceInfo h2 {\n    font-size: 1.2em;\n    padding-top: 1em;\n    padding-bottom: 0.4em;\n    color: darkblue;\n}\n#sequenceInfo td, #seuqneceInfo th {\n    padding: 0.2em;\n}\n#sequenceInfo table {\n    border-collapse: collapse;\n}\n#sequenceInfo th, #sequenceInfo td {\n    border-style: solid;\n    border-width: 1px 0px 1px 0px;\n    border-color: darkgrey;\n    font-size: 12px;\n    vertical-align: center;\n    height: 20px;\n}\n\n</style>\n\n<div id=\"sequenceInfo\">\n{% if sequencesInfo.nucleic.length>0 %}\n<h1>Nucleic</h1>\n<table>\n    <tr>\n        <th>Chain</th>\n        <th>Name</th>\n        <th>Type</th>\n        <th>MF</th>\n        <th>mw</th>\n    </tr>\n    {% for key, nucleic in sequencesInfo.nucleic %}\n        <tr>\n            <td>{{key+1}}</td>\n            <td>{{nucleic.sequence.name}}</td>\n            <td>{{nucleic.sequence.moleculeType}}</td>\n            <td>{{rendertype(nucleic.mfInfo.mf,'mf')}}</td>\n            <td>{{nucleic.mfInfo.mass|number_format(2)}}</td>\n        </tr>\n    {% endfor %}   \n</table>\n{% endif %}\n\n{% if sequencesInfo.peptidic.length>0 %}\n<h1>Peptidic</h1>\n<table>\n    <tr>\n        <th>Chain</th>\n        <th>Name</th>\n        <th>MF</th>\n        <th>mw</th>\n    </tr>\n    {% for key, peptidic in sequencesInfo.peptidic %}\n        <tr>\n            <td>{{key+1}}</td>\n            <td>{{peptidic.sequence.name}}</td>\n            <td>{{rendertype(peptidic.mfInfo.mf,'mf')}}</td>\n            <td>{{peptidic.mfInfo.mass|number_format(2)}}</td>\n        </tr>\n    {% endfor %}\n</table>\n<h2>Isoelectric point</h2>\n    <table>\n    <tr>\n        <th>Chain</th>\n        <th>Name</th>\n        <th>Type</th>\n        <th>IEP</th>\n    </tr>\n    {% for key, peptidic in sequencesInfo.peptidic %}\n      {% if peptidic.iep %}\n        <tr>\n          <td>{{key+1}}</td>\n          <td>{{peptidic.sequence.name}}</td>\n          <td>{{peptidic.sequence.moleculeType}}</td>\n          <td>\n            {{peptidic.iep|number_format(2)}}\n          </td>\n        </tr>\n      {% endif %}\n    {% endfor %}\n</table>\n{% endif %}\n</div>";
  module.exports = {
    calculateMFFromSequence: calculateMFFromSequence,
    calculateMFFromNucleic: calculateMFFromNucleic,
    calculateMFFromPeptidic: calculateMFFromPeptidic,
    explodeSequences: explodeSequences,
    getFirstNucleotide: getFirstNucleotide,
    getFirstPeptide: getFirstPeptide,
    getSequencesInformation: getSequencesInformation,
    sequencesInformationTwigTemplate: sequencesInformationTwigTemplate,
    translateNucleic: translateNucleic
  };
});