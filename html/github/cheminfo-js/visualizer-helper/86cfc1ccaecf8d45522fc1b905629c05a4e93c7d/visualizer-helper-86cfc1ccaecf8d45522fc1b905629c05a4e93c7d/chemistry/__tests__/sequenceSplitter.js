"use strict";

define(['../sequenceSplitter'], function (sequenceSplitter) {
  test('AAA', function () {
    expect(sequenceSplitter('AAA')).toHaveLength(3);
  });
  test('HAlaAlaAlaOH', function () {
    expect(sequenceSplitter('HAlaAlaAlaOH')).toHaveLength(3);
  });
  test('HAlaAla(H-1OH)AlaOH', function () {
    expect(sequenceSplitter('HAlaAla(H-1OH)AlaOH')).toHaveLength(3);
  });
  test('H(+)AlaAla(H-1OH)AlaOH', function () {
    expect(sequenceSplitter('H(+)AlaAla(H-1OH)AlaOH')).toHaveLength(3);
  });
  test('ForAlaAla(H-1OH)AlaOH', function () {
    expect(sequenceSplitter('ForAlaAla(H-1OH)AlaOH')).toHaveLength(3);
  });
});