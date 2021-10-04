
import { addType } from 'src/util/typerenderer';

const status = {
  100: {
    description: 'Order to confirm',
    color: 'orange'
  },
  200: {
    description: 'Product to order',
    color: 'lightblue'
  },
  300: {
    description: 'Product ordered',
    color: 'lightblue'
  },
  400: {
    description: 'Product arrived',
    color: 'lightgray'
  },
  500: {
    description: 'Product released',
    color: 'lightgreen'
  },
  600: {
    description: 'Product to revalidate',
    color: 'orange'
  },
  700: {
    description: 'Product refused',
    color: 'pink'
  },
  800: {
    description: 'Product expired',
    color: 'pink'
  },
  900: {
    description: 'Product lost',
    color: 'pink'
  },
  1000: {
    description: 'Product empty',
    color: 'pink'
  }
};

// register type renderer
function toscreen($element, value, root, options) {
  $element.html(getStatusDescription(+value));
  if (options.withColor) {
    $element.css('background-color', getStatusColor(+value));
  }
}

addType('stockstatus', { toscreen });

export function getStatusDescription(code) {
  if (!status[code]) return 'Status does not exist';
  return status[code].description;
}

export function getStatusColor(code) {
  if (!status[code]) return '#FFFFFF';
  return status[code].color;
}

export function getAllStatus() {
  return JSON.parse(JSON.stringify(status));
}
