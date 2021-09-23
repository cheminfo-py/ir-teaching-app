define(['src/util/ui', 'lodash'], function (UI, _) {
  function editGroups(record, allGroups) {
    const groups = JSON.parse(JSON.stringify(allGroups));
    const groupNames = groups.map((group) => group.name);
    // we will also take the current groups from the record
    const owners = DataObject.resurrect(record.$owners).slice(1); // eslint-disable-line
    const groupsToAdd = _.difference(owners, groupNames);
    for (let group of groupsToAdd) {
      groups.push({ name: group });
    }
    for (let group of groups) {
      if (owners.includes(group.name)) {
        group.checked = true;
        group.previous = true;
      } else {
        group.checked = false;
        group.previous = false;
      }
    }

    return UI.form(
      `
    <div>
    <form>
        <table>
        <tr>
        <th>Groups</th>
        <td>
        {% for group in groups %}
          <div>
            <input type="checkbox" name="groups.{{ loop.index0 }}.checked" />
            <span style="font-weight: bold;">{{group.name}}</span>
            <span>{{ group.description }}</span>
          </div>
        {% endfor %}
        </td>
        </tr>
        </table>
        Add new owner: <input type="text" name="email" placeholder="email or group name" size=40>
        <input type="submit" value="Submit"/>
    </form>
    </div>
`,
      { groups },
      { twig: { groups } }
    ).then(function (result) {
      if (!result) return undefined;
      let groups = result.groups;
      let add = groups.filter((r) => !r.previous && r.checked).map((r) => r.name);
      if (result.email) add.push(result.email);
      return {
        add,
        remove: groups.filter((r) => r.previous && !r.checked).map((r) => r.name)
      };
    });
  }
  return editGroups;
});
