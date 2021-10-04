
define(['src/util/api'], function (API) {
  return async function loadZips(zipURLs, options = {}) {
    const filterOptions = options.filterOptions;
    const JSZip = await API.require('jszip');
    const superagent = await API.require('superagent');
    const SD = await API.require('SD');
    const jszip = new JSZip();
    const spectraDataSet = [];
    for (let zipURL of zipURLs) {
      let zipFiles = await superagent.get(zipURL)
        .withCredentials()
        .responseType('blob');
      const zip = await jszip.loadAsync(zipFiles.body);
      let filesToProcess = Object.keys(zip.files).filter((filename) => filename.match(/jdx$/));
      for (const filename of filesToProcess) {
        let jcamp = await zip.files[filename].async('string');
        let spectrum = SD.NMR.fromJcamp(jcamp, {});
        spectrum.sd.filename = filename.replace(/[0-9 a-z A-Z]+\//, '').replace(/.jdx$/, '');
        if (options.filter) options.filter(spectrum, filterOptions);
        spectraDataSet.push(spectrum);
      }
    }
    return spectraDataSet;
  };
});
