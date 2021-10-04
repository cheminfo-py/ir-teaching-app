"use strict";

// returns a Mysql formatted date, very practical to get a string with dthe date
define([], function () {
  function twoDigits(d) {
    if (d >= 0 && d < 10) return "0".concat(d.toString());
    if (d > -10 && d < 0) return "-0".concat((-1 * d).toString());
    return d.toString();
  }

  function create(date) {
    if (!date) date = new Date();
    return "".concat(date.getUTCFullYear(), "-").concat(twoDigits(1 + date.getUTCMonth()), "-").concat(twoDigits(date.getUTCDate()), " ").concat(twoDigits(date.getUTCHours()), ":").concat(twoDigits(date.getUTCMinutes()), ":").concat(twoDigits(date.getUTCSeconds()));
  }

  return create;
});