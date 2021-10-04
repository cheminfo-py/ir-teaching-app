"use strict";

define(['src/util/ui'], function (UI) {
  function showUserInfo(user) {
    var html = '';
    html += "<style>\n            #userInfo {font-size:1.5em};\n            #userInfo h1 {font-size: 20px};\n            #userInfo th {text-align: left};\n        </style>";
    html += '<div id="userInfo">';
    html += "<h1>".concat(user.email, "</h1>");
    html += '<table>';

    if (user.userId) {
      html += "<tr>\n                <th>User ID</th>\n                <td>".concat(user.userId, "</td>\n            </tr>");
    }

    if (user.firstName) {
      html += "<tr>\n                <th>Firstname</th>\n                <td>".concat(user.firstName, "</td>\n            </tr>");
    }

    if (user.lastName) {
      html += "<tr>\n                <th>Lastname</th>\n                <td>".concat(user.lastName, "</td>\n            </tr>");
    }

    if (user.groupName) {
      html += "<tr>\n                <th>Group</th>\n                <td>".concat(user.groupName, "</td>\n            </tr>");
    }

    if (user.phoneNumber) {
      html += "<tr>\n                <th>Phone number</th>\n                <td>".concat(user.phoneNumber, "</td>\n            </tr>");
    }

    if (user.roomNumber) {
      html += "<tr>\n                <th>Room number</th>\n                <td>".concat(user.roomNumber, "</td>\n            </tr>");
    }

    if (user.postalAddress) {
      html += "<tr>\n                <th>Room number</th>\n                <td>".concat(user.postalAddress, "</td>\n            </tr>");
    }

    if (user.allGroups && Array.isArray(user.allGroups)) {
      html += "<tr>\n                <th>Groups</th>\n                <td>".concat(user.allGroups.join('<br>'), "</td>\n            </tr>");
    }

    html += '</table>';
    html += '</div>';
    UI.dialog(html, {
      width: 800,
      height: 400,
      title: 'Logged in user information'
    });
  }

  return showUserInfo;
});