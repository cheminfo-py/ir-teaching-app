"use strict";

var actionValue = undefined.action.value;
var actionMame = undefined.action.name;
var categories = actionValue.category || [];
var spectrumCategories = [{
  label: 'reference',
  description: 'Reference data'
}, {
  label: 'nonRepresentative',
  description: 'Non representative data'
}, {
  label: 'supplementary',
  description: 'Supplementary data'
}];
define(['src/util/ui', 'lodash'], function (UI, _) {
  function setspectrumCategories(record, allCategories) {
    var selectedCategories = categories;
    var entrysample = {
      group: {}
    };
    owners.forEach(function (group) {
      return entrysample.group[group] = true;
    });
    var data = {
      allGroups: allGroups
    };
    return UI.form("\n  <div>\n  <form>\n      <table>\n      <tr>\n      <th>Groups</th>\n      <td>\n      {% for category in allCategories %}\n        <div>\n          <input type=\"checkbox\" name=\"group.{{ group.name }}\" />\n          <span style=\"font-weight: bold;\">{{group.name}}</span>\n          <span>{{ group.description }}</span>\n        </div>\n      {% endfor %}\n      </td>\n      </tr>\n      </table>\n      <input type=\"submit\" value=\"Submit\"/>\n  </form>\n  </div>\n", entrysample, {
      twig: data
    }).then(function (result) {
      if (!result) return null;
      var selected = Object.keys(result.group).filter(function (key) {
        return result.group[key];
      });
      var notSelected = Object.keys(result.group).filter(function (key) {
        return !result.group[key];
      });

      var toAdd = _.difference(canBeAdded, notSelected);

      var toRemove = _.difference(canBeRemoved, selected);

      return {
        add: toAdd,
        remove: toRemove
      };
    });
  }

  setspectrumCategories(spectrum, spectrumCategories);
});