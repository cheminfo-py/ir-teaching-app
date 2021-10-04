"use strict";

define(["module", "src/util/api", "src/util/ui", "./libs/OCLUtils", "./libs/MolecularFormula"], function (module, _api, _ui, _OCLUtils, _MolecularFormula) {
  var _api2 = _interopRequireDefault(_api);

  var _ui2 = _interopRequireDefault(_ui);

  var _MolecularFormula2 = _interopRequireDefault(_MolecularFormula);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var MF = function () {
    function MF(sample) {
      _classCallCheck(this, MF);

      this.sample = sample; // if no mf we calculate from molfile

      if (!this.getMF()) {
        this.fromMolfile();

        if (!this.getMF()) {
          this.setMF('');
        }
      } else {
        var mf = this.getMF();

        if (mf) {
          try {
            var mfInfo = new _MolecularFormula2["default"].MF(mf).getInfo();
            this.setCanonizedMF(mfInfo.mf);
            this.previousEMMF = mfInfo.monoisotopicMass;
          } catch (e) {
            // eslint-disable-next-line no-console
            this.setCanonizedMF('');
            console.log('Could not parse MF: ', mf);
          }
        }
      }
    }

    _createClass(MF, [{
      key: "getIsotopicDistributionInstance",
      value: function getIsotopicDistributionInstance(options) {
        options = Object.assign({}, {
          ionizations: '+',
          fwhm: 0.01,
          maxLines: 5000,
          minY: 1e-8
        }, options);
        return new _MolecularFormula2["default"].IsotopicDistribution(this.getMF(), options);
      }
    }, {
      key: "setCanonizedMF",
      value: function setCanonizedMF(mf) {
        _api2["default"].createData('canonizedMF', mf);
      }
    }, {
      key: "getIsotopicDistribution",
      value: function getIsotopicDistribution(options) {
        var isotopicDistribution = this.getIsotopicDistributionInstance(options);
        return isotopicDistribution.getXY();
      }
    }, {
      key: "getMassParts",
      value: function getMassParts(options) {
        var isotopicDistribution = this.getIsotopicDistributionInstance(options);
        return isotopicDistribution.getParts();
      }
    }, {
      key: "fromMolfile",
      value: function fromMolfile() {
        var mfInfo = this._mfInfoFromMolfile();

        if (mfInfo && this.previousEMMolfile !== mfInfo.monoisotopicMass) {
          this.previousEMMolfile = mfInfo.monoisotopicMass;
          this.setMF(mfInfo.mf);
        } else {// why should we suppress the molecular formula if it changed ???
          // this.setMF('');
        }

        _api2["default"].createData('mfBGColor', 'white');
      }
    }, {
      key: "_mfInfoFromMolfile",
      value: function _mfInfoFromMolfile() {
        var molfile = this.getMolfile();

        if (molfile) {
          var molecule = _OCLUtils.OCL.Molecule.fromMolfile(molfile);

          var mf = _OCLUtils.OCLUtils.getMF(molecule).parts.join(' . ');

          try {
            var mfInfo = new _MolecularFormula2["default"].MF(mf).getInfo();
            mfInfo.mf = mf;
            return mfInfo;
          } catch (e) {
            if (mf !== '') {
              _ui2["default"].showNotification("Could not calculate molecular formula: ".concat(e));
            }
          }
        }

        return null;
      }
    }, {
      key: "getMF",
      value: function getMF() {
        return String(this.sample.getChildSync(['$content', 'general', 'mf']) || '');
      }
    }, {
      key: "getMolfile",
      value: function getMolfile() {
        return String(this.sample.getChildSync(['$content', 'general', 'molfile']));
      }
    }, {
      key: "setMF",
      value: function setMF(mf) {
        this.sample.setChildSync(['$content', 'general', 'mf'], mf);
      }
    }, {
      key: "setMF",
      value: function setMF(mf) {
        this.sample.setChildSync(['$content', 'general', 'mf'], mf);
      }
    }, {
      key: "setMW",
      value: function setMW(mw) {
        this.sample.setChildSync(['$content', 'general', 'mw'], mw);
      }
    }, {
      key: "setEM",
      value: function setEM(em) {
        this.sample.setChildSync(['$content', 'general', 'em'], em);
      }
    }, {
      key: "fromMF",
      value: function fromMF() {
        try {
          if (!this.getMF()) {
            this.previousEMMF = 0;
            this.setMW(0);
            this.setEM(0);
            this.setCanonizedMF('');
            return;
          }

          var mfInfo = new _MolecularFormula2["default"].MF(this.getMF()).getInfo();

          if (this.previousEMMF !== mfInfo.monoisotopicMass) {
            this.previousEMMF = mfInfo.monoisotopicMass;
            this.setCanonizedMF(mfInfo.mf);
            this.setMW(mfInfo.mass);
            this.setEM(mfInfo.monoisotopicMass);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('MF error', e); // disable

          this.setMW(0);
          this.setEM(0);
          this.setCanonizedMF('');
        }
      }
    }, {
      key: "_mfColor",
      value: function _mfColor() {
        var existingMF = this.getMF();
        var molfile = this.getMolfile();

        if (molfile) {
          var molecule = _OCLUtils.OCL.Molecule.fromMolfile(molfile);

          var mf = molecule.getMolecularFormula().formula;
          var existingMW = existingMF ? new _MolecularFormula2["default"].MF(existingMF).getInfo().mw : 0;
          var newMW = mf ? new _MolecularFormula2["default"].MF(mf).getInfo().mw : 0;

          if (newMW !== existingMW) {
            _api2["default"].createData('mfBGColor', 'pink');
          } else {
            _api2["default"].createData('mfBGColor', 'white');
          }
        } else {
          _api2["default"].createData('mfBGColor', 'white');
        }
      }
    }]);

    return MF;
  }();

  module.exports = MF;
});