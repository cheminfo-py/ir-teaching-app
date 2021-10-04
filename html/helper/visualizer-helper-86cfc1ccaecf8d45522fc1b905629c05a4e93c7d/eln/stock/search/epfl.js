import superagent from 'superagent';
import util from 'src/util/util';
import ui from 'src/util/ui';
import _ from 'lodash';

// example: http://stock-isic.epfl.ch/searchstock?for=json&bl=100&search=Field10.11%3D123456&bottle=123456

module.exports = {
  search(term) {
    return superagent
      .get(
        `http://stock-isic.epfl.ch/searchstock?for=json&bl=100&search=Field10.11%3D${encodeURIComponent(
          term
        )}`
      )
      .then(function (result) {
        result = result.body && result.body.entry;
        if (!result) {
          ui.showNotification('No results in reference DB', 'warn');
          return Promise.resolve([]);
        }
        var list = [];
        for (var i = 0; i < result.length; i++) {
          if (result[i] && result[i].value) {
            var val = result[i].value;
            val.code = val.catalogID;
            list.push({
              id: i,
              name: val && val.iupac && val.iupac[0] ? val.iupac[0].value : '',
              row: val
            });
          }
        }
        return list;
      })
      .then((data) => data.map(fromExpereact))
      .then((data) =>
        data.sort((a, b) => {
          let rn1 =
            a.$content.identifier.cas.length > 0
              ? Number(a.$content.identifier.cas[0].value.replace(/-/g, ''))
              : Number.MAX_SAFE_INTEGER;
          let rn2 =
            b.$content.identifier.cas.length > 0
              ? Number(b.$content.identifier.cas[0].value.replace(/-/g, ''))
              : Number.MAX_SAFE_INTEGER;
          return rn1 - rn2;
        })
      );
  }
};

function fromExpereact(expereact) {
  const mol = expereact.row.mol;
  const mf =
    expereact.row.mf && expereact.row.mf[0] && expereact.row.mf[0].value.value;
  const cas =
    expereact.row.rn &&
    expereact.row.rn.map((rn) => ({ value: numberToCas(rn.value.value) }));
  if (!expereact.row.iupac) expereact.row.iupac = [];
  return {
    $content: {
      general: {
        molfile: mol && mol[0] && mol[0].value.value,
        description: expereact.name,
        name: expereact.row.iupac,
        mf
      },
      identifier: {
        cas
      },
      stock: {
        catalogNumber: expereact.row.code
      },
      physical: {
        density: expereact.row.density,
        mp: expereact.row.mp,
        bp: expereact.row.bp
      }
    },
    id: util.getNextUniqueId(true),
    names: _.uniq([expereact.name, ...expereact.row.iupac.map((i) => i.value)]),
    source: 'reference'
  };
}

function numberToCas(nb) {
  nb = String(nb);
  return `${nb.slice(0, -3)}-${nb.slice(-3, -1)}-${nb.slice(-1)}`;
}
