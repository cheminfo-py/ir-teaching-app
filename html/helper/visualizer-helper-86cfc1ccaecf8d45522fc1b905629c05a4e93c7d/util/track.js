/*
In the general preferences you should put something like:
require(['Track'], function(Track) {
    Track('massOptions');
})
*/

let _defaultValue;

define(['jquery', 'src/util/api', 'src/util/versioning'], function (
  $,
  API,
  Versioning
) {
  function track(cookieName, defaultValue, options = {}) {
    var varName = options.varName || cookieName;
    var data = API.getData(varName);
    _defaultValue = defaultValue;
    if (data) return Promise.resolve(data);
    data = {};
    try {
      data = JSON.parse(window.localStorage.getItem(cookieName)) || {};
      if (defaultValue) {
        if (
          defaultValue.version &&
          defaultValue.version > (data.version || 0)
        ) {
          data = JSON.parse(JSON.stringify(defaultValue));
        } else {
          data = $.extend(true, JSON.parse(JSON.stringify(defaultValue)), data);
        }
      }
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }

    return API.createData(varName, data).then(function (result) {
      var mainData = Versioning.getData();

      result.resetValue = () => {
        Object.keys(_defaultValue).forEach((key) => {
          result[key] = JSON.parse(JSON.stringify(_defaultValue[key]));
        });
        result.triggerChange();
      };
      mainData.onChange((evt) => {
        if (evt.jpath[0] === varName) {
          localStorage.setItem(cookieName, JSON.stringify(result));
        }
      });
      return result;
    });
  }

  return track;
});
