import Sample from './ExtSample';

export async function extSample(options = {}) {
  var sample = new Sample({}, options);
  await sample._initialized;
  return sample;
}
