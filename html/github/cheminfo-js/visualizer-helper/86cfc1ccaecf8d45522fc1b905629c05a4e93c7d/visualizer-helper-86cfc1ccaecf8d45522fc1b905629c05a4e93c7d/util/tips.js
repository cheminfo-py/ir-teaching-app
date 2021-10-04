"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/util/api', './yamlParser', 'src/util/ui', './getViewInfo'], function (API, yamlParser, UI, getViewInfo) {
  var baseUrl = require.s.contexts._.config.baseUrl;
  var tipsURL = baseUrl + '../../docs/tips/';
  var pagesURL = baseUrl + '../../docs/pages/';
  var minDelayBetweenTips = 4 * 3600 * 1000;

  function showTips(_x) {
    return _showTips.apply(this, arguments);
  }

  function _showTips() {
    _showTips = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(info) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (info) {
                _context2.next = 4;
                break;
              }

              _context2.next = 3;
              return getViewInfo();

            case 3:
              info = _context2.sent;

            case 4:
              if (info._id) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt("return");

            case 6:
              _context2.next = 8;
              return fetch("".concat(tipsURL + info._id, "/index.yml")).then( /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(response) {
                  var text;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return response.text();

                        case 2:
                          text = _context.sent;
                          processTipsToc(text, info);

                        case 4:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x2) {
                  return _ref.apply(this, arguments);
                };
              }())["catch"]();

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _showTips.apply(this, arguments);
  }

  function processTipsToc(yaml, info) {
    var toc = yamlParser.parse(yaml);
    if (!toc.tips) return;
    var userPrefs = JSON.parse(window.localStorage.getItem('tipsPreferences') || '{"lastTip":0, "views":{}}');
    if ((Date.now() - userPrefs.lastTip || 0) < minDelayBetweenTips) return;

    if (!userPrefs.views[info._id]) {
      userPrefs.views[info._id] = {
        lastIndex: -1
      };
    }

    var viewPrefs = userPrefs.views[info._id];
    var tips = toc.tips.map(function (a, index) {
      a.index = a.index === undefined ? index + 1 : a.index;
      return a;
    }).sort(function (a, b) {
      return a.index - b.index;
    }).filter(function (a) {
      return a.index > viewPrefs.lastIndex;
    }).filter(function (a) {
      return info.rev >= (a.minRev || 0);
    }).filter(function (a) {
      return info.rev <= (a.maxRev || Number.MAX_SAFE_INTEGER);
    });

    if (tips.length > 0) {
      viewPrefs.lastIndex = tips[0].index;
      userPrefs.lastTip = Date.now();
      window.localStorage.setItem('tipsPreferences', JSON.stringify(userPrefs));
      UI.dialog("\n            <iframe frameBorder=\"0\" width=\"100%\" height=\"100%\" allowfullscreen=\"true\"\n            src=\"".concat(tipsURL).concat(info._id, "/").concat(tips[0].name, "\">\n        "), {
        width: 800,
        height: 600,
        title: 'Did you know ?'
      });
    }
  }

  function addPageHelp() {
    return _addPageHelp.apply(this, arguments);
  }

  function _addPageHelp() {
    _addPageHelp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var options,
          _options$iconSize,
          iconSize,
          info,
          response,
          target,
          div,
          _args3 = arguments;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
              _options$iconSize = options.iconSize, iconSize = _options$iconSize === void 0 ? 'fa-3x' : _options$iconSize;

              if (!(options._id === undefined)) {
                _context3.next = 8;
                break;
              }

              _context3.next = 5;
              return getViewInfo();

            case 5:
              _context3.t0 = _context3.sent;
              _context3.next = 9;
              break;

            case 8:
              _context3.t0 = {
                _id: options._id
              };

            case 9:
              info = _context3.t0;

              if (info._id) {
                _context3.next = 12;
                break;
              }

              return _context3.abrupt("return");

            case 12:
              _context3.next = 14;
              return fetch("".concat(pagesURL + info._id, "/index.html"), {
                method: 'HEAD'
              });

            case 14:
              response = _context3.sent;

              if (!(response.status !== 200)) {
                _context3.next = 17;
                break;
              }

              return _context3.abrupt("return");

            case 17:
              target = document.getElementById('modules-grid');
              div = document.createElement('DIV');
              div.innerHTML = "\n      <i style=\"color: lightgrey; cursor: pointer;\" class=\"fa fa-question-circle ".concat(iconSize, "\"></i>\n      ");
              div.style.zIndex = 99;
              div.style.position = 'fixed';
              div.addEventListener('click', function () {
                UI.dialog("\n            <iframe frameBorder=\"0\" width=\"100%\" height=\"100%\" allowfullscreen=\"true\"\n            src=\"".concat(pagesURL + info._id, "\">\n        "), {
                  width: 1000,
                  height: 800,
                  title: 'Information about the page'
                }).css('overflow', 'hidden');
              });
              target.prepend(div);
              window.addEventListener('keypress', function (event) {
                if (event.altKey && event.shiftKey && event.ctrlKey && event.keyCode === 8) {
                  UI.dialog("\n                <iframe frameBorder=\"0\" width=\"100%\" height=\"100%\" allowfullscreen=\"true\"\n                src=\"".concat(pagesURL + info._id, "\">\n            "), {
                    width: 900,
                    height: 700,
                    title: 'Information about the page'
                  });
                }
              }, false);

            case 25:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _addPageHelp.apply(this, arguments);
  }

  return {
    showTips: showTips,
    addPageHelp: addPageHelp
  };
});