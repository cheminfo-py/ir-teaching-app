"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/util/ui', 'lodash'], function (ui, _) {
  return /*#__PURE__*/function () {
    var _createSample = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(roc, allGroups) {
      var storageKey, entrysample, data, toFill, allGroupNames, groupPref, result, selected;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              storageKey = 'eln-new-sample-default-groups';
              entrysample = {
                $content: {}
              };
              data = {
                allGroups: allGroups
              };
              toFill = {
                group: {}
              };
              allGroupNames = allGroups.map(function (g) {
                return g.name;
              });
              groupPref = localStorage.getItem(storageKey);
              groupPref = groupPref ? JSON.parse(groupPref) : [];
              groupPref = _.intersection(allGroupNames, groupPref);
              groupPref.forEach(function (group) {
                return toFill.group[group] = true;
              });
              _context.next = 11;
              return ui.form("\n              <div>\n              <form>\n                  <table>\n                  <tr>\n                  <th align=right>Reference<br><span style='font-size: smaller'>Product code</span></th>\n                  <td><input type=\"text\" name=\"code\" pattern=\"[A-Za-z0-9 .-]{3,}\"/></td>\n                  </tr>\n                  <tr>\n                  <th align=right>Batch<br><span style='font-size: smaller'>Batch code</span></th>\n                  <td><input type=\"text\" name=\"batch\" pattern=\"[A-Za-z0-9 .-]*\"/></td>\n                  </tr>\n                  <tr>\n                  <th>Groups</th>\n                  Select the groups who should have access to the sample. If you don't select any group, only you will have access to it.\n                  <td>\n                  {% for group in allGroups %}\n                    <div>\n                      <input type=\"checkbox\" name=\"group.{{ group.name }}\" />\n                      <span style=\"font-weight: bold;\">{{group.name}}</span>\n                      <span>{{ group.description }}</span>\n                    </div>\n                  {% endfor %}\n                  </td>\n                  </tr>\n                  </table>\n                  <input type=\"submit\" value=\"Submit\"/>\n              </form>\n              </div>\n          ", toFill, {
                twig: data,
                dialog: {
                  width: 500
                }
              });

            case 11:
              result = _context.sent;

              if (!(!result || !result.code || result.batch == null)) {
                _context.next = 14;
                break;
              }

              return _context.abrupt("return", undefined);

            case 14:
              selected = Object.keys(result.group).filter(function (key) {
                return result.group[key];
              });
              entrysample.$id = [result.code, result.batch];
              entrysample.$owners = selected;
              localStorage.setItem(storageKey, JSON.stringify(selected));
              return _context.abrupt("return", roc.create(entrysample));

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function createSample(_x, _x2) {
      return _createSample.apply(this, arguments);
    }

    return createSample;
  }();
});