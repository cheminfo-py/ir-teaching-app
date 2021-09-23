/*
We retrieve some exercises for structural analysis
 */

import UI from 'src/util/ui';
import OCL from 'openchemlib/openchemlib-full';

import MolecularFormula from '../eln/libs/MolecularFormula';

module.exports = function showMfGroupsList(CustomMolecularFormula) {
  console.log({ CustomMolecularFormula });
  const html = getHtml(CustomMolecularFormula);
  UI.dialog(html, {
    width: 880,
    height: 700,
    title: 'List of known groups',
  });
};

function getHtml(CustomMolecularFormula = MolecularFormula) {
  const MF = CustomMolecularFormula.MF;
  const groups = JSON.parse(JSON.stringify(CustomMolecularFormula.Groups));
  console.log(groups);
  groups.forEach((group) => {
    group.mfHtml = new MF(String(group.mf)).toHtml();
  });
  let html = `
    <style>
      
        #allGroups thead, #allGroups tbody {
            display: block;
        }
        #allGroups tbody {
            height: 600px;
            overflow-y: auto;
        }
        #allGroups td {
            vertical-align: top;
        }
        #allGroups tr:nth-child(even) {
            background: #DDD;
        }
        #allGroups tr:nth-child(odd) {
            background: #EEE;
        }
        #allGroups thead th:nth-child(1), #allGroups tbody td:nth-child(1) {
            width: 90px;
        }
        #allGroups thead th:nth-child(2), #allGroups tbody td:nth-child(2) {
            width: 200px;
            max-width: 200px;
            text-overflow:ellipsis;
        }
        #allGroups thead th:nth-child(3), #allGroups tbody td:nth-child(3) {
            width: 100px;
            max-width: 100px;
            text-overflow:ellipsis;
        }
        #allGroups thead th:nth-child(4), #allGroups tbody td:nth-child(4) {
            width: 100px;
            max-width: 100px;
            text-overflow:ellipsis;
        }
        #allGroups thead th:nth-child(5), #allGroups tbody td:nth-child(5) {
          width: 70px;
          max-width: 70px;
          text-overflow:ellipsis;
        }
        #allGroups thead th:nth-child(6), #allGroups tbody td:nth-child(6) {
          width: 250px;
          text-overflow:ellipsis;
        }
      
    </style>
    Filter the list: <input type='text' oninput='filter(this)'>
    <table id='allGroups'>
        <thead>
            <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>mf</th>
                <th>Kind</th>
                <th>One letter</th>
                <th>Structure</th>
            </tr>
        </thead>
        <tbody>
            ${groups
              .map(
                (group) => `
                <tr>
                    <td>${group.symbol}</td>
                    <td>${group.name}</td>
                    <td>${group.mfHtml}<span style='display:none'>${
                  group.mf
                }</span></td>
                <td>${group.kind}</td>
                <td>${group.oneLetter ? group.oneLetter : ''}</td>
                    <td><span  style="zoom: 0.8">
                    ${
                      group.ocl && group.ocl.value.length > 2
                        ? "<img src='data:image/svg+xml;base64," +
                          btoa(
                            OCL.Molecule.fromIDCode(
                              group.ocl.value,
                              group.ocl.coordinates,
                            ).toSVG(250, 200, undefined, {
                              autoCrop: true,
                              autoCropMargin: 5,
                              suppressChiralText: true,
                              suppressCIPParity: true,
                              suppressESR: true,
                              noStereoProblem: true,
                            }),
                          ) +
                          "'>"
                        : ''
                    }
                    </span></td>
                </tr>
            `,
              )
              .join('\n')}
        </tbody>
    </table>
    <script>
        function filter(input) {
            let regexp=new RegExp(input.value,'i')
            let lines=document.getElementById('allGroups').getElementsByTagName('TR');
            for (let line of lines) {
                let content=line.innerHTML;
                if (content.match(regexp) || content.match(/<th>/i)) {
                    line.style.display='';
                } else {
                    line.style.display='none';
                }
            }
        }
    </script>
`;
  return html;
}
