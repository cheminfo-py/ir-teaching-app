"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var pkas = [{
  ha: 'HIO3',
  a: 'IO3-',
  pka: 0.8,
  specie: {
    label: 'IO3-',
    number: 1,
    pka: 0.8
  }
}, {
  ha: 'H3PO4',
  a: 'H2PO4-',
  pka: 2.16,
  specie: {
    label: 'PO4---',
    number: 3,
    pka: 21.69
  }
}, {
  ha: 'H2PO4-',
  a: 'HPO4--',
  pka: 7.21,
  specie: {
    label: 'PO4---',
    number: 2,
    pka: 19.53
  }
}, {
  ha: 'HPO4--',
  a: 'PO4---',
  pka: 12.32,
  specie: {
    label: 'PO4---',
    number: 1,
    pka: 12.32
  }
}, {
  ha: 'HF',
  a: 'F-',
  pka: 3.2,
  specie: {
    label: 'F-',
    number: 1,
    pka: 3.2
  }
}, {
  ha: 'HNO2',
  a: 'NO2-',
  pka: 3.25,
  specie: {
    label: 'NO2-',
    number: 1,
    pka: 3.25
  }
}, {
  ha: 'HOCN',
  a: 'OCN-',
  pka: 3.48,
  specie: {
    label: 'OCN-',
    number: 1,
    pka: 3.48
  }
}, {
  ha: 'H2CO3',
  a: 'HCO3-',
  pka: 6.35,
  specie: {
    label: 'CO3--',
    number: 2,
    pka: 16.68
  }
}, {
  ha: 'HCO3-',
  a: 'CO3--',
  pka: 10.33,
  specie: {
    label: 'CO3--',
    number: 1,
    pka: 10.33
  }
}, {
  ha: 'H2S',
  a: 'HS-',
  pka: 7.05,
  specie: {
    label: 'S--',
    number: 2,
    pka: 19.14
  }
}, {
  ha: 'HS-',
  a: 'S--',
  pka: 12.09,
  specie: {
    label: 'S--',
    number: 1,
    pka: 12.09
  }
}, {
  ha: 'HClO',
  a: 'ClO-',
  pka: 7.4,
  specie: {
    label: 'ClO-',
    number: 1,
    pka: 7.4
  }
}, {
  ha: 'HBrO',
  a: 'BrO-',
  pka: 8.6,
  specie: {
    label: 'BrO-',
    number: 1,
    pka: 8.6
  }
}, {
  ha: 'HCN',
  a: 'CN-',
  pka: 9.21,
  specie: {
    label: 'CN-',
    number: 1,
    pka: 9.21
  }
}, {
  ha: 'NH4+',
  a: 'NH3',
  pka: 9.25,
  specie: {
    label: 'NH3',
    number: 1,
    pka: 9.25
  }
}, {
  ha: 'CH2ClCOOH',
  a: 'CH2ClCOO-',
  pka: 2.89,
  specie: {
    label: 'CH2ClCOO-',
    number: 1,
    pka: 2.89
  }
}, {
  ha: 'HCOOH',
  a: 'HCOO-',
  pka: 3.75,
  specie: {
    label: 'HCOO-',
    number: 1,
    pka: 3.75
  }
}, {
  ha: 'C6H5COOH',
  a: 'C6H5COO-',
  pka: 4.2,
  specie: {
    label: 'C6H5COO-',
    number: 1,
    pka: 4.2
  }
}, {
  ha: 'C66H5NH3+',
  a: 'C66H5NH2',
  pka: 4.6,
  specie: {
    label: 'C66H5NH2',
    number: 1,
    pka: 4.6
  }
}, {
  ha: 'CH3COOH',
  a: 'CH3COO-',
  pka: 4.75,
  specie: {
    label: 'CH3COO-',
    number: 1,
    pka: 4.75
  }
}, {
  ha: 'C2H5COOH',
  a: 'C2H5COO-',
  pka: 4.87,
  specie: {
    label: 'C2H5COO-',
    number: 1,
    pka: 4.87
  }
}, {
  ha: 'C5H5NH+',
  a: 'C5H5N',
  pka: 5.25,
  specie: {
    label: 'C5H5N',
    number: 1,
    pka: 5.25
  }
}, {
  ha: 'CH3NH3+',
  a: 'CH3NH2',
  pka: 10.66,
  specie: {
    label: 'CH3NH2',
    number: 1,
    pka: 10.66
  }
}, {
  ha: '(C2H5)3NH+',
  a: '(C2H5)3N',
  pka: 10.75,
  specie: {
    label: '(C2H5)3N',
    number: 1,
    pka: 10.75
  }
}, {
  ha: 'C2H5NH3+',
  a: 'C2H5NH2',
  pka: 10.8,
  specie: {
    label: 'C2H5NH2',
    number: 1,
    pka: 10.8
  }
}, {
  ha: 'HCl',
  a: 'Cl-',
  pka: 1,
  specie: {
    label: 'Cl-',
    number: 1,
    pka: 1
  }
}];
define(['lodash'], function (_) {
  var AcidBase = /*#__PURE__*/function () {
    function AcidBase(customPkas) {
      _classCallCheck(this, AcidBase);

      this.pkas = customPkas || pkas;
      this.components = [];
    }

    _createClass(AcidBase, [{
      key: "addAcidBase",
      value: function addAcidBase(label, total) {
        var titrProtonCount;
        var titrSpecie = pkas.find(function (pka) {
          return pka.ha === label;
        });

        if (titrSpecie) {
          titrProtonCount = titrSpecie.specie.number;
          titrSpecie = titrSpecie.specie.label;
        } else {
          titrSpecie = pkas.find(function (pka) {
            return pka.a === label;
          });

          if (titrSpecie) {
            titrProtonCount = 0;
          } else {
            if (label === 'OH-') {
              this.addComponent('OH-', total);
              return;
            } else {
              throw new Error('Could not find acid/base');
            }
          }

          titrSpecie = titrSpecie.specie.label;
        }

        this.addComponent(titrSpecie, total);
        this.addComponent('H+', titrProtonCount * total);
      }
    }, {
      key: "addComponent",
      value: function addComponent(label, total) {
        if (label === 'OH-') {
          label = 'H+';
          total = -total;
        }

        if (!total) total = 0;
        var comp = this.components.find(function (c) {
          return c.label === label;
        });

        if (comp) {
          comp.total += total;
        } else {
          this.components.push({
            label: label,
            total: total
          });
        }
      }
    }, {
      key: "setTotal",
      value: function setTotal(componentLabel, total) {
        var c = this.components.find(function (c) {
          return c.label === componentLabel;
        });
        c.total = total;
        c.atEquilibrium = undefined;
      }
    }, {
      key: "setAtEquilibrium",
      value: function setAtEquilibrium(componentLabel, atEquilibrium) {
        var c = this.components.find(function (c) {
          return c.label === componentLabel;
        });
        c.atEquilibrium = atEquilibrium;
        c.total = undefined;
      }
    }, {
      key: "getModel",
      value: function getModel() {
        var _this = this;

        // Get all involved pkas
        var pkas = this.pkas.filter(function (pka) {
          return _this.components.find(function (c) {
            return String(c.label) === String(pka.specie.label);
          });
        }); // group pkas by component

        var grouped = _.groupBy(pkas, function (pka) {
          return String(pka.specie.label);
        });

        var nbComponents = this.components.length;
        var protonIndex = this.components.findIndex(function (c) {
          return c.label === 'H+';
        });
        if (protonIndex === -1) throw new Error('Acid-base model has no proton');
        var model = {}; // Model components

        model.components = new Array(nbComponents);

        for (i = 0; i < this.components.length; i++) {
          model.components[i] = Object.assign({}, this.components[i]);
        } // Model formed species


        model.formedSpecies = [{
          label: 'OH-',
          beta: Math.pow(10, -14),
          components: new Array(nbComponents).fill(0)
        }];
        model.formedSpecies[0].components[protonIndex] = -1;

        for (var i = 0; i < this.components.length; i++) {
          if (i === protonIndex) continue;
          var group = grouped[this.components[i].label];
          if (!group) throw new Error('Should be unreachable');

          for (var j = 0; j < group.length; j++) {
            var el = group[j];
            model.formedSpecies.push({
              label: String(el.ha),
              beta: Math.pow(10, Number(el.specie.pka)),
              components: new Array(nbComponents).fill(0)
            });
            model.formedSpecies[model.formedSpecies.length - 1].components[i] = 1;
            model.formedSpecies[model.formedSpecies.length - 1].components[protonIndex] = Number(el.specie.number);
          }
        }

        return model;
      }
    }], [{
      key: "getAllAcidBaseLabels",
      value: function getAllAcidBaseLabels() {
        var species = new Set();

        for (var i = 0; i < pkas.length; i++) {
          species.add(pkas[i].ha);
          species.add(pkas[i].a);
        }

        return Array.from(species);
      }
    }]);

    return AcidBase;
  }();

  AcidBase.pkas = pkas;
  return AcidBase;
});