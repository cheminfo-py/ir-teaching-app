import API from 'src/util/api';

import { OCL, OCLUtils } from '../libs/OCLUtils';

function waitImmediate() {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}

module.exports = {
  async buildDatabase(dropped, options = {}) {
    const moleculesDB = new OCLUtils.MoleculesDB(OCL, {
      computeProperties: options.computeProperties
    });
    const date = Date.now();
    let onStep;
    if (options.showLoading) {
      onStep = async (i, total) => {
        if (i % 100 === 0 && Date.now() - date > 500) {
          await waitImmediate();
          API.loading('mol', `Loading molecules (${i + 1}/${total})`);
        }
      };
    }
    // sdf or smiles ?
    if (dropped.includes('$$$$')) {
      await moleculesDB.appendSDF(dropped, { onStep, ...options });
    } else if (dropped.includes('\t')) {
      await moleculesDB.appendCSV(dropped, { onStep, ...options });
    } else {
      await moleculesDB.appendSmilesList(dropped, { onStep, ...options });
    }
    if (options.showLoading) {
      API.stopLoading('mol');
    }
    return moleculesDB;
  }
};
