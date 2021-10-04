"use strict";

define(["module", "openchemlib/openchemlib-core", "src/util/ui", "lodash"], function (module, _openchemlibCore, _ui, _lodash) {
  var _openchemlibCore2 = _interopRequireDefault(_openchemlibCore);

  var _ui2 = _interopRequireDefault(_ui);

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function F() {};

        return {
          s: F,
          n: function n() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function e(_e) {
            throw _e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function s() {
        it = o[Symbol.iterator]();
      },
      n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function e(_e2) {
        didErr = true;
        err = _e2;
      },
      f: function f() {
        try {
          if (!normalCompletion && it["return"] != null) it["return"]();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
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

  module.exports = function (roc, prefix) {
    function getMoleculeWithSalts(options) {
      var saltCode = options.saltCode,
          idCode = options.idCode,
          nbSalts = options.nbSalts,
          value = options.value;
      var oclid = idCode || value;

      var mol = _openchemlibCore2["default"].Molecule.fromIDCode(oclid);

      if (saltCode !== 'NX' && oclid !== 'd@') {
        var salt = salts[saltCode];

        if (salt) {
          var oclSalt = _openchemlibCore2["default"].Molecule.fromIDCode(String(salt.idCode));

          for (var i = 0; i < nbSalts; i++) {
            mol.addMolecule(oclSalt);
          }

          mol.inventCoordinates();
        } else {
          throw new Error("unknown salt ".concat(salt));
        }
      }

      return mol;
    }

    function getOclDistinguishOr(mol) {
      var idCode = mol.getCanonizedIDCode(_openchemlibCore2["default"].Molecule.CANONIZER_DISTINGUISH_RACEMIC_OR_GROUPS);

      var _mol$getIDCodeAndCoor = mol.getIDCodeAndCoordinates(),
          coordinates = _mol$getIDCodeAndCoor.coordinates;

      return {
        idCode: idCode,
        coordinates: coordinates
      };
    }

    function updateInternalDocumentWithNewStructure(_x, _x2) {
      return _updateInternalDocumentWithNewStructure.apply(this, arguments);
    }

    function _updateInternalDocumentWithNewStructure() {
      _updateInternalDocumentWithNewStructure = _asyncToGenerator(regeneratorRuntime.mark(function _callee(doc, newOcl) {
        var newOclid, newOclCoordinates, general, freeBaseMolecule, freeBaseOcl, baseMf;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                newOclid = String(newOcl.idCode || newOcl.value);
                newOclCoordinates = newOcl.coordinates && String(newOcl.coordinates);
                general = doc.$content.general;
                freeBaseMolecule = _openchemlibCore2["default"].Molecule.fromIDCode(newOclid);
                freeBaseOcl = freeBaseMolecule.getIDCodeAndCoordinates();
                baseMf = freeBaseMolecule.getMolecularFormula();
                general.mf = baseMf.formula;
                general.mw = baseMf.relativeWeight;
                general.molfile = freeBaseMolecule.toMolfileV3();
                general.ocl = {
                  value: newOclid,
                  coordinates: newOclCoordinates || freeBaseOcl.coordinates,
                  index: freeBaseMolecule.getIndex()
                };

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _updateInternalDocumentWithNewStructure.apply(this, arguments);
    }

    function updateInternalStructureByUpdate(_x3, _x4) {
      return _updateInternalStructureByUpdate.apply(this, arguments);
    }

    function _updateInternalStructureByUpdate() {
      _updateInternalStructureByUpdate = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(docId, newOcl) {
        var doc;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return roc.document(docId);

              case 2:
                doc = _context2.sent;
                updateInternalDocumentWithNewStructure(doc, newOcl);
                _context2.next = 6;
                return roc.update(doc);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _updateInternalStructureByUpdate.apply(this, arguments);
    }

    function updateInternalStructure(_x5, _x6) {
      return _updateInternalStructure.apply(this, arguments);
    }

    function _updateInternalStructure() {
      _updateInternalStructure = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(oldOclid, newOcl) {
        var newOclid, oldDups, newDups, confirmed, _iterator2, _step2, dup;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                newOclid = newOcl.idCode || newOcl.value;

                if (!(String(newOclid) === String(oldOclid))) {
                  _context3.next = 3;
                  break;
                }

                throw new Error('new and old structures are identical');

              case 3:
                _context3.next = 5;
                return getDups(oldOclid);

              case 5:
                oldDups = _context3.sent;
                _context3.next = 8;
                return getDups(newOclid);

              case 8:
                newDups = _context3.sent;

                if (!(newDups.length > 0)) {
                  _context3.next = 14;
                  break;
                }

                _context3.next = 12;
                return _ui2["default"].confirm("\n        The same ACI number cannot be reused because the new structure already\n        exists as ".concat(newDups[0].value[0], ".\n        Therefore it is not possible to update this structure.<br>\n        If you really need to do this, please contact us at support@zakodium.com\n      "));

              case 12:
                _context3.next = 40;
                break;

              case 14:
                if (!(oldDups.length > 0)) {
                  _context3.next = 39;
                  break;
                }

                _context3.next = 17;
                return _ui2["default"].confirm("\n                The same ACI number can be reused.<br/><br/>\n                The operation will update ".concat(oldDups.length, " entries.<br/>\n                Do you want to proceed?\n            "));

              case 17:
                confirmed = _context3.sent;

                if (confirmed) {
                  _context3.next = 20;
                  break;
                }

                return _context3.abrupt("return");

              case 20:
                _iterator2 = _createForOfIteratorHelper(oldDups);
                _context3.prev = 21;

                _iterator2.s();

              case 23:
                if ((_step2 = _iterator2.n()).done) {
                  _context3.next = 29;
                  break;
                }

                dup = _step2.value;
                _context3.next = 27;
                return updateInternalStructureByUpdate(dup.id, newOcl);

              case 27:
                _context3.next = 23;
                break;

              case 29:
                _context3.next = 34;
                break;

              case 31:
                _context3.prev = 31;
                _context3.t0 = _context3["catch"](21);

                _iterator2.e(_context3.t0);

              case 34:
                _context3.prev = 34;

                _iterator2.f();

                return _context3.finish(34);

              case 37:
                _context3.next = 40;
                break;

              case 39:
                throw new Error('oclid cannot be updated because it does not exist');

              case 40:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[21, 31, 34, 37]]);
      }));
      return _updateInternalStructure.apply(this, arguments);
    }

    function getNextID() {
      return _getNextID.apply(this, arguments);
    }

    function _getNextID() {
      _getNextID = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var v, id, current, nextID, nextIDStr;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return roc.view('sampleId', {
                  reduce: true
                });

              case 2:
                v = _context4.sent;

                if (!(!v.length || !v[0].value || !v[0].value[prefix])) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", "".concat(prefix, "-1"));

              case 5:
                id = v[0].value[prefix];
                current = Number(id);
                nextID = current + 1;
                nextIDStr = String(nextID);
                return _context4.abrupt("return", "".concat(prefix, "-").concat(nextIDStr));

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));
      return _getNextID.apply(this, arguments);
    }

    function getDups(_x7) {
      return _getDups.apply(this, arguments);
    }

    function _getDups() {
      _getDups = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(oclid) {
        var oclidStr, dups;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                oclidStr = String(oclid);
                _context5.next = 3;
                return roc.query('idWithOCLID', {
                  startkey: [oclidStr, "".concat(prefix, "-")],
                  endkey: [oclidStr, "".concat(prefix, "-\uFFF0")]
                });

              case 3:
                dups = _context5.sent;

                if (isUnique(dups)) {
                  _context5.next = 6;
                  break;
                }

                throw new Error("Found ID conflict with ".concat(oclid));

              case 6:
                dups.forEach(function (d) {
                  return d.key.shift();
                }); // unique by oclid + $id

                return _context5.abrupt("return", _lodash2["default"].uniqBy(dups, function (dup) {
                  return dup.key[0] + dup.value.join();
                }));

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));
      return _getDups.apply(this, arguments);
    }

    function getInternalIDInfo(_x8, _x9) {
      return _getInternalIDInfo.apply(this, arguments);
    }

    function _getInternalIDInfo() {
      _getInternalIDInfo = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(oclid, salt) {
        var info, dups, _code, code, unique, nextBatchNumber, newId;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                salt = String(salt);

                if (salts[salt]) {
                  _context6.next = 3;
                  break;
                }

                throw new Error("unknown salt ".concat(salt));

              case 3:
                info = {};
                _context6.next = 6;
                return getDups(oclid);

              case 6:
                dups = _context6.sent;
                info.codeCount = dups.length;

                if (!(dups.length === 0)) {
                  _context6.next = 15;
                  break;
                }

                _context6.next = 11;
                return getNextID();

              case 11:
                _code = _context6.sent;
                info.nextId = [_code, salt, 1];
                info.saltCount = 0;
                return _context6.abrupt("return", info);

              case 15:
                code = dups[0].value[0];
                unique = isUnique(dups);

                if (unique) {
                  _context6.next = 19;
                  break;
                }

                throw new Error('conflict with this structure');

              case 19:
                // only keep structures with same salt
                dups = dups.filter(function (dup) {
                  return dup.value[1] === String(salt);
                });
                info.saltCount = dups.length;

                if (!(dups.length === 0)) {
                  _context6.next = 24;
                  break;
                }

                info.nextId = [code, salt, 1];
                return _context6.abrupt("return", info);

              case 24:
                nextBatchNumber = getNextBatchNumber(dups);
                newId = dups[0].value.slice();
                newId[newId.length - 1] = nextBatchNumber;
                info.nextId = newId;
                return _context6.abrupt("return", info);

              case 29:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));
      return _getInternalIDInfo.apply(this, arguments);
    }

    function getNextSampleWithSaltID(_x10, _x11) {
      return _getNextSampleWithSaltID.apply(this, arguments);
    }

    function _getNextSampleWithSaltID() {
      _getNextSampleWithSaltID = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(oclid, salt) {
        var info;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return getInternalIDInfo(oclid, salt);

              case 2:
                info = _context7.sent;
                return _context7.abrupt("return", info.nextId);

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));
      return _getNextSampleWithSaltID.apply(this, arguments);
    }

    function getNextSampleID(_x12) {
      return _getNextSampleID.apply(this, arguments);
    }

    function _getNextSampleID() {
      _getNextSampleID = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(oclid) {
        var dups, code, nextBatchNumber, newId;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return getDups(oclid);

              case 2:
                dups = _context8.sent;

                if (!(dups.length === 0)) {
                  _context8.next = 8;
                  break;
                }

                _context8.next = 6;
                return getNextID();

              case 6:
                code = _context8.sent;
                return _context8.abrupt("return", [code, 1]);

              case 8:
                nextBatchNumber = getNextBatchNumber(dups);
                newId = dups[0].value.slice();
                newId[newId.length - 1] = nextBatchNumber;
                return _context8.abrupt("return", newId);

              case 12:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));
      return _getNextSampleID.apply(this, arguments);
    }

    function isUnique(dups) {
      // We check the unicity
      var keys = dups.map(function (v) {
        return v.key;
      });
      if (keys.length === 0) return true;
      var id = keys[0][2];

      var _iterator = _createForOfIteratorHelper(keys),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          if (key[2] !== id) return false;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return true;
    }

    function getNextBatchNumber(values) {
      return Math.max.apply(null, values.map(function (v) {
        return v.value[v.value.length - 1];
      })) + 1;
    }

    function getSaltMW(salt, nbSalts) {
      if (!salts[salt]) throw new Error("Unknow salt ".concat(salt));
      return salts[salt].mw * nbSalts;
    }

    return {
      getSaltMW: getSaltMW,
      updateInternalStructure: updateInternalStructure,
      getNextSampleID: getNextSampleID,
      getNextSampleWithSaltID: getNextSampleWithSaltID,
      getInternalIDInfo: getInternalIDInfo,
      salts: salts,
      getMoleculeWithSalts: getMoleculeWithSalts,
      getOclDistinguishOr: getOclDistinguishOr
    };
  };

  var salts = {
    NX: {
      name: 'Free base',
      mf: '',
      mw: 0
    },
    TT: {
      name: 'Tritiated compound',
      mf: '',
      mw: 0
    },
    XX: {
      name: 'Unknown salt',
      mf: '',
      mw: 0
    },
    AA: {
      idCode: 'fHdP@@',
      name: 'Hydrochloride',
      mf: 'HCl',
      mw: 36.46094
    },
    AB: {
      idCode: 'fHv`d@',
      name: 'Sodium',
      mf: 'Na+',
      mw: 22.99
    },
    AC: {
      idCode: 'fHfH@@',
      mf: 'HBr',
      mw: 80.91194,
      name: 'Hydrobromide'
    },
    AD: {
      idCode: 'fHeX@@',
      mf: 'HI',
      mw: 127.90794000000001,
      name: 'Hydroiodide'
    },
    AE: {
      idCode: 'daxB@@QnR[VZY`cD',
      mf: 'C4H4O4',
      mw: 116.07176,
      name: 'Maleate'
    },
    AG: {
      idCode: 'gJQhHl@bOV`@',
      mf: 'CH4O3S',
      mw: 96.10576,
      name: 'Mesylate'
    },
    AH: {
      idCode: 'gGPP@cTfyi`@',
      mf: 'C2H2O4',
      mw: 90.03388,
      name: 'Oxalate'
    },
    AI: {
      idCode: 'gNplJqHJPtadTaeTp@',
      mf: 'C2HO2F3',
      mw: 114.02194,
      name: 'Trifluoroacetate'
    },
    AJ: {
      idCode: 'gJPXHlPDQzt@@',
      mf: 'H2O4S',
      mw: 98.07788000000001,
      name: 'Sulfate'
    },
    AK: {
      idCode: 'gC``@dfZ@@',
      mf: 'C2H4O2',
      mw: 60.05176,
      name: 'Acetate'
    },
    AL: {
      idCode: 'fHvPd@',
      mf: 'K',
      mw: 39.098,
      name: 'Potassium'
    },
    AM: {
      idCode: 'dedF@@PfFTf{nZjf@@',
      mf: 'C4H6O6',
      mw: 150.08564,
      name: 'Tartrate'
    },
    AN: {
      idCode: 'dmtL`HS@BLddlRVFUh@H@@',
      mf: 'C7H8O3S',
      mw: 172.20352,
      name: 'p-Toluenesulfonate'
    },
    AO: {
      idCode: 'dkLN@@PiWSR[kVYjjfX@@',
      mf: 'C6H8O7',
      mw: 192.12252,
      name: 'Citrate'
    },
    AP: {
      idCode: 'dmvL`BaL@HrRRjIJUVjjh@@',
      mf: 'C6H13NO3S',
      mw: 179.23922000000002,
      name: 'n-Cyclohexylsulfamate'
    },
    AQ: {
      idCode: 'gGPXHlPDYIHUj@@',
      mf: 'CH4O4S',
      mw: 112.10476,
      name: 'Methylsulfate'
    },
    AR: {
      idCode: 'fHv@d@',
      mf: 'Li',
      mw: 6.941,
      name: 'Lithium'
    },
    AS: {
      idCode: 'dazL@LAnRVmjj`@',
      mf: 'C4H11NO3',
      mw: 121.13534,
      name: 'Tris(hydroxymethyl)-methylammonium'
    },
    AT: {
      idCode: 'gCi`hEiNyIf`@',
      mf: 'HNO3',
      mw: 63.011939999999996,
      name: 'Nitrate'
    },
    AU: {
      idCode: 'gNpP@jtfvZf@@',
      mf: 'C3H4O4',
      mw: 104.06076,
      name: 'Malonate'
    },
    AV: {
      idCode: 'fJ@@',
      mf: 'H3N',
      mw: 17.03082,
      name: 'Ammonium'
    },
    AW: {
      idCode: 'gNx@@eRmUP@',
      mf: 'C6H15N',
      mw: 101.19210000000001,
      name: 'Triethylammonium'
    },
    AX: {
      idCode: 'fdy@q@HHqxLPAE`cIIKEDhmCIKQgKP@@Pl@@@',
      mf: 'C10H8O6S2',
      mw: 288.29952000000003,
      name: 'Naphthalene-1,5-disulfonic acid'
    },
    AY: {
      idCode: 'dk^@@@RfYU\\]Tzjjjj@@',
      mf: 'C12H23N',
      mw: 181.32162,
      name: 'Dicyclohexyl-ammonium'
    },
    DB: {
      idCode: 'gJPXHlQDQzl@@',
      mf: 'HO4Cl',
      mw: 100.45694,
      name: 'Perchlorate'
    },
    WA: {
      code: 'WA',
      idCode: 'fI@D',
      mf: 'H2O',
      mw: 18.015286,
      name: 'Water'
    },
    BB: {
      code: 'BB',
      idCode: 'daxB@@QnR[VZi`@',
      mw: 118.088208,
      mf: 'C4H6O4',
      name: 'Succinate'
    },
    BD: {
      code: 'BD',
      idCode: 'eMDARV@',
      mw: 46.025427,
      mf: 'CH2O2',
      name: 'Formate'
    },
    FD: {
      code: 'FD',
      idCode: 'daxLHHS@BJdFdNdLddlbuT@@',
      mw: 150.076888,
      mf: 'CHF3O3S',
      name: 'Triflate'
    }
  };
});