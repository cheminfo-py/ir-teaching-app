import TypeRenderer from 'src/util/typerenderer';

// we systematically add the type renderer
TypeRenderer.addType('requeststatus', {
  toscreen($element, val) {
    let label = Status.getStatusDescription(val);
    let color = Status.getStatusColor(val);
    $element.css('background-color', color);
    $element.html(label);
  }
});

const Status = {};

export default Status;

const status = {
  10: { description: 'Created', color: '#f1f4dc' },
  20: { description: 'Pending', color: '#FFDC00' },
  30: { description: 'Acquiring', color: '#a8d5ff' },
  40: { description: 'Processing', color: '#0074D9' },
  50: { description: 'Finished', color: '#01FF70' },
  80: { description: 'Error', color: '#FF4136' },
  90: { description: 'Cancelled', color: '#AAAAAA' }
};

Status.status = status;

Status.getStatusArray = function getStatusArray() {
  var statusArray = Object.keys(status).map((key) => ({
    code: key,
    description: status[key].description,
    color: status[key].color
  }));
  return statusArray;
};

Status.getStatus = function getStatus(code) {
  if (status[code]) {
    return status[code];
  }
  throw new Error(`No such status: ${code}`);
};

Status.getStatusDescription = function getStatusDescription(code) {
  if (!status[code]) return 'Status does not exist';
  return status[code].description;
};

Status.getStatusColor = function getStatusColor(code) {
  if (!status[code]) return '#FFFFFF';
  return status[code].color;
};

Status.getStatusCode = function getStatusCode(description) {
  for (const key of Object.keys(status)) {
    if (status[key].description === description) {
      return Number(key);
    }
  }
  throw new Error(`No such status: ${description}`);
};
