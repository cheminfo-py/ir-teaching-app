import UI from 'src/util/ui';

import { convert } from '../libs/jcampconverter';

async function jcampInfo(value) {
  let jcamp = await DataObject.check(value.jcamp.data, true).get(true);
  let parsed = convert(String(jcamp), {
    withoutXY: true,
    keepRecordsRegExp: /.*/,
  }).flatten[0];

  console.log(parsed);

  let data = [];

  for (let key of Object.keys(parsed.meta)) {
    let value = parsed.meta[key];
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        data.push({ label: `${key}.${i + 1}`, value: value[i] });
      }
    } else {
      data.push({ label: key, value });
    }
  }

  let html = `
        <style>
            #allParameters { 
                width: 100%;
            }
            #allParameters .limited{ 
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            #allParameters pre {
                margin: 0;
            }
            #allParameters td {
                vertical-align: top;
            }
            #allParameters tbody {
                display: block;
                height: 500px;
                overflow-y: auto;
            }
        </style>
        Search parameters: <input type='text' oninput='filter(this)'>
        <table id='allParameters'>
            <tbody>
                ${data
      .map(
        (datum) => `
                    <tr>
                        <td class="limited"><b>${datum.label}</b></td>
                        <td><pre>${datum.value.replace
            ? datum.value.replace(/[\r\n]+$/, '')
            : datum.value
          }</pre></td>
                    </tr>
                `,
      )
      .join('\n')}
            </tbody>
        </table>
        <script>
            function filter(input) {
                let escaped=input.value.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
                let regexp=new RegExp(escaped,'i')
            console.log(regexp);
                let lines=document.getElementById('allParameters').getElementsByTagName('TR');
                for (let line of lines) {
                    let content=line.children[0].innerHTML;
                // console.log(regexp, content, content.match(regexp))
                    if (content.match(regexp) || content.match(/<th>/i)) {
                        line.style.display='';
                    } else {
                        line.style.display='none';
                    }
                }
            }
        </script>
    `;

  UI.dialog(html, {
    width: 800,
    height: 600,
    title: 'List of parameters',
  });
}

module.exports = jcampInfo;
