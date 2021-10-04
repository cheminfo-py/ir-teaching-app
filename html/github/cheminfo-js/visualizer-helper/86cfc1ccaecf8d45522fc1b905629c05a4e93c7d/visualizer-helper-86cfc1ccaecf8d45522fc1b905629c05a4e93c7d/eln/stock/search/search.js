"use strict";

define(["module", "lodash", "src/util/ui", "./chemspider", "./chemexper", "./epfl"], function (module, _lodash, _ui, _chemspider, _chemexper, _epfl) {
  var _lodash2 = _interopRequireDefault(_lodash);

  var _ui2 = _interopRequireDefault(_ui);

  var _chemspider2 = _interopRequireDefault(_chemspider);

  var _chemexper2 = _interopRequireDefault(_chemexper);

  var _epfl2 = _interopRequireDefault(_epfl);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var defaultOptions = {
    chemexper: true,
    chemspider: true,
    epfl: false
  };
  module.exports = {
    chemspider: _chemspider2["default"],
    chemexper: _chemexper2["default"],
    epfl: _epfl2["default"],
    choose: function choose(term, options) {
      options = Object.assign({}, defaultOptions, options);
      var sources = [];

      if (options.epfl) {
        sources.push({
          promise: _epfl2["default"].search(term)
        });
      }

      if (options.chemspider) {
        sources.push({
          promise: _chemspider2["default"].search(term)
        });
      }

      if (options.chemexper) sources.push({
        promise: _chemexper2["default"].search(term)
      });

      if (options.roc) {
        var roc = options.roc;
        var rocPromise = roc.view('entryByKindAndId', {
          startkey: ['sample', [term]],
          endkey: ['sample', ["".concat(term, "\uFFF0"), {}]]
        }).then(function (data) {
          data.forEach(function (d) {
            var names = []; // we start with the title

            if (d.$content.general && d.$content.general.title) {
              names.push(d.$content.general.title);
            } // then the names


            if (d.$content.general && d.$content.general.name > 0) {
              names.push.apply(names, _toConsumableArray(d.$content.general.name.map(function (d) {
                return d.value;
              })));
            }

            names.push(d.$id.join(' '));

            if (d.$content.general && d.$content.general.description) {
              names.push(d.$content.general.description);
            }

            d.id = d._id;
            d.source = 'sample';
            d.names = _lodash2["default"].uniq(names);
          });
          return data;
        });
        sources.push({
          promise: rocPromise
        });
      }

      return _ui2["default"].choose(sources, {
        autoSelect: options.autoSelect,
        asynchronous: true,
        noConfirmation: true,
        returnRow: true,
        dialog: {
          width: 1000,
          height: 800
        },
        columns: [{
          id: 'names',
          name: 'names',
          jpath: [],
          rendererOptions: {
            forceType: 'object',
            twig: "\n                        <div style=\"height: 100%; line-height: initial;\">\n                        <table style=\"width: 100%;\">\n                        {% for n in names %}\n                            <tr><td>{{ n }}</td></tr>\n                        {% endfor %}\n                        </table>\n                        </div>\n                    "
          }
        }, {
          id: 'cas',
          name: 'cas',
          jpath: ['$content', 'identifier'],
          rendererOptions: {
            forceType: 'object',
            twig: listTemplate('cas', '.value')
          },
          maxWidth: 100
        }, {
          id: 'molfile',
          name: 'molfile',
          jpath: ['$content', 'general', 'molfile'],
          rendererOptions: {
            forceType: 'mol2d'
          },
          maxWidth: 250
        }, {
          id: 'source',
          name: 'source',
          field: 'source',
          maxWidth: 70
        }],
        idField: 'id',
        slick: {
          rowHeight: 150
        }
      })["catch"](function (e) {
        console.error(e); // eslint-disable-line no-console

        _ui2["default"].showNotification('search failed', 'error');
      });
    }
  };

  function listTemplate(val, prop) {
    return "\n    <div style=\"height: 100%; line-height: initial; vertical-align: middle\">\n        <table style=\"width: 100%; text-align: center;\">\n            {% for n in ".concat(val, " %}\n                <tr><td>{{ n").concat(prop, " }}</td></tr>\n            {% endfor %}\n        </table>\n    </div>\n    ");
  }
});