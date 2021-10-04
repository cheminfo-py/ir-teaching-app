"use strict";

define(["module", "src/util/ui", "../libs/jcampconverter"], function (module, _ui, _jcampconverter) {
  var _ui2 = _interopRequireDefault(_ui);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function jcampInfo(_x) {
    return _jcampInfo.apply(this, arguments);
  }

  function _jcampInfo() {
    _jcampInfo = _asyncToGenerator(regeneratorRuntime.mark(function _callee(value) {
      var jcamp, parsed, data, _i, _Object$keys, key, _value, i, html;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return DataObject.check(value.jcamp.data, true).get(true);

            case 2:
              jcamp = _context.sent;
              parsed = (0, _jcampconverter.convert)(String(jcamp), {
                withoutXY: true,
                keepRecordsRegExp: /.*/
              }).flatten[0];
              console.log(parsed);
              data = [];

              for (_i = 0, _Object$keys = Object.keys(parsed.meta); _i < _Object$keys.length; _i++) {
                key = _Object$keys[_i];
                _value = parsed.meta[key];

                if (Array.isArray(_value)) {
                  for (i = 0; i < _value.length; i++) {
                    data.push({
                      label: "".concat(key, ".").concat(i + 1),
                      value: _value[i]
                    });
                  }
                } else {
                  data.push({
                    label: key,
                    value: _value
                  });
                }
              }

              html = "\n        <style>\n            #allParameters { \n                width: 100%;\n            }\n            #allParameters .limited{ \n                max-width: 150px;\n                overflow: hidden;\n                text-overflow: ellipsis;\n                white-space: nowrap;\n            }\n            #allParameters pre {\n                margin: 0;\n            }\n            #allParameters td {\n                vertical-align: top;\n            }\n            #allParameters tbody {\n                display: block;\n                height: 500px;\n                overflow-y: auto;\n            }\n        </style>\n        Search parameters: <input type='text' oninput='filter(this)'>\n        <table id='allParameters'>\n            <tbody>\n                ".concat(data.map(function (datum) {
                return "\n                    <tr>\n                        <td class=\"limited\"><b>".concat(datum.label, "</b></td>\n                        <td><pre>").concat(datum.value.replace ? datum.value.replace(/[\r\n]+$/, '') : datum.value, "</pre></td>\n                    </tr>\n                ");
              }).join('\n'), "\n            </tbody>\n        </table>\n        <script>\n            function filter(input) {\n                let escaped=input.value.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');\n                let regexp=new RegExp(escaped,'i')\n            console.log(regexp);\n                let lines=document.getElementById('allParameters').getElementsByTagName('TR');\n                for (let line of lines) {\n                    let content=line.children[0].innerHTML;\n                // console.log(regexp, content, content.match(regexp))\n                    if (content.match(regexp) || content.match(/<th>/i)) {\n                        line.style.display='';\n                    } else {\n                        line.style.display='none';\n                    }\n                }\n            }\n        </script>\n    ");

              _ui2["default"].dialog(html, {
                width: 800,
                height: 600,
                title: 'List of parameters'
              });

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _jcampInfo.apply(this, arguments);
  }

  module.exports = jcampInfo;
});