import TypeRenderer from 'src/util/typerenderer';

import toHtmlEA from './ea';
import toHtmlIR from './ir';
import toHtmlRaman from './raman';
import toHtmlUV from './uv';
import toHtmlNMR from './nmr';
import toHtmlMass from './mass';

export function add() {
  TypeRenderer.addType('acsir', {
    toscreen($element, val, root, options = {}) {
      $element.html(toHtmlIR(val, options));
    }
  });

  TypeRenderer.addType('acsraman', {
    toscreen($element, val, root, options = {}) {
      $element.html(toHtmlRaman(val, options));
    }
  });

  TypeRenderer.addType('acsuv', {
    toscreen($element, val, root, options = {}) {
      $element.html(toHtmlUV(val, options));
    }
  });

  TypeRenderer.addType('acsnmr', {
    toscreen($element, val, root, options = {}) {
      $element.html(toHtmlNMR(val, options));
    }
  });

  TypeRenderer.addType('acsms', {
    toscreen($element, val, root, options = {}) {
      $element.html(toHtmlMass(val, options));
    }
  });

  TypeRenderer.addType('acsea', {
    toscreen($element, val, root, options = {}) {
      $element.html(toHtmlEA(val, options));
    }
  });
}
