"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/util/ui'], function (UI) {
  function privacy(_x) {
    return _privacy.apply(this, arguments);
  }

  function _privacy() {
    _privacy = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(cookieName) {
      var options,
          _options$message,
          message,
          _options$agree,
          agree,
          _options$notAgree,
          notAgree,
          _options$dialogOption,
          dialogOptions,
          prefs,
          result,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              _options$message = options.message, message = _options$message === void 0 ? "\n        Please note that in order to use this view data WILL BE SUBMITTED to our servers !\n    " : _options$message, _options$agree = options.agree, agree = _options$agree === void 0 ? 'I agree' : _options$agree, _options$notAgree = options.notAgree, notAgree = _options$notAgree === void 0 ? 'I don\'t agree' : _options$notAgree, _options$dialogOption = options.dialogOptions, dialogOptions = _options$dialogOption === void 0 ? {
                width: 800,
                title: 'Privacy information'
              } : _options$dialogOption;
              prefs = JSON.parse(localStorage.getItem(cookieName) || '{}');

              if (!(!prefs.validation || !prefs.validation.isValidated)) {
                _context.next = 10;
                break;
              }

              _context.next = 6;
              return UI.confirm(message, agree, notAgree, dialogOptions);

            case 6:
              result = _context.sent;

              if (!result) {
                document.body.innerHTML = '';
              }

              prefs.validation = {
                isValidated: result,
                date: new Date().getTime()
              };
              localStorage.setItem(cookieName, JSON.stringify(prefs));

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _privacy.apply(this, arguments);
  }

  return privacy;
});