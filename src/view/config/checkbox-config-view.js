const $ = require('jquery');
const templates = require('./../../templates');

class CheckboxConfigView {

   constructor(model) {
      this._model = model;
   }

   render() {
      this._root = $(templates["checkbox-config-view"]);
      return this._root;
   }
}

module.exports = CheckboxConfigView;