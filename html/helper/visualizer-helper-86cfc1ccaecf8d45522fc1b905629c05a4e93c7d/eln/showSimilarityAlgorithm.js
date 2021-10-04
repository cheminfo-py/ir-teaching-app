/*
We retrieve some exercises for structural analysis
 */

import UI from 'src/util/ui';

let html = `
<style>
#distances {
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
}
#distances thead,
#distances tbody {
  display: block;
}
#distances tbody {
  height: 600px;
  overflow-y: auto;
}
#distances td {
  vertical-align: top;
}
#distances i {
  color: darkred;
  font-size: 0.8em;
}
#distances tr:nth-child(even) {
  background: #ddd;
}
#distances tr:nth-child(odd) {
  background: #eee;
}
#distances thead th:nth-child(1),
#distances tbody td:nth-child(1) {
  width: 90px;
}
#distances thead th:nth-child(2),
#distances tbody td:nth-child(2) {
  width: 200px;
  text-overflow: ellipsis;
}
#distances thead th:nth-child(3),
#distances tbody td:nth-child(3) {
  width: 80px;
  text-overflow: ellipsis;
}
#distances thead th:nth-child(4),
#distances tbody td:nth-child(4) {
  width: 250px;
  text-overflow: ellipsis;
}
</style>

<div id="distances">
<table>
  <tbody>
    <tr>
      <th>Algorithm</th>
      <th>Allow negative</th>
      <th>Scale insensitive</th>
      <th>Formula</th>
    </tr>

    <tr>
      <td>avg</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\frac{\\sum\\limits_{i=1}^{n}{\\left|p_i-q_i\\right|}%2b\\max\\limits_i(|p_i-q_i|)}{2}"
        />
      </td>
    </tr>

    <tr>
      <td>canberra</td>
      <td style="color:darkred;">✘</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\sum\\limits_{i=1}^{n}\\frac{\\left|{p_i-q_i}\\right|}{p_i%2bq_i}"
        />
      </td>
    </tr>

    <tr>
      <td>chebyshev</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td><img src="https://tex.cheminfo.org/?tex=d(p,q)=\\max\\limits_i(|p_i-q_i|)">
      </td>
    </tr>

    <tr>
      <td>clark</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\sqrt{\\sum\\limits_{i=1}^{n}{\\left(\\frac{\\left|p_i-q_i\\right|}{(p_i%2bq_i)}\\right)^2}}"
        />
      </td>
    </tr>

    <tr>
      <td>czekanowski</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkgreen;">✔</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=1-\\frac{2\\sum\\limits_{i=1}^{n}{min(p_i,q_i)}}{\\sum\\limits_{i=1}^{n}{p_i%2Bq_i}}"
        />
      </td>
    </tr>

    <tr>
      <td>dice</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=1-\\frac{\\sum\\limits_{i=1}^{n}{(p_i-q_i)^2}}{\\sum\\limits_{i=1}^{n}{p_i^2}%2b\\sum\\limits_{i=1}^{n}{q_i^2}}"
        />
      </td>
    </tr>

    <tr>
      <td>divergence</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=2\\cdot\\sum\\limits_{i=1}^{n}{\\frac{(p_i-q_i)^2}{(p_i%2bq_i)^2}}"
        />
      </td>
    </tr>

    <tr>
      <td>euclidean</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\sqrt{\\sum\\limits_{i=1}^{n}(p_i-q_i)^2}"
        />
      </td>
    </tr>

    <tr>
      <td>gower</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\frac{\\sum\\limits_{i=1}^{n}{\\left|p_i-q_i\\right|}}{n}"
        />
      </td>
    </tr>
 
    <tr>
      <td nowrap>intersection<br><i>Requires normalization</i></td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td>
      <img src="https://tex.cheminfo.org/?tex=d(p,q)=1-\sum\limits_{i=1}^{n}min(p_i,q_i)">
      </td>
    </tr>

    <tr>
      <td>jaccard</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkgreen;">✔</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=1-\\frac{\\sum\\limits_{i=1}^{n}{p_i\\cdot{q_i}}}{\\sum\\limits_{i=1}^{n}{p_i^2}%2b\\sum\\limits_{i=1}^{n}{q_i^2}-\\sum\\limits_{i=1}^{n}{p_i\\cdot{q_i}}}"
        />
      </td>
    </tr>

    <tr>
      <td>kulczynski</td>
      <td style="color:darkred;">✘</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\frac{\\sum\\limits_{i=1}^{n}{\\left|p_i-q_i\\right|}}{min(p_i,q_i)}"
        />
      </td>
    </tr>

    <tr>
      <td>lorentzian</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\sum\\limits_{i=1}^{n}\\ln(\\left|{p_i-q_i}\\right|%2b1)"
        />
      </td>
    </tr>

    <tr>
      <td>manhattan</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\sum\\limits_{i=1}^{n}{\\left|p_i-q_i\\right|}"
        />
      </td>
    </tr>

    <tr>
      <td>probabilisticSymmetric</td>
      <td style="color:darkred;">✘</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=2\\cdot\\sum\\limits_{i=1}^{n}{\\frac{(p_i-q_i)^2}{p_i%2bq_i}}"
        />
      </td>
    </tr>

    <tr>
      <td>soergel</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkgreen;">✔</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\frac{\\sum\\limits_{i=1}^{n}{\\left|p_i-q_i\\right|}}{max(p_i,q_i)}"
        />
      </td>
    </tr>

    <tr>
      <td>sorensen</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\frac{\\sum\\limits_{i=1}^{n}{\\left|p_i-q_i\\right|}}{\\sum\\limits_{i=1}^{n}{p_i%2Bq_i}}"
        />
      </td>
    </tr>

    <tr>
      <td>squared</td>
      <td style="color:darkred;">✘</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\sum\\limits_{i=1}^{n}{(\\sqrt{p_i}-\\sqrt{q_i})^2}"
        />
      </td>
    </tr>

    <tr>
      <td>squaredChord</td>
      <td style="color:darkred;">✘</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\sum\\limits_{i=1}^{n}{(\\sqrt{p_i}-\\sqrt{q_i})^2}"
        />
      </td>
    </tr>

    <tr>
      <td>squaredEuclidean</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkred;">✘</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\sum\\limits_{i=1}^{n}{(p_i-q_i)^2}"
        />
      </td>
    </tr>

    <tr>
      <td>waveHedges</td>
      <td style="color:darkgreen;">✔</td>
      <td style="color:darkgreen;">✔</td>
      <td>
        <img
          src="https://tex.cheminfo.org/?tex=d(p,q)=\\sum\\limits_{i=1}^{n}\\left(1-\\frac{min(p_i,q_i)}{max(p_i,q_i)}\\right)"
        />
      </td>
    </tr>
  </tbody>
</table>
</div>

`;

module.exports = function showMfGroupsList() {
  UI.dialog(html, {
    width: 700,
    height: 700,
    title: 'List of known groups'
  });
};
