"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/util/ui', './getViewInfo'], function (UI, getViewInfo) {
  var baseUrl = require.s.contexts._.config.baseUrl;
  var pagesURL = "".concat(baseUrl, "../../docs/eln/uuid/");

  function addFullHelp() {
    return _addFullHelp.apply(this, arguments);
  }

  function _addFullHelp() {
    _addFullHelp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var options,
          _options$iconSize,
          iconSize,
          target,
          div,
          _args2 = arguments;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
              _options$iconSize = options.iconSize, iconSize = _options$iconSize === void 0 ? 'fa-3x' : _options$iconSize;
              target = document.getElementById('modules-grid');
              div = document.createElement('DIV');
              div.innerHTML = "\n      <i style=\"color: lightgrey; cursor: pointer;\" class=\"fa fa-question-circle ".concat(iconSize, "\"></i>\n      ");
              div.style.zIndex = 99;
              div.style.position = 'fixed';
              div.addEventListener('click', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        window.open('https://docs.c6h6.org', 'ELN documentation');

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })));
              target.prepend(div);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _addFullHelp.apply(this, arguments);
  }

  function addPageHelp() {
    return _addPageHelp.apply(this, arguments);
  }

  function _addPageHelp() {
    _addPageHelp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var options,
          _options$iconSize2,
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
              _options$iconSize2 = options.iconSize, iconSize = _options$iconSize2 === void 0 ? 'fa-3x' : _options$iconSize2;

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
              return fetch("".concat(pagesURL + info._id), {
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
                  width: 950,
                  height: 800,
                  title: 'Information about the page'
                }).css('overflow', 'hidden');
              });
              target.prepend(div);

            case 24:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _addPageHelp.apply(this, arguments);
  }

  return {
    addPageHelp: addPageHelp,
    addFullHelp: addFullHelp
  };
});