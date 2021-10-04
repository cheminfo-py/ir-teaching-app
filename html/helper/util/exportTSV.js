
/*
Example:
exportTSV(myArray, {keys:['surface','volume]}
 */

define(['src/util/ui'], function (UI) {
  function exportTSV(items, options = {}) {
    const {
      keys = Object.keys(items[0])
    } = options;

    var results = [];

    results.push(keys.join('\t'));

    for (var item of items) {
      var line = [];
      for (var key of keys) {
        line.push(item[key]);
      }
      results.push(line.join('\t'));
    }

    UI.showCode(
      {
        mode: 'text',
        content: results.join('\r\n'),
        title: 'Export ROIs as a tab-delimited text (copy / paste to spreadsheet)'
      }
    );
  }

  return exportTSV;
});

