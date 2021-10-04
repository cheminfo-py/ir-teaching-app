import API from 'src/util/api';

import { OCL, OCLUtils } from '../libs/OCLUtils';

function waitImmediate() {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}

module.exports = {
  async buildDatabase(tocData, options = {}) {
    const moleculesDB = new OCLUtils.MoleculesDB(OCL, {
      computeProperties: options.calculateProperties
    });
    const date = Date.now();
    for (let i = 0; i < tocData.length; i++) {
      if (options.showLoading) {
        if (i % 100 === 0 && Date.now() - date > 500) {
          await waitImmediate();
          API.loading('mol', `Loading molecules (${i + 1}/${tocData.length})`);
        }
      }

      let entry = tocData[i];
      const idCode = entry.value.ocl && entry.value.ocl.value;
      if (!idCode) continue;
      let moleculeInfo = { idCode, index: entry.value.ocl.index };
      moleculesDB.pushMoleculeInfo(moleculeInfo, entry);
    }
    if (options.showLoading) {
      API.stopLoading('mol');
    }
    return moleculesDB;
  }
};
