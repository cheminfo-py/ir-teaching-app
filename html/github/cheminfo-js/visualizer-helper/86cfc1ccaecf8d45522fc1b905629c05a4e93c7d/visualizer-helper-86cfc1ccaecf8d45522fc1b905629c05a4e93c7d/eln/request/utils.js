"use strict";

define(["exports", "src/main/datas"], function (exports, _datas) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.convertParametersToSchema = convertParametersToSchema;
  exports.getSchemaFromExperiment = getSchemaFromExperiment;
  exports.getServiceAndSetTree = getServiceAndSetTree;

  var _datas2 = _interopRequireDefault(_datas);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var DataBoolean = _datas2["default"].DataBoolean;

  function convertParametersToSchema(parameters) {
    var props = {};

    for (var i = 0; i < parameters.length; i++) {
      var param = parameters[i];

      if (param.variable) {
        var def = {
          type: 'string',
          name: String(param.variable)
        };
        props[param.variable] = def;

        if (param.label) {
          def.label = String(param.label);
        }

        if (param.description) {
          def.title = String(param.description);
        }

        if (param.required) {
          def.required = DataBoolean.cast(param.required);
        }

        if (param.readonly) {
          def.readonly = DataBoolean.cast(param.readonly);
        }

        var type = (param.type ? "".concat(param.type) : 'string').toLowerCase();
        def.type = type;
        var converter = getConverter(type);

        if (param["default"]) {
          def["default"] = converter(String(param["default"]));
        }

        if (param["enum"] && String(param["enum"])) {
          def["enum"] = String(param["enum"]).split(';');
        }
      }
    }

    return {
      type: 'object',
      properties: props
    };
  }

  function getSchemaFromExperiment(experiment) {
    var schema;
    var custom = experiment.customOnde;

    if (custom && String(custom)) {
      schema = JSON.parse(String(custom));
    } else {
      schema = convertParametersToSchema(experiment.parameters);
    }

    return schema;
  }

  function getConverter(type) {
    switch (type) {
      case 'number':
        return Number;

      case 'boolean':
        return castBool;

      default:
        return String;
    }
  }

  function castBool(val) {
    if (!val) return false;
    if (val === '0' || val === 'f' || val === 'false') return false;
    return true;
  }

  function getServiceAndSetTree(services, sets) {
    var treeSets = {
      label: 'Sets',
      children: sets.map(formatSet)
    };
    var treeServices = {
      label: 'Services',
      children: services.map(formatService)
    };
    return {
      children: [treeSets, treeServices]
    };
  }

  function formatSet(theset) {
    return {
      label: theset.$content.name,
      info: theset
    };
  }

  function formatService(service) {
    return {
      label: "".concat(service.$content.name, " (").concat(service.$id, ")"),
      children: service.$content.instruments.map(formatInstrument)
    };

    function formatInstrument(instrument) {
      return {
        label: instrument.name,
        children: instrument.experiments.map(formatExperiment)
      };

      function formatExperiment(experiment) {
        return {
          label: experiment.name,
          info: {
            service: service,
            instrument: instrument,
            experiment: experiment
          }
        };
      }
    }
  }
});