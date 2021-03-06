const $ = require('jquery');
const templates = require('./../../templates');
const ConfigView = require('./config-view');

class RadioConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
      this._counter = 0;
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

      var defaultValue = this._defaultInput.val();
      var validation = this._validationSelect.val();

      if (defaultValue) {
         this._model.default = defaultValue;
      } else {
         delete this._model.default;
      }

      if (validation !== "-") {
         this._model._iub_validation = validation;
      } else {
         delete this._model._iub_validation;
      }

      this._model.enum = [];
      this._model._iub_labels = [];

      var radios = this._radios.find(".choice-box");

      for (var i = 0; i < radios.length; i++) {
         var radio = $(radios[i]);
         this._model.enum.push(radio.find(".choice-value").val());
         this._model._iub_labels.push(radio.find(".choice-label").val());
      }

      return this._model;
   }

   validate() {
      this._removeErrors();

      var valid = true;
      var inputs = this._radios.find("input");
      var radioValues = [];

      for (var i = 0; i < inputs.length; i++) {
         let input = $(inputs[i]);
         if (input.is(".choice-value") && $.trim(input.val() !== "")) {
            radioValues.push(input.val());
         }
         if ($.trim(input.val()) === "") {
            input.addClass("error");
            valid = false;
         }
      }

      if (inputs.length > 0 && this._defaultInput.val() !== "") {
         if (radioValues.indexOf(this._defaultInput.val()) === -1) {
            this._defaultInput.addClass("error");
            valid = false;
         }
      }

      return valid;
   }

   _behaviour() {

      this._initExpander();

      this._root.click((e) => {
         var trg = $(e.target);
         if (trg.is(".add-choice")) {
            this._appendRadio();
         } else if (trg.is(".remove-choice")) {
            this._removeRadio(trg.parents(".choice-box"));
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
      this._counter++;
      var radio = this._proto.clone();
      radio.show();
      radio.removeClass("prototype");
      radio.find(".choice-label").attr("name", "choice-label-" + this._counter);
      radio.find(".choice-value").attr("name", "choice-value-" + this._counter);
      this._radios.append(radio);;
      if (data) {
         radio.find(".choice-label").val(data.label);
         radio.find(".choice-value").val(data.value);
      }
   }

   _removeRadio(el) {
      el.slideUp(() => {
         el.remove();
         this._eventHub.trigger("config-has-been-updated", [this._nodeViewId, this.getModel()]);
      });
   }

   _loadData() {
      this._defaultInput.val(this._model.default);
      this._validationSelect.val(this._model._iub_validation || "-");
      // when a new config view is created there is no `enum` attribute yet, so I need to make the following check
      if (this._model.enum) {
         for (var i = 0; i < this._model.enum.length; i++) {
            this._appendRadio({
               label: this._model._iub_labels[i],
               value: this._model.enum[i]
            });
         }
      }
   }
}

module.exports = RadioConfigView;