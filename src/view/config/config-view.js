const $ = require('jquery');
const Expander = require('./../expander');

class ConfigView {

   constructor(nodeViewId, model, eventHub) {
      this._nodeViewId = nodeViewId;
      this._model = model;
      this._eventHub = eventHub;
   }

   getModel() {
      throw "Abstract";
   }

   _behaviour() {
      new Expander(this._root.find(".expand"), this._root.find("section"), "Configuration", true).init();
      this._root.find("input").on("keyup", () => {
         this._eventHub.trigger("config-updated", [this._nodeViewId, this.getModel()]);
      });
   }
}

module.exports = ConfigView;