import API from 'src/util/api';
import fileSaver from 'file-saver';

export async function twigToDoc(moduleID, options = {}) {
  const { filename = 'report.html' } = options;
  const module = API.getModule(moduleID);

  let div = module.domContent[0];
  let canvases = div.querySelectorAll('canvas');

  // clone the original dom, we also need to copy the canvas
  let domCopy = div.firstChild.cloneNode(true);
  let canvasesCopy = domCopy.querySelectorAll('canvas');
  for (let i = 0; i < canvases.length; i++) {
    const png = canvases[i].toDataURL('image/png');
    canvasesCopy[i].parentElement.innerHTML = '<img src="' + png + '" />';
  }

  let svgs = div.querySelectorAll('svg');
  let svgsCopy = domCopy.querySelectorAll('svg');

  const promises = [];

  for (let i = 0; i < svgs.length; i++) {
    const svgDOM = svgs[i];
    const svgDOMCopy = svgsCopy[i];
    const width = svgDOM.clientWidth;
    const height = svgDOM.clientHeight;
    const svgString = svgDOM.parentElement.innerHTML;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const image = new Image();
    const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svg);

    const promise = new Promise((resolve, reject) => {
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
        const png = canvas.toDataURL('image/png');
        svgDOMCopy.parentElement.innerHTML = '<img src="' + png + '" />';
        URL.revokeObjectURL(url);
        resolve();
      };
    });
    promises.push(promise);
    image.src = url;
  }

  await Promise.all(promises);

  const blob = new Blob(['<html>' + domCopy.innerHTML + '</html>'], {
    type: 'text/html'
  });
  fileSaver(blob, filename);
}
