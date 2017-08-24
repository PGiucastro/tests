const $ = require('jquery');
const CheckboxConfigView = require('./checkbox-config-view');

module.exports = function(model) {

   console.log(model);

   if (model.type === "boolean") {
      return new CheckboxConfigView({

      });
   }

   return {
      render: function() {
         return $("<div>default</div>");
      }
   };
};