"use strict";

define(["exports", "../libs/jcampconverter", "../libs/parseXY"], function (exports, _jcampconverter, _parseXY) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getChartFromIR = getChartFromIR;

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

  function getChartFromIR(_x) {
    return _getChartFromIR.apply(this, arguments);
  }

  function _getChartFromIR() {
    _getChartFromIR = _asyncToGenerator(regeneratorRuntime.mark(function _callee(experiment) {
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
                _context.next = 14;
                break;
              }

              name = options.name || String(experiment.jcamp.filename).match(/([^/]+)\..+/)[1];

              if (experiment.jcamp.data) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", undefined);

            case 5:
              _context.next = 7;
              return experiment.getChild(['jcamp', 'data']);

            case 7:
              data = _context.sent.get();
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

            case 14:
              if (!experiment.text) {
                _context.next = 24;
                break;
              }

              _name = options.name || String(experiment.text.filename).match(/([^/]+)\..+/)[1];
              _context.next = 18;
              return experiment.getChild(['text', 'data']);

            case 18:
              _data = _context.sent.get();
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

            case 24:
              throw new Error('the file should be a jcamp or text');

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getChartFromIR.apply(this, arguments);
  }
});