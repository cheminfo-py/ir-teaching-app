const STATUS = [
  {
    code: 10,
    label: 'Started',
    color: 'rgba(244,204,204,1)'
  },
  {
    code: 20,
    label: 'Finished',
    color: 'rgba(252,229,205,1)'
  },
  {
    code: 30,
    label: 'Worked up',
    color: 'rgba(255,242,204,1)'
  },
  {
    code: 40,
    label: 'Purified',
    color: 'rgba(217,234,211,1)'
  },
  {
    code: 50,
    label: 'Closed',
    color: 'rgba(206,224,227,1)'
  }
];

function getColor(statusCode) {
  for (let status of STATUS) {
    if (Number(status.code) === Number(statusCode)) {
      return status.color;
    }
  }
  return 'white';
}

function getColorFromReaction(reaction) {
  let status = Number(
    reaction.$content.status &&
      reaction.$content.status[0] &&
      reaction.$content.status[0].code
  );
  return getColor(status);
}

function updateStatuses(statuses) {
  if (!statuses || !Array.isArray(statuses)) return [];
  for (let status of statuses) {
    updateStatus(status);
  }
  return statuses;
}

/*
 * We will migrate all code to a number
 @param {object} status
 @returns {object}
 */
function updateStatus(status) {
  if (isNaN(status.code)) {
    switch (status.code) {
      case 'started':
        status.code = 10;
        break;
      case 'finished':
        status.code = 20;
        break;
      case 'worked-up':
        status.code = 30;
        break;
      case 'purified':
        status.code = 40;
        break;
      case 'closed':
        status.code = 50;
        break;
      default:
    }
  }
  return status;
}

function getLabel(statusCode) {
  for (let status of STATUS) {
    if (Number(status.code) === Number(statusCode)) {
      return status.label;
    }
  }
  return 'white';
}

function getNextStatus(statusCode) {
  for (let i = 0; i < STATUS.length; i++) {
    let status = STATUS[i];
    if (status.code === statusCode && i < STATUS.length - 1) {
      return STATUS[i + 1].code;
    }
  }
  return statusCode;
}

function getForm(currentStatus) {
  return `
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
                ${STATUS.map(
    (item) =>
      `<option value="${item.code}" ${
        item.code === currentStatus ? 'selected' : ''
      }>${item.label}</option>`
  )}
            </select>
            <input type="submit" value="Submit"/>
        </form>
    </div>
`;
}

module.exports = {
  STATUS,
  getColor,
  getLabel,
  getForm,
  getNextStatus,
  getColorFromReaction,
  updateStatus,
  updateStatuses
};
