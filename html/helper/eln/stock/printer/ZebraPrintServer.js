define(['superagent', 'uri/URI'], function (superagent, URI) {
  class ZebraPrintServer {
    constructor(server, opts) {
      this.server = server;
      opts = opts || {};
      if (opts.proxy) {
        this.url = new URI(opts.proxy)
          .addSearch('mac', String(server.macAddress))
          .normalize()
          .href();
      } else {
        throw new Error('zebra printers need a proxy');
      }
    }

    getDeviceIds() {
      return Promise.resolve([this.server.macAddress]);
    }

    async print(id, printData) {
      const url = new URI(this.url)
        .segment('pstprnt')
        .normalize()
        .href();

      return superagent
        .post(url)
        .set('Content-Type', 'text/plain')
        .send(printData);
    }
  }

  return ZebraPrintServer;
});
