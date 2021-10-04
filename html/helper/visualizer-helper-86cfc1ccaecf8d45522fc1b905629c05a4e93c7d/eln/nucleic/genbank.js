import Twig from 'lib/twigjs/twig';
import 'angularplasmid';
import typerenderer from 'src/util/typerenderer';
import $ from 'jquery';

const templateOptions = {
  style: `
        #p1 {border:1px solid #ccc}
        #t1 {fill:#f0f0f0;stroke:#ccc}
        .sminor {stroke:#ccc}
        .smajor {stroke:#f00}
        .sml { fill:#999;font-size:10px }
        .smajorin { stroke:#999 }
        .marker { fill:#fc0;stroke:#fc0 }
        .boundary {stroke-dasharray:2,2;stroke-width:2px}
        .mdlabel {font-size:12px}
        .smlabel {font-size:8px}
        .white {fill:#fff}
        .red {fill:rgb(192,64,64)}
        .purple {fill:rgb(192,64,192)}
        .blue {fill:rgb(64,192,192)}
        .green {fill:rgb(64,192,64)}
        .gold {fill:rgb(192,128,64)}`
};

const template = (options) => {
  options = Object.assign({}, templateOptions, options);
  return `
        {% set p = parsed %}
        {% set features = parsed.features %}
        {% set interval = p.size / 25 %}
        <plasmid plasmidWidth='600' plasmidHeight='600' id='p1' sequencelength='{{ p.size }}' width="600" height="600">
            <style>
                ${options.style}
            </style>
            <plasmidtrack  radius='170' width='50' id='t1'>
                <trackscale class='sminor' interval='20'></trackscale>
                <trackscale class='smajor' interval='{{ interval | round}}' showlabels='1' labelclass='sml'></trackscale>
                <trackscale class='smajorin' interval='{{ interval | round }}' direction='in'></trackscale>
                {% for feature in features %}
                    {% if options.show[feature.type] %}
                <trackmarker class='marker' start='{{ feature.start }}' end='{{ feature.end }}' class='boundary'>
                    <markerlabel text="{{ feature.name }}" style="font-size: 11px"  showline='1' markerstyle='stroke:#000;fill:#f00;'></markerlabel>
                </trackmarker>
                    {% endif %}
                {% endfor %}
                <tracklabel text='{{ p.name }}' style='font-size:25px;font-weight:bold'></tracklabel>
            </plasmidtrack>
        </plasmid>`;
};

export function filterCircular(gb) {
  return gb.filter((seq) => seq.parsedSequence && seq.parsedSequence.circular);
}

export function getFeatureTypes(parsedGb) {
  if (!Array.isArray(parsedGb)) {
    parsedGb = [parsedGb];
  }
  const s = new Set();
  parsedGb.forEach((d) => {
    d.features.forEach((f) => {
      s.add(f.type);
    });
  });
  return Array.from(s);
}

export async function getSvgString(parsedGb, options) {
  // eslint-disable-next-line no-undef
  options = DataObject.resurrect(options);
  const svg = await getSvg(parsedGb, options);
  return $('<div>')
    .append(svg)
    .html();
}

export async function getSvg(parsedGb, options) {
  const tmpl = Twig.twig({
    data: template(templateOptions)
  });

  const render = tmpl.renderAsync({
    parsed: parsedGb,
    options: options
  });
  render.render();
  return compile(render.html);
}

async function compile(val) {
  return new Promise(function (resolve) {
    var $injector = self.angular.injector(['ng', 'angularplasmid']);
    $injector.invoke(function ($rootScope, $compile) {
      const svg = $compile(String(val))($rootScope);
      // TODO: why is this setTimeout needed
      setTimeout(() => resolve(svg), 0);
    });
  });
}

async function plasmidRenderer($element, val, root, options) {
  const svg = await getSvg(val, options);
  $element.html(svg);
}

export function setTypeRenderer(name) {
  typerenderer.addType(name, plasmidRenderer);
}
