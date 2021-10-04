import API from 'src/util/api';

import load from './load';

module.exports = async function loadTwig(category, options = {}) {
  const { variableName = 'twigTemplate' } = options;

  try {
    // eslint-disable-next-line no-undef
    let templates = DataObject(await load(category));
    var twigTemplate = await templates.getChild([
      '0',
      'document',
      '$content',
      'twig',
    ]);
    if (variableName) API.createData(variableName, twigTemplate);
    return twigTemplate;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`No twig format found for ${category}`);
    return '';
  }
};
