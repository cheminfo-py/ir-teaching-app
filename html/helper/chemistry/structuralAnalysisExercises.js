import CA from 'src/util/couchdbAttachments';

import OCLE from '../eln/libs/OCLE';

async function fetchData(
  query = undefined,
  url = 'https://couch.cheminfo.org/cheminfo-public/668677b6432fb3fde76305cfe706856d'
) {
  var ca = new CA(url);

  var files = await ca.fetchList();
  files = files.filter((a) => a.filename.match('upload'));

  files = files.map((a) => {
    var filename = a.filename.replace('upload/', '');
    var parts;
    if (filename.match(/.*\.mol/)) {
      parts = [filename.replace(/\..*/, ''), 'mol'];
    } else {
      filename = filename.replace(/\..+?$/, '');
      parts = filename.split('_');
    }
    return {
      filename: filename,
      rn: parts[0],
      kind: parts[1],
      experiment: parts[2],
      url: a.url
    };
  });

  files = files.filter((a) => !query || query[a.rn]);

  // we combine the files based on some filters

  var data = {};

  for (var file of files) {
    if (!data[file.rn]) {
      data[file.rn] = {
        rn: file.rn,
        myResult: ''
      };
    }
    var datum = data[file.rn];
    switch (file.kind) {
      case 'mol':
        datum.mol = { type: 'mol2d', url: file.url };
        var molfile = await (await fetch(file.url)).text();
        var molecule = OCLE.Molecule.fromMolfile(molfile);
        datum.oclCode = molecule.getIDCode();
        datum.id = datum.rn;
        datum.result = datum.oclCode;
        datum.mf = molecule.getMolecularFormula().formula;
        molecule.addImplicitHydrogens();
        datum.nbDiaH = molecule.getGroupedDiastereotopicAtomIDs({
          atomLabel: 'H'
        }).length;
        datum.nbDiaC = molecule.getGroupedDiastereotopicAtomIDs({
          atomLabel: 'C'
        }).length;
        datum.nbH = Number(datum.mf.replace(/.*H([0-9]+).*/, '$1'));
        datum.nbC = Number(datum.mf.replace(/.*C([0-9]+).*/, '$1'));
        break;
      case 'mass':
        datum.mass = { type: 'jcamp', url: file.url };
        datum.isMass = true;
        break;
      case 'ir':
        datum.ir = { type: 'jcamp', url: file.url };
        datum.isIr = true;
        break;
      case 'nmr':
        switch (file.experiment) {
          case '1h':
            datum.h1 = { type: 'jcamp', url: file.url };
            datum.isH1 = true;
            break;
          case 'cosy':
            datum.cosy = { type: 'jcamp', url: file.url };
            datum.isCosy = true;
            break;
          case 'hsqc':
            datum.hsqc = { type: 'jcamp', url: file.url };
            datum.isHsqc = true;
            break;
          case 'hmbc':
            datum.hmbc = { type: 'jcamp', url: file.url };
            datum.isHmbc = true;
            break;
          case '13cDec':
            datum.c13dec = { type: 'jcamp', url: file.url };
            datum.isC13dec = true;
            break;
          case '13c':
            datum.c13 = { type: 'jcamp', url: file.url };
            datum.isC13 = true;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  var results = [];

  for (var key of Object.keys(data)) {
    results.push(data[key]);
  }
  var counter = 1;
  results.forEach((a) => {
    a.number = counter++;
  });

  return results;
}

export { fetchData };
