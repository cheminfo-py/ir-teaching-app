import fs from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { RxnRenderer } from '..';

let rxn = fs.readFileSync(join(__dirname, 'test.rxn'), 'utf8');
let emptyRXN = fs.readFileSync(join(__dirname, 'empty.rxn'), 'utf8');

let json = JSON.parse(fs.readFileSync(join(__dirname, 'test.json'), 'utf8'));

describe('rxn-renderer', () => {
  it('generate file for rxn', () => {
    let rxnRenderer = new RxnRenderer(OCL, {
      maxWidth: 200,
      maxHeight: 100,
    });
    let result = rxnRenderer.renderRXN(rxn);
    expect(result).toMatchSnapshot();
    fs.writeFileSync(join(__dirname, 'test-rxn.html'), result);
  });

  it('generate file for empty rxn', () => {
    let rxnRenderer = new RxnRenderer(OCL, {
      maxWidth: 200,
      maxHeight: 100,
    });
    let result = rxnRenderer.renderRXN(emptyRXN);
    expect(result).toMatchSnapshot();
    fs.writeFileSync(join(__dirname, 'test-empty.html'), result);
  });

  it('generate file for json', () => {
    let rxnRenderer = new RxnRenderer(OCL);
    let result = rxnRenderer.render(json);
    expect(result).toMatchSnapshot();
    fs.writeFileSync(join(__dirname, 'test-json.html'), result);
  });
});
