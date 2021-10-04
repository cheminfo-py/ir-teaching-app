import API from 'src/util/api';

import Roc from '../rest-on-couch/Roc';

export async function preferencesFactory(id, options) {
  const {
    name = 'viewPreferences',
    url = undefined,
    database = 'eln',
    initial = []
  } = options;

  const kind = 'viewPreferences';

  var roc = new Roc({
    url: url,
    database: database,
    kind: kind
  });

  var user = await roc.getUser();
  id += `_${user.username}`;

  var existing = (await roc.view('entryByKindAndId', { key: [kind, id] }))[0];
  var preferenceRoc;
  var rocOptions = {
    varName: name,
    track: true
  };
  if (existing) {
    preferenceRoc = await roc.document(existing._id, rocOptions);
  } else {
    var created = await roc.create({
      $id: id,
      $content: initial,
      $kind: kind
    });
    preferenceRoc = await roc.document(created._id, rocOptions);
  }

  var viewPreferences = new Preference(roc, preferenceRoc);

  await API.cache(name, viewPreferences);
  return viewPreferences;
}

export class Preference {
  constructor(roc, preferenceRoc) {
    this.roc = roc;
    this.preference = preferenceRoc;
  }

  async save() {
    await this.roc.update(this.preference);
  }
}
