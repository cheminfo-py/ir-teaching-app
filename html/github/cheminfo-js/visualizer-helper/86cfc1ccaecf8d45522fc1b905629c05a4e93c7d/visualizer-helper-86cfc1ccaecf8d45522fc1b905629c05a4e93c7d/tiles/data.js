"use strict";

define([], function () {
  var tiles = [{
    label: 'General',
    // this is my first tab
    tiles: [{
      id: 'Samples',
      kind: 'nbSample',
      description: 'Number of sample',
      bgcolor: 'rgb(255, 242, 204)',
      fontcolor: 'black',
      date: '2016-05-06',
      empty: false,
      line: 0,
      title: function title() {
        return Math.floor(Math.random() * 10000);
      }
    }, {
      rev: '20-c62a0ada4035aa13ca2c427b5018109c',
      description: 'Generate or visualize a 3D model',
      viewURL: '07223c3391c6b0cde342518d240d3426',
      bgcolor: 'rgb(255, 255, 255)',
      empty: false
    }, {
      id: 'ELN',
      viewURL: 'a6fb774a50448cc3edd52dd6dfd275ea',
      kind: 'optionalSample',
      description: 'Notebook',
      icon: 'ci-icon-glassware-round-flask',
      bgcolor: 'rgb(255, 242, 204)',
      line: 0,
      date: '2017-04-30',
      fontcolor: 'rgb(0, 0, 0)',
      rev: '300-5c2740e6182e473103c08247b4fb0843'
    }, {
      id: 'Structure search',
      kind: 'optionalSample',
      description: 'Structure search',
      viewURL: 'aaa5f97c7cde94741de2938b106bb0d4',
      icon: 'ci-icon-structure-search',
      bgcolor: 'rgb(255, 242, 204)',
      fontcolor: 'black',
      date: '2016-09-20',
      line: 0,
      rev: '157-7f074b966057300a1351e8c4f65d0fb4'
    }, {
      id: 'OS',
      kind: 'sample',
      requires: 'sample',
      description: 'Open/edit sample',
      viewURL: '15c9a2dcd55c963fdedf2c18a1471b03',
      icon: 'fa-edit',
      bgcolor: 'rgb(255, 242, 204)',
      fontcolor: 'black',
      date: '2016-05-06',
      line: 0
    }, {
      date: '2017-05-09',
      id: 'attachments',
      kind: 'sample',
      description: 'Upload attachments',
      icon: 'fa-edit',
      bgcolor: 'rgb(255, 242, 204)',
      fontcolor: 'rgb(0, 0, 0)',
      rights: 'admin@cheminfo.org',
      viewURL: 'f795f6dc38df9221ca34bf288aa015aa',
      line: 0
    }, {
      date: '2020-05-15',
      id: 'Lipinski',
      kind: 'optionalSample',
      viewURL: '5ba3ccc2681bc1ff7f370e78efd335c3',
      description: 'Lipinski',
      rights: '',
      bgcolor: 'rgb(255, 242, 204)',
      line: 0,
      icon: 'ci-icon-chart-multi2'
    }, {
      viewURL: 'd3c3001cb6f7868c571bdc165c88a649',
      kind: 'optionalSample',
      id: 'Solution calculation',
      description: 'Solution calculation',
      icon: 'ci-icon-glassware-erlen',
      bgcolor: 'rgb(255, 242, 204)',
      date: '2020-01-30',
      line: 0
    }, {
      id: '',
      line: 1,
      empty: true
    }]
  }, {
    label: 'NMR',
    tiles: [{
      id: 'PP',
      kind: 'sample',
      requires: 'sample',
      description: '1D NMR peak picking',
      viewURL: '4c986ed7d921b11fbe6f20240f0df3a8',
      icon: 'ci-icon-nmr-peak-picking',
      bgcolor: 'rgb(182, 215, 168)',
      fontcolor: 'black',
      date: '2016-05-06',
      line: 1
    }, {
      id: 'Overlay NMR',
      kind: 'optionalSample',
      description: 'Overlay NMR',
      viewURL: 'f162299d0efd3f7c21b5542c85003689',
      icon: 'ci-icon-nmr-overlay',
      bgcolor: 'rgb(182, 215, 168)',
      fontcolor: 'black',
      date: '2016-05-06',
      line: 1,
      rev: ''
    }, {
      id: '1H',
      kind: 'sample',
      requires: 'sample',
      description: 'NMR predict 1H',
      viewURL: 'eea0ba081ea2cc99da5c1aed2f29a0a8',
      icon: 'ci-icon-nmr-1h',
      bgcolor: 'rgb(182, 215, 168)',
      fontcolor: 'black',
      date: '2016-07-06',
      line: 1
    }, {
      id: '13C',
      kind: 'optionalSample',
      requires: 'sample',
      description: 'NMR predict 13C',
      viewURL: 'b50564ac9d207212f8e5ae8167a45f3c',
      icon: 'ci-icon-nmr-13c',
      bgcolor: 'rgb(182, 215, 168)',
      fontcolor: 'black',
      date: '2016-08-06',
      line: 1
    }, {
      id: 'COSY',
      kind: 'optionalSample',
      requires: 'sample',
      description: 'NMR predict COSY',
      viewURL: 'b50564ac9d207212f8e5ae8167a607ed',
      icon: 'ci-icon-nmr-1h1h',
      bgcolor: 'rgb(182, 215, 168)',
      fontcolor: 'black',
      date: '2016-08-06',
      line: 1
    }, {
      id: 'HMBC',
      kind: 'sample',
      requires: 'sample',
      description: 'NMR predict HMBC',
      viewURL: 'b50564ac9d207212f8e5ae8167a68433',
      icon: 'ci-icon-nmr-1h13c',
      bgcolor: 'rgb(182, 215, 168)',
      fontcolor: 'black',
      date: '2016-08-06',
      line: 1
    }, {
      viewURL: '901378074eeb9b75396aadff96b3b83a',
      date: '2020-06-20',
      id: 'Search',
      kind: 'optionalSample',
      description: 'Search by δ',
      icon: 'ci-icon-nmr-search',
      bgcolor: 'rgb(182, 215, 168)',
      line: 1,
      rights: ''
    }, {
      date: '2020-02-20',
      kind: 'optionalSample',
      viewURL: '4b7669c5ec0a15e6fb3994f53b950277',
      description: 'Simulate spin system',
      bgcolor: 'rgb(182, 215, 168)',
      id: 'Spin system',
      icon: 'ci-icon-nmr-simulator',
      line: 1
    }, {
      date: '2018-02-20',
      kind: 'optionalSample',
      bgcolor: 'rgb(182, 215, 168)',
      viewURL: '06d3c6ed57762b356b993a0d8138ae04',
      description: 'Multiplet simulator',
      id: 'Mutiplet',
      line: 1,
      icon: 'ci-icon-nmr-tree'
    }, {
      viewURL: 'da522035c4cce8f1473093c7ed4f6dcb',
      date: '2017-11-13',
      kind: 'sample',
      bgcolor: 'rgb(182, 215, 168)',
      id: 'Deconvolution',
      description: 'NMR SVD',
      line: 1,
      rights: 'admin@cheminfo.org,goodyear-test@cheminfo.org '
    }, {
      date: '2017-11-30',
      id: 'General Spectra Similarity',
      kind: 'optionalSample',
      description: 'Similarity',
      viewURL: '023641398c730e5eea384269664a7192',
      rights: 'admin@cheminfo.org,goodyear-test@cheminfo.org ',
      line: 1,
      bgcolor: 'rgb(182, 215, 168)',
      rev: ''
    }, {
      empty: true
    }]
  }, {
    label: 'Mass',
    tiles: [{
      id: 'Frag',
      kind: 'sample',
      requires: 'sample',
      description: 'Mass fragmentation',
      viewURL: '0e35f561fff36fef6c9e7341a9eec858',
      icon: 'fa-bomb',
      bgcolor: 'rgb(244, 204, 204)',
      fontcolor: 'black',
      date: '2016-07-06',
      line: 2
    }, {
      viewURL: 'd9bd75989166b0459041ad75bb6020b4',
      date: '2017-09-01',
      rights: 'admin@cheminfo.org',
      id: 'OLD Analyse mass',
      kind: 'sample',
      description: 'OLD HR mass',
      bgcolor: 'rgb(244, 204, 204)',
      line: 2,
      empty: false,
      hide: true
    }, {
      empty: false,
      viewURL: 'daf2eda5bf803818ce48655dd963ca21',
      id: 'analyseMS',
      date: '2018-03-20',
      kind: 'sample',
      description: 'Check HR mass',
      bgcolor: 'rgb(244, 204, 204)',
      rights: '',
      line: 2,
      icon: 'ci-icon-mass-monoisotopic'
    }, {
      id: 'EM',
      kind: 'sample',
      description: 'OLD Monoisotopic mass',
      viewURL: '4a06cbbc25197036518fab2ea6ff961d',
      icon: 'ci-icon-mass-monoisotopic',
      bgcolor: 'rgb(244, 204, 204)',
      fontcolor: 'black',
      date: '2016-07-06',
      line: 2,
      rights: 'admin@cheminfo.org',
      empty: false,
      hide: true
    }, {
      viewURL: '2294a250c8c1da87ca6753a6eb93c166',
      rights: '',
      date: '2018-03-20',
      id: 'EM',
      kind: 'sample',
      description: 'Monoisotopic mass',
      icon: 'ci-icon-mass-monoisotopic',
      bgcolor: 'rgb(244, 204, 204)',
      line: 2
    }, {
      viewURL: '4cf732cabaf4941a66d2f19cbc5875f2',
      kind: 'optionalSample',
      id: 'overlayMS',
      date: '2017-09-01',
      description: 'Overlay Mass',
      rights: '',
      bgcolor: 'rgb(244, 204, 204)',
      line: 2,
      icon: 'ci-icon-mass-overlay'
    }, {
      viewURL: 'b60d4cd22af351b3996cb3321f169a0e',
      bgcolor: 'rgb(244, 204, 204)',
      id: 'Cont',
      kind: 'sample',
      description: 'Mass contaminants',
      fontcolor: 'rgb(0, 0, 0)',
      date: '2017-05-15',
      line: 2,
      icon: 'ci-icon-mass-impurities'
    }, {
      id: 'mixtureMS',
      rev: '',
      icon: 'ci-icon-misc-peptide',
      description: 'Mixture analysis',
      viewURL: '1fdc4456ddfda089d9a67f9366ac6883',
      bgcolor: 'rgb(244, 204, 204)',
      empty: false,
      line: 2,
      date: '2018-02-15',
      kind: 'sample'
    }, {
      viewURL: '230d2530cee8782b3cb63dc4e25931d9',
      description: 'Polymer analysis',
      kind: 'sample',
      id: 'MSPolyCalc',
      icon: 'ci-icon-misc-polymer',
      bgcolor: 'rgb(244, 204, 204)',
      line: 2,
      date: '2019-10-15'
    }, {
      viewURL: '8fcf268d9a86be15206e3bc1fa1dca49',
      id: 'peptideMS',
      kind: 'sample',
      description: 'OLD Peptide analysis',
      bgcolor: 'rgb(244, 204, 204)',
      fontcolor: 'rgb(0, 0, 0)',
      date: '2017-05-15',
      line: 2,
      icon: 'ci-icon-misc-peptide',
      hide: true
    }, {
      viewURL: 'f8b2a67c144b612f89580e05f8c02509',
      id: 'deconvolution',
      description: 'Mass deconvolution',
      bgcolor: 'rgb(244, 204, 204)',
      rights: '',
      kind: 'sample',
      date: '2017-08-30',
      line: 2,
      icon: 'ci-icon-mass-sum'
    }, {
      viewURL: '8863f8f1546748df4d552ae7c6006e8e',
      date: '2018-06-30',
      id: 'uploadMS',
      description: 'Upload mass',
      bgcolor: 'rgb(244, 204, 204)',
      kind: 'optionalSample',
      icon: 'ci-icon-mass-upload',
      rights: 'admin@cheminfo.org',
      line: 2,
      hide: true
    }, {
      viewURL: 'bf1f6acc30fc6c92c730ea434234530c',
      kind: 'sample',
      date: '2019-03-10',
      id: 'Elemental analysis',
      description: 'EA',
      rights: '',
      bgcolor: 'rgb(244, 204, 204)',
      icon: 'fa-percent',
      line: 2
    }, {
      empty: true
    }, {
      viewURL: 'a7448bb6798371144f9a5ecab184e100',
      date: '2017-06-25',
      id: 'IR',
      kind: 'sample',
      description: 'Process IR spectra',
      bgcolor: 'rgb(252, 229, 205)',
      line: 3,
      icon: 'ci-icon-ir-assignment'
    }, {
      viewURL: 'df238595c62b7f6dac535921e99afba4',
      date: '2017-10-15',
      id: 'Overlay IR',
      kind: 'optionalSample',
      description: 'Overlay infrared',
      bgcolor: 'rgb(252, 229, 205)',
      rights: '',
      line: 3,
      icon: 'ci-icon-ir-overlay'
    }, {
      viewURL: 'd1a3edf4783f8a0d64e1940d4f461153',
      id: 'Raman',
      kind: 'sample',
      description: 'Raman',
      date: '2019-06-01',
      bgcolor: 'rgb(252, 229, 205)',
      icon: 'ci-icon-raman-assignment',
      rights: '',
      line: 3
    }, {
      viewURL: 'ef39548735eda960577b1ff9a6c5d7fa',
      id: 'UV',
      date: '2019-04-20',
      kind: 'sample',
      description: 'Process UV spectra',
      bgcolor: 'rgb(252, 229, 205)',
      rights: '',
      line: 3,
      icon: 'ci-icon-ir-assignment'
    }, {
      date: '2019-05-01',
      viewURL: '6a0e9667a8c3bc8d7cd87af9ccdf4c46',
      bgcolor: 'rgb(252, 229, 205)',
      id: 'Compare UV',
      kind: 'optionalSample',
      description: 'UV comparison',
      icon: 'ci-icon-ir-overlay',
      line: 3
    }, {
      date: '2017-07-30',
      viewURL: 'afcd626f66f6803b17f7102fb61af080',
      rights: 'admin@cheminfo.org',
      bgcolor: 'rgb(252, 229, 205)',
      kind: 'sample',
      id: 'HR gclcMS',
      description: 'Visualize HR GC/LC MS',
      line: 3
    }, {
      date: '2018-09-01',
      id: 'gclcMS',
      kind: 'sample',
      description: 'Visualize GC/LC MS',
      rights: '',
      viewURL: '088e53bb9d86f832fa90961ee70a17aa',
      bgcolor: 'rgb(252, 229, 205)',
      line: 3
    }, {
      date: '2017-08-03',
      id: 'gcIntegration ??',
      kind: 'sample',
      description: 'GC/LC integration',
      bgcolor: 'rgb(252, 229, 205)',
      rights: 'admin@cheminfo.org',
      viewURL: 'ab10245211be28889d989193b3f48fc9',
      line: 3
    }, {
      viewURL: '62fb57eef6b94ccb8bef741dec8d9baf',
      date: '2017-11-10',
      kind: 'sample',
      id: 'Chromatogram',
      description: 'Peak picking and integration',
      rights: 'admin@cheminfo.org,goodyear-test@cheminfo.org ',
      bgcolor: 'rgb(252, 229, 205)',
      line: 3
    }, {
      date: '2018-07-01',
      id: 'IV viewer',
      kind: 'sample',
      viewURL: 'f2ddd6af4507d2da8ffa42acd925d33b',
      bgcolor: 'rgb(252, 229, 205)',
      line: 3,
      icon: 'ci-icon-iv-assignment'
    }, {
      viewURL: '30f10e274924e7216563b97c61b0f18a',
      id: 'DSC',
      kind: 'sample',
      description: 'Differential scanning calorimetry',
      bgcolor: 'rgb(252, 229, 205)',
      rights: 'admin@cheminfo.org,goodyear-test@cheminfo.org ',
      date: '2017-11-10',
      line: 3
    }, {
      viewURL: 'e83aeebeb956c8174cc6a53a5d11def8',
      id: 'TGA',
      kind: 'sample',
      description: 'Thermogravimetric analysis',
      date: '2017-11-10',
      bgcolor: 'rgb(252, 229, 205)',
      rights: 'admin@cheminfo.org,goodyear-test@cheminfo.org ',
      line: 3
    }, {
      viewURL: 'd0378051a415008bdee4eb326c787a23',
      date: '2017-08-15',
      description: 'Upload chromatogram',
      id: 'uploadChromatogram',
      kind: 'sample',
      icon: 'fa-plus',
      bgcolor: 'rgb(252, 229, 205)',
      fontcolor: 'rgb(0, 0, 0)',
      rights: '',
      line: 3,
      hide: true
    }, {
      date: '2019-09-09',
      bgcolor: 'rgb(252, 229, 205)',
      icon: 'ci-icon-misc-cyclic-voltammetry',
      kind: 'sample',
      id: 'CV',
      description: 'Cyclic voltammetry',
      rights: 'admin@cheminfo.org',
      viewURL: '58de796a1f72061bbf5dbc08305d1c37',
      line: 3
    }, {
      id: 'x',
      empty: true
    }, {
      viewURL: '1b967cff2053f36f83d68aeb27035010',
      id: 'Test copy',
      kind: 'sample',
      bgcolor: 'rgb(207, 226, 243)',
      rights: 'admin@cheminfo.org',
      line: 4
    }, {
      viewURL: '739379c6183ec9beb757025314c40f8e',
      kind: 'optionalSample',
      id: 'Compare',
      description: 'Scale and compare spectra',
      icon: 'ci-icon-spectra-compare',
      bgcolor: 'rgb(207, 226, 243)',
      line: 4
    }, {
      viewURL: '02d6bbc6c04edd24ce90b146348573f1',
      id: 'Analyse',
      kind: 'optionalSample',
      description: 'Spectra analysis',
      bgcolor: 'rgb(207, 226, 243)',
      rights: '',
      line: 4,
      icon: 'ci-icon-spectra-analyse'
    }, {
      viewURL: '99e77c27589aa8f3d14f48716e4e6c89',
      kind: 'optionalSample',
      id: 'PCA',
      description: 'Principal component analysis',
      icon: 'ci-icon-spectra-pca',
      bgcolor: 'rgb(207, 226, 243)',
      rights: '',
      line: 4
    }, {
      viewURL: '448ba934ffd677adbeeb24ade0c0acbe',
      id: 'PLS',
      description: 'Partial least squares',
      kind: 'optionalSample',
      bgcolor: 'rgb(207, 226, 243)',
      rights: 'admin@cheminfo.org',
      icon: 'ci-icon-spectra-pca'
    }, {
      viewURL: 'e62a47d76949b3e2e1eaec845d486d81',
      kind: 'optionalSample',
      id: 'Deconvolution',
      description: 'Spectra deconvolution',
      icon: 'ci-icon-spectra-deconvolution',
      rights: '',
      bgcolor: 'rgb(207, 226, 243)',
      line: 4
    }, {
      viewURL: 'c5a2739a6e2bb270fde2ceb278546fa0',
      description: 'Spectra similarity',
      kind: 'optionalSample',
      id: 'Similarity',
      bgcolor: 'rgb(207, 226, 243)',
      rights: '',
      line: 4,
      icon: 'ci-icon-spectra-phylogram'
    }, {
      id: '3D',
      kind: 'sample',
      requires: 'sample',
      description: '3D model',
      viewURL: '0e019bb4d797395213d22aca403d2c93',
      icon: 'ci-icon-structure-3d-model',
      bgcolor: 'rgb(207, 226, 243)',
      fontcolor: 'black',
      date: '2016-08-06',
      line: 4
    }, {
      viewURL: '47508f02682bd1522de421f0bc847061',
      description: '3D model',
      kind: 'optionalSample',
      id: '3D',
      date: '2019-08-06',
      icon: 'ci-icon-structure-3d-model',
      rights: 'admin@cheminfo.org',
      bgcolor: 'rgb(207, 226, 243)',
      line: 4
    }, {
      id: 'Conf',
      kind: 'sample',
      requires: 'sample',
      description: 'Conformations',
      viewURL: '0e019bb4d797395213d22aca4043260e',
      icon: 'ci-icon-structure-conformers',
      bgcolor: 'rgb(207, 226, 243)',
      fontcolor: 'black',
      date: '2016-08-06',
      line: 4,
      rights: ''
    }, {
      id: 'Dia',
      kind: 'sample',
      requires: 'sample',
      description: 'Diastereotopic',
      viewURL: 'b50564ac9d207212f8e5ae816795fb39',
      icon: 'ci-icon-structure-diastereotopic',
      bgcolor: 'rgb(207, 226, 243)',
      fontcolor: 'black',
      date: '2016-08-06',
      line: 4
    }, {
      kind: 'optionalSample',
      viewURL: 'd9498d0a2ea400ea71efec8840a1273b',
      description: 'Property explorer',
      bgcolor: 'rgb(207, 226, 243)',
      id: 'Info',
      date: '2018-06-30',
      icon: 'fa-calculator',
      line: 4
    }, {
      date: '2017-06-10',
      id: 'Xray',
      kind: 'sample',
      viewURL: '07223c3391c6b0cde342518d240d3426',
      description: 'Xray structure',
      icon: 'ci-icon-misc-cristal2',
      bgcolor: 'rgb(207, 226, 243)',
      line: 4
    }, {
      date: 'x',
      empty: true
    }, {
      rights: '',
      viewURL: '0471a3b7a296450267555b7982ae29ad',
      id: 'DNA Upload',
      description: 'View / Upload DNA seq',
      date: '2018-06-15',
      bgcolor: 'rgb(234, 209, 220)',
      fontcolor: 'rgb(0, 0, 0)',
      line: 5,
      icon: 'ci-icon-bio-upload-dna',
      kind: 'sample'
    }, {
      date: '2018-06-15',
      id: 'dnaFeatures',
      kind: 'optionalSample',
      description: 'Search features',
      viewURL: '0f7ebf89799296e234a73591bafb6e5e',
      icon: 'ci-icon-bio-search-dna',
      bgcolor: 'rgb(234, 209, 220)',
      rights: '',
      fontcolor: 'rgb(0, 0, 0)',
      line: 5
    }, {
      date: '2018-06-15',
      id: 'dnaSimilar',
      kind: 'optionalSample',
      description: 'Search similar',
      viewURL: 'b4af40ab0f57303185700745410032db',
      icon: 'ci-icon-bio-search-dna',
      bgcolor: 'rgb(234, 209, 220)',
      rights: '',
      line: 5
    }, {
      viewURL: '775b00d7a220425f2232a2efa58e704e',
      kind: 'optionalSample',
      id: 'UniMOD',
      description: 'Protein modification',
      icon: 'ci-icon-bio-unimod',
      bgcolor: 'rgb(234, 209, 220)',
      line: 5
    }, {
      id: 'plasmidSearch',
      date: '2018-06-15',
      kind: 'optionalSample',
      description: 'Search plasmids',
      viewURL: '9ffc86418ff71dcef36a5def49d944e8',
      icon: 'ci-icon-bio-search-dna',
      bgcolor: 'rgb(234, 209, 220)',
      rights: 'admin@cheminfo.org',
      line: 5
    }, {
      date: '2018-06-15',
      id: 'Isoelectric point',
      kind: 'optionalSample',
      description: 'IEP',
      viewURL: '8a6a09eabcd80af204583be5814e2d4a',
      bgcolor: 'rgb(234, 209, 220)',
      rights: '',
      line: 5,
      icon: 'ci-icon-misc-peptide'
    }, {
      icon: 'ci-icon-bio-protein',
      bgcolor: 'rgb(234, 209, 220)',
      viewURL: '46548ab75e0ca6e1e95bbc30663bee0a',
      id: 'Prot',
      kind: 'optionalSample',
      date: '2018-06-30',
      description: 'PDB visualisation',
      line: 5
    }, {
      viewURL: '187642421e225f8cfcd65a9243394a72',
      icon: 'ci-icon-misc-electron-microscopy',
      description: 'SEM / TEM image analysis',
      id: 'sem',
      kind: 'sample',
      date: '2017-06-15',
      bgcolor: 'rgb(234, 209, 220)',
      line: 5,
      fontcolor: 'rgb(0, 0, 0)'
    }, {
      empty: true
    }, {
      rev: '20-c62a0ada4035aa13ca2c427b5018109c',
      description: 'Generate or visualize a 3D model',
      viewURL: '07223c3391c6b0cde342518d240d3426',
      bgcolor: 'rgb(255, 255, 255)',
      empty: false
    }, {
      kind: 'optionalSample',
      icon: 'fa-list-alt',
      id: 'Report',
      description: 'Report',
      date: '2018-11-20',
      viewURL: '7b27528bcf8f1d6b4bef966125021698',
      bgcolor: 'rgb(217, 210, 233)',
      line: 6
    }, {
      viewURL: 'd969e852d55d44f6caad508be6bb13e5',
      kind: 'optionalSample',
      id: 'Sample rights',
      description: 'Sample rights',
      icon: 'fa-user-cog',
      bgcolor: 'rgb(217, 210, 233)',
      date: '2019-12-50',
      line: 6
    }, {
      date: '2019-02-10',
      kind: 'sample',
      icon: 'fa-user-edit',
      id: 'User preferences',
      rights: 'admin@cheminfo.org',
      viewURL: '4bd38fcc8700b63d7a34e247c174d217',
      line: 6,
      bgcolor: 'rgb(217, 210, 233)',
      description: 'Prefs'
    }, {
      viewURL: '6680a21f3889348522e1968dda9f6aa7',
      description: 'Zenodo',
      kind: 'optionalSample',
      id: 'Zenodo',
      date: '2018-05-20',
      bgcolor: 'rgb(217, 210, 233)',
      rights: '',
      icon: 'ci-icon-misc-zenodo',
      line: 6,
      fontcolor: 'rgb(0, 0, 0)'
    }, {
      id: 'addStock',
      kind: 'optionalSample',
      description: 'Add Stock',
      viewURL: '435e7dd9a4a474308d681831307220a9',
      icon: 'fa-plus',
      bgcolor: 'rgb(217, 210, 233)',
      fontcolor: 'rgb(0, 0, 0)',
      date: '2017-06-16',
      rights: 'admin@cheminfo.org,lpatiny@gmail.com',
      line: 6
    }, {
      date: '2017-06-16',
      id: 'searchStock',
      kind: 'optionalSample',
      description: 'Search Stock',
      viewURL: 'eeb03ca6c7a82d043456704a340e6d04',
      rights: 'luc@patiny.com,lpatiny@gmail.com,admin@cheminfo.org,julien.wist@correounivalle.edu.co',
      bgcolor: 'rgb(217, 210, 233)',
      fontcolor: 'rgb(0, 0, 0)',
      icon: 'ci-icon-structure-search',
      line: 6
    }, {
      rights: 'admin@cheminfo.org,lpatiny@gmail.com',
      date: '2017-06-01',
      id: 'Inventory',
      kind: 'optionalSample',
      description: 'Inventory',
      viewURL: 'c2a672b13238215f40fab85ff6fa04b4',
      bgcolor: 'rgb(217, 210, 233)',
      icon: 'fa-book',
      line: 6,
      fontcolor: 'rgb(0, 0, 0)'
    }, {
      date: '2017-08-19',
      kind: 'optionalSample',
      id: 'Tokens',
      description: 'Access tokens',
      bgcolor: 'rgb(217, 210, 233)',
      rights: 'admin@cheminfo.org',
      viewURL: '6a1d02a76eec96c43177a6c503c3f933',
      line: 6,
      fontcolor: 'rgb(0, 0, 0)',
      icon: 'fa-user-cog'
    }, {
      id: 'request',
      kind: 'sample',
      icon: 'ci-icon-mass-request',
      bgcolor: 'rgb(217, 210, 233)',
      date: '2018-06-30',
      description: 'Analytical request',
      viewURL: 'b1af0ae8843bc4b72b5501c717197b5f',
      rights: '',
      line: 6
    }, {
      viewURL: '105a8192b3046702221775d1c09485d2',
      description: 'Format manager',
      rights: 'admin@cheminfo.org',
      icon: 'fa-edit',
      kind: 'optionalSample',
      id: 'formatManager',
      line: 6,
      bgcolor: 'rgb(217, 210, 233)',
      fontcolor: 'rgb(0, 0, 0)'
    }, {
      viewURL: '343af97da2f69b4abaa244065faefaee',
      date: '2018-06-30',
      id: 'Templates manager',
      description: 'Templates manager',
      kind: 'optionalSample',
      icon: 'fa-notes-medical',
      bgcolor: 'rgb(217, 210, 233)',
      line: 6,
      fontcolor: 'rgb(0, 0, 0)',
      rights: 'admin@cheminfo.org'
    }, {
      description: 'Sample manager',
      viewURL: '83e55c39f2601bc912a45f049e7c9645',
      rights: 'admin@cheminfo.org',
      icon: 'fa-edit',
      kind: 'optionalSample',
      id: 'sampleManager',
      line: 6,
      bgcolor: 'rgb(217, 210, 233)',
      fontcolor: 'rgb(0, 0, 0)'
    }, {
      date: '2017-07-02',
      id: 'printerManagement',
      kind: 'optionalSample',
      description: 'Printer Management',
      icon: 'fa-print',
      bgcolor: 'rgb(217, 210, 233)',
      fontcolor: 'rgb(0, 0, 0)',
      rights: 'admin@cheminfo.org',
      viewURL: 'a2d22457b39108ecdbaa2d4556395053',
      line: 6
    }, {
      date: '2017-11-28',
      id: 'Test stock',
      kind: 'optionalSample',
      description: 'new add stock',
      viewURL: '8d230dd129d38a5755bb7e3128f4e8b5',
      bgcolor: 'rgb(217, 210, 233)',
      rights: 'admin@cheminfo.org',
      line: 6,
      fontcolor: 'rgb(0, 0, 0)'
    }, {
      date: '2017-12-11',
      id: 'General Deconvolution',
      kind: 'sample',
      description: 'deconvolution 2',
      viewURL: '36211a07a9a78e9493f4188d601d5f25',
      rights: 'admin@cheminfo.org',
      line: 6,
      bgcolor: 'rgb(217, 210, 233)',
      fontcolor: 'rgb(0, 0, 0)'
    }, {
      date: '2017-12-26',
      id: 'NMR Tree ',
      kind: 'sample',
      description: 'tree ',
      viewURL: '1c6e56b7f559de31a804f37f3e9f8762',
      bgcolor: 'rgb(217, 210, 233)',
      line: 6,
      rights: 'admin@cheminfo.org',
      fontcolor: 'rgb(0, 0, 0)'
    }, {
      date: '2018-02-15',
      id: 'MSDS',
      kind: 'optionalSample',
      description: 'MSDS',
      viewURL: '59dec54d14e5e206142256823eb92a7c',
      line: 6,
      bgcolor: 'rgb(217, 210, 233)',
      icon: 'ci-icon-safety-toxic',
      fontcolor: 'rgb(0, 0, 0)'
    }, {
      viewURL: '0728f3778cd29613c3c685cd1ba2e2f3',
      date: '2018-06-10',
      id: 'Share data',
      kind: 'optionalSample',
      description: 'Publication',
      icon: 'fa-share-alt',
      bgcolor: 'rgb(217, 210, 233)',
      rights: 'admin@cheminfo.org',
      line: 6,
      fontcolor: 'rgb(0, 0, 0)'
    }, {
      viewURL: '58d02720b825b75293792ec50dc8d4fe',
      icon: 'ci-icon-misc-search-request',
      date: '2018-07-01',
      id: 'Search requests',
      kind: 'optionalSample',
      description: 'Search requests',
      rights: 'admin@cheminfo.org',
      bgcolor: 'rgb(217, 210, 233)',
      line: 6
    }, {
      id: 'aliquots',
      rev: '',
      description: 'Aliquots',
      viewURL: '4d4d4afc298d37652a1ef3342b821cca',
      bgcolor: 'rgb(217, 210, 233)',
      empty: false,
      line: 6,
      date: '2018-08-25',
      rights: 'admin@cheminfo.org',
      kind: 'sample'
    }, {
      rights: 'admin@cheminfo.org',
      kind: 'rawIframe',
      line: 6,
      description: 'TEST',
      id: 'TEST',
      date: '2018-10-26',
      bgcolor: 'rgb(204, 0, 0)',
      viewURL: '/next/demo/forms/general/index.html'
    }, {
      viewURL: '5bdeb228532dc346b21e7f60f4191caf',
      id: 'Test 2',
      kind: 'optionalSample',
      description: 'Test 2',
      line: 6
    }]
  }];
});