module.exports = `
{% if meta is empty %}
<span onclick="addParameter(this)" style="font-size: 2em; padding: 10px; color: darkgreen" class="far fa-plus-square"></span>
{% endif %}
<table>
    {% for key, value in meta %}
        <tr data-name="{{key}}">
            <td onclick="addParameter(this)"><span style="color: darkgreen" class="far fa-plus-square"></span></td>
            <td onclick="deleteMeta(this)"><span style="color: darkred" class="far fa-minus-square"></span></td>
            
            <td>{{key}}</td>
            <td><input name="{{key}}"></td>
        </tr>
    {% endfor %} 
</table>

<script>
    var deleteMeta;
    var addParameter;
    require(['jquery', 'src/util/api', 'modules/modulefactory', 'src/util/ui'], function (
      $,
      API,
      Module,
      UI,
    ) {
        deleteMeta = function (target) {
            target=$(target);
            let variableName = target.parent('tr').attr('data-name');
            let sample=API.getData('sample');
            delete sample.$content.general.meta[variableName];
            sample.triggerChange();
            target.parent('tr').remove();
        }
        
        addParameter = async function(target) {
            let parameterName = await UI.enterValue({
                label: 'Enter the parameter name: '
            })
            if (! parameterName) return;
            let sample=API.getData('sample');
            if (! sample.$content.general.meta) {
                sample.setChildSync(['$content', 'general', 'meta'], {});
            }
            sample.setChildSync(['$content', 'general', 'meta', parameterName], '');
        }
    })
</script>
`;
