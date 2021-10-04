
import OCL from 'openchemlib/openchemlib-core';

function Structure(roc) {
  return {
    async refresh(type) {
      const options = {
        key: 'structure',
        varName: 'structures'
      };

      if (type) {
        options.filter = function (entry) {
          return entry.$id[1] === type;
        };
      }
      return roc.view('entryByKind', options);
    },

    async create(molfile, type) {
      const ocl = getOcl(molfile, true);
      return this._createFromOcl(ocl, type);
    },

    async _createFromOcl(ocl, type, rocOptions) {
      rocOptions = rocOptions || {};
      var prefix = 'X';
      if (type === 'internal') {
        prefix = 'ACI';
      } else if (type === 'commercial') {
        prefix = 'S';
      }

      const newEntry = {
        $id: [ocl.idCode, type],
        $kind: 'structure',
        $owners: ['structureRW', 'structureR'],
        $content: {
          structureId: await getNextId(roc, 'structureId', prefix),
          coordinates: ocl.coordinates
        }
      };
      await roc.create(newEntry, Object.assign({
        messages: {
          409: 'Conflict: this structure already exists'
        }
      }, rocOptions));
      return newEntry;
    },

    async createAndGetId(molfile, type) {
      const ocl = getOcl(molfile, true);
      try {
        const entry = await this._createFromOcl(ocl, type, { disableNotification: true });
        return entry;
      } catch (e) {
        if (e.message === 'Conflict') {
          // try to get id
          const result = await roc.view('entryById', {
            key: [ocl.idCode, type]
          });
          if (result.length) {
            return result[0];
          } else {
            throw new Error('Unexpected error creating structure');
          }
        }
      }
      return null;
    }

  };
}

function getOcl(molfile, throwIfEmpty) {
  molfile = String(molfile);
  var ocl = OCL.Molecule.fromMolfile(molfile);
  if (throwIfEmpty && !ocl.getAtoms()) {
    throw new Error('Empty molfile');
  }
  return ocl.getIDCodeAndCoordinates();
}

async function getNextId(roc, viewName, type) {
  const v = await roc.view(viewName, {
    reduce: true
  });

  if (!v.length || !v[0].value || !v[0].value[type]) {
    return `${type}-1`;
  }

  var id = v[0].value[type];
  var current = Number(id);
  var nextID = current + 1;
  var nextIDStr = String(nextID);
  return `${type}-${nextIDStr}`;
}

module.exports = Structure;
