define(['src/util/ui'], function (UI) {
  async function privacy(cookieName, options = {}) {
    const {
      message = `
        Please note that in order to use this view data WILL BE SUBMITTED to our servers !
    `,
      agree = 'I agree',
      notAgree = 'I don\'t agree',
      dialogOptions = {
        width: 800,
        title: 'Privacy information'
      }
    } = options;

    var prefs = JSON.parse(localStorage.getItem(cookieName) || '{}');
    if (!prefs.validation || !prefs.validation.isValidated) {
      var result = await UI.confirm(message, agree, notAgree, dialogOptions);

      if (!result) {
        document.body.innerHTML = '';
      }

      prefs.validation = {
        isValidated: result,
        date: (new Date()).getTime()
      };
      localStorage.setItem(cookieName, JSON.stringify(prefs));
    }
  }
  return privacy;
});
