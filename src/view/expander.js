class Expander {

   constructor(trigger, panel, label, initiallyExpanded) {
      this._trigger = trigger;
      this._panel = panel;
      this._label = label;
      this._initiallyExpanded = initiallyExpanded;
   }

   init() {

      var label;
      this._trigger.text(this._label + " " + (this._initiallyExpanded ? "[-]" : "[+]"));

      this._trigger.click(() => {
         label = this._trigger.text();

         if (label.indexOf("[-]") > -1) {
            label = this._label + " [+]";
         } else {
            label = this._label + " [-]";
         }

         this._trigger.text(label);
         this._panel.slideToggle();
      });
   }
}

module.exports = Expander;