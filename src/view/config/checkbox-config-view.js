const $ = require('jquery');
const templates = require('./../../templates');
const ConfigView = require('./config-view');

class CheckboxConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }

   render() {
      this._root = $(templates["checkbox-config-view"]);
      this._checkedByDefaultCheckbox = this._root.find("input[name='default-checked']");
      this._loadData();
      this._behaviour();
      return this._root;
   }

   validate() {
      return true;
   }

   getModel() {
      var checkedByDefault = this._checkedByDefaultCheckbox.prop("checked");
      
      if (checkedByDefault) {
         this._model.default = "checked";
      } else {
         delete this._model.default;
      }
      return this._model;
   }

   _loadData() {
      if (this._model.default === "checked") {
         this._checkedByDefaultCheckbox.prop("checked", true);
      }
   }
}

module.exports = CheckboxConfigView;