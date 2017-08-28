const $ = require('jquery');
const templates = require('./../../templates');
const ConfigView = require('./config-view');

class TextConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }

   render() {
      this._root = $(templates["text-config-view"]);
      this._defaultInput = this._root.find(".default");
      this._populate();
      this._behaviour();
      return this._root;
   }

   getModel() {
      this._model.default = this._defaultInput.val();
      return this._model;
   }

   _populate() {
      this._defaultInput.val(this._model.default);
   }
}

module.exports = TextConfigView;