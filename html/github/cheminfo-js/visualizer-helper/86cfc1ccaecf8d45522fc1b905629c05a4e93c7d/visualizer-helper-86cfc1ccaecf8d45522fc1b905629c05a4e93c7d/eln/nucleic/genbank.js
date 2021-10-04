"use strict";

define(["exports", "lib/twigjs/twig", "src/util/typerenderer", "jquery", "angularplasmid"], function (exports, _twig, _typerenderer, _jquery) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.filterCircular = filterCircular;
  exports.getFeatureTypes = getFeatureTypes;
  exports.getSvgString = getSvgString;
  exports.getSvg = getSvg;
  exports.setTypeRenderer = setTypeRenderer;

  var _twig2 = _interopRequireDefault(_twig);

  var _typerenderer2 = _interopRequireDefault(_typerenderer);

  var _jquery2 = _interopRequireDefault(_jquery);

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

  var templateOptions = {
    style: "\n        #p1 {border:1px solid #ccc}\n        #t1 {fill:#f0f0f0;stroke:#ccc}\n        .sminor {stroke:#ccc}\n        .smajor {stroke:#f00}\n        .sml { fill:#999;font-size:10px }\n        .smajorin { stroke:#999 }\n        .marker { fill:#fc0;stroke:#fc0 }\n        .boundary {stroke-dasharray:2,2;stroke-width:2px}\n        .mdlabel {font-size:12px}\n        .smlabel {font-size:8px}\n        .white {fill:#fff}\n        .red {fill:rgb(192,64,64)}\n        .purple {fill:rgb(192,64,192)}\n        .blue {fill:rgb(64,192,192)}\n        .green {fill:rgb(64,192,64)}\n        .gold {fill:rgb(192,128,64)}"
  };

  var template = function template(options) {
    options = Object.assign({}, templateOptions, options);
    return "\n        {% set p = parsed %}\n        {% set features = parsed.features %}\n        {% set interval = p.size / 25 %}\n        <plasmid plasmidWidth='600' plasmidHeight='600' id='p1' sequencelength='{{ p.size }}' width=\"600\" height=\"600\">\n            <style>\n                ".concat(options.style, "\n            </style>\n            <plasmidtrack  radius='170' width='50' id='t1'>\n                <trackscale class='sminor' interval='20'></trackscale>\n                <trackscale class='smajor' interval='{{ interval | round}}' showlabels='1' labelclass='sml'></trackscale>\n                <trackscale class='smajorin' interval='{{ interval | round }}' direction='in'></trackscale>\n                {% for feature in features %}\n                    {% if options.show[feature.type] %}\n                <trackmarker class='marker' start='{{ feature.start }}' end='{{ feature.end }}' class='boundary'>\n                    <markerlabel text=\"{{ feature.name }}\" style=\"font-size: 11px\"  showline='1' markerstyle='stroke:#000;fill:#f00;'></markerlabel>\n                </trackmarker>\n                    {% endif %}\n                {% endfor %}\n                <tracklabel text='{{ p.name }}' style='font-size:25px;font-weight:bold'></tracklabel>\n            </plasmidtrack>\n        </plasmid>");
  };

  function filterCircular(gb) {
    return gb.filter(function (seq) {
      return seq.parsedSequence && seq.parsedSequence.circular;
    });
  }

  function getFeatureTypes(parsedGb) {
    if (!Array.isArray(parsedGb)) {
      parsedGb = [parsedGb];
    }

    var s = new Set();
    parsedGb.forEach(function (d) {
      d.features.forEach(function (f) {
        s.add(f.type);
      });
    });
    return Array.from(s);
  }

  function getSvgString(_x, _x2) {
    return _getSvgString.apply(this, arguments);
  }

  function _getSvgString() {
    _getSvgString = _asyncToGenerator(regeneratorRuntime.mark(function _callee(parsedGb, options) {
      var svg;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // eslint-disable-next-line no-undef
              options = DataObject.resurrect(options);
              _context.next = 3;
              return getSvg(parsedGb, options);

            case 3:
              svg = _context.sent;
              return _context.abrupt("return", (0, _jquery2["default"])('<div>').append(svg).html());

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getSvgString.apply(this, arguments);
  }

  function getSvg(_x3, _x4) {
    return _getSvg.apply(this, arguments);
  }

  function _getSvg() {
    _getSvg = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(parsedGb, options) {
      var tmpl, render;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              tmpl = _twig2["default"].twig({
                data: template(templateOptions)
              });
              render = tmpl.renderAsync({
                parsed: parsedGb,
                options: options
              });
              render.render();
              return _context2.abrupt("return", compile(render.html));

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _getSvg.apply(this, arguments);
  }

  function compile(_x5) {
    return _compile.apply(this, arguments);
  }

  function _compile() {
    _compile = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(val) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", new Promise(function (resolve) {
                var $injector = self.angular.injector(['ng', 'angularplasmid']);
                $injector.invoke(function ($rootScope, $compile) {
                  var svg = $compile(String(val))($rootScope); // TODO: why is this setTimeout needed

                  setTimeout(function () {
                    return resolve(svg);
                  }, 0);
                });
              }));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _compile.apply(this, arguments);
  }

  function plasmidRenderer(_x6, _x7, _x8, _x9) {
    return _plasmidRenderer.apply(this, arguments);
  }

  function _plasmidRenderer() {
    _plasmidRenderer = _asyncToGenerator(regeneratorRuntime.mark(function _callee4($element, val, root, options) {
      var svg;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return getSvg(val, options);

            case 2:
              svg = _context4.sent;
              $element.html(svg);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _plasmidRenderer.apply(this, arguments);
  }

  function setTypeRenderer(name) {
    _typerenderer2["default"].addType(name, plasmidRenderer);
  }
});