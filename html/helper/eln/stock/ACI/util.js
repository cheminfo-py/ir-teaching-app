import OCL from 'openchemlib/openchemlib-core';
import UI from 'src/util/ui';
import _ from 'lodash';

module.exports = function (roc, prefix) {
  function getMoleculeWithSalts(options) {
    const { saltCode, idCode, nbSalts, value } = options;
    const oclid = idCode || value;
    const mol = OCL.Molecule.fromIDCode(oclid);
    if (saltCode !== 'NX' && oclid !== 'd@') {
      var salt = salts[saltCode];
      if (salt) {
        var oclSalt = OCL.Molecule.fromIDCode(String(salt.idCode));
        for (var i = 0; i < nbSalts; i++) {
          mol.addMolecule(oclSalt);
        }
        mol.inventCoordinates();
      } else {
        throw new Error(`unknown salt ${salt}`);
      }
    }
    return mol;
  }

  function getOclDistinguishOr(mol) {
    const idCode = mol.getCanonizedIDCode(
      OCL.Molecule.CANONIZER_DISTINGUISH_RACEMIC_OR_GROUPS,
    );
    const { coordinates } = mol.getIDCodeAndCoordinates();
    return {
      idCode,
      coordinates,
    };
  }

  async function updateInternalDocumentWithNewStructure(doc, newOcl) {
    // init some variables
    const newOclid = String(newOcl.idCode || newOcl.value);
    const newOclCoordinates = newOcl.coordinates && String(newOcl.coordinates);
    const general = doc.$content.general;

    // structure
    const freeBaseMolecule = OCL.Molecule.fromIDCode(newOclid);
    const freeBaseOcl = freeBaseMolecule.getIDCodeAndCoordinates();
    const baseMf = freeBaseMolecule.getMolecularFormula();

    general.mf = baseMf.formula;
    general.mw = baseMf.relativeWeight;
    general.molfile = freeBaseMolecule.toMolfileV3();
    general.ocl = {
      value: newOclid,
      coordinates: newOclCoordinates || freeBaseOcl.coordinates,
      index: freeBaseMolecule.getIndex(),
    };
  }

  async function updateInternalStructureByUpdate(docId, newOcl) {
    let doc = await roc.document(docId);
    updateInternalDocumentWithNewStructure(doc, newOcl);
    await roc.update(doc);
  }

  async function updateInternalStructure(oldOclid, newOcl) {
    const newOclid = newOcl.idCode || newOcl.value;
    if (String(newOclid) === String(oldOclid)) {
      throw new Error('new and old structures are identical');
    }
    const oldDups = await getDups(oldOclid);
    const newDups = await getDups(newOclid);

    if (newDups.length > 0) {
      await UI.confirm(`
        The same ACI number cannot be reused because the new structure already
        exists as ${newDups[0].value[0]}.
        Therefore it is not possible to update this structure.<br>
        If you really need to do this, please contact us at support@zakodium.com
      `);
    } else if (oldDups.length > 0) {
      // warn user
      const confirmed = await UI.confirm(`
                The same ACI number can be reused.<br/><br/>
                The operation will update ${oldDups.length} entries.<br/>
                Do you want to proceed?
            `);
      if (!confirmed) return;
      for (let dup of oldDups) {
        await updateInternalStructureByUpdate(dup.id, newOcl);
      }

      // update all old entries with the new structure
    } else {
      throw new Error('oclid cannot be updated because it does not exist');
    }
  }

  async function getNextID() {
    var v = await roc.view('sampleId', {
      reduce: true,
    });

    if (!v.length || !v[0].value || !v[0].value[prefix]) {
      return `${prefix}-1`;
    }

    var id = v[0].value[prefix];
    var current = Number(id);
    var nextID = current + 1;
    var nextIDStr = String(nextID);
    return `${prefix}-${nextIDStr}`;
  }

  async function getDups(oclid) {
    const oclidStr = String(oclid);
    let dups = await roc.query('idWithOCLID', {
      startkey: [oclidStr, `${prefix}-`],
      endkey: [oclidStr, `${prefix}-\ufff0`],
    });

    if (!isUnique(dups)) {
      throw new Error(`Found ID conflict with ${oclid}`);
    }

    dups.forEach((d) => d.key.shift());
    // unique by oclid + $id
    return _.uniqBy(dups, (dup) => dup.key[0] + dup.value.join());
  }

  async function getInternalIDInfo(oclid, salt) {
    salt = String(salt);
    if (!salts[salt]) {
      throw new Error(`unknown salt ${salt}`);
    }
    const info = {};
    let dups = await getDups(oclid);
    info.codeCount = dups.length;
    if (dups.length === 0) {
      const code = await getNextID();
      info.nextId = [code, salt, 1];
      info.saltCount = 0;
      return info;
    }
    const code = dups[0].value[0];
    const unique = isUnique(dups);
    if (!unique) throw new Error('conflict with this structure');
    // only keep structures with same salt
    dups = dups.filter((dup) => dup.value[1] === String(salt));

    info.saltCount = dups.length;
    if (dups.length === 0) {
      info.nextId = [code, salt, 1];
      return info;
    }
    const nextBatchNumber = getNextBatchNumber(dups);
    const newId = dups[0].value.slice();
    newId[newId.length - 1] = nextBatchNumber;
    info.nextId = newId;
    return info;
  }

  async function getNextSampleWithSaltID(oclid, salt) {
    const info = await getInternalIDInfo(oclid, salt);
    return info.nextId;
  }

  async function getNextSampleID(oclid) {
    const dups = await getDups(oclid);
    if (dups.length === 0) {
      const code = await getNextID();
      return [code, 1];
    }

    const nextBatchNumber = getNextBatchNumber(dups);
    const newId = dups[0].value.slice();
    newId[newId.length - 1] = nextBatchNumber;
    return newId;
  }

  function isUnique(dups) {
    // We check the unicity
    const keys = dups.map((v) => v.key);
    if (keys.length === 0) return true;
    const id = keys[0][2];
    for (let key of keys) {
      if (key[2] !== id) return false;
    }
    return true;
  }

  function getNextBatchNumber(values) {
    return (
      Math.max.apply(
        null,
        values.map((v) => v.value[v.value.length - 1]),
      ) + 1
    );
  }

  function getSaltMW(salt, nbSalts) {
    if (!salts[salt]) throw new Error(`Unknow salt ${salt}`);
    return salts[salt].mw * nbSalts;
  }

  return {
    getSaltMW,
    updateInternalStructure,
    getNextSampleID,
    getNextSampleWithSaltID,
    getInternalIDInfo,
    salts,
    getMoleculeWithSalts,
    getOclDistinguishOr,
  };
};

var salts = {
  NX: {
    name: 'Free base',
    mf: '',
    mw: 0,
  },
  TT: {
    name: 'Tritiated compound',
    mf: '',
    mw: 0,
  },
  XX: {
    name: 'Unknown salt',
    mf: '',
    mw: 0,
  },
  AA: {
    idCode: 'fHdP@@',
    name: 'Hydrochloride',
    mf: 'HCl',
    mw: 36.46094,
  },
  AB: {
    idCode: 'fHv`d@',
    name: 'Sodium',
    mf: 'Na+',
    mw: 22.99,
  },
  AC: {
    idCode: 'fHfH@@',
    mf: 'HBr',
    mw: 80.91194,
    name: 'Hydrobromide',
  },
  AD: {
    idCode: 'fHeX@@',
    mf: 'HI',
    mw: 127.90794000000001,
    name: 'Hydroiodide',
  },
  AE: {
    idCode: 'daxB@@QnR[VZY`cD',
    mf: 'C4H4O4',
    mw: 116.07176,
    name: 'Maleate',
  },
  AG: {
    idCode: 'gJQhHl@bOV`@',
    mf: 'CH4O3S',
    mw: 96.10576,
    name: 'Mesylate',
  },
  AH: {
    idCode: 'gGPP@cTfyi`@',
    mf: 'C2H2O4',
    mw: 90.03388,
    name: 'Oxalate',
  },
  AI: {
    idCode: 'gNplJqHJPtadTaeTp@',
    mf: 'C2HO2F3',
    mw: 114.02194,
    name: 'Trifluoroacetate',
  },
  AJ: {
    idCode: 'gJPXHlPDQzt@@',
    mf: 'H2O4S',
    mw: 98.07788000000001,
    name: 'Sulfate',
  },
  AK: {
    idCode: 'gC``@dfZ@@',
    mf: 'C2H4O2',
    mw: 60.05176,
    name: 'Acetate',
  },
  AL: {
    idCode: 'fHvPd@',
    mf: 'K',
    mw: 39.098,
    name: 'Potassium',
  },
  AM: {
    idCode: 'dedF@@PfFTf{nZjf@@',
    mf: 'C4H6O6',
    mw: 150.08564,
    name: 'Tartrate',
  },
  AN: {
    idCode: 'dmtL`HS@BLddlRVFUh@H@@',
    mf: 'C7H8O3S',
    mw: 172.20352,
    name: 'p-Toluenesulfonate',
  },
  AO: {
    idCode: 'dkLN@@PiWSR[kVYjjfX@@',
    mf: 'C6H8O7',
    mw: 192.12252,
    name: 'Citrate',
  },
  AP: {
    idCode: 'dmvL`BaL@HrRRjIJUVjjh@@',
    mf: 'C6H13NO3S',
    mw: 179.23922000000002,
    name: 'n-Cyclohexylsulfamate',
  },
  AQ: {
    idCode: 'gGPXHlPDYIHUj@@',
    mf: 'CH4O4S',
    mw: 112.10476,
    name: 'Methylsulfate',
  },
  AR: {
    idCode: 'fHv@d@',
    mf: 'Li',
    mw: 6.941,
    name: 'Lithium',
  },
  AS: {
    idCode: 'dazL@LAnRVmjj`@',
    mf: 'C4H11NO3',
    mw: 121.13534,
    name: 'Tris(hydroxymethyl)-methylammonium',
  },
  AT: {
    idCode: 'gCi`hEiNyIf`@',
    mf: 'HNO3',
    mw: 63.011939999999996,
    name: 'Nitrate',
  },
  AU: {
    idCode: 'gNpP@jtfvZf@@',
    mf: 'C3H4O4',
    mw: 104.06076,
    name: 'Malonate',
  },
  AV: {
    idCode: 'fJ@@',
    mf: 'H3N',
    mw: 17.03082,
    name: 'Ammonium',
  },
  AW: {
    idCode: 'gNx@@eRmUP@',
    mf: 'C6H15N',
    mw: 101.19210000000001,
    name: 'Triethylammonium',
  },
  AX: {
    idCode: 'fdy@q@HHqxLPAE`cIIKEDhmCIKQgKP@@Pl@@@',
    mf: 'C10H8O6S2',
    mw: 288.29952000000003,
    name: 'Naphthalene-1,5-disulfonic acid',
  },
  AY: {
    idCode: 'dk^@@@RfYU\\]Tzjjjj@@',
    mf: 'C12H23N',
    mw: 181.32162,
    name: 'Dicyclohexyl-ammonium',
  },
  DB: {
    idCode: 'gJPXHlQDQzl@@',
    mf: 'HO4Cl',
    mw: 100.45694,
    name: 'Perchlorate',
  },
  WA: {
    code: 'WA',
    idCode: 'fI@D',
    mf: 'H2O',
    mw: 18.015286,
    name: 'Water',
  },
  BB: {
    code: 'BB',
    idCode: 'daxB@@QnR[VZi`@',
    mw: 118.088208,
    mf: 'C4H6O4',
    name: 'Succinate',
  },
  BD: {
    code: 'BD',
    idCode: 'eMDARV@',
    mw: 46.025427,
    mf: 'CH2O2',
    name: 'Formate',
  },
  FD: {
    code: 'FD',
    idCode: 'daxLHHS@BJdFdNdLddlbuT@@',
    mw: 150.076888,
    mf: 'CHF3O3S',
    name: 'Triflate',
  },
};
