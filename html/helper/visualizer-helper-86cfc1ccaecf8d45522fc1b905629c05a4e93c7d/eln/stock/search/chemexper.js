import superagent from 'superagent';
import util from 'src/util/util';
import ui from 'src/util/ui';
import _ from 'lodash';

module.exports = {
  search(term) {
    return superagent
      .get(
        `https://reference.cheminfo.org/v1/search?appendMolfile=true&quick=${encodeURIComponent(
          term
        )}`
      )
      .then((result) => {
        const data = result.body && result.body.data;
        if (!data) {
          ui.showNotification('No results in reference DB', 'warn');
          return Promise.resolve([]);
        }
        return data;
      })
      .then((data) => data.map(fromChemexper))
      .then((data) =>
        data.sort((a, b) => {
          let rn1 = Number(a.catalogID);
          let rn2 = Number(b.catalogID);
          return rn1 - rn2;
        })
      );
  }
};

function fromChemexper(datum) {
  return {
    $content: {
      general: {
        molfile: datum.molfile,
        description: datum.iupac && datum.iupac[0],
        name: [{ value: datum.iupac[0] }],
        mf: datum.mf && datum.mf.mf,
        mw: datum.mf && datum.mf.mass,
        em: datum.mf && datum.mf.monoisotopicMass
      },
      identifier: {
        cas: numberToCas(datum.catalogID)
      },
      stock: {
        catalogNumber: datum.catalogID
      },
      physical: {
        density: datum.density,
        mp: datum.mp,
        bp: datum.bp
      }
    },
    id: util.getNextUniqueId(true),
    names: datum.iupac,
    source: 'reference'
  };
}

function numberToCas(nb) {
  nb = String(nb);
  return `${nb.slice(0, -3)}-${nb.slice(-3, -1)}-${nb.slice(-1)}`;
}
