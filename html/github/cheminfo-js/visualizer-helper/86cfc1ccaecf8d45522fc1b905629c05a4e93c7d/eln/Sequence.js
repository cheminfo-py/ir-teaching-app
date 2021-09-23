import translateDNA from '../biology/translateDNA';

import MolecularFormula from './libs/MolecularFormula';

function explodeSequences(sample) {
  var sequencePeptidic = getFirstPeptide(sample);

  if (sequencePeptidic && sequencePeptidic.sequence) {
    sequencePeptidic.sequence = MolecularFormula.Peptide.sequenceToMF(
      String(sequencePeptidic.sequence),
    );
  }

  var sequenceNucleic = getFirstNucleotide(sample);
  if (sequenceNucleic && sequenceNucleic.sequence) {
    sequenceNucleic.sequence = MolecularFormula.Nucleotide.sequenceToMF(
      String(sequenceNucleic.sequence),
    );
  }
  sample.triggerChange();
}

function calculateMFFromPeptidic(sample) {
  const sequencePeptidic = getFirstPeptide(sample);
  if (sequencePeptidic) {
    let sequence = MolecularFormula.Peptide.sequenceToMF(
      String(sequencePeptidic.sequence),
    );
    sample.setChildSync(['$content', 'general', 'mf'], sequence);
  }
}

function calculateMFFromNucleic(sample) {
  let sequenceNucleic = getFirstNucleotide(sample);
  if (sequenceNucleic) {
    sequenceNucleic = JSON.parse(JSON.stringify(sequenceNucleic));
  } // get rid of datatypes
  if (sequenceNucleic && sequenceNucleic.sequence) {
    let sequence = MolecularFormula.Nucleotide.sequenceToMF(
      sequenceNucleic.sequence,
      {
        kind: sequenceNucleic.moleculeType,
        circular: sequenceNucleic.circular,
        fivePrime: sequenceNucleic.fivePrime,
      },
    );
    sample.setChildSync(['$content', 'general', 'mf'], sequence);
  }
}

function calculateMFFromSequence(sample) {
  calculateMFFromNucleic(sample);
  calculateMFFromPeptidic(sample);
}

function getSequencesInformation(sample) {
  const biology = sample.getChildSync(['$content', 'biology']);
  let result = { nucleic: [], peptidic: [] };
  if (biology.nucleic) {
    for (let entry of biology.nucleic) {
      if (entry.seq) {
        for (let sequence of entry.seq) {
          let mf = MolecularFormula.Nucleotide.sequenceToMF(
            String(sequence.sequence),
            {
              kind: sequence.moleculeType,
              circular: sequence.circular,
              fivePrime: sequence.fivePrime,
            },
          );
          let mfInfo = new MolecularFormula.MF(mf).getInfo();
          result.nucleic.push({
            sequence,
            mf,
            mfInfo,
          });
        }
      }
    }
  }
  if (biology.peptidic) {
    for (let entry of biology.peptidic) {
      if (entry.seq) {
        let antibody = {};
        for (let sequence of entry.seq) {
          let mf = MolecularFormula.Peptide.sequenceToMF(
            String(sequence.sequence),
          );
          if (sequence.moleculeType.match(/antibody.*light/i)) {
            antibody.light = mf;
          }
          if (sequence.moleculeType.match(/antibody.*heavy/i)) {
            antibody.heavy = mf;
          }
          let mfInfo = new MolecularFormula.MF(mf).getInfo();
          result.peptidic.push({
            sequence,
            mf,
            mfInfo,
            iep: MolecularFormula.Peptide.calculateIEP(mf),
          });
        }
        if (antibody.light && antibody.heavy) {
          let mf =
            antibody.light + antibody.light + antibody.heavy + antibody.heavy;
          let mfInfo = new MolecularFormula.MF(mf).getInfo();
          result.peptidic.push({
            sequence: { moleculeType: 'Full antibody' },
            mf,
            mfInfo,
            // iep: MolecularFormula.Peptide.calculateIEP(mf),
          });
        }
      }
    }
  }
  return result;
}

function translateNucleic(sample) {
  const sequenceNucleic = sample.getChildSync([
    '$content',
    'biology',
    'nucleic',
  ]);
  const sequencePeptidic = [];
  for (let nucleic of sequenceNucleic) {
    const peptidic = [];
    sequencePeptidic.push({ seq: peptidic });
    if (Array.isArray(nucleic.seq)) {
      for (let entry of nucleic.seq) {
        peptidic.push({
          sequence: translateDNA(entry.sequence),
        });
      }
    }
  }
  sample.setChildSync(['$content', 'biology', 'peptidic'], sequencePeptidic);
}

function getFirstPeptide(sample) {
  return sample.getChildSync([
    '$content',
    'biology',
    'peptidic',
    '0',
    'seq',
    '0',
  ]);
}

function getFirstNucleotide(sample) {
  return sample.getChildSync([
    '$content',
    'biology',
    'nucleic',
    '0',
    'seq',
    '0',
  ]);
}

const sequencesInformationTwigTemplate = `<style>
#sequenceInfo h1 {
    font-size: 1.5em;
    padding-top: 1em;
    padding-bottom: 0.4em;
    color: darkblue;
}
#sequenceInfo h2 {
    font-size: 1.2em;
    padding-top: 1em;
    padding-bottom: 0.4em;
    color: darkblue;
}
#sequenceInfo td, #seuqneceInfo th {
    padding: 0.2em;
}
#sequenceInfo table {
    border-collapse: collapse;
}
#sequenceInfo th, #sequenceInfo td {
    border-style: solid;
    border-width: 1px 0px 1px 0px;
    border-color: darkgrey;
    font-size: 12px;
    vertical-align: center;
    height: 20px;
}

</style>

<div id="sequenceInfo">
{% if sequencesInfo.nucleic.length>0 %}
<h1>Nucleic</h1>
<table>
    <tr>
        <th>Chain</th>
        <th>Name</th>
        <th>Type</th>
        <th>MF</th>
        <th>mw</th>
    </tr>
    {% for key, nucleic in sequencesInfo.nucleic %}
        <tr>
            <td>{{key+1}}</td>
            <td>{{nucleic.sequence.name}}</td>
            <td>{{nucleic.sequence.moleculeType}}</td>
            <td>{{rendertype(nucleic.mfInfo.mf,'mf')}}</td>
            <td>{{nucleic.mfInfo.mass|number_format(2)}}</td>
        </tr>
    {% endfor %}   
</table>
{% endif %}

{% if sequencesInfo.peptidic.length>0 %}
<h1>Peptidic</h1>
<table>
    <tr>
        <th>Chain</th>
        <th>Name</th>
        <th>MF</th>
        <th>mw</th>
    </tr>
    {% for key, peptidic in sequencesInfo.peptidic %}
        <tr>
            <td>{{key+1}}</td>
            <td>{{peptidic.sequence.name}}</td>
            <td>{{rendertype(peptidic.mfInfo.mf,'mf')}}</td>
            <td>{{peptidic.mfInfo.mass|number_format(2)}}</td>
        </tr>
    {% endfor %}
</table>
<h2>Isoelectric point</h2>
    <table>
    <tr>
        <th>Chain</th>
        <th>Name</th>
        <th>Type</th>
        <th>IEP</th>
    </tr>
    {% for key, peptidic in sequencesInfo.peptidic %}
      {% if peptidic.iep %}
        <tr>
          <td>{{key+1}}</td>
          <td>{{peptidic.sequence.name}}</td>
          <td>{{peptidic.sequence.moleculeType}}</td>
          <td>
            {{peptidic.iep|number_format(2)}}
          </td>
        </tr>
      {% endif %}
    {% endfor %}
</table>
{% endif %}
</div>`;

module.exports = {
  calculateMFFromSequence,
  calculateMFFromNucleic,
  calculateMFFromPeptidic,
  explodeSequences,
  getFirstNucleotide,
  getFirstPeptide,
  getSequencesInformation,
  sequencesInformationTwigTemplate,
  translateNucleic,
};
