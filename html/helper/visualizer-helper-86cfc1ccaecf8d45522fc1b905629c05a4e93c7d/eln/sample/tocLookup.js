import _ from 'lodash';
import ui from 'src/util/ui';

module.exports = {
  choose(entries, options) {
    entries = JSON.parse(JSON.stringify(entries));
    entries.forEach((entry) => {
      entry.names = entry.value.names.join('<br />');
    });

    return ui
      .choose(entries, {
        autoSelect: options.autoSelect,
        noConfirmation: true,
        returnRow: true,
        dialog: {
          width: 1000,
          height: 800
        },
        columns: [
          {
            id: 'code',
            name: 'Code',
            jpath: ['key', '0'],
            maxWidth: 100
          },
          {
            id: 'batch',
            name: 'Batch',
            jpath: ['key', '1'],
            maxWidth: 100
          },
          {
            id: 'names',
            name: 'names',
            jpath: ['names'],
            rendererOptions: {
              forceType: 'html'
            }
          },

          {
            id: 'molfile',
            name: 'Molecule',
            jpath: ['value', 'ocl'],
            rendererOptions: {
              forceType: 'oclid'
            },
            maxWidth: 400
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
