"use strict";

define(["module", "src/util/ui"], function (module, _ui) {
  var _ui2 = _interopRequireDefault(_ui);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var html = "\n    <style>\n        #mfHelp {\n            font-size: 1.4em;\n        }\n    </style>\n    <div id='mfHelp'>\n        <h1>How to enter a MF ?</h1>\n        In a molecular formula it is possible to define multiple components, isotopes, \n        non natural isotopic abundance as well as to use groups and parenthesis.\n        <ul>\n            <li>isotopes will be place in brackets: eg: [13C], C[2H]Cl3\n            <li>non natural abundance will be specified in curly brackets: eg: C{50,50}10 means that we have a ratio 50:50 between 12C and 13C\n            <li>group abbreviation: you may use in molecular formula groups like Ala, Et, Ph, etc ...\n            <li>multiple components should be separated by ' . '. eg. Et3N . HCl\n            <li>hydrates on non-integer molecular formula may be specify with numbers in front on the MF. ex. CaSO4 . 1.5 H2O\n            <li>parenthesis: any number of parenthesis may be used. eg. ((CH3)3C)3C6H3\n        </ul>  \n    </div> \n";

  module.exports = function showMfHelp() {
    _ui2["default"].dialog(html, {
      width: 500,
      height: 400,
      title: 'HELP: entering a molecular formula'
    });
  };
});