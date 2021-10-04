"use strict";

define(['src/util/ui'], function (UI) {
  function showRecordInfo(record) {
    var html = '';
    html += "<style>\n            #ownerInfo {font-size:1.5em; }\n            #ownerInfo h1 {font-size: 2em; }\n            #ownerInfo th {text-align: left; }\n        </style>";
    html += '<div id="ownerInfo">';

    if (Array.isArray(record.$id)) {
      html += "<h1>".concat(record.$id.join(' - '), "</h1>");
    } else {
      html += "<h1>".concat(record.$id, "</h1>");
    }

    html += "\n        <table>\n            <tr>\n                <th>UUID</th>\n                <td>".concat(record._id, "</td>\n            </tr>\n            <tr>\n                <th>Revision</th>\n                <td>").concat(record._rev, "</td>\n            </tr>\n            <tr>\n                <th>Kind</th>\n                <td>").concat(record.$kind, "</td>\n            </tr>\n            <tr>\n                <th>Creation date</th>\n                <td>").concat(new Date(record.$creationDate), "</td>\n            </tr>\n            <tr>\n                <th>Last modification date</th>\n                <td>").concat(new Date(record.$modificationDate), "</td>\n            </tr>\n            <tr>\n                <th>Last modified by</th>\n                <td>").concat(record.$lastModification, "</td>\n            </tr>\n            <tr>\n                <th>Owner</th>\n                <td>").concat(record.$owners[0], "</td>\n            </tr>\n             <tr>\n                <th>Other owners</th>\n                <td>").concat(record.$owners.slice(1).join(' - '), "</td>\n            </tr>\n        \n        </table>");
    html += '</div>';
    UI.dialog(html, {
      width: 800,
      height: 600,
      title: 'Security record information'
    });
  }

  return showRecordInfo;
});