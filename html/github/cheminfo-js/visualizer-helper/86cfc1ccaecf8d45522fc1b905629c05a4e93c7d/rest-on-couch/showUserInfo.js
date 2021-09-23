
define(['src/util/ui'], function (UI) {
  function showUserInfo(user) {
    let html = '';
    html += `<style>
            #userInfo {font-size:1.5em};
            #userInfo h1 {font-size: 20px};
            #userInfo th {text-align: left};
        </style>`;
    html += '<div id="userInfo">';
    html += `<h1>${user.email}</h1>`;
    html += '<table>';
    if (user.userId) {
      html += `<tr>
                <th>User ID</th>
                <td>${user.userId}</td>
            </tr>`;
    }

    if (user.firstName) {
      html += `<tr>
                <th>Firstname</th>
                <td>${user.firstName}</td>
            </tr>`;
    }


    if (user.lastName) {
      html += `<tr>
                <th>Lastname</th>
                <td>${user.lastName}</td>
            </tr>`;
    }


    if (user.groupName) {
      html += `<tr>
                <th>Group</th>
                <td>${user.groupName}</td>
            </tr>`;
    }

    if (user.phoneNumber) {
      html += `<tr>
                <th>Phone number</th>
                <td>${user.phoneNumber}</td>
            </tr>`;
    }


    if (user.roomNumber) {
      html += `<tr>
                <th>Room number</th>
                <td>${user.roomNumber}</td>
            </tr>`;
    }

    if (user.postalAddress) {
      html += `<tr>
                <th>Room number</th>
                <td>${user.postalAddress}</td>
            </tr>`;
    }

    if (user.allGroups && Array.isArray(user.allGroups)) {
      html += `<tr>
                <th>Groups</th>
                <td>${user.allGroups.join('<br>')}</td>
            </tr>`;
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

