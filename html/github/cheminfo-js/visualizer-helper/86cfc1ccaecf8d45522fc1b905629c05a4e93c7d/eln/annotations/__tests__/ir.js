var toAnnotations = require('../ir');


var peaks = [
  { wavelength: 1000, transmittance: 10, kind: 'w' },
  { wavelength: 2000, transmittance: 50, kind: 'm' },
  { wavelength: 3000, transmittance: 100, kind: 'S' }
];


describe('Annotations object for IR spectrum', () => {
  it('default options', () => {
    var annotations = toAnnotations(peaks);
    expect(annotations).toHaveLength(3);
  });
});
