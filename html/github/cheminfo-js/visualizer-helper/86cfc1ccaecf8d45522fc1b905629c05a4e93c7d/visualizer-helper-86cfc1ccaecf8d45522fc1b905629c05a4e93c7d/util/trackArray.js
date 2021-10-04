"use strict";

define(['src/util/api', 'lodash'], function (API, _) {
  function track(localName, defaultValue) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var _options$varName = options.varName,
        varName = _options$varName === void 0 ? localName : _options$varName,
        _options$appendDefaul = options.appendDefault,
        appendDefault = _options$appendDefaul === void 0 ? true : _options$appendDefaul,
        _options$comparator = options.comparator,
        comparator = _options$comparator === void 0 ? _.isEqual : _options$comparator;
    var data = API.getData(varName);
    if (data) return Promise.resolve(data);
    var localValue = [];

    try {
      localValue = JSON.parse(window.localStorage.getItem(localName)) || [];

      if (!Array.isArray(localValue)) {
        throw new Error('TrackArray expected an array in local storage');
      }

      if (localValue.length === 0 || appendDefault) {
        localValue = localValue.concat(JSON.parse(JSON.stringify(defaultValue)));
        localValue = _.uniqWith(localValue, comparator);
      }
    } catch (e) {
      return Promise.reject(e);
    }

    return API.createData(varName, localValue).then(function (data) {
      data.onChange(function () {
        localStorage.setItem(localName, JSON.stringify(data));
      });
      return data;
    });
  }

  return track;
});