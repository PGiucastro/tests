const $ = require('jquery');
const CheckboxConfigView = require('./checkbox-config-view');
const NumberConfigView = require('./number-config-view');

module.exports = function(model) {

   console.log(model);

   if (model.type === "boolean") {
      return new CheckboxConfigView({

      });
   } else if (model.type === "number") {
      return new NumberConfigView({
         default: model.default,
         min: model._iub_min,
         max: model._iub_max
      });
   }

   return {
      render: function() {
         return $("<div>default</div>");
      }
   };
};