define(['src/util/ui', 'lodash'], function (ui, _) {
  return async function createSample(roc, allGroups) {
    const storageKey = 'eln-new-sample-default-groups';
    var entrysample = { $content: {} };
    var data = { allGroups };
    var toFill = { group: {} };
    const allGroupNames = allGroups.map((g) => g.name);
    let groupPref = localStorage.getItem(storageKey);
    groupPref = groupPref ? JSON.parse(groupPref) : [];
    groupPref = _.intersection(allGroupNames, groupPref);
    groupPref.forEach((group) => (toFill.group[group] = true));
    const result = await ui.form(
      `
              <div>
              <form>
                  <table>
                  <tr>
                  <th align=right>Reference<br><span style='font-size: smaller'>Product code</span></th>
                  <td><input type="text" name="code" pattern="[A-Za-z0-9 .-]{3,}"/></td>
                  </tr>
                  <tr>
                  <th align=right>Batch<br><span style='font-size: smaller'>Batch code</span></th>
                  <td><input type="text" name="batch" pattern="[A-Za-z0-9 .-]*"/></td>
                  </tr>
                  <tr>
                  <th>Groups</th>
                  Select the groups who should have access to the sample. If you don't select any group, only you will have access to it.
                  <td>
                  {% for group in allGroups %}
                    <div>
                      <input type="checkbox" name="group.{{ group.name }}" />
                      <span style="font-weight: bold;">{{group.name}}</span>
                      <span>{{ group.description }}</span>
                    </div>
                  {% endfor %}
                  </td>
                  </tr>
                  </table>
                  <input type="submit" value="Submit"/>
              </form>
              </div>
          `,
      toFill,
      {
        twig: data,
        dialog: {
          width: 500
        }
      }
    );
    if (!result || !result.code || result.batch == null) return undefined;

    const selected = Object.keys(result.group).filter((key) => result.group[key]);

    entrysample.$id = [result.code, result.batch];
    entrysample.$owners = selected;
    localStorage.setItem(storageKey, JSON.stringify(selected));
    return roc.create(entrysample);
  };
});
