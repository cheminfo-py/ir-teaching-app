import API from 'src/util/api';
import UI from 'src/util/ui';

import Status from './Status';

var roc;
var requestManager;

async function processAction(actionName, actionValue) {
  roc = this.roc;
  requestManager = this;
  switch (actionName) {
    case 'requestFromScan':
      requestFromScan(actionValue);
      break;
    case 'requestFromUUID':
      requestFromScan(actionValue);
      break;
    case 'changeStatus':
      {
        let request = API.getData('request');
        var newStatus = await askNewStatus(request);
        await prependStatus(request, newStatus);
        request.triggerChange();
        API.doAction('refreshRequests');
      }
      break;
    case 'createForm':
      createForm();
      break;
    case 'refreshRequests':
      refreshRequests(API.getData('preferences'));
      break;
    case 'updateFilters':
      refreshRequests(actionValue);
      break;
    case 'bulkChangeStatus':
      await bulkChangeStatus(API.getData('selected'));
      API.doAction('refreshRequests');
      API.createData('status', []);
      API.doAction('setSelected', []);
      break;
    default:
      throw Error(`the action "${actionValue}" is unknown`);
  }
}

async function requestFromScan(scan) {
  var request = await requestManager.getRequest(scan);
  if (!request) {
    API.createData('request', {});
    return;
  }

  API.createData('request', request);
  let requestVar = await API.getVar('request');
  API.setVariable('status', requestVar, ['$content', 'status']);
}

async function refreshRequests(options) {
  var queryOptions = {
    sort: (a, b) => a.value.status.date - b.value.status.date
  };
  if (String(options.group) === 'mine') {
    queryOptions.mine = true;
  } else {
    queryOptions.groups = [String(options.group)];
  }
  if (String(options.status) !== 'any') {
    var statusCode = Status.getStatusCode(String(options.status));
    queryOptions.startkey = [statusCode];
    queryOptions.endkey = [statusCode];
  }
  var results = await roc.query('analysisRequestByKindAndStatus', queryOptions);
  results.forEach((result) => {
    result.color = Status.getStatusColor(Number(result.value.status.status));
  });
  API.createData('requests', results);
}

async function bulkChangeStatus(selected) {
  var newStatus = await askNewStatus();
  for (var requestToc of selected) {
    var request = await roc.document(String(requestToc.id));
    ensureStatus(request);
    await prependStatus(request, newStatus);
  }
}

function ensureStatus(request) {
  if (!request.$content) request.$content = {};
  if (!request.$content.status) request.$content.status = [];
}

async function askNewStatus(request) {
  var currentStatusCode = '';
  if (request) {
    ensureStatus(request);
    let status = request.$content.status;
    currentStatusCode = status.length > 0 ? String(status[0].status) : '';
  }
  var statusArray = Status.getStatusArray();
  var currentStatus = -1;
  statusArray.forEach((item, i) => {
    if (String(currentStatusCode) === item.code) currentStatus = i;
  });
  if (currentStatus < statusArray.length - 1) {
    currentStatus++;
  }

  let newStatus = await UI.form(
    `
        <style>
            #status {
                zoom: 1.5;
            }
        </style>
        <div id='status'>
            <b>Please select the new status</b>
            <p>&nbsp;</p>
            <form>
                <select name="status">
                    ${statusArray.map(
    (item, i) =>
      `<option value="${i}" ${
        i === currentStatus ? 'selected' : ''
      }>${item.description}</option>`
  )}
                </select>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    `,
    {}
  );
  return statusArray[newStatus.status].code;
}

async function prependStatus(request, newStatus) {
  request.$content.status.unshift({
    status: Number(newStatus),
    date: Date.now()
  });
  await roc.update(request);
}

async function createForm() {
  var groups = (await roc.getGroupMembership()).map((g) => g.name);
  var possibleGroups = ['mine'].concat(groups);
  var defaultGroup = window.localStorage.getItem('eln-default-sample-group');
  if (possibleGroups.indexOf(defaultGroup) === -1) {
    defaultGroup = 'all';
  }
  var possibleStatus = ['any'].concat(
    Status.getStatusArray().map((s) => s.description)
  );
  var schema = {
    type: 'object',
    properties: {
      group: {
        type: 'string',
        enum: possibleGroups,
        default: defaultGroup,
        required: true
      },
      status: {
        type: 'string',
        enum: possibleStatus,
        default: '30',
        required: true
      }
    }
  };
  API.createData('formSchema', schema);
}

export default processAction;
