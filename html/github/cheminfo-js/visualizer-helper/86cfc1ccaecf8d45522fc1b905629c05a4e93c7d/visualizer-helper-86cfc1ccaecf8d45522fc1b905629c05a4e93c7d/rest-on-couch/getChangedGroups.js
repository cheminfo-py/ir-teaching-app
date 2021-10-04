"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

define(['src/util/ui', 'lodash'], function (UI, _) {
  function editGroups(record, allGroups) {
    var groups = JSON.parse(JSON.stringify(allGroups));
    var groupNames = groups.map(function (group) {
      return group.name;
    }); // we will also take the current groups from the record

    var owners = DataObject.resurrect(record.$owners).slice(1); // eslint-disable-line

    var groupsToAdd = _.difference(owners, groupNames);

    var _iterator = _createForOfIteratorHelper(groupsToAdd),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var group = _step.value;
        groups.push({
          name: group
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var _iterator2 = _createForOfIteratorHelper(groups),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _group = _step2.value;

        if (owners.includes(_group.name)) {
          _group.checked = true;
          _group.previous = true;
        } else {
          _group.checked = false;
          _group.previous = false;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return UI.form("\n    <div>\n    <form>\n        <table>\n        <tr>\n        <th>Groups</th>\n        <td>\n        {% for group in groups %}\n          <div>\n            <input type=\"checkbox\" name=\"groups.{{ loop.index0 }}.checked\" />\n            <span style=\"font-weight: bold;\">{{group.name}}</span>\n            <span>{{ group.description }}</span>\n          </div>\n        {% endfor %}\n        </td>\n        </tr>\n        </table>\n        Add new owner: <input type=\"text\" name=\"email\" placeholder=\"email or group name\" size=40>\n        <input type=\"submit\" value=\"Submit\"/>\n    </form>\n    </div>\n", {
      groups: groups
    }, {
      twig: {
        groups: groups
      }
    }).then(function (result) {
      if (!result) return undefined;
      var groups = result.groups;
      var add = groups.filter(function (r) {
        return !r.previous && r.checked;
      }).map(function (r) {
        return r.name;
      });
      if (result.email) add.push(result.email);
      return {
        add: add,
        remove: groups.filter(function (r) {
          return r.previous && !r.checked;
        }).map(function (r) {
          return r.name;
        })
      };
    });
  }

  return editGroups;
});