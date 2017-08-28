const $ = require('jquery');
const templates = require('./../../templates');
const ConfigView = require('./config-view');

class CheckboxConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }

   render() {
      this._root = $(templates["checkbox-config-view"]);
      this._root.hide(); // no config for checkbox so far, so I just hide it.
      return this._root;
   }

   getModel() {
      return {

      };
   }
}

module.exports = CheckboxConfigView;