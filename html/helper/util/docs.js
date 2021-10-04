define(['src/util/ui', './getViewInfo'], function (UI, getViewInfo) {
  let baseUrl = require.s.contexts._.config.baseUrl;

  let pagesURL = `${baseUrl}../../docs/eln/uuid/`;

  async function addFullHelp(options = {}) {
    const { iconSize = 'fa-3x' } = options;
    let target = document.getElementById('modules-grid');
    let div = document.createElement('DIV');
    div.innerHTML = `
      <i style="color: lightgrey; cursor: pointer;" class="fa fa-question-circle ${iconSize}"></i>
      `;
    div.style.zIndex = 99;
    div.style.position = 'fixed';

    div.addEventListener('click', async () => {
      window.open('https://docs.c6h6.org', 'ELN documentation');
    });

    target.prepend(div);
  }

  async function addPageHelp(options = {}) {
    const { iconSize = 'fa-3x' } = options;
    const info =
      options._id === undefined ? await getViewInfo() : { _id: options._id };
    if (!info._id) return;

    const response = await fetch(`${pagesURL + info._id}`, {
      method: 'HEAD'
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
        { width: 950, height: 800, title: 'Information about the page' }
      ).css('overflow', 'hidden');
    });

    target.prepend(div);
  }

  return {
    addPageHelp,
    addFullHelp
  };
});
