export const style = `
<style>
 #extendedForm {
        padding: 10px;
    }
    #extendedForm .addRow {
        color: green;
        font-weight: bold;
        font-size: 12px;
        padding: .4em .6em;
    }
    #extendedForm .removeRow {
        color: red;
        font-weight: bold;
        font-size: 12px;
        padding: .4em .8em;
    }
    #extendedForm h1 {
        font-size: 16px;
        padding-top: 12px;
        padding-bottom: 4px;
        space
    }
    #extendedForm h2 {
        font-size: 12px;
        margin-top: 12px;
        margin-bottom: 4px;
        space
    }
    #extendedForm input[type=number]{
        width: 60px;
    }
    #extendedForm input, #extendedForm select {
        margin-top: 3px;
        margin-bottom: 3px;
    } 
</style>`;

export const dataNormalization = `
  <h1>Preprocessing</h1>
  <table>
      <tr>
          <th align="left">Filters</th>
          <td>
              <table>
                  <tr>
                      <th></th><th></th>
                      <th>Name</th>
                      <th>Options</th>
                  </tr>
                  <tr data-repeat='normalization.filters'>
                      <td>
                          <select onchange="updateOptions(this);" data-field='name'>
                              <option value=""></option>
                              <option value="centerMean">Center Mean</option>
                              <option value="divideBySD">Divide by SD</option>
                              <option value="divideByMax">Divide by max Y</option>
                              <option value="rescale" data-options="min,max">Rescale (x to y)</option>
                              <option value="normalize" data-options="value">Normalize (sum to n)</option>
                              <option value="multiply" data-options="value">Multiply (value)</option>
                              <option value="add" data-options="value">Add (value)</option>
                              <option value="airplsbaseline" data-options="">AirPLS baseline</option>
                              <option value="rollingaveragebaseline" data-options="">Rolling average baseline</option>
                              <option value="iterativepolynomialbaseline" data-options="">Iterative polynomial baseline</option>
                              <option value="rollingballbaseline" data-options="">Rolling ball basline</option>
                              <option value="rollingmedianbaseline" data-options="">Rolling median baseline</option>
                          </select>
                      </td>
                      <td>
                          <input style="display:none" type='number' placeholder="min" data-field='options.min' size="5">
                          <input style="display:none" type='number' placeholder="max" data-field='options.max' size="5">
                          <input style="display:none" type='number' placeholder="value" data-field='options.value' size="5">
                      </td>
                  </tr>
              </table>
          </td>
      </tr>
      <tr>
          <th align="left">Range:</th>
          <td>
              from: <input type="number" name="normalization.from" step="any"> - 
              to: <input type="number" name="normalization.to" step="any">
          </td>
      </tr>
      <tr>
          <th align="left">Exclusions</th>
          <td>
              <table>
                  <tr>
                      <th></th><th></th>
                      <th>From</th>
                      <th>To</th>
                  </tr>
                  <tr data-repeat='normalization.exclusions'>
                      <td><input type='number' data-field='from' size="5"></td>
                      <td><input type='number' data-field='to' size="5"></td>
                  </tr>
              </table>
          </td>
      </tr>
      <tr>
          <th align="left">Processing:</th>
          <td>
              <select name='normalization.processing'>
                  <option value=""></option>
                  <option value="firstDerivative">First derivative</option>
                  <option value="secondDerivative">Second derivative</option>
                  <option value="thirdDerivative">Third derivative</option>
              </select>
          </td>
      </tr>
      <!--
      <tr>
          <th align="left">Number of points:</th>
          <td>
              <input type='number' name='normalization.numberOfPoints' size="6">
          </td>
      </tr>
      -->
  </table>
  <script>
    function updateOptions(source) {
        let options=source.options[source.options.selectedIndex].getAttribute('data-options');
        let show=options ? options.split(',') : [];
        let optionsElement = $(source).parent().next();
        optionsElement.find('input').hide();
        optionsElement.find('textarea').hide();
        for (let key of show) {
            optionsElement.find('input[placeholder='+key+']').show();
            optionsElement.find('textarea[placeholder='+key+']').show();
        }
    }
  </script>
`;

export const spectraDisplay = `
<h1>Spectra display preferences</h1>

<table>
    <tr>
        <th>Spectra:</th>
        <td>
            <input type='radio' name='display.selection' value='all'>All
            <input type='radio' name='display.selection' value='selected'>Selected
            <input type='radio' name='display.selection' value='none'>None
        </td>
    </tr>
    {% if keepOriginal %}
        <tr>
            <th>Display:</th>
            <td>
                <input type='radio' name='display.original' value='true'> Original data
                <input type='radio' name='display.original' value='false'> Normalized data
            </td>
        </tr>
    {% else %}
        <input type='hidden' name='display.original' value='false'>
    {% endif %}
    <tr>
        <th>Box-plot shadow</th>
        <td>
            <input type="checkbox" name="display.boxplot" checked>
            <span onclick="toggle(this);">▶</span>
            <div style="display: none">
                <b>Box plot preferences:</b><br>
                Q2 stroke width: <input type="number" step="any" style="width:50px" name="display.boxplotOptions.q2StrokeWidth"> - color: <input type="color" name="display.boxplotOptions.q2StrokeColor"><br>
                Q1/Q3 fill opacity: <input type="number" step="any" style="width:50px" name="display.boxplotOptions.q13FillOpacity"> - color: <input type="color" name="display.boxplotOptions.q13FillColor"><br>
                min/max fill opacity: <input type="number" step="any" style="width:50px" name="display.boxplotOptions.minMaxFillOpacity"> - color: <input type="color" name="display.boxplotOptions.minMaxFillColor"><br>
            </div>  
        </td>
    </tr>
    <tr>
        <th>
            Display tracking info:
        </th>
        <td>
            <input type="checkbox" name="display.trackingInfo">
        </td>
    </tr>
    <tr>
        <th>
            Correlation point index:
        </th>
        <td>
            <input type="number" name="display.correlationIndex">
        </td>
    </tr>
</table>

<script>
    function toggle(element) {
        let nextStyle=element.nextElementSibling.style
        if (nextStyle.display==="none") {
            nextStyle.display = "block";
            element.innerHTML='▼';
        } else {
            nextStyle.display = "none";
            element.innerHTML='▶';
        }
    }
</script>
`;

export const displayTwigPreferences = `
<style>
    #displayPreferences select {
        background-color: #DDD;
        font-size: small;
    }
</style>
<div id="displayPreferences">
    Display:
    <select name='display.selection'>
        <option value="">None</option>
        <option value="selected">Selected</option>
        <option value="all">All</option>
    </select>
    
    {% if keepOriginal %}
        — 
        <select name='display.original'>
            <option value="true">Original</option>
            <option value="false">Normalized</option>
        </select>
    {% else %}
        <input type='hidden' name='display.original' value='false'>
    {% endif %}
    
     — 
    
    Box-plot:
    <select name='display.boxplot'>
        <option value="">None</option>
        <option value="selected">Selected</option>
        <option value="all">All</option>
    </select>
        
    <div style="display:none">
        Q2 stroke width: <input type="number" step="any" style="width:50px" name="display.boxplotOptions.q2StrokeWidth"> - color: <input type="color" name="display.boxplotOptions.q2StrokeColor"><br>
        Q1/Q3 fill opacity: <input type="number" step="any" style="width:50px" name="display.boxplotOptions.q13FillOpacity"> - color: <input type="color" name="display.boxplotOptions.q13FillColor"><br>
        min/max fill opacity: <input type="number" step="any" style="width:50px" name="display.boxplotOptions.minMaxFillOpacity"> - color: <input type="color" name="display.boxplotOptions.minMaxFillColor"><br>
    </div>
    
    <label>
        <input type="checkbox" name="display.trackingInfo">
        Tracking info
    </label>
    
    — Correlation:
        <select name='display.correlation'>
            <option value="">None</option>
            <option value="selected">Selected</option>
            <option value="all">All</option>
        </select>
        <input type="hidden" name="display.correlationIndex" step="any" value="{{preferences.display.correlationIndex}}" style="width: 50px">
            
</div>
`;

export const tocOfflineTwig = `
{% if tocClicked %}
{%set data=tocClicked %}
{% endif %}
{% if tocHovered %}
{%set data=tocHovered %}
{% endif %}
{% if tocSample %}
{%set data=tocSample %}
{% endif %}
{%set value=data.value %}
<style>
#toc, #toc tbody  {
    font-size: 1em;
    font-family: Arial, Helvetica, sans-serif;
}
#toc h1 {
    font-size:1.5em;
    text-align: left;
}
#toc h2 {
    font-size:1.2em;
    text-align: center;
}
#toc td,  #toc th {
    vertical-align: top;
    text-align: left;
}
</style>

{% macro showProperties(object) %}
{% if object is iterable %}
    <table>
        {% for key, value in object %}
        <tr>
            <th>{{key}}</th>
            <td>{{ _self.showProperties(value) }}</td>
        </tr>
        {% endfor %}  
    </table>
{% else %}
    {% if object is same as (false) %}
        <span style="color:red">✘</span>︎
    {% elseif object is same as (true) %}
         <span style="color:green">✔</span>
    {% else %}
        {{object}}
    {% endif %}
{% endif %}
{% endmacro %}
{% import _self as macros %}

{% if value %}
<div id='toc'>

<h1>{{value.reference}}</h1>
<h2>{{value.title}}</h2>
<div class="molecule">
    {{rendertype(value.ocl.value,{width:300, height:120, coordinates: value.ocl.coordinates},"oclID")}}
</div>
<table>
    {% if value.misc %}
        <tr>
            <th>Meta information:</th>
            <td>
                {{ macros.showProperties(value.misc) }}
            </td>           
        </tr>
    {% endif %}
</table>
</div>
{% endif %}
`;
