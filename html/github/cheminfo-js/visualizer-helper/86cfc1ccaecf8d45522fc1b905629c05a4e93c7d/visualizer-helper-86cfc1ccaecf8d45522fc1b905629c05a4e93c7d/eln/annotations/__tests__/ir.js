"use strict";

define(['../ir'], function (toAnnotations) {
  var peaks = [{
    wavelength: 1000,
    transmittance: 10,
    kind: 'w'
  }, {
    wavelength: 2000,
    transmittance: 50,
    kind: 'm'
  }, {
    wavelength: 3000,
    transmittance: 100,
    kind: 'S'
  }];
  describe('Annotations object for IR spectrum', function () {
    it('default options', function () {
      var annotations = toAnnotations(peaks);
      expect(annotations).toHaveLength(3);
    });
  });
});