const $ = require('jquery');
const ConfigView = require('./config-view');
const CheckboxConfigView = require('./checkbox-config-view');
const NumberConfigView = require('./number-config-view');

module.exports = function(nodeViewId, model, eventHub) {

   if (model.type === "boolean") {
      return new CheckboxConfigView(nodeViewId, {}, eventHub);
   } else if (model.type === "number") {
      return new NumberConfigView(nodeViewId, {
         default: model.default,
         _iub_min: model._iub_min,
         _iub_max: model._iub_max
      }, eventHub);
   } else {
      console.warn("no congig view found for model", model);
      return new ConfigView();
   }
};