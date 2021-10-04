const defaultOptions = {
  onTileClick: (target) => {
    console.log(target);
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
  icon: (tile) => tile.icon,
};

class TilesManager {
  constructor(divID, tiles = [], options = {}) {
    this.tiles = tiles;
    this.divID = divID;
    this.options = { ...defaultOptions, ...options };
  }

  repaint() {
    repaint(this.divID, this.tiles, this.options);
  }
}

function repaint(divID, tiles, options) {
  let lineCount = 0;
  const $div = $('#' + divID);
  console.log($div);

  $div.empty();
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
      $el = $(event.target).parents('.cell').first();
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
                            : `<div class="title main ${size}">${
                                title || ''
                              }</div>`
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
      cursor: active && options.isLink(tile) ? 'pointer' : 'inherit',
    });

    $el.attr({
      'data-idx': idx,
    });
    if (newTabLink && active && href) {
      return $el
        .wrap(
          `<a href="${href}" target="_blank" style="text-decoration: none; color: initial;" />`,
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
}
