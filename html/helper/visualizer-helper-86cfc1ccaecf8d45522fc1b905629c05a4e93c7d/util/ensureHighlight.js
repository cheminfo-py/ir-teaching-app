import API from 'src/util/api';

function ensureHighlight(variableName) {
  let array = API.getData(variableName);
  let changed = false;
  for (let item of array) {
    if (!item._highlight) {
      Object.defineProperty(item, '_highlight', {
        writable: true,
        enumerable: false,
      });
      item._highlight = Math.random();
      changed = true;
    }
  }
  if (changed) array.triggerChange();
  return changed;
}

module.exports = ensureHighlight;
