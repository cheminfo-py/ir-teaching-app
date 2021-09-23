/*
Create jsgraph annotations from an array
This method will put the original data in 'info' of the annotations
*/

define(['src/util/api'], function (API) {
  function create(data, variableName, options = {}) {
    const {
      from = (datum) => datum.from,
      to = (datum) => datum.to,
      top = '10px',
      bottom = '20px',
      highlight = (datum) => datum._highlight,
      fillColor = 'red',
      strokeColor = 'red'
    } = options;

    var annotations = [];

    for (let datum of data) {
      annotations.push({
        position: [
          {
            x: typeof from === 'function' ? from(datum) : from,
            y: typeof top === 'function' ? top(datum) : top,
          },
          {
            x: typeof to === 'function' ? to(datum) : to,
            y: typeof bottom === 'function' ? bottom(datum) : bottom,
          }
        ],
        type: 'rect',
        fillColor: typeof fillColor === 'function' ? fillColor(datum) : fillColor,
        strokeColor: typeof strokeColor === 'function' ? strokeColor(datum) : strokeColor,
        _highlight: typeof highlight === 'function' ? highlight(datum) : highlight,
        info: datum
      });
    }
    API.createData(variableName, annotations);
  }

  return create;
});
