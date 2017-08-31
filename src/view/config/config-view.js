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
      this._initExpander();

      this._root.find("input").on("keyup", () => {
         this._triggerConfigUpdate();
      });

      this._root.find("select").on("change", () => {
         this._triggerConfigUpdate();
      });
   }

   _triggerConfigUpdate() {
      this._eventHub.trigger("config-has-been-updated", [this._nodeViewId, this.getModel()]);
   }

   _initExpander() {
      new Expander(this._root.find(".expand"), this._root.find("section"), "Configuration", true).init();
   }
}

module.exports = ConfigView;