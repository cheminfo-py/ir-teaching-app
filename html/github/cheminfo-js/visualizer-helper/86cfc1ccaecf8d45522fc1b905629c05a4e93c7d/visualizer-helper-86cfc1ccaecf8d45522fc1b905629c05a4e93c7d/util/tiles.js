"use strict";

define(['jquery'], function ($) {
  var styles = "\n<style>\n.on-tabs-tiles {\n    display: inline-flex;\n    flex-wrap: wrap;\n}\n.on-tabs-tiles .cell {\n    position: relative;\n    border: 2px solid white;\n}\n\n.on-tabs-tiles .cell.inactive {\n    opacity: 0.5;\n}\n\n.on-tabs-tiles .cell div {\n    text-align: center;\n}\n\n.on-tabs-tiles .content {\n    width: 120px;\n    height: 120px;\n    display: inline-flex;\n    font-size:0.8em;\n}\n.on-tabs-tiles .hide {\n    background-color: rgba(255,255,255,0.6);\n    position: absolute;\n    width: 120px;\n    height: 120px;\n    top:0;\n    left:0;\n    z-index:100;\n}\n\n/*\n.on-tabs-tiles .fa, .ci-icon {\n    font-size: 8em;\n    \n}\n*/\n\n.on-tabs-tiles .cell .main {\n    margin: auto;\n}\n\n.on-tabs-tiles .cell .huge {\n    font-size: 6em;\n}\n\n.on-tabs-tiles .cell .large {\n    font-size: 4em;\n}\n\n.on-tabs-tiles .cell .medium {\n    font-size: 2em;\n}\n\n.on-tabs-tiles .cell .title {\n    font-weight: bold;\n    margin: auto;\n}\n\n.on-tabs-tiles .cell .header {\n    position: absolute;\n    font-size: 1.4em;\n    font-weight: bold;\n    text-align: center;\n    width: 100%;\n    z-index: 100;\n    margin-top: 4px;\n}\n.on-tabs-tiles .footer {\n    position: absolute;\n    bottom: 0em;\n    left: 0;\n    text-align: center;\n    width: 100%;\n    /* white-space: pre; */\n    font-size: 10px;\n    /*overflow: hidden;*/\n    margin-bottom: 4px;\n}\n\n.on-tabs-tiles .ribbon-wrapper {\n  width: 75px;\n  height: 75px;\n  overflow: hidden;\n  position: absolute;\n  top: 0px;\n  right: 0px;\n}\n \n.on-tabs-tiles .ribbon {\n  font: bold 1em Sans-Serif;\n  color: white;\n  text-align: center;\n  transform:rotate(45deg);\n  position: relative;\n  padding: 3px 0px 0px 0px;\n  left: 0px;\n  top: 10px;\n  width: 120px;\n  background-color: rgba(255,0,0,0.9);\n  z-index:10;\n  \n}\n.on-tabs-tiles .ribbon.beta {\n    background-color: rgba(0,0,255,0.9);\n}\n</style>\n";
  var defaultOptions = {
    tiles: [],
    onTileClick: function onTileClick() {// noop
    },
    isNewTabLink: function isNewTabLink() {
      return false;
    },
    ribbon: function ribbon() {
      return '';
    },
    isLink: function isLink() {
      return true;
    },
    isActive: function isActive() {
      return true;
    },
    shouldRender: function shouldRender() {
      return true;
    },
    href: function href() {
      return null;
    },
    backgroundColor: function backgroundColor(tile) {
      return tile.backgroundColor;
    },
    color: function color(tile) {
      return tile.color;
    },
    header: function header(tile) {
      return tile.header;
    },
    footer: function footer(tile) {
      return tile.footer;
    },
    title: function title(tile) {
      return tile.title;
    },
    icon: function icon(tile) {
      return tile.icon;
    }
  };
  return function (div, options) {
    var lineCount = 0;
    options = Object.assign({}, defaultOptions, options);
    var _options = options,
        tiles = _options.tiles;
    var $div = $("#".concat(div));
    $div.empty();
    $div.append(styles);
    var $main = $('<div>');
    $div.append($main);

    if (!tiles) {
      $div.append('No tiles');
      return;
    }

    $main.addClass('on-tabs-tiles');
    $main.append(tiles.map(getTile));
    $main.on('click', function (event) {
      var $el;

      if ($(event.target).hasClass('cell')) {
        $el = $(event.target);
      } else {
        $el = $(event.target).parents('.cell').first();
      }

      var idx = $el.attr('data-idx');
      var tile = tiles[idx];

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
      var ribbon = options.ribbon(tile);
      var active = options.isActive(tile);
      var header = options.header(tile);
      var footer = options.footer(tile);
      var title = options.title(tile);
      var icon = options.icon(tile);
      var href = options.href(tile);
      var newTabLink = options.isNewTabLink(tile);
      var size = getSize(title);
      var iconType = /(fa|ci-icon)-/.exec(icon);
      if (iconType) iconType = iconType[1];
      var $el = $("\n                <div class=\"cell ".concat(active ? 'active' : 'inactive', "\">\n                    <div class='content'>\n                        <div class='header'>").concat(header || '', "</div>\n                        ").concat(icon ? "<div class=\"".concat(iconType, " ").concat(icon, " icon main huge\"></div>") : "<div class=\"title main ".concat(size, "\">").concat(title || '', "</div>"), "\n                        <div class=\"footer\">").concat(footer || '', "</div>\n                        ").concat(ribbon ? "<div class=\"ribbon-wrapper\"><div class=\"ribbon beta\">".concat(ribbon, "</div></div>") : '', "\n                    </div>\n                </div>\n        "));
      $el.css({
        color: options.color(tile),
        backgroundColor: options.backgroundColor(tile),
        cursor: active && options.isLink(tile) ? 'pointer' : 'inherit'
      });
      $el.attr({
        'data-idx': idx
      });

      if (newTabLink && active && href) {
        return $el.wrap("<a href=\"".concat(href, "\" target=\"_blank\" style=\"text-decoration: none; color: initial;\" />")).parent();
      }

      return $el;
    }

    function getSize(text) {
      if (text === undefined) return 'huge';
      var asText = String(text);

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