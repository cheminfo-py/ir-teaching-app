define([
  'src/util/api',
  './yamlParser',
  'src/util/ui',
  './getViewInfo',
], function (API, yamlParser, UI, getViewInfo) {
  let baseUrl = require.s.contexts._.config.baseUrl;

  let tipsURL = baseUrl + '../../docs/tips/';
  let pagesURL = baseUrl + '../../docs/pages/';
  let minDelayBetweenTips = 4 * 3600 * 1000;

  async function showTips(info) {
    if (!info) info = await getViewInfo();
    if (!info._id) return;

    //  info._id='15c9a2dcd55c963fdedf2c18a1471b03';
    //  info.rev=90;
    // retrieve tips toc
    await fetch(`${tipsURL + info._id}/index.yml`)
      .then(async (response) => {
        let text = await response.text();
        processTipsToc(text, info);
      })
      .catch();
  }

  function processTipsToc(yaml, info) {
    let toc = yamlParser.parse(yaml);
    if (!toc.tips) return;
    let userPrefs = JSON.parse(
      window.localStorage.getItem('tipsPreferences') ||
        '{"lastTip":0, "views":{}}',
    );
    if ((Date.now() - userPrefs.lastTip || 0) < minDelayBetweenTips) return;
    if (!userPrefs.views[info._id]) {
      userPrefs.views[info._id] = { lastIndex: -1 };
    }
    let viewPrefs = userPrefs.views[info._id];
    let tips = toc.tips
      .map((a, index) => {
        a.index = a.index === undefined ? index + 1 : a.index;
        return a;
      })
      .sort((a, b) => a.index - b.index)
      .filter((a) => a.index > viewPrefs.lastIndex)
      .filter((a) => info.rev >= (a.minRev || 0))
      .filter((a) => info.rev <= (a.maxRev || Number.MAX_SAFE_INTEGER));
    if (tips.length > 0) {
      viewPrefs.lastIndex = tips[0].index;
      userPrefs.lastTip = Date.now();
      window.localStorage.setItem('tipsPreferences', JSON.stringify(userPrefs));
      UI.dialog(
        `
            <iframe frameBorder="0" width="100%" height="100%" allowfullscreen="true"
            src="${tipsURL}${info._id}/${tips[0].name}">
        `,
        { width: 800, height: 600, title: 'Did you know ?' },
      );
    }
  }

  async function addPageHelp(options = {}) {
    const { iconSize = 'fa-3x' } = options;
    const info =
      options._id === undefined ? await getViewInfo() : { _id: options._id };
    if (!info._id) return;

    const response = await fetch(`${pagesURL + info._id}/index.html`, {
      method: 'HEAD',
    });
    if (response.status !== 200) return;

    let target = document.getElementById('modules-grid');
    let div = document.createElement('DIV');
    div.innerHTML = `
      <i style="color: lightgrey; cursor: pointer;" class="fa fa-question-circle ${iconSize}"></i>
      `;
    div.style.zIndex = 99;
    div.style.position = 'fixed';

    div.addEventListener('click', () => {
      UI.dialog(
        `
            <iframe frameBorder="0" width="100%" height="100%" allowfullscreen="true"
            src="${pagesURL + info._id}">
        `,
        { width: 1000, height: 800, title: 'Information about the page' },
      ).css('overflow', 'hidden');
    });

    target.prepend(div);

    window.addEventListener(
      'keypress',
      (event) => {
        if (
          event.altKey &&
          event.shiftKey &&
          event.ctrlKey &&
          event.keyCode === 8
        ) {
          UI.dialog(
            `
                <iframe frameBorder="0" width="100%" height="100%" allowfullscreen="true"
                src="${pagesURL + info._id}">
            `,
            { width: 900, height: 700, title: 'Information about the page' },
          );
        }
      },
      false,
    );
  }

  return {
    showTips,
    addPageHelp,
  };
});
