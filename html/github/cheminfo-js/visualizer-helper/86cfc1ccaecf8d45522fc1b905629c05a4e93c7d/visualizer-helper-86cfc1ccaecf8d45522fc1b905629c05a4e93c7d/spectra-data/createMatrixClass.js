"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/util/api'], function (API) {
  return /*#__PURE__*/function () {
    var _createMatrixClass = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(classURL, spectraDataSet) {
      var options,
          Papa,
          superagent,
          classFile,
          meta,
          metaIndex,
          withOutClass,
          dataClass,
          i,
          vector,
          filename,
          index,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
              options = Object.assign({}, {
                delimiter: ',',
                header: true,
                debug: false
              }, options);
              _context.next = 4;
              return API.require('components/papa-parse/papaparse.min');

            case 4:
              Papa = _context.sent;
              _context.next = 7;
              return API.require('superagent');

            case 7:
              superagent = _context.sent;
              _context.next = 10;
              return superagent.get(classURL).withCredentials().responseType('text');

            case 10:
              classFile = _context.sent;
              if (options.debug) console.log('classFile', classFile); // eslint-disable-line no-console

              meta = Papa.parse(classFile.text, {
                delimiter: options.delimiter,
                header: options.header
              }).data;
              metaIndex = {};
              meta.forEach(function (a) {
                metaIndex[a.filename] = a;
              });
              withOutClass = [];
              dataClass = new Array(spectraDataSet.length);
              i = dataClass.length;

              while (i--) {
                dataClass[i] = new Array(2).fill(-1);
                vector = dataClass[i];
                filename = spectraDataSet[i].sd.filename;
                index = metaIndex[filename];

                if (typeof index === 'undefined') {
                  withOutClass.push(filename);
                } else {
                  vector[index["class"]] = 1;
                }
              }

              return _context.abrupt("return", {
                dataClass: dataClass,
                withOutClass: withOutClass
              });

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function createMatrixClass(_x, _x2) {
      return _createMatrixClass.apply(this, arguments);
    }

    return createMatrixClass;
  }();
});