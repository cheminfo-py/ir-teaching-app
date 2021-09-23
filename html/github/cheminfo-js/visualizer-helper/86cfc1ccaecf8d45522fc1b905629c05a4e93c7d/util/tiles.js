define(['jquery'], function ($) {
  const styles = `
<style>
.on-tabs-tiles {
    display: inline-flex;
    flex-wrap: wrap;
}
.on-tabs-tiles .cell {
    position: relative;
    border: 2px solid white;
}

.on-tabs-tiles .cell.inactive {
    opacity: 0.5;
}

.on-tabs-tiles .cell div {
    text-align: center;
}

.on-tabs-tiles .content {
    width: 120px;
    height: 120px;
    display: inline-flex;
    font-size:0.8em;
}
.on-tabs-tiles .hide {
    background-color: rgba(255,255,255,0.6);
    position: absolute;
    width: 120px;
    height: 120px;
    top:0;
    left:0;
    z-index:100;
}

/*
.on-tabs-tiles .fa, .ci-icon {
    font-size: 8em;
    
}
*/

.on-tabs-tiles .cell .main {
    margin: auto;
}

.on-tabs-tiles .cell .huge {
    font-size: 6em;
}

.on-tabs-tiles .cell .large {
    font-size: 4em;
}

.on-tabs-tiles .cell .medium {
    font-size: 2em;
}

.on-tabs-tiles .cell .title {
    font-weight: bold;
    margin: auto;
}

.on-tabs-tiles .cell .header {
    position: absolute;
    font-size: 1.4em;
    font-weight: bold;
    text-align: center;
    width: 100%;
    z-index: 100;
    margin-top: 4px;
}
.on-tabs-tiles .footer {
    position: absolute;
    bottom: 0em;
    left: 0;
    text-align: center;
    width: 100%;
    /* white-space: pre; */
    font-size: 10px;
    /*overflow: hidden;*/
    margin-bottom: 4px;
}

.on-tabs-tiles .ribbon-wrapper {
  width: 75px;
  height: 75px;
  overflow: hidden;
  position: absolute;
  top: 0px;
  right: 0px;
}
 
.on-tabs-tiles .ribbon {
  font: bold 1em Sans-Serif;
  color: white;
  text-align: center;
  transform:rotate(45deg);
  position: relative;
  padding: 3px 0px 0px 0px;
  left: 0px;
  top: 10px;
  width: 120px;
  background-color: rgba(255,0,0,0.9);
  z-index:10;
  
}
.on-tabs-tiles .ribbon.beta {
    background-color: rgba(0,0,255,0.9);
}
</style>
`;

  const defaultOptions = {
    tiles: [],
    onTileClick: () => {
      // noop
    },
    isNewTabLink: () => false,
    ribbon: () => '',
    isLink: () => true,
    isActive: () => true,
    shouldRender: () => true,
    href: () => null,
    backgroundColor: (tile) => tile.backgroundColor,
    color: (tile) => tile.color,
    header: (tile) => tile.header,
    footer: (tile) => tile.footer,
    title: (tile) => tile.title,
    icon: (tile) => tile.icon
  };

  return function (div, options) {
    let lineCount = 0;
    options = Object.assign({}, defaultOptions, options);
    const { tiles } = options;
    const $div = $(`#${div}`);
    $div.empty();
    $div.append(styles);
    const $main = $('<div>');
    $div.append($main);
    if (!tiles) {
      $div.append('No tiles');
      return;
    }
    $main.addClass('on-tabs-tiles');
    $main.append(tiles.map(getTile));

    $main.on('click', function (event) {
      let $el;
      if ($(event.target).hasClass('cell')) {
        $el = $(event.target);
      } else {
        $el = $(event.target)
          .parents('.cell')
          .first();
      }
      let idx = $el.attr('data-idx');
      const tile = tiles[idx];
      if (tile && options.isActive(tile) && !options.isNewTabLink(tile)) {
        options.onTileClick(event, tile, $el);
      }
    });

    function getTile(tile, idx) {
      tile.line = lineCount;
      if (Object.keys(tile).length === 1) {
        lineCount++;
        return '<div style="width: 100%"></div>';
      }
      if (!options.shouldRender(tile)) return '';
      const ribbon = options.ribbon(tile);
      const active = options.isActive(tile);
      const header = options.header(tile);
      const footer = options.footer(tile);
      const title = options.title(tile);
      const icon = options.icon(tile);
      const href = options.href(tile);
      const newTabLink = options.isNewTabLink(tile);
      const size = getSize(title);

      let iconType = /(fa|ci-icon)-/.exec(icon);
      if (iconType) iconType = iconType[1];
      const $el = $(`
                <div class="cell ${active ? 'active' : 'inactive'}">
                    <div class='content'>
                        <div class='header'>${header || ''}</div>
                        ${
  icon
    ? `<div class="${iconType} ${icon} icon main huge"></div>`
    : `<div class="title main ${size}">${title ||
                                ''}</div>`
}
                        <div class="footer">${footer || ''}</div>
                        ${
  ribbon
    ? `<div class="ribbon-wrapper"><div class="ribbon beta">${ribbon}</div></div>`
    : ''
}
                    </div>
                </div>
        `);

      $el.css({
        color: options.color(tile),
        backgroundColor: options.backgroundColor(tile),
        cursor: active && options.isLink(tile) ? 'pointer' : 'inherit'
      });

      $el.attr({
        'data-idx': idx
      });
      if (newTabLink && active && href) {
        return $el
          .wrap(
            `<a href="${href}" target="_blank" style="text-decoration: none; color: initial;" />`
          )
          .parent();
      }
      return $el;
    }

    function getSize(text) {
      if (text === undefined) return 'huge';
      const asText = String(text);
      if (asText.length <= 3) {
        return 'huge';
      } else if (asText.length <= 6) {
        return 'large';
      } else {
        return 'medium';
      }
    }
  };
});
