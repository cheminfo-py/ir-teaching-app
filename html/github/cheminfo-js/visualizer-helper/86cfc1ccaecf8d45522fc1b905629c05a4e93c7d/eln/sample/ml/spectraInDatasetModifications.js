define(['src/util/api', 'src/util/ui'], function (API, UI) {
  async function spectraInDatasetModifications() {
    const spectraProcessor = API.cache('spectraProcessor');
    const roc = API.cache('roc');
    const spectraInDataset = API.getData('spectraInDataset');
    const preferences = JSON.parse(JSON.stringify(API.getData('preferences')));

    let currentIDs = spectraInDataset.map((spectrum) => String(spectrum.id));
    spectraProcessor.removeSpectraNotIn(currentIDs);

    try {
      spectraProcessor.setNormalization(preferences.normalization);
    } catch (e) {
      UI.showNotification(e);
      return;
    }

    let promises = [];
    for (let spectrum of spectraInDataset) {
      let id = String(spectrum.id);
      if (spectraProcessor.contains(id)) {
        let processorSpectrum = spectraProcessor.getSpectrum(id);
        processorSpectrum.meta.color = DataObject.resurrect(spectrum.color);
        processorSpectrum.meta.selected = DataObject.resurrect(
          spectrum.selected,
        );
        processorSpectrum.meta.category = DataObject.resurrect(
          spectrum.category,
        );
        continue;
      }

      if (spectrum.jcamp) {
        promises.push(
          roc
            .getAttachment({ _id: spectrum.sampleID }, spectrum.jcamp.filename)
            .then((jcamp) => {
              spectraProcessor.addFromJcamp(jcamp, {
                id,
                meta: {
                  info: DataObject.resurrect(spectrum.toc),
                  color: DataObject.resurrect(spectrum.color),
                  selected: DataObject.resurrect(spectrum.selected),
                  category: DataObject.resurrect(spectrum.category),
                },
              });
            }),
        );
      } else if (spectrum.data) {
        spectraProcessor.addFromData(DataObject.resurrect(spectrum.data), {
          id,
          meta: {
            ...DataObject.resurrect(spectrum.toc),
            color: DataObject.resurrect(spectrum.color),
            selected: DataObject.resurrect(spectrum.selected),
            category: DataObject.resurrect(spectrum.category),
          },
        });
      }
    }
    if (promises.length) API.createData('chart', {});
    await Promise.all(promises);

    // we need to check if there is a from / to
    const hasFrom = Number.isFinite(preferences.normalization.from);
    const hasTo = Number.isFinite(preferences.normalization.to);
    if (!hasFrom || !hasTo) {
      let prefs = API.getData('preferences');
      let minMaxX = spectraProcessor.getMinMaxX();
      if (minMaxX.min < minMaxX.max) {
        if (!hasFrom) prefs.normalization.from = minMaxX.min;
        if (!hasTo) prefs.normalization.to = minMaxX.max;
        prefs.triggerChange();
      }
    }

    const previousMemoryInfo =
      DataObject.resurrect(API.getData('memoryInfo')) || {};
    let memoryInfo = spectraProcessor.getMemoryInfo();
    if (
      !API.getData('keepOriginal') ||
      memoryInfo.keepOriginal !== previousMemoryInfo.keepOriginal
    ) {
      API.createData('keepOriginal', memoryInfo.keepOriginal);
    }
    API.createData('memoryInfo', memoryInfo);

    // force an update of the chart taking into account the autorefresh
    API.doAction('UpdateChart');
  }
  return spectraInDatasetModifications;
});
