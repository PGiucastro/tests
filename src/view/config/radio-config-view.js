const $ = require('jquery');
const templates = require('./../../templates');
const ConfigView = require('./config-view');

class RadioConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }

   render() {
      this._root = $(templates["radio-config-view"]);
      this._proto = this._root.find(".prototype");
      this._defaultInput = this._root.find("input.default");
      this._validationSelect = this._root.find("select.validation");
      this._radios = this._root.find(".radios");
      this._loadData();
      this._behaviour();
      return this._root;
   }

   getModel() {

      var validation = this._validationSelect.val();

      this._model.default = this._defaultInput.val();
      this._model._iub_validation = validation;
      this._model.enum = [];
      this._model._iub_labels = [];

      var radios = this._radios.find(".input-wrapper");

      for (var i = 0; i < radios.length; i++) {
         var radio = $(radios[i]);
         this._model.enum.push(radio.find(".value").val());
         this._model._iub_labels.push(radio.find(".label").val());
      }

      return this._model;
   }

   _behaviour() {

      this._initExpander();

      this._root.click((e) => {
         var trg = $(e.target);
         if (trg.is(".add-choice")) {
            this._appendRadio();
         } else if (trg.is(".remove-choice")) {
            this._removeRadio(trg.parents(".input-wrapper"));
         }
      });

      this._root.on("keyup", (e) => {
         this._triggerConfigUpdate();
      });

      this._root.find("select").on("change", () => {
         this._triggerConfigUpdate();
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
         this._eventHub.trigger("config-updated", [this._nodeViewId, this.getModel()]);
      });
   }

   _loadData() {
      this._defaultInput.val(this._model.default);
      this._validationSelect.val(this._model._iub_validation || "-");
      for (var i = 0; i < this._model.enum.length; i++) {
         this._appendRadio({
            label: this._model._iub_labels[i],
            value: this._model.enum[i]
         });
      }
   }
}

module.exports = RadioConfigView;