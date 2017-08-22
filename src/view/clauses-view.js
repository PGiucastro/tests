const $ = require('jquery');
const _ = require('underscore');
const templates = require('./templates');

class ClausesView {

   constructor(model) {
      this._model = model;
   }

   render() {
      var tmpl = _.template(templates["clauses-view"]);
      this._root = $(tmpl({
         html: this._createCheckboxesHTML()
      }));
      return this._root;
   }

   toJSON() {
      return this._root.find("input:checked").map((i, el) => {
         return el.name;
      });
   }

   _createCheckboxesHTML() {
      var html = "";
      for (var key in this._model) {
         html += `<label><input name="${key}" type="checkbox" />${key}</label>`;
      }
      return html;
   }
}

module.exports = ClausesView;