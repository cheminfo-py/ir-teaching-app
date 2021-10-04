"use strict";

define(['src/util/color'], function (Color) {
  return {
    getChart: function getChart(x, y, options) {
      options = options || {};

      if (x.length !== y.length || y.length === 0) {
        throw new Error('Invalid data length');
      }

      var chart = {
        data: [],
        axis: [{
          label: options.xLabel || ''
        }, {
          label: options.yLabel || ''
        }]
      };
      var species = Object.keys(y[0]);
      var colors = Color.getDistinctColors(species.length);

      for (var i = 0; i < species.length; i++) {
        var data = {};
        chart.data.push(data); // eslint-disable-next-line no-loop-func

        data.y = y.map(function (y) {
          return y[species[i]];
        });

        if (options.xLog) {
          data.x = x.map(function (v) {
            return -Math.log10(v);
          });
        } else {
          data.x = x;
        }

        data.label = species[i];
        data.xAxis = 0;
        data.yAxis = 1;
        data.defaultStyle = {
          lineColor: colors[i],
          lineWidth: 1
        };
      }

      return chart;
    }
  };
});