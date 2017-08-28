const $ = require('jquery');
const templates = require('./../../templates');
const ConfigView = require('./config-view');

class RadioConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }

   render() {
      this._root = $(templates["radio-config-view"]);
      this._behaviour();
      return this._root;
   }

   _behaviour() {
      super._behaviour();
   }

   getModel() {
      this._model;
   }
}

module.exports = RadioConfigView;