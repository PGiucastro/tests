const $ = require('jquery');
const _ = require('underscore');
const templates = require('./../templates');

class ClausesView {

   constructor(clauses) {
      this._clauses = clauses;
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
      for (var key in this._clauses) {
         html += `<label><input name="${key}" type="checkbox" />${key}</label>`;
      }
      return html;
   }
}

module.exports = ClausesView;