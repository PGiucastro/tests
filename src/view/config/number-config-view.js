const $ = require('jquery');
const templates = require('./../../templates');
const ConfigView = require('./config-view');

class NumberConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }

   render() {
      this._root = $(templates["number-config-view"]);
      this._defaultInput = this._root.find(".default");
      this._minInput = this._root.find(".min");
      this._maxInput = this._root.find(".max");
      this._populate();
      this._behaviour();
      return this._root;
   }

   getModel() {
      var min = this._minInput.val();
      var max = this._maxInput.val();
      this._model.default = parseInt(this._defaultInput.val());
      this._model._iub_min = parseInt(min) ? parseInt(min) : min;
      this._model._iub_max = parseInt(max) ? parseInt(max) : max;
      return this._model;
   }

   _populate() {
      this._defaultInput.val(this._model.default);
      this._minInput.val(this._model._iub_min);
      this._maxInput.val(this._model._iub_max);
   }
}

module.exports = NumberConfigView;