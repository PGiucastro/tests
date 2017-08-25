const $ = require('jquery');
const templates = require('./../../templates');
const ConfigView = require('./config-view');

class CheckboxConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }

   render() {
      this._root = $(templates["checkbox-config-view"]);
      return this._root;
   }
}

module.exports = CheckboxConfigView;