const templates = require('./templates');

class NodeView {

   constructor(model, eventHub) {
      this._eventHub = eventHub;
      this._model = model;
   }

   render() {
      var tmpl = _.template(templates["node-view"]);
      this._root = $(tmpl(this._model));
      this._name = this._root.find(".name");
      this._title = this._root.find(".title");
      this._type = this._root.find(".type");
      this._deleteButton = this._root.find("button");
      this._behaviour();
      return this._root;
   }

   getData() {
      this._model.name = this._name.val();
      this._model.title = this._title.val();
      this._model.type = this._type.val();
      return this._model;
   }

   _behaviour() {
      this._deleteButton.click((e) => {
         e.preventDefault();
         this._root.remove();
      });
   }
}

module.exports = NodeView;