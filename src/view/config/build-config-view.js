const $ = require('jquery');
const ConfigView = require('./config-view');
const CheckboxConfigView = require('./checkbox-config-view');
const NumberConfigView = require('./number-config-view');
const RadioConfigView = require('./radio-config-view');
const TextConfigView = require('./text-config-view');

module.exports = function(configType, nodeViewId, nodeModel, eventHub) {

   var view;

   if (configType === "checkbox") {
      view = new CheckboxConfigView(nodeViewId, {
         _iub_checked: nodeModel._iub_checked
      }, eventHub);
   } else if (configType === "number") {
      view = new NumberConfigView(nodeViewId, {
         default: nodeModel.default,
         _iub_min: nodeModel._iub_min,
         _iub_max: nodeModel._iub_max,
         _iub_validation: nodeModel._iub_validation
      }, eventHub);
   } else if (configType === "radio") {
      view = new RadioConfigView(nodeViewId, {
         enum: nodeModel.enum,
         default: nodeModel.default,
         _iub_labels: nodeModel._iub_labels,
         _iub_validation: nodeModel._iub_validation,
         _iub_triggering_value: nodeModel._iub_triggering_value
      }, eventHub);
   } else if (configType === "text") {
      view = new TextConfigView(nodeViewId, {
         default: nodeModel.default,
         _iub_validation: nodeModel._iub_validation
      }, eventHub);
   }

   return view;
};