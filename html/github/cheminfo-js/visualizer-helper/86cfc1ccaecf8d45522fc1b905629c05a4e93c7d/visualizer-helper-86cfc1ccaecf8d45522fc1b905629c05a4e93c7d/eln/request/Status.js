"use strict";

define(["exports", "src/util/typerenderer"], function (exports, _typerenderer) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typerenderer2 = _interopRequireDefault(_typerenderer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // we systematically add the type renderer
  _typerenderer2["default"].addType('requeststatus', {
    toscreen: function toscreen($element, val) {
      var label = Status.getStatusDescription(val);
      var color = Status.getStatusColor(val);
      $element.css('background-color', color);
      $element.html(label);
    }
  });

  var Status = {};
  exports["default"] = Status;
  var status = {
    10: {
      description: 'Created',
      color: '#f1f4dc'
    },
    20: {
      description: 'Pending',
      color: '#FFDC00'
    },
    30: {
      description: 'Acquiring',
      color: '#a8d5ff'
    },
    40: {
      description: 'Processing',
      color: '#0074D9'
    },
    50: {
      description: 'Finished',
      color: '#01FF70'
    },
    80: {
      description: 'Error',
      color: '#FF4136'
    },
    90: {
      description: 'Cancelled',
      color: '#AAAAAA'
    }
  };
  Status.status = status;

  Status.getStatusArray = function getStatusArray() {
    var statusArray = Object.keys(status).map(function (key) {
      return {
        code: key,
        description: status[key].description,
        color: status[key].color
      };
    });
    return statusArray;
  };

  Status.getStatus = function getStatus(code) {
    if (status[code]) {
      return status[code];
    }

    throw new Error("No such status: ".concat(code));
  };

  Status.getStatusDescription = function getStatusDescription(code) {
    if (!status[code]) return 'Status does not exist';
    return status[code].description;
  };

  Status.getStatusColor = function getStatusColor(code) {
    if (!status[code]) return '#FFFFFF';
    return status[code].color;
  };

  Status.getStatusCode = function getStatusCode(description) {
    for (var _i = 0, _Object$keys = Object.keys(status); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];

      if (status[key].description === description) {
        return Number(key);
      }
    }

    throw new Error("No such status: ".concat(description));
  };
});