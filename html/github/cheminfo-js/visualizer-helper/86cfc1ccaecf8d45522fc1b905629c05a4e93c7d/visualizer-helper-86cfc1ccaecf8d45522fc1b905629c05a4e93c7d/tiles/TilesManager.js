"use strict";

define([], function () {
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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

  var defaultOptions = {
    onTileClick: function onTileClick(target) {
      console.log(target);
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

  var TilesManager = function () {
    function TilesManager(divID) {
      var tiles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, TilesManager);

      this.tiles = tiles;
      this.divID = divID;
      this.options = _objectSpread(_objectSpread({}, defaultOptions), options);
    }

    _createClass(TilesManager, [{
      key: "repaint",
      value: function repaint() {
        _repaint(this.divID, this.tiles, this.options);
      }
    }]);

    return TilesManager;
  }();

  function _repaint(divID, tiles, options) {
    var lineCount = 0;
    var $div = $('#' + divID);
    console.log($div);
    $div.empty();
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
  }
});