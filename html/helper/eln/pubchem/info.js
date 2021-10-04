'use strict';

import OCL from 'openchemlib/openchemlib-core';

// returns GHS information based on pubchem and a smiles

define(['src/util/ui', 'src/util/api'], function (UI, API) {
  async function fromIDCode(oclCode, options) {
    const molecule = OCL.Molecule.fromIDCode(oclCode);
    const smiles = molecule.toSmiles();
    return fromSMILES(smiles, options);
  }

  async function fromSMILES(smiles, options = {}) {
    const html = `<iframe src="https://www.lactame.com/react/views/v1.2.1/chemistry/pubchem.html?smiles=${encodeURIComponent(
      smiles,
    )}" frameborder="0" style="overflow:hidden;height:95%;width:100%" height="95%" width="100%"></iframe>`;

    UI.dialog(html, {
      width: 1000,
      height: 800,
      modal: true,
      title: 'Pubchem information',
    });
  }

  return { fromIDCode, fromSMILES };
});

const ghsTemplate = `
<style>
    #ghsSmmary {
        
    }
    #ghsSummary table {
        border-collapse: collapse;
    }
    #ghsSummary td {
        border: 0.5px solid grey;
        padding: 2px;
    }
    #ghsSummary h1 {
        font-size: 1.5em;
        padding-bottom: 0.5em;
        padding-top: 1em;
    }
</style>
<div id="ghsSummary">
    {% if ghs.pictograms %}
        <h1>Pictograms</h1>
        <table>
            {% for pictogram in ghs.pictograms %}
            <tr>
              <td>
                  {{pictogram.code}}
              </td>
              <td>
                  <div style="width:4em; height:4em">
                    {{rendertypeBlock(pictogram.code,'ghs')}}
                  </div>
              </td>
              <td>
                  {{pictogram.description}}
              </td>
            </tr>
            {% endfor %}
        </table>
    {% endif %}
    {% if ghs.hStatements %}
        <h1>Hazard statements</h1>
        <table>
            {% for h in ghs.hStatements %}
            <tr>
              <td>
                  {{h.code}}
              </td>
              <td>
                  {{h.description}}
              </td>
            </tr>
            {% endfor %}
        </table>
    {% endif %}
    {% if ghs.pStatements %}
        <h1>Precautionary statements</h1>
        <table>
            {% for p in ghs.pStatements %}
            <tr>
              <td>
                  {{p.code}}
              </td>
              <td>
                  {{p.description}}
              </td>
            </tr>
            {% endfor %}
        </table>
    {% endif %}
</div>
`;

const ghsFullTemplate = `
<style>
    #ghsFull {
        
    }
    #ghsFull table {
        border-collapse: collapse;
    }
    #ghsFull a:hover, #ghsFull a:link, #ghsFull a:active, #ghsFull a:visited {
        color: darkblue;
        text-decoration: none;
    }
    #ghsFull td {
        border: 0.5px solid grey;
        padding: 2px;
    }
    #ghsFull h1 {
        font-size: 1.5em;
        padding-bottom: 0.1em;
        padding-top: 0.5em;
    }
    #ghsFull h2 {
        font-size: 1.2em;
        padding-bottom: 0.5em;
        padding-top: 1em;
    }
    #ghsFull i {
        font-size: 0.8em;
    }
    #ghsFull p {
        padding-bottom: 0.1em;
        padding-top: 0.1em;
    }
</style>
<div id="ghsFull">
    <p style="text-align: center; font-size: 2em; font-weight:bold;">Detailed safety information</p>
    {% if ghsFull.pictograms %}
        <h1>Pictograms</h1>
        {% for entry in ghsFull.pictograms %}
            <h2><a href="{{entry.reference.url}}">{{entry.reference.sourceName}}</a></h2>
            <p>
                Name: <b>{{entry.reference.name}}</b>
            </p>
            <p><i>{{entry.reference.description}}</i></p>
            <table>
                {% for pictogram in entry.data %}
                <tr>
                  <td>
                      {{pictogram.code}}
                  </td>
                  <td>
                      <div style="width:4em; height:4em">
                        {{rendertypeBlock(pictogram.code,'ghs')}}
                      </div>
                  </td>
                  <td>
                      {{pictogram.description}}
                  </td>
                </tr>
                {% endfor %}
            </table>
        {% endfor %}
    {% endif %}
    {% if ghsFull.hStatements %}
        <h1>Hazard statements</h1>
        {% for entry in ghsFull.hStatements %}
            <h2><a href="{{entry.reference.url}}">{{entry.reference.sourceName}}</a></h2>
            <p>
                Name: <b>{{entry.reference.name}}</b>
            </p>
            <p><i>{{entry.reference.description}}</i></p>
            <table>
                {% for hStatement in entry.data %}
                <tr>
                  <td>
                      {{hStatement.code}}
                  </td>
                  <td>
                      {{hStatement.description}}
                  </td>
                </tr>
                {% endfor %}
            </table>
        {% endfor %}
    {% endif %}
    {% if ghsFull.pStatements %}
        <h1>Precautionary statements</h1>
        {% for entry in ghsFull.pStatements %}
            <h2><a href="{{entry.reference.url}}">{{entry.reference.sourceName}}</a></h2>
            <p>
                Name: <b>{{entry.reference.name}}</b>
            </p>
            <p><i>{{entry.reference.description}}</i></p>
            <table>
                {% for pStatement in entry.data %}
                <tr>
                  <td>
                      {{pStatement.code}}
                  </td>
                  <td>
                      {{pStatement.description}}
                  </td>
                </tr>
                {% endfor %}
            </table>
        {% endfor %}
    {% endif %}
</div>
`;
