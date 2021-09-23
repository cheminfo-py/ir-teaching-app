define(['src/util/ui'], function (UI) {
  function showRecordInfo(record) {
    let html = '';
    html += `<style>
            #ownerInfo {font-size:1.5em; }
            #ownerInfo h1 {font-size: 2em; }
            #ownerInfo th {text-align: left; }
        </style>`;
    html += '<div id="ownerInfo">';
    if (Array.isArray(record.$id)) {
      html += `<h1>${record.$id.join(' - ')}</h1>`;
    } else {
      html += `<h1>${record.$id}</h1>`;
    }
    html += `
        <table>
            <tr>
                <th>UUID</th>
                <td>${record._id}</td>
            </tr>
            <tr>
                <th>Revision</th>
                <td>${record._rev}</td>
            </tr>
            <tr>
                <th>Kind</th>
                <td>${record.$kind}</td>
            </tr>
            <tr>
                <th>Creation date</th>
                <td>${new Date(record.$creationDate)}</td>
            </tr>
            <tr>
                <th>Last modification date</th>
                <td>${new Date(record.$modificationDate)}</td>
            </tr>
            <tr>
                <th>Last modified by</th>
                <td>${record.$lastModification}</td>
            </tr>
            <tr>
                <th>Owner</th>
                <td>${record.$owners[0]}</td>
            </tr>
             <tr>
                <th>Other owners</th>
                <td>${record.$owners.slice(1).join(' - ')}</td>
            </tr>
        
        </table>`;
    html += '</div>';

    UI.dialog(html, {
      width: 800,
      height: 600,
      title: 'Security record information',
    });
  }

  return showRecordInfo;
});
