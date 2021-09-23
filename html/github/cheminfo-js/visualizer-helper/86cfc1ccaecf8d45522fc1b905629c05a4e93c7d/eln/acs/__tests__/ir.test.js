var toHTML = require('../ir');

var entry = {
  peak: [
    { wavelength: 1000, transmittance: 10, kind: 'w' },
    { wavelength: 2000, transmittance: 50, kind: 'm' },
    { wavelength: 3000, transmittance: 100, kind: 'S' }
  ]
};

describe('ACS string for IR spectrum', () => {
  it('default options', () => {
    var html = toHTML(entry, {});
    expect(html).toBe(
      'IR (cm<sup>-1</sup>): 3000<i>S</i>, 2000<i>m</i>, 1000<i>w</i>'
    );
  });

  it('ascending order', () => {
    var html = toHTML(entry, { ascending: true });
    expect(html).toBe(
      'IR (cm<sup>-1</sup>): 1000<i>w</i>, 2000<i>m</i>, 3000<i>S</i>'
    );
  });
});
