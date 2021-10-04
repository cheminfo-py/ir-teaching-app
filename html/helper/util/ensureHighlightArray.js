function ensureHighlightArray(array) {
  let changed = false;
  for (let item of array) {
    if (!item._highlight) {
      Object.defineProperty(item, '_highlight', {
        writable: true,
        enumerable: false
      });
      item._highlight = Math.random();
      changed = true;
    }
  }
  return changed;
}

module.exports = ensureHighlightArray;
