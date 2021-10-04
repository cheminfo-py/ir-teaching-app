'use strict';

var _openchemlibCore = require("openchemlib/openchemlib-core");

var _openchemlibCore2 = _interopRequireDefault(_openchemlibCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// returns GHS information based on pubchem and a smiles
define(['src/util/ui', 'src/util/api'], function (UI, API) {
  function fromIDCode(_x, _x2) {
    return _fromIDCode.apply(this, arguments);
  }

  function _fromIDCode() {
    _fromIDCode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(oclCode, options) {
      var molecule, smiles;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              molecule = _openchemlibCore2["default"].Molecule.fromIDCode(oclCode);
              smiles = molecule.toSmiles();
              return _context.abrupt("return", fromSMILES(smiles, options));

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _fromIDCode.apply(this, arguments);
  }

  function fromSMILES(_x3) {
    return _fromSMILES.apply(this, arguments);
  }

  function _fromSMILES() {
    _fromSMILES = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(smiles) {
      var options,
          html,
          _args2 = arguments;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
              html = "<iframe src=\"https://www.lactame.com/react/views/v1.2.1/chemistry/pubchem.html?smiles=".concat(encodeURIComponent(smiles), "\" frameborder=\"0\" style=\"overflow:hidden;height:95%;width:100%\" height=\"95%\" width=\"100%\"></iframe>");
              UI.dialog(html, {
                width: 1000,
                height: 800,
                modal: true,
                title: 'Pubchem information'
              });

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _fromSMILES.apply(this, arguments);
  }

  return {
    fromIDCode: fromIDCode,
    fromSMILES: fromSMILES
  };
});
var ghsTemplate = "\n<style>\n    #ghsSmmary {\n        \n    }\n    #ghsSummary table {\n        border-collapse: collapse;\n    }\n    #ghsSummary td {\n        border: 0.5px solid grey;\n        padding: 2px;\n    }\n    #ghsSummary h1 {\n        font-size: 1.5em;\n        padding-bottom: 0.5em;\n        padding-top: 1em;\n    }\n</style>\n<div id=\"ghsSummary\">\n    {% if ghs.pictograms %}\n        <h1>Pictograms</h1>\n        <table>\n            {% for pictogram in ghs.pictograms %}\n            <tr>\n              <td>\n                  {{pictogram.code}}\n              </td>\n              <td>\n                  <div style=\"width:4em; height:4em\">\n                    {{rendertypeBlock(pictogram.code,'ghs')}}\n                  </div>\n              </td>\n              <td>\n                  {{pictogram.description}}\n              </td>\n            </tr>\n            {% endfor %}\n        </table>\n    {% endif %}\n    {% if ghs.hStatements %}\n        <h1>Hazard statements</h1>\n        <table>\n            {% for h in ghs.hStatements %}\n            <tr>\n              <td>\n                  {{h.code}}\n              </td>\n              <td>\n                  {{h.description}}\n              </td>\n            </tr>\n            {% endfor %}\n        </table>\n    {% endif %}\n    {% if ghs.pStatements %}\n        <h1>Precautionary statements</h1>\n        <table>\n            {% for p in ghs.pStatements %}\n            <tr>\n              <td>\n                  {{p.code}}\n              </td>\n              <td>\n                  {{p.description}}\n              </td>\n            </tr>\n            {% endfor %}\n        </table>\n    {% endif %}\n</div>\n";
var ghsFullTemplate = "\n<style>\n    #ghsFull {\n        \n    }\n    #ghsFull table {\n        border-collapse: collapse;\n    }\n    #ghsFull a:hover, #ghsFull a:link, #ghsFull a:active, #ghsFull a:visited {\n        color: darkblue;\n        text-decoration: none;\n    }\n    #ghsFull td {\n        border: 0.5px solid grey;\n        padding: 2px;\n    }\n    #ghsFull h1 {\n        font-size: 1.5em;\n        padding-bottom: 0.1em;\n        padding-top: 0.5em;\n    }\n    #ghsFull h2 {\n        font-size: 1.2em;\n        padding-bottom: 0.5em;\n        padding-top: 1em;\n    }\n    #ghsFull i {\n        font-size: 0.8em;\n    }\n    #ghsFull p {\n        padding-bottom: 0.1em;\n        padding-top: 0.1em;\n    }\n</style>\n<div id=\"ghsFull\">\n    <p style=\"text-align: center; font-size: 2em; font-weight:bold;\">Detailed safety information</p>\n    {% if ghsFull.pictograms %}\n        <h1>Pictograms</h1>\n        {% for entry in ghsFull.pictograms %}\n            <h2><a href=\"{{entry.reference.url}}\">{{entry.reference.sourceName}}</a></h2>\n            <p>\n                Name: <b>{{entry.reference.name}}</b>\n            </p>\n            <p><i>{{entry.reference.description}}</i></p>\n            <table>\n                {% for pictogram in entry.data %}\n                <tr>\n                  <td>\n                      {{pictogram.code}}\n                  </td>\n                  <td>\n                      <div style=\"width:4em; height:4em\">\n                        {{rendertypeBlock(pictogram.code,'ghs')}}\n                      </div>\n                  </td>\n                  <td>\n                      {{pictogram.description}}\n                  </td>\n                </tr>\n                {% endfor %}\n            </table>\n        {% endfor %}\n    {% endif %}\n    {% if ghsFull.hStatements %}\n        <h1>Hazard statements</h1>\n        {% for entry in ghsFull.hStatements %}\n            <h2><a href=\"{{entry.reference.url}}\">{{entry.reference.sourceName}}</a></h2>\n            <p>\n                Name: <b>{{entry.reference.name}}</b>\n            </p>\n            <p><i>{{entry.reference.description}}</i></p>\n            <table>\n                {% for hStatement in entry.data %}\n                <tr>\n                  <td>\n                      {{hStatement.code}}\n                  </td>\n                  <td>\n                      {{hStatement.description}}\n                  </td>\n                </tr>\n                {% endfor %}\n            </table>\n        {% endfor %}\n    {% endif %}\n    {% if ghsFull.pStatements %}\n        <h1>Precautionary statements</h1>\n        {% for entry in ghsFull.pStatements %}\n            <h2><a href=\"{{entry.reference.url}}\">{{entry.reference.sourceName}}</a></h2>\n            <p>\n                Name: <b>{{entry.reference.name}}</b>\n            </p>\n            <p><i>{{entry.reference.description}}</i></p>\n            <table>\n                {% for pStatement in entry.data %}\n                <tr>\n                  <td>\n                      {{pStatement.code}}\n                  </td>\n                  <td>\n                      {{pStatement.description}}\n                  </td>\n                </tr>\n                {% endfor %}\n            </table>\n        {% endfor %}\n    {% endif %}\n</div>\n";