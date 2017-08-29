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
      this._proto = this._root.find(".prototype");
      this._radios = this._root.find(".radios");
      for (var i = 0; i < this._model.enum.length; i++) {
         this._appendRadio({
            label: this._model.enum[i],
            value: this._model._iub_labels[i]
         });
      }
      return this._root;
   }

   getModel() {
      this._model;
   }

   _behaviour() {
      super._behaviour();
      this._root.click((e) => {
         var trg = $(e.target);
         if (trg.is(".add-choice")) {
            this._appendRadio();
         } else if (trg.is(".remove-choice")) {
            this._removeRadio(trg.parents(".input-wrapper"));
         }
      });
   }

   _appendRadio(data) {
      var radio = this._proto.clone();
      radio.show();
      radio.removeClass("prototype");
      this._radios.append(radio);
      if (data) {
         radio.find(".label").val(data.label);
         radio.find(".value").val(data.value);
      }
   }

   _removeRadio(el) {
      el.slideUp(() => {
         el.remove();
      });
   }
}

module.exports = RadioConfigView;