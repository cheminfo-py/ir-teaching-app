"use strict";

define(["exports", "src/util/api", "file-saver"], function (exports, _api, _fileSaver) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.twigToDoc = twigToDoc;

  var _api2 = _interopRequireDefault(_api);

  var _fileSaver2 = _interopRequireDefault(_fileSaver);

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

  function twigToDoc(_x) {
    return _twigToDoc.apply(this, arguments);
  }

  function _twigToDoc() {
    _twigToDoc = _asyncToGenerator(regeneratorRuntime.mark(function _callee(moduleID) {
      var options,
          _options$filename,
          filename,
          module,
          div,
          canvases,
          domCopy,
          canvasesCopy,
          i,
          png,
          svgs,
          svgsCopy,
          promises,
          _loop,
          _i,
          blob,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              _options$filename = options.filename, filename = _options$filename === void 0 ? 'report.html' : _options$filename;
              module = _api2["default"].getModule(moduleID);
              div = module.domContent[0];
              canvases = div.querySelectorAll('canvas');
              domCopy = div.firstChild.cloneNode(true);
              canvasesCopy = domCopy.querySelectorAll('canvas');

              for (i = 0; i < canvases.length; i++) {
                png = canvases[i].toDataURL('image/png');
                canvasesCopy[i].parentElement.innerHTML = '<img src="' + png + '" />';
              }

              svgs = div.querySelectorAll('svg');
              svgsCopy = domCopy.querySelectorAll('svg');
              promises = [];

              _loop = function _loop(_i) {
                var svgDOM = svgs[_i];
                var svgDOMCopy = svgsCopy[_i];
                var width = svgDOM.clientWidth;
                var height = svgDOM.clientHeight;
                var svgString = svgDOM.parentElement.innerHTML;
                var canvas = document.createElement('canvas');
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                var image = new Image();
                var svg = new Blob([svgString], {
                  type: 'image/svg+xml;charset=utf-8'
                });
                var url = URL.createObjectURL(svg);
                var promise = new Promise(function (resolve, reject) {
                  image.onload = function () {
                    ctx.drawImage(image, 0, 0);
                    var png = canvas.toDataURL('image/png');
                    svgDOMCopy.parentElement.innerHTML = '<img src="' + png + '" />';
                    URL.revokeObjectURL(url);
                    resolve();
                  };
                });
                promises.push(promise);
                image.src = url;
              };

              for (_i = 0; _i < svgs.length; _i++) {
                _loop(_i);
              }

              _context.next = 15;
              return Promise.all(promises);

            case 15:
              blob = new Blob(['<html>' + domCopy.innerHTML + '</html>'], {
                type: 'text/html'
              });
              (0, _fileSaver2["default"])(blob, filename);

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _twigToDoc.apply(this, arguments);
  }
});