import API from 'src/util/api';

/**
 * (string|array) [categories='']:  categories
 * (object) [options]
 * (string) [options.variableName='templates']
 */

module.exports = async function load(categories, options = {}) {
  const { variableName = 'templates' } = options;
  if (typeof categories === 'string') {
    categories = [categories];
  }

  // we check if roc is already defined, in this case
  // we will check if the templates database exists
  var roc = API.cache('roc');

  var templates;
  if (roc) {
    await fetch(`${roc.url}/db/templates/_query/template?key=abcdef`)
      .then(async (result) => {
        if (result.status === 200) {
          templates = await fetchAndLink(`${roc.url}`, categories);
          if (!templates || templates.length === 0) {
            templates = await fetchPublicAndLink(categories);
          }
        } else {
          templates = await fetchPublicAndLink(categories);
        }
      })
      .catch(async () => {
        templates = await fetchPublicAndLink(categories);
      });
  } else {
    templates = await fetchPublicAndLink(categories);
  }

  templates.sort((a, b) => {
    if (a.value.title < b.value.title) return -1;
    if (a.value.title > b.value.title) return 1;
    return 0;
  });

  // could be improved to remember the last selected format
  if (variableName) await API.createData(variableName, templates);

  return templates;
};

// https://www.cheminfo.org/couch/templates-public/_design/customApp/_view/template?reduce=false&startkey=%5B%22admin@cheminfo.org%22%2C%22org.cheminfo%22%5D&endkey=%5B%22admin@cheminfo.org%22%2C%22org.cheminfo.default%22%5D
async function fetchPublicAndLink(categories) {
  if (!Array.isArray(categories)) categories = [categories];
  var templates = [];
  for (let category of categories) {
    let startkey = escape(JSON.stringify(['admin@cheminfo.org', category]));
    let endkey = escape(
      JSON.stringify(['admin@cheminfo.org', `${category}\uFFFF`]),
    );

    let baseUrl = require.s.contexts._.config.baseUrl;

    // if there are //.. it does not work
    let url = `${baseUrl}../../templates-public/_design/customApp/_view/template?reduce=false&startkey=${startkey}&endkey=${endkey}`;

    let response = await fetch(url);
    let results = (await response.json()).rows;
    results.forEach((result) => {
      result.document = {
        type: 'object',
        url: `${baseUrl}../../templates-public/${result.id}`,
      };
    });
    templates.push(...results);
  }
  return templates;
}

async function fetchAndLink(url = 'https://mydb.cheminfo.org', categories) {
  var templates = [];
  for (let category of categories) {
    let startkey = category;
    let endkey = `${category}\uFFFF`;
    let response = await fetch(
      `${url}/db/templates/_query/template?startkey=${startkey}&endkey=${endkey}`,
    );
    let results = await response.json();
    results.forEach((result) => {
      result.document = {
        type: 'object',
        url: `${url}/db/templates/entry/${result.id}`,
      };
    });
    templates.push(...results);
  }
  return templates;
}
