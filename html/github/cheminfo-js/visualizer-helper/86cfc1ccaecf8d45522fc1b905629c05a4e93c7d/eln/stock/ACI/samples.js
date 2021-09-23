
module.exports = function (roc) {
  return {
    async getNextCommercialBatch(structureId) {
      structureId = String(structureId);
      const result = await roc.view('entryById', {
        startkey: [structureId],
        endkey: [structureId, '\ufff0']
      });

      if (!result.length) {
        return 1;
      } else {
        const batchNumbers = result.map((r) => Number(r.$id[1])).filter((batch) => !Number.isNaN(batch)).sort(descending);
        return ++batchNumbers[0];
      }
    },

    async getNextInternalBatch(structureId, salt) {
      structureId = String(structureId);
      salt = String(salt);
      const result = await roc.view('entryById', {
        startkey: [structureId, salt],
        endkey: [structureId, salt, '\ufff0']
      });

      if (!result.length) {
        return 1;
      } else {
        const batchNumbers = result.map((r) => Number(r.$id[2])).filter((batch) => !Number.isNaN(batch)).sort(descending);
        return ++batchNumbers[0];
      }
    }
  };
};

function descending(a, b) {
  if (a < b) return 1;
  else if (b < a) return -1;
  else return 0;
}
