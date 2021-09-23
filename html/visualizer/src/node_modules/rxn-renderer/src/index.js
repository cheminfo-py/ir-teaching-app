import parse from 'rxn-parser';

export class RxnRenderer {
  constructor(OCL, options = {}) {
    this.OCL = OCL;
    this.maxWidth = options.maxWidth || 400;
    this.maxHeight = options.maxHeight || 300;
    this.escaped = options.escaped;
  }

  renderRXN(rxn) {
    let parsed = parse(rxn);
    let result = this.getStructures(parsed.reagents);
    if (parsed.reagents.length > 0 || parsed.products.length > 0) {
      result += this.getArrow();
    }
    result += this.getStructures(parsed.products);
    return `<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">${result}</div>`;
  }
  render(object = {}) {
    let result = '';
    let parsed;
    if (object.rxn) {
      parsed = parse(object.rxn);
      result += this.getStructures(parsed.reagents);
    }

    let hover = [];
    let under = [];
    if (object.catalyst) hover.push(this.getEscaped(object.catalyst));
    if (object.reagent) hover.push(this.getEscaped(object.reagent));

    if (object.solvent) hover.push(this.getEscaped(object.solvent));
    if (object.temperature) under.push(this.getEscaped(object.temperature));
    if (object.conditions) under.push(this.getEscaped(object.conditions));
    if (object.yield) under.push(this.getEscaped(object.yield));

    result += this.getArrow(hover.join(', '), under.join(', '));

    if (object.rxn) {
      result += this.getStructures(parsed.products);
    }

    return `<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">${result}</div>`;
  }

  getArrow(hover = '', under = '') {
    return `<div style="font-family: arial, sans-serif; font-size: 10px">
    <div style="text-align: center; margin: 5px">${hover}</div>
    <div>
      <div
        style="top: 50%; position: relative; border-top: 2px solid black; width: 100%; min-width: 70px"
      >
        <div
          style="position: absolute; right: -2px; top: -6px; border-top: 5px solid transparent; border-left: 10px solid black;border-bottom: 5px solid transparent;"
        ></div>
      </div>
    </div>
    <div style="text-align: center; margin: 5px">
      ${under}
    </div>
  </div>`;
  }

  getEscaped(value) {
    if (this.escaped) return subscript(value);
    return subscript(safeTagsReplace(value));
  }

  getStructures(structures) {
    if (!structures || structures.length === 0) return '';
    let result = [];
    for (let structure of structures) {
      let molecule = this.OCL.Molecule.fromMolfile(structure);
      let svg = molecule.toSVG(this.maxWidth, this.maxHeight, undefined, {
        autoCrop: true,
        autoCropMargin: 25,
        suppressChiralText: true,
        suppressCIPParity: true,
        suppressESR: true,
        noStereoProblem: true,
      });
      result.push(`<div>${svg}</div>`);
    }

    return result.join('<div>+</div>');
  }
}

function subscript(string) {
  return string.replace(/([a-zA-Z])([0-9]+)/g, '$1<sub>$2</sub>');
}

let tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

function safeTagsReplace(str) {
  return str.replace(/[&<>]/g, (tag) => tagsToReplace[tag] || tag);
}
