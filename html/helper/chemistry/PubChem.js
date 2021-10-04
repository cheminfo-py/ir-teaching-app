import ui from 'src/util/ui';

const pubchemURL = 'https://pubchem.cheminfo.org/molecules/mf?mf=';

async function getMolecules(mf) {
  let response = await fetch(`${pubchemURL}${mf}`);
  let results = (await response.json()).result;
  return new Promise(function (resolve) {
    resolve(results);
  });
}

module.exports = {
  choose: function (mf) {
    let promise = getMolecules(mf);
    return ui
      .choose([{ promise }], {
        autoSelect: false,
        asynchronous: true,
        noConfirmation: true,
        returnRow: false,
        dialog: {
          width: 1000,
          height: 800
        },
        columns: [
          {
            id: 'iupac',
            name: 'Name',
            jpath: [],
            rendererOptions: {
              forceType: 'object',
              twig: `
                {{iupac}}
              `
            }
          },
          {
            id: 'structure',
            name: 'Structure',
            jpath: ['ocl', 'id'],
            rendererOptions: {
              forceType: 'oclID'
            },
            maxWidth: 500
          },
          {
            id: 'url',
            name: 'Pubchem',
            jpath: [],
            rendererOptions: {
              forceType: 'object',
              twig: `
                <a href="https://pubchem.ncbi.nlm.nih.gov/compound/{{_id}}" onclick="event.stopPropagation()" target="_blank">&#x2B08;</a>
              `
            },
            maxWidth: 70
          }
        ],
        idField: 'id',
        slick: {
          rowHeight: 140
        }
      })
      .catch(function (e) {
        console.error(e); // eslint-disable-line no-console
        ui.showNotification('search failed', 'error');
      });
  }
};
