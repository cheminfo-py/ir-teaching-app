"use strict";

define(["module"], function (module) {
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function F() {};

        return {
          s: F,
          n: function n() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function e(_e) {
            throw _e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function s() {
        it = o[Symbol.iterator]();
      },
      n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function e(_e2) {
        didErr = true;
        err = _e2;
      },
      f: function f() {
        try {
          if (!normalCompletion && it["return"] != null) it["return"]();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var STATUS = [{
    code: 10,
    label: 'Started',
    color: 'rgba(244,204,204,1)'
  }, {
    code: 20,
    label: 'Finished',
    color: 'rgba(252,229,205,1)'
  }, {
    code: 30,
    label: 'Worked up',
    color: 'rgba(255,242,204,1)'
  }, {
    code: 40,
    label: 'Purified',
    color: 'rgba(217,234,211,1)'
  }, {
    code: 50,
    label: 'Closed',
    color: 'rgba(206,224,227,1)'
  }];

  function getColor(statusCode) {
    var _iterator = _createForOfIteratorHelper(STATUS),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var status = _step.value;

        if (Number(status.code) === Number(statusCode)) {
          return status.color;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return 'white';
  }

  function getColorFromReaction(reaction) {
    var status = Number(reaction.$content.status && reaction.$content.status[0] && reaction.$content.status[0].code);
    return getColor(status);
  }

  function updateStatuses(statuses) {
    if (!statuses || !Array.isArray(statuses)) return [];

    var _iterator2 = _createForOfIteratorHelper(statuses),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var status = _step2.value;
        updateStatus(status);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return statuses;
  }
  /*
   * We will migrate all code to a number
   @param {object} status
   @returns {object}
   */


  function updateStatus(status) {
    if (isNaN(status.code)) {
      switch (status.code) {
        case 'started':
          status.code = 10;
          break;

        case 'finished':
          status.code = 20;
          break;

        case 'worked-up':
          status.code = 30;
          break;

        case 'purified':
          status.code = 40;
          break;

        case 'closed':
          status.code = 50;
          break;

        default:
      }
    }

    return status;
  }

  function getLabel(statusCode) {
    var _iterator3 = _createForOfIteratorHelper(STATUS),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var status = _step3.value;

        if (Number(status.code) === Number(statusCode)) {
          return status.label;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return 'white';
  }

  function getNextStatus(statusCode) {
    for (var i = 0; i < STATUS.length; i++) {
      var status = STATUS[i];

      if (status.code === statusCode && i < STATUS.length - 1) {
        return STATUS[i + 1].code;
      }
    }

    return statusCode;
  }

  function getForm(currentStatus) {
    return "\n    <style>\n        #status {\n            zoom: 1.5;\n        }\n    </style>\n    <div id='status'>\n        <b>Please select the new status</b>\n        <p>&nbsp;</p>\n        <form>\n            <select name=\"status\">\n                ".concat(STATUS.map(function (item) {
      return "<option value=\"".concat(item.code, "\" ").concat(item.code === currentStatus ? 'selected' : '', ">").concat(item.label, "</option>");
    }), "\n            </select>\n            <input type=\"submit\" value=\"Submit\"/>\n        </form>\n    </div>\n");
  }

  module.exports = {
    STATUS: STATUS,
    getColor: getColor,
    getLabel: getLabel,
    getForm: getForm,
    getNextStatus: getNextStatus,
    getColorFromReaction: getColorFromReaction,
    updateStatus: updateStatus,
    updateStatuses: updateStatuses
  };
});