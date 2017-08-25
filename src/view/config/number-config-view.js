const $ = require('jquery');
const templates = require('./../../templates');

class NumberConfigView {

   constructor(model) {
      this._model = model;
   }

   render() {
      this._root = $(templates["number-config-view"]);
      this._defaultInput = this._root.find(".default");
      this._minInput = this._root.find(".min");
      this._maxInput = this._root.find(".max");
      this._populate();
      return this._root;
   }

   getModel() {
      this._model.default = this._defaultInput.val();
      this._model.min = this._minInput.val();
      this._model.max = this._maxInput.val();
      return this._model;
   }

   _populate() {
      this._defaultInput.val(this._model.default);
      this._minInput.val(this._model.min);
      this._maxInput.val(this._model.max);
   }
}

module.exports = NumberConfigView;