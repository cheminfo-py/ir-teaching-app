"use strict";

define(["module"], function (module) {
  // this code is coming from : https://github.com/Lattice-Automation/seqviz.git

  /**
   * mapping the 64 standard codons to amino acids
   * no synth AA's
   *
   * adapted from: "https://github.com/keithwhor/NtSeq/blob/master/lib/nt.js
   */
  var codon2AA = {
    AAA: 'K',
    AAT: 'N',
    AAG: 'K',
    AAC: 'N',
    ATA: 'I',
    ATT: 'I',
    ATG: 'M',
    ATC: 'I',
    AGA: 'R',
    AGT: 'S',
    AGG: 'R',
    AGC: 'S',
    ACA: 'T',
    ACT: 'T',
    ACG: 'T',
    ACC: 'T',
    TAA: '*',
    TAT: 'Y',
    TAG: '*',
    TAC: 'Y',
    TTA: 'L',
    TTT: 'F',
    TTG: 'L',
    TTC: 'F',
    TGA: '*',
    TGT: 'C',
    TGG: 'W',
    TGC: 'C',
    TCA: 'S',
    TCT: 'S',
    TCG: 'S',
    TCC: 'S',
    GAA: 'E',
    GAT: 'D',
    GAG: 'E',
    GAC: 'D',
    GTA: 'V',
    GTT: 'V',
    GTG: 'V',
    GTC: 'V',
    GGA: 'G',
    GGT: 'G',
    GGG: 'G',
    GGC: 'G',
    GCA: 'A',
    GCT: 'A',
    GCG: 'A',
    GCC: 'A',
    CAA: 'Q',
    CAT: 'H',
    CAG: 'Q',
    CAC: 'H',
    CTA: 'L',
    CTT: 'L',
    CTG: 'L',
    CTC: 'L',
    CGA: 'R',
    CGT: 'R',
    CGG: 'R',
    CGC: 'R',
    CCA: 'P',
    CCT: 'P',
    CCG: 'P',
    CCC: 'P'
  };

  function translateDNA(sequence) {
    sequence = sequence.toUpperCase();
    var aaSequence = '';

    for (var i = 0; i < sequence.length - 2; i += 3) {
      aaSequence += codon2AA[sequence[i] + sequence[i + 1] + sequence[i + 2]] || '?';
    }

    return aaSequence;
  }

  module.exports = translateDNA;
});