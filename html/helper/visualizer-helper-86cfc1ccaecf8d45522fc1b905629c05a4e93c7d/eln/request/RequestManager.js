import { confirm } from 'src/util/ui';

import Roc from '../../rest-on-couch/Roc';

import Status from './Status';
import processAction from './processAction';

const muteSuccess = { muteSuccess: true };

export default class RequestManager {
  constructor(couchDB, options) {
    options = options || {};
    this.roc = new Roc({
      url: couchDB.url,
      database: couchDB.database,
      kind: 'analysisRequest'
    });
    this.sampleRoc = options.sampleRoc || null;
    this.servicesRoc = options.servicesRoc || null;
    this.servicesView = null;
  }

  getStatus(request) {
    return request.$content.status[0];
  }

  getStatusCode(request) {
    return Number(this.getStatus(request).status);
  }

  async cancel(request) {
    if (this.getStatusCode(request) === 0) {
      return null;
    }
    if (await confirm('cancel request?')) {
      return this.setStatus(request, 0);
    }
    return null;
  }

  async setStatus(request, status) {
    if (typeof status !== 'number') {
      status = Status.getStatusCode(status);
    }
    if (this.getStatusCode(request) === status) {
      return;
    }
    request.$content.status.unshift({
      date: Date.now(),
      status: status
    });
    await this.roc.update(request, muteSuccess);
  }
  async createCustomRequest(sample, options = {}) {
    let groups = options.groups || [];
    if (typeof groups === 'string') groups = [groups];

    const kind = options.kind || '';
    const data = options.data || {};
    const disableNotification = options.disableNotification;
    // allow each lab analytical lab to edit the entry
    for (const group of groups) {
      await this.sampleRoc.addGroup(sample, group, disableNotification);
    }
    // we can only add one request
    const requestObject = {
      $content: {
        productUuid: String(sample._id),
        productId: sample.$id,
        analysis: {
          kind,
          data
        },
        status: [
          {
            date: Date.now(),
            status: 10
          }
        ]
      },
      $owners: groups
    };

    return this.roc.create(requestObject, disableNotification);
  }

  async createRequests(sample, list) {
    const groups = Array.from(new Set(list.map((el) => el.kind)));
    // allow each lab to edit the entry
    for (const group of groups) {
      await this.sampleRoc.addGroup(sample, group, muteSuccess);
    }
    for (const req of list) {
      const requestObject = {
        $content: {
          productUuid: String(sample._id),
          productId: sample.$id,
          analysis: req,
          status: [
            {
              date: Date.now(),
              status: 10
            }
          ]
        },
        $owners: [req.kind]
      };
      await this.roc.create(requestObject, muteSuccess);
    }
  }

  async view(name, options) {
    const viewData = await this.roc.view(name, options);
    viewData.sort(sortRequestsByStatus);
    addChangeListener(viewData);
    return viewData;
  }

  async initServices(name, options) {
    if (this.servicesView) {
      return this.servicesView;
    } else {
      this.servicesView = this.servicesRoc.view(name, options);
      return this.servicesView;
    }
  }

  /**
   *
   * @param {string} scan : either the result of a scan or an uuid
   */
  async getRequest(scan) {
    let uuid = scan.replace(/[^a-z0-9:_]/g, '');
    if (uuid.includes('_')) {
      uuid = uuid.replace(/.*_r:([a-z0-9]*).*/, '$1');
    }
    if (uuid.length === 0) return undefined;
    if (uuid.length !== 32) {
      return undefined;
    }
    return this.roc.document(uuid);
  }

  async getSample(request) {
    return this.sampleRoc.document(request.$content.productUuid);
  }

  async getPrintTemplate(analysis) {
    const experiment = await this.getExperiment(analysis);
    return experiment.twig;
  }

  async getExperiment(analysis) {
    const services = await this.initServices();
    const serviceId = analysis.kind;
    const instrument = analysis.instrument;
    const configName = analysis.configuration;
    return services
      .find((s) => String(s.$id) === String(serviceId))
      .$content.instruments.find((i) => String(i.name) === String(instrument))
      .experiments.find((e) => String(e.name) === String(configName));
  }

  async getUserInfo() {
    return this.roc.getUserInfo();
  }
}

RequestManager.prototype.processAction = processAction;

function addChangeListener(view) {
  const id = view.onChange((event, triggerId) => {
    if (triggerId !== id) {
      updateView(view, id);
    }
  });
  updateView(view, id);
}

function updateView(view, id) {
  view.forEach(updateRequest);
  view.triggerChange(false, id);
}

function updateRequest(request) {
  const lastStatus = request.$content.status[0];
  const status = Status.getStatus(lastStatus.status);
  request.statusText = status[0];
  request.statusColor = status[1];
}

function sortRequestsByStatus(req1, req2) {
  return req1.$content.status[0].status - req2.$content.status[0].status;
}
