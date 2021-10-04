"use strict";

define(["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var style = exports.style = "\n<style>\n #extendedForm {\n        padding: 10px;\n    }\n    #extendedForm .addRow {\n        color: green;\n        font-weight: bold;\n        font-size: 12px;\n        padding: .4em .6em;\n    }\n    #extendedForm .removeRow {\n        color: red;\n        font-weight: bold;\n        font-size: 12px;\n        padding: .4em .8em;\n    }\n    #extendedForm h1 {\n        font-size: 16px;\n        padding-top: 12px;\n        padding-bottom: 4px;\n        space\n    }\n    #extendedForm h2 {\n        font-size: 12px;\n        margin-top: 12px;\n        margin-bottom: 4px;\n        space\n    }\n    #extendedForm input[type=number]{\n        width: 60px;\n    }\n    #extendedForm input, #extendedForm select {\n        margin-top: 3px;\n        margin-bottom: 3px;\n    } \n</style>";
  var dataNormalization = exports.dataNormalization = "\n  <h1>Preprocessing</h1>\n  <table>\n      <tr>\n          <th align=\"left\">Filters</th>\n          <td>\n              <table>\n                  <tr>\n                      <th></th><th></th>\n                      <th>Name</th>\n                      <th>Options</th>\n                  </tr>\n                  <tr data-repeat='normalization.filters'>\n                      <td>\n                          <select onchange=\"updateOptions(this);\" data-field='name'>\n                              <option value=\"\"></option>\n                              <option value=\"centerMean\">Center Mean</option>\n                              <option value=\"divideBySD\">Divide by SD</option>\n                              <option value=\"divideByMax\">Divide by max Y</option>\n                              <option value=\"rescale\" data-options=\"min,max\">Rescale (x to y)</option>\n                              <option value=\"normalize\" data-options=\"value\">Normalize (sum to n)</option>\n                              <option value=\"multiply\" data-options=\"value\">Multiply (value)</option>\n                              <option value=\"add\" data-options=\"value\">Add (value)</option>\n                              <option value=\"airplsbaseline\" data-options=\"\">AirPLS baseline</option>\n                              <option value=\"rollingaveragebaseline\" data-options=\"\">Rolling average baseline</option>\n                              <option value=\"iterativepolynomialbaseline\" data-options=\"\">Iterative polynomial baseline</option>\n                              <option value=\"rollingballbaseline\" data-options=\"\">Rolling ball basline</option>\n                              <option value=\"rollingmedianbaseline\" data-options=\"\">Rolling median baseline</option>\n                          </select>\n                      </td>\n                      <td>\n                          <input style=\"display:none\" type='number' placeholder=\"min\" data-field='options.min' size=\"5\">\n                          <input style=\"display:none\" type='number' placeholder=\"max\" data-field='options.max' size=\"5\">\n                          <input style=\"display:none\" type='number' placeholder=\"value\" data-field='options.value' size=\"5\">\n                      </td>\n                  </tr>\n              </table>\n          </td>\n      </tr>\n      <tr>\n          <th align=\"left\">Range:</th>\n          <td>\n              from: <input type=\"number\" name=\"normalization.from\" step=\"any\"> - \n              to: <input type=\"number\" name=\"normalization.to\" step=\"any\">\n          </td>\n      </tr>\n      <tr>\n          <th align=\"left\">Exclusions</th>\n          <td>\n              <table>\n                  <tr>\n                      <th></th><th></th>\n                      <th>From</th>\n                      <th>To</th>\n                  </tr>\n                  <tr data-repeat='normalization.exclusions'>\n                      <td><input type='number' data-field='from' size=\"5\"></td>\n                      <td><input type='number' data-field='to' size=\"5\"></td>\n                  </tr>\n              </table>\n          </td>\n      </tr>\n      <tr>\n          <th align=\"left\">Processing:</th>\n          <td>\n              <select name='normalization.processing'>\n                  <option value=\"\"></option>\n                  <option value=\"firstDerivative\">First derivative</option>\n                  <option value=\"secondDerivative\">Second derivative</option>\n                  <option value=\"thirdDerivative\">Third derivative</option>\n              </select>\n          </td>\n      </tr>\n      <!--\n      <tr>\n          <th align=\"left\">Number of points:</th>\n          <td>\n              <input type='number' name='normalization.numberOfPoints' size=\"6\">\n          </td>\n      </tr>\n      -->\n  </table>\n  <script>\n    function updateOptions(source) {\n        let options=source.options[source.options.selectedIndex].getAttribute('data-options');\n        let show=options ? options.split(',') : [];\n        let optionsElement = $(source).parent().next();\n        optionsElement.find('input').hide();\n        optionsElement.find('textarea').hide();\n        for (let key of show) {\n            optionsElement.find('input[placeholder='+key+']').show();\n            optionsElement.find('textarea[placeholder='+key+']').show();\n        }\n    }\n  </script>\n";
  var spectraDisplay = exports.spectraDisplay = "\n<h1>Spectra display preferences</h1>\n\n<table>\n    <tr>\n        <th>Spectra:</th>\n        <td>\n            <input type='radio' name='display.selection' value='all'>All\n            <input type='radio' name='display.selection' value='selected'>Selected\n            <input type='radio' name='display.selection' value='none'>None\n        </td>\n    </tr>\n    {% if keepOriginal %}\n        <tr>\n            <th>Display:</th>\n            <td>\n                <input type='radio' name='display.original' value='true'> Original data\n                <input type='radio' name='display.original' value='false'> Normalized data\n            </td>\n        </tr>\n    {% else %}\n        <input type='hidden' name='display.original' value='false'>\n    {% endif %}\n    <tr>\n        <th>Box-plot shadow</th>\n        <td>\n            <input type=\"checkbox\" name=\"display.boxplot\" checked>\n            <span onclick=\"toggle(this);\">\u25B6</span>\n            <div style=\"display: none\">\n                <b>Box plot preferences:</b><br>\n                Q2 stroke width: <input type=\"number\" step=\"any\" style=\"width:50px\" name=\"display.boxplotOptions.q2StrokeWidth\"> - color: <input type=\"color\" name=\"display.boxplotOptions.q2StrokeColor\"><br>\n                Q1/Q3 fill opacity: <input type=\"number\" step=\"any\" style=\"width:50px\" name=\"display.boxplotOptions.q13FillOpacity\"> - color: <input type=\"color\" name=\"display.boxplotOptions.q13FillColor\"><br>\n                min/max fill opacity: <input type=\"number\" step=\"any\" style=\"width:50px\" name=\"display.boxplotOptions.minMaxFillOpacity\"> - color: <input type=\"color\" name=\"display.boxplotOptions.minMaxFillColor\"><br>\n            </div>  \n        </td>\n    </tr>\n    <tr>\n        <th>\n            Display tracking info:\n        </th>\n        <td>\n            <input type=\"checkbox\" name=\"display.trackingInfo\">\n        </td>\n    </tr>\n    <tr>\n        <th>\n            Correlation point index:\n        </th>\n        <td>\n            <input type=\"number\" name=\"display.correlationIndex\">\n        </td>\n    </tr>\n</table>\n\n<script>\n    function toggle(element) {\n        let nextStyle=element.nextElementSibling.style\n        if (nextStyle.display===\"none\") {\n            nextStyle.display = \"block\";\n            element.innerHTML='\u25BC';\n        } else {\n            nextStyle.display = \"none\";\n            element.innerHTML='\u25B6';\n        }\n    }\n</script>\n";
  var displayTwigPreferences = exports.displayTwigPreferences = "\n<style>\n    #displayPreferences select {\n        background-color: #DDD;\n        font-size: small;\n    }\n</style>\n<div id=\"displayPreferences\">\n    Display:\n    <select name='display.selection'>\n        <option value=\"\">None</option>\n        <option value=\"selected\">Selected</option>\n        <option value=\"all\">All</option>\n    </select>\n    \n    {% if keepOriginal %}\n        \u2014 \n        <select name='display.original'>\n            <option value=\"true\">Original</option>\n            <option value=\"false\">Normalized</option>\n        </select>\n    {% else %}\n        <input type='hidden' name='display.original' value='false'>\n    {% endif %}\n    \n     \u2014 \n    \n    Box-plot:\n    <select name='display.boxplot'>\n        <option value=\"\">None</option>\n        <option value=\"selected\">Selected</option>\n        <option value=\"all\">All</option>\n    </select>\n        \n    <div style=\"display:none\">\n        Q2 stroke width: <input type=\"number\" step=\"any\" style=\"width:50px\" name=\"display.boxplotOptions.q2StrokeWidth\"> - color: <input type=\"color\" name=\"display.boxplotOptions.q2StrokeColor\"><br>\n        Q1/Q3 fill opacity: <input type=\"number\" step=\"any\" style=\"width:50px\" name=\"display.boxplotOptions.q13FillOpacity\"> - color: <input type=\"color\" name=\"display.boxplotOptions.q13FillColor\"><br>\n        min/max fill opacity: <input type=\"number\" step=\"any\" style=\"width:50px\" name=\"display.boxplotOptions.minMaxFillOpacity\"> - color: <input type=\"color\" name=\"display.boxplotOptions.minMaxFillColor\"><br>\n    </div>\n    \n    <label>\n        <input type=\"checkbox\" name=\"display.trackingInfo\">\n        Tracking info\n    </label>\n    \n    \u2014 Correlation:\n        <select name='display.correlation'>\n            <option value=\"\">None</option>\n            <option value=\"selected\">Selected</option>\n            <option value=\"all\">All</option>\n        </select>\n        <input type=\"hidden\" name=\"display.correlationIndex\" step=\"any\" value=\"{{preferences.display.correlationIndex}}\" style=\"width: 50px\">\n            \n</div>\n";
  var tocOfflineTwig = exports.tocOfflineTwig = "\n{% if tocClicked %}\n{%set data=tocClicked %}\n{% endif %}\n{% if tocHovered %}\n{%set data=tocHovered %}\n{% endif %}\n{% if tocSample %}\n{%set data=tocSample %}\n{% endif %}\n{%set value=data.value %}\n<style>\n#toc, #toc tbody  {\n    font-size: 1em;\n    font-family: Arial, Helvetica, sans-serif;\n}\n#toc h1 {\n    font-size:1.5em;\n    text-align: left;\n}\n#toc h2 {\n    font-size:1.2em;\n    text-align: center;\n}\n#toc td,  #toc th {\n    vertical-align: top;\n    text-align: left;\n}\n</style>\n\n{% macro showProperties(object) %}\n{% if object is iterable %}\n    <table>\n        {% for key, value in object %}\n        <tr>\n            <th>{{key}}</th>\n            <td>{{ _self.showProperties(value) }}</td>\n        </tr>\n        {% endfor %}  \n    </table>\n{% else %}\n    {% if object is same as (false) %}\n        <span style=\"color:red\">\u2718</span>\uFE0E\n    {% elseif object is same as (true) %}\n         <span style=\"color:green\">\u2714</span>\n    {% else %}\n        {{object}}\n    {% endif %}\n{% endif %}\n{% endmacro %}\n{% import _self as macros %}\n\n{% if value %}\n<div id='toc'>\n\n<h1>{{value.reference}}</h1>\n<h2>{{value.title}}</h2>\n<div class=\"molecule\">\n    {{rendertype(value.ocl.value,{width:300, height:120, coordinates: value.ocl.coordinates},\"oclID\")}}\n</div>\n<table>\n    {% if value.misc %}\n        <tr>\n            <th>Meta information:</th>\n            <td>\n                {{ macros.showProperties(value.misc) }}\n            </td>           \n        </tr>\n    {% endif %}\n</table>\n</div>\n{% endif %}\n";
});