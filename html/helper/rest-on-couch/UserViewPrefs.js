define(['../util/getViewInfo'], function (getViewInfo) {
  class UserViewPrefs {
    constructor(roc) {
      this.roc = roc;
    }
    /**
     * Retrieves user preferences related to the current view
     * @param {*} prefID
     * @return {object} preferences
     */
    async get(prefID) {
      let record = await this.getRecord(prefID);
      if (record && record.$content) return record.$content;
      return undefined;
    }

    async getRecord(prefID) {
      if (!prefID) prefID = (await getViewInfo())._id;
      var user = await this.roc.getUser();
      if (!user || !user.username) return undefined;
      var firstEntry = (
        await this.roc.view('entryByOwnerAndId', {
          key: [user.username, ['userViewPrefs', prefID]]
        })
      )[0];
      return firstEntry;
    }

    async set(value, prefID) {
      if (!prefID) prefID = (await getViewInfo())._id;
      let record = await this.getRecord(prefID);
      if (record) {
        record.$content = value;
        return this.roc.update(record);
      } else {
        return this.roc.create({
          $id: ['userViewPrefs', prefID],
          $content: value,
          $kind: 'userViewPrefs'
        });
      }
    }
  }
  return UserViewPrefs;
});
