"use strict";

define(["module"], function (module) {
  function toHTML(value) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$parenthesis = options.parenthesis,
        parenthesis = _options$parenthesis === void 0 ? false : _options$parenthesis,
        _options$ascending = options.ascending,
        ascending = _options$ascending === void 0 ? false : _options$ascending;
    value = JSON.parse(JSON.stringify(value));

    if (value && value.peak) {
      // hack for old wrong peaks
      value.peak.forEach(function (item) {
        if (!item.wavenumber) item.wavenumber = item.wavelength;
      });

      if (ascending) {
        value.peak.sort(function (a, b) {
          return a.wavenumber - b.wavenumber;
        });
      } else {
        value.peak.sort(function (a, b) {
          return b.wavenumber - a.wavenumber;
        });
      }
    }

    if (parenthesis) return format2(value);
    return format1(value);
  } // IR (cm-1): 1955w, 1881w, 1807w, 1614m, 1500S, 1454m


  function format1(value) {
    var acsString = '';

    if (value && value.peak) {
      acsString += 'IR (cm<sup>-1</sup>): ';
      acsString += value.peak.map(function (a) {
        return Math.round(a.wavenumber) + (a.kind ? "<i>".concat(a.kind, "</i>") : '');
      }).join(', ');
    }

    return acsString;
  } // IR (νmax, cm-1) 2929 (w), 3521 (w), 3016 (w), 3065 (w), 2853 (w), 1766S, 1495 (w),


  function format2(value) {
    var acsString = '';

    if (value && value.peak) {
      acsString += 'IR (ν<sub>max</sub>, cm<sup>-1</sup>) ';
      acsString += value.peak.map(function (a) {
        return Math.round(a.wavenumber) + (a.kind ? " (".concat(a.kind.toLowerCase(), ")") : '');
      }).join(', ');
    }

    return acsString;
  }

  module.exports = toHTML;
});