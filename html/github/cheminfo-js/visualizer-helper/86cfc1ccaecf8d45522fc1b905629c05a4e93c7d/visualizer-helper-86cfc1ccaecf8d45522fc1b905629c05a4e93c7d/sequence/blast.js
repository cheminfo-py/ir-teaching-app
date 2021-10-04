"use strict";

define(["module", "superagent"], function (module, _superagent) {
  var _superagent2 = _interopRequireDefault(_superagent);

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

  module.exports = function (url) {
    function makeblastdb(_x) {
      return _makeblastdb.apply(this, arguments);
    }

    function _makeblastdb() {
      _makeblastdb = _asyncToGenerator(regeneratorRuntime.mark(function _callee(sequences) {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _superagent2["default"].post("".concat(url, "/makeblastdb")).send(sequences);

              case 2:
                res = _context.sent;
                return _context.abrupt("return", res.body);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _makeblastdb.apply(this, arguments);
    }

    function blastn(_x2) {
      return _blastn.apply(this, arguments);
    }

    function _blastn() {
      _blastn = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(options) {
        var res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _superagent2["default"].post("".concat(url, "/blastn")).send(options);

              case 2:
                res = _context2.sent;
                return _context2.abrupt("return", res.body);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _blastn.apply(this, arguments);
    }

    function createSequencesDatabase(_x3) {
      return _createSequencesDatabase.apply(this, arguments);
    }

    function _createSequencesDatabase() {
      _createSequencesDatabase = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(roc) {
        var seqs, sequences, md5s, toSend, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return roc.query('dnaSequences');

              case 2:
                seqs = _context3.sent;
                sequences = {};
                seqs.forEach(function (s) {
                  var val = s.value;
                  val.forEach(function (v) {
                    v.seq.forEach(function (seq) {
                      if (!sequences[seq.md5]) {
                        sequences[seq.md5] = [seq];
                      } else {
                        sequences[seq.md5].push(seq);
                      }

                      seq.ref = v.ref;
                      seq.document = s.document;
                      seq.uuid = s.id;
                    });
                  });
                });
                md5s = Object.keys(sequences);
                toSend = md5s.map(function (md5) {
                  return {
                    id: md5,
                    seq: sequences[md5][0].seq
                  };
                });
                _context3.next = 9;
                return _superagent2["default"].post("".concat(url, "/makeblastdb")).send({
                  seq: toSend
                });

              case 9:
                res = _context3.sent;
                return _context3.abrupt("return", {
                  sequences: sequences,
                  database: res.body.database
                });

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _createSequencesDatabase.apply(this, arguments);
    }

    function createFeaturesDatabase(_x4) {
      return _createFeaturesDatabase.apply(this, arguments);
    }

    function _createFeaturesDatabase() {
      _createFeaturesDatabase = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(roc) {
        var dnaFeatures, features, md5s, seq, res;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return roc.query('dnaFeatures');

              case 2:
                dnaFeatures = _context4.sent;
                features = {};
                dnaFeatures.forEach(function (q) {
                  // one per couchdb document
                  var val = q.value; // one per attachment reference

                  val.forEach(function (v) {
                    v.features.forEach(function (f) {
                      // one per sequence in the attachments
                      if (!features[f.md5]) {
                        features[f.md5] = [f];
                      } else {
                        features[f.md5].push(f);
                      }

                      f.ref = v.ref;
                      f.document = q.document;
                      f.uuid = q.id;
                    });
                  });
                });
                md5s = Object.keys(features);
                seq = md5s.map(function (md5) {
                  return {
                    id: md5,
                    seq: features[md5][0].seq
                  };
                });
                _context4.next = 9;
                return _superagent2["default"].post("".concat(url, "/makeblastdb")).send({
                  seq: seq
                });

              case 9:
                res = _context4.sent;
                return _context4.abrupt("return", {
                  features: features,
                  database: res.body.database
                });

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));
      return _createFeaturesDatabase.apply(this, arguments);
    }

    return {
      createFeaturesDatabase: createFeaturesDatabase,
      createSequencesDatabase: createSequencesDatabase,
      makeblastdb: makeblastdb,
      blastn: blastn
    };
  }; // const url = 'https://www.cheminfo.org/blast-webservice';

});