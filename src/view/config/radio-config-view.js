const $ = require('jquery');
const templates = require('./../../templates');
const ConfigView = require('./config-view');

class RadioConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }
}

module.exports = RadioConfigView;