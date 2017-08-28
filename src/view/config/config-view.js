const $ = require('jquery');
const Expander = require('./../expander');

class ConfigView {

   constructor(nodeViewId, model, eventHub) {
      this._nodeViewId = nodeViewId;
      this._model = model;
      this._eventHub = eventHub;
   }

   render() {
      this._root = $("<div class='config-view'></div>");
      return this._root;
   }

   _behaviour() {
      this._root.find("input").on("keyup", () => {
         this._eventHub.trigger("config-updated", [this._nodeViewId, this.getModel()]);
      });

      var expander = new Expander(this._root.find(".expand"), this._root.find("section"), "Configuration", true);
      expander.init();
   }
}

module.exports = ConfigView;