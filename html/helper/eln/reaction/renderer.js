import TypeRenderer from 'src/util/typerenderer';

import Color from './color';

export function add() {
  TypeRenderer.addType('reactionStatus', {
    toscreen($element, val) {
      let label = Color.getLabel(val);
      let color = Color.getColor(val);
      $element.css('background-color', color);
      $element.html(label);
    }
  });
}
