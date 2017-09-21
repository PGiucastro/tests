const $ = require('jquery');
const _ = require('underscore');
const templates = require('./../templates');

class ClausesView {

   constructor(clauses, selectedClauses) {
      this._clauses = clauses;
      this._selectedClauses = selectedClauses;
   }

   render() {
      var tmpl = _.template(templates["clauses-view"]);
      this._root = $(tmpl({
         html: this._createCheckboxesHTML()
      }));
      return this._root;
   }

   reset() {
      this._root.find("input").prop("checked", false);
   }

   getChosenClausues() {
      var clauses = [];
      var checked = this._root.find("input:checked");
      for (var i = 0; i < checked.length; i++) {
         clauses.push(checked[i].name);
      }
      return clauses;
   }

   _createCheckboxesHTML() {
      var html = "";
      for (var i = 0, len = this._clauses.length; i < len; i++) {
         let c = this._clauses[i];
         let checkedAttribute;
         if (this._selectedClauses) {
            checkedAttribute = this._selectedClauses.indexOf(c) > -1 ? "checked" : "";
         }
         html += `<div class="form-check">
                     <label class="form-check-label">
                        <input name="${c}" type="checkbox" ${checkedAttribute} class="form-check-input" />
                        ${c}
                     </label>
                  </div>`;
      }
      return html;
   }
}

module.exports = ClausesView;