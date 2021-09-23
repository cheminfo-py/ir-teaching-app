import superagent from 'superagent';

module.exports = function (url) {
  async function makeblastdb(sequences) {
    const res = await superagent.post(`${url}/makeblastdb`).send(sequences);
    return res.body;
  }

  /**
   * Perform a blastn search
   * @param {object} options - blastn options
   * @param {string} options.database - id of the database to query against
   * @param {string} options.query - query (sequence of nucleotides)
   * @return {Promise.<Array>} - An array of hits ordered from the most significative to the least significative
   */
  async function blastn(options) {
    const res = await superagent.post(`${url}/blastn`).send(options);
    return res.body;
  }

  async function createSequencesDatabase(roc) {
    const seqs = await roc.query('dnaSequences');
    const sequences = {};
    seqs.forEach((s) => {
      let val = s.value;
      val.forEach((v) => {
        v.seq.forEach((seq) => {
          if (!sequences[seq.md5]) {
            sequences[seq.md5] = [seq];
          } else {
            sequences[seq.md5].push(seq);
          }
          seq.ref = v.ref;
          seq.document = s.document;
          seq.uuid = s.id;
        });
      });
    });

    const md5s = Object.keys(sequences);

    const toSend = md5s.map((md5) => ({
      id: md5,
      seq: sequences[md5][0].seq
    }));

    const res = await superagent
      .post(`${url}/makeblastdb`)
      .send({ seq: toSend });
    return {
      sequences: sequences,
      database: res.body.database
    };
  }

  async function createFeaturesDatabase(roc) {
    const dnaFeatures = await roc.query('dnaFeatures');
    const features = {};
    dnaFeatures.forEach((q) => {
      // one per couchdb document
      let val = q.value; // one per attachment reference
      val.forEach((v) => {
        v.features.forEach((f) => {
          // one per sequence in the attachments
          if (!features[f.md5]) {
            features[f.md5] = [f];
          } else {
            features[f.md5].push(f);
          }
          f.ref = v.ref;
          f.document = q.document;
          f.uuid = q.id;
        });
      });
    });

    const md5s = Object.keys(features);

    const seq = md5s.map((md5) => ({
      id: md5,
      seq: features[md5][0].seq
    }));

    const res = await superagent.post(`${url}/makeblastdb`).send({ seq });
    return {
      features,
      database: res.body.database
    };
  }

  return {
    createFeaturesDatabase,
    createSequencesDatabase,
    makeblastdb,
    blastn
  };
};
// const url = 'https://www.cheminfo.org/blast-webservice';
