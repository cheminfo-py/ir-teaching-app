
define(['src/util/api'], function (API) {
  return async function createMatrixClass(classURL, spectraDataSet, options = {}) {
    options = Object.assign({}, { delimiter: ',', header: true, debug: false }, options);
    const Papa = await API.require('components/papa-parse/papaparse.min');
    const superagent = await API.require('superagent');
    let classFile = await superagent.get(classURL)
      .withCredentials()
      .responseType('text');
    if (options.debug) console.log('classFile', classFile); // eslint-disable-line no-console
    let meta = Papa.parse(classFile.text, { delimiter: options.delimiter, header: options.header }).data;
    let metaIndex = {};
    meta.forEach((a) => {
      metaIndex[a.filename] = a;
    });
    var withOutClass = [];
    var dataClass = new Array(spectraDataSet.length);
    let i = dataClass.length;
    while (i--) {
      dataClass[i] = new Array(2).fill(-1);
      let vector = dataClass[i];
      let filename = spectraDataSet[i].sd.filename;
      let index = metaIndex[filename];
      if (typeof index === 'undefined') {
        withOutClass.push(filename);
      } else {
        vector[index.class] = 1;
      }
    }
    return { dataClass: dataClass, withOutClass: withOutClass };
  };
});
