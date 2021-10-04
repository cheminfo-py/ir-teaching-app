define(['src/util/api', 'lodash'], function (API, _) {
  function track(localName, defaultValue, options = {}) {
    const {
      varName = localName,
      appendDefault = true,
      comparator = _.isEqual
    } = options;

    var data = API.getData(varName);
    if (data) return Promise.resolve(data);
    var localValue = [];
    try {
      localValue = JSON.parse(window.localStorage.getItem(localName)) || [];
      if (!Array.isArray(localValue)) {
        throw new Error('TrackArray expected an array in local storage');
      }
      if (localValue.length === 0 || appendDefault) {
        localValue = localValue.concat(
          JSON.parse(JSON.stringify(defaultValue))
        );
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
