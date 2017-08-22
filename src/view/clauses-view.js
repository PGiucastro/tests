const $ = require('jquery');
const _ = require('underscore');
const templates = require('./templates');

class ClausesView {

   construct(model) {
      this._model = model;
   }

   render() {
      var tmpl = _.template(templates["clauses-view"]);
      this._root = $(tmpl(this._model));
      return this._root;
   }
}

module.exports = ClausesView;