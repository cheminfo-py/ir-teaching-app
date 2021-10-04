import _ from 'lodash';
import ui from 'src/util/ui';

import chemspider from './chemspider';
import chemexper from './chemexper';
import epfl from './epfl';

const defaultOptions = {
  chemexper: true,
  chemspider: true,
  epfl: false
};

module.exports = {
  chemspider: chemspider,
  chemexper: chemexper,
  epfl: epfl,
  choose(term, options) {
    options = Object.assign({}, defaultOptions, options);
    const sources = [];
    if (options.epfl) {
      sources.push({ promise: epfl.search(term) });
    }
    if (options.chemspider) {
      sources.push({ promise: chemspider.search(term) });
    }
    if (options.chemexper) sources.push({ promise: chemexper.search(term) });
    if (options.roc) {
      const roc = options.roc;
      const rocPromise = roc
        .view('entryByKindAndId', {
          startkey: ['sample', [term]],
          endkey: ['sample', [`${term}\ufff0`, {}]]
        })
        .then((data) => {
          data.forEach((d) => {
            let names = [];
            // we start with the title
            if (d.$content.general && d.$content.general.title) {
              names.push(d.$content.general.title);
            }
            // then the names
            if (d.$content.general && d.$content.general.name > 0) {
              names.push(...d.$content.general.name.map((d) => d.value));
            }
            names.push(d.$id.join(' '));
            if (d.$content.general && d.$content.general.description) {
              names.push(d.$content.general.description);
            }
            d.id = d._id;
            d.source = 'sample';
            d.names = _.uniq(names);
          });
          return data;
        });
      sources.push({ promise: rocPromise });
    }
    return ui
      .choose(sources, {
        autoSelect: options.autoSelect,
        asynchronous: true,
        noConfirmation: true,
        returnRow: true,
        dialog: {
          width: 1000,
          height: 800
        },
        columns: [
          {
            id: 'names',
            name: 'names',
            jpath: [],
            rendererOptions: {
              forceType: 'object',
              twig: `
                        <div style="height: 100%; line-height: initial;">
                        <table style="width: 100%;">
                        {% for n in names %}
                            <tr><td>{{ n }}</td></tr>
                        {% endfor %}
                        </table>
                        </div>
                    `
            }
          },
          {
            id: 'cas',
            name: 'cas',
            jpath: ['$content', 'identifier'],
            rendererOptions: {
              forceType: 'object',
              twig: listTemplate('cas', '.value')
            },
            maxWidth: 100
          },
          {
            id: 'molfile',
            name: 'molfile',
            jpath: ['$content', 'general', 'molfile'],
            rendererOptions: {
              forceType: 'mol2d'
            },
            maxWidth: 250
          },
          {
            id: 'source',
            name: 'source',
            field: 'source',
            maxWidth: 70
          }
        ],
        idField: 'id',
        slick: {
          rowHeight: 150
        }
      })
      .catch(function (e) {
        console.error(e); // eslint-disable-line no-console
        ui.showNotification('search failed', 'error');
      });
  }
};

function listTemplate(val, prop) {
  return `
    <div style="height: 100%; line-height: initial; vertical-align: middle">
        <table style="width: 100%; text-align: center;">
            {% for n in ${val} %}
                <tr><td>{{ n${prop} }}</td></tr>
            {% endfor %}
        </table>
    </div>
    `;
}
