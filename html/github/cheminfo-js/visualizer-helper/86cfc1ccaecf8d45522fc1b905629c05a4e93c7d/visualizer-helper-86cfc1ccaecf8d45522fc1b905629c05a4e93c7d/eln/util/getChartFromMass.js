"use strict";

define(["exports", "../libs/jcampconverter", "../libs/parseXY"], function (exports, _jcampconverter, _parseXY) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getChartFromMass = getChartFromMass;

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

  function getChartFromMass(_x) {
    return _getChartFromMass.apply(this, arguments);
  }

  function _getChartFromMass() {
    _getChartFromMass = _asyncToGenerator(regeneratorRuntime.mark(function _callee(experiment) {
      var options,
          name,
          data,
          jcamp,
          result,
          points,
          _name,
          _data,
          text,
          _points,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};

              if (!experiment.jcamp) {
                _context.next = 19;
                break;
              }

              name = options.name || String(experiment.jcamp.filename).match(/([^/]+)\..+/)[1];

              if (!(!experiment.jcamp.data && !experiment.jcamp.content)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", undefined);

            case 5:
              if (!experiment.jcamp.content) {
                _context.next = 9;
                break;
              }

              _context.t0 = experiment.jcamp.content;
              _context.next = 12;
              break;

            case 9:
              _context.next = 11;
              return experiment.getChild(['jcamp', 'data']);

            case 11:
              _context.t0 = _context.sent.get();

            case 12:
              data = _context.t0;
              jcamp = String(data);
              result = (0, _jcampconverter.convert)(jcamp).flatten[0];
              points = result.spectra[0].data;
              return _context.abrupt("return", {
                data: [{
                  label: name,
                  x: points.x,
                  y: points.y
                }]
              });

            case 19:
              if (!experiment.text) {
                _context.next = 34;
                break;
              }

              _name = options.name || String(experiment.text.filename).match(/([^/]+)\..+/)[1];

              if (!experiment.text.content) {
                _context.next = 25;
                break;
              }

              _context.t1 = experiment.text.content;
              _context.next = 28;
              break;

            case 25:
              _context.next = 27;
              return experiment.getChild(['text', 'data']);

            case 27:
              _context.t1 = _context.sent.get();

            case 28:
              _data = _context.t1;
              text = String(_data);
              _points = (0, _parseXY.parseXY)(String(text), {
                arrayType: 'xxyy',
                uniqueX: true
              });
              return _context.abrupt("return", {
                data: [{
                  label: _name,
                  x: _points[0],
                  y: _points[1]
                }]
              });

            case 34:
              throw new Error('the file should be a jcamp or text');

            case 35:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getChartFromMass.apply(this, arguments);
  }
});