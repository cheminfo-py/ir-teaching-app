"use strict";

define(["exports", "d3-hierarchy", "src/util/tree", "lodash", "src/main/datas"], function (exports, _d3Hierarchy, _tree, _lodash, _datas) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getTree = getTree;
  exports.getAnnotatedTree = getAnnotatedTree;

  var _tree2 = _interopRequireDefault(_tree);

  var _lodash2 = _interopRequireDefault(_lodash);

  var _datas2 = _interopRequireDefault(_datas);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function F() {};

        return {
          s: F,
          n: function n() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function e(_e) {
            throw _e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function s() {
        it = o[Symbol.iterator]();
      },
      n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function e(_e2) {
        didErr = true;
        err = _e2;
      },
      f: function f() {
        try {
          if (!normalCompletion && it["return"] != null) it["return"]();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var DataObject = _datas2["default"].DataObject; // data should have id as first level property
  // id should be an array that represents the hierarchy

  function getTree(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      idProperty: 'id'
    };
    var idProperty = options.idProperty;
    var getId = getIdFunction(idProperty);
    var getParentId = getParentIdFunction(idProperty);
    fillGaps(data, options);
    var strat = (0, _d3Hierarchy.stratify)().id(getId).parentId(getParentId);
    var tree = strat(data);
    tree.each(function (node) {
      node.index = _lodash2["default"].property(node, idProperty);
    });
    return tree;
  }

  var defaultAnnotationOptions = {
    label: ['label']
  }; // Creates tree and annotates it

  function getAnnotatedTree(data) {
    var annotationOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultAnnotationOptions;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      idProperty: 'id'
    };
    var annotations = {};
    var idProperty = options.idProperty;
    var tree = getTree(data, options);

    for (var key in annotations) {
      annotations[key] = DataObject.check(annotations[key], true);
    }

    tree.each(function (node) {
      node.index = idToString(_lodash2["default"].get(node.data, idProperty));
      annotations[node.index] = node.data;
    });
    tree = _tree2["default"].annotateTree(tree, annotations, annotationOptions);
    return tree;
  }

  function getIdFunction(idProperty) {
    return function getId(d) {
      var id = _lodash2["default"].get(d, idProperty);

      return idToString(id);
    };
  }

  function getParentIdFunction(idProperty) {
    return function getParentId(d) {
      var id = _lodash2["default"].get(d, idProperty);

      if (id.length === 0) {
        return null;
      }

      id = id.slice();
      id.pop();
      return idToString(id);
    };
  }

  function getCreateParent(idProperty) {
    return function createParent(element) {
      var id = _lodash2["default"].get(element, idProperty);

      var parent = {};
      var parentId = id.slice();
      parentId.pop();

      _lodash2["default"].set(parent, idProperty, parentId);

      return parent;
    };
  }

  function fillGaps(data, options) {
    var idProperty = options.idProperty;
    var getId = getIdFunction(idProperty);
    var getParentId = getParentIdFunction(idProperty);
    var createParent = getCreateParent(idProperty);
    var map = new Map();

    var _iterator = _createForOfIteratorHelper(data),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var element = _step.value;
        var id = getId(element);
        map.set(id, {
          data: element
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    function fillParents(element) {
      var pid = getParentId(element);
      if (pid === null) return;
      var mapped = map.get(pid);

      if (!mapped) {
        var newElement = createParent(element);
        data.push(newElement);
        map.set(pid, {
          done: true,
          data: newElement
        });
        fillParents(newElement);
      } else if (!mapped.done) {
        mapped.done = true;
        fillParents(mapped.data);
      }
    }

    var _iterator2 = _createForOfIteratorHelper(data),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _element = _step2.value;
        fillParents(_element);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  function idToString(id) {
    return id.length === 0 ? '.' : id.join('.');
  }
});