const $ = require('jquery');
const templates = require('./../../templates');
const ConfigView = require('./config-view');

class TextConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }

   render() {
      this._root = $(templates["text-config-view"]);
      this._defaultInput = this._root.find("input.default");
      this._validationSelect = this._root.find("select.validation");
      this._loadData();
      this._behaviour();
      return this._root;
   }

   getModel() {
      var validation = this._validationSelect.val();
      this._model.default = this._defaultInput.val();
      this._model._iub_validation = validation;
      return this._model;
   }

   _loadData() {
      this._defaultInput.val(this._model.default);
      this._validationSelect.val(this._model._iub_validation || "-");
   }
}

module.exports = TextConfigView;