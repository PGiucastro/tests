const templates = require('./templates');
const _ = require('underscore');
const $ = require('jquery');

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
      this._parent = this._root.find(".parent");
      this._deleteButton = this._root.find("button");

      this._name.val(this._model.name);
      this._title.val(this._model.title);
      this._type.val(this._model.type || "-");

      this._behaviour();
      return this._root;
   }

   getRootNode() {
      return this._root;
   }

   getModel() {
//      this._model.name = this._name.val();
//      this._model.title = this._title.val();
//      this._model.type = this._type.val();
//      this._model.parent = this._parent.val();
      return this._model;
   }

   updateParentSelect(nodes) {
      console.log("update select", this._model.parent);

      var i, option;

      this._parent.empty();
      this._parent.append("<option value='-'>-</option>");

      for (var i = 0; i < nodes.length; i++) {
         option = $("<option>" + nodes[i].name + "</option>");
         option.attr("value", nodes[i].id);
         this._parent.append(option);
      }

      if (this._model.parent) {
         this._parent.val(this._model.parent);
      } else {
         this._parent.val("-");
      }
   }

   _behaviour() {

      this._deleteButton.click((e) => {
         e.preventDefault();
         this._eventHub.trigger("node-removed", this.getModel());
      });

      this._name.on("keyup", (e) => {
         this._eventHub.trigger("node-name-updated", this.getModel());
      });
   }
}

module.exports = NodeView;