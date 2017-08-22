const templates = require('./templates');
const _ = require('underscore');
const $ = require('jquery');

class NodeView {

   constructor(model, eventHub) {
      this._eventHub = eventHub;
      this._model = model;
   }

   getRootNode() {
      return this._root;
   }

   getModel() {
      return this._model;
   }

   render() {

      var tmpl = _.template(templates["node-view"]);
      this._root = $(tmpl(this._model));

      this._name = this._root.find(".name");
      this._title = this._root.find(".title");
      this._type = this._root.find(".type");
      this._parent = this._root.find(".parent");
      this._deleteButton = this._root.find("button");

      this._loadModelData();
      this._behaviour();

      return this._root;
   }

   updateParentSelect(nodes) {

      var i, option, name, id, parentsIds = [];

      this._parent.empty();
      this._parent.append("<option value='-'>-</option>");

      for (var i = 0; i < nodes.length; i++) {

         name = nodes[i].name;
         id = nodes[i].id;

         parentsIds.push(id);

         if (id === this._model.id) {
            continue;
         }

         if (!name) {
            name = "...";
         }
         option = $("<option>" + name + "</option>");
         option.attr("value", id);
         this._parent.append(option);
      }

      if (this._model.parent && parentsIds.indexOf(this._model.parent) > -1) {
         this._parent.val(this._model.parent);
      } else {
         this._parent.val("-");
         this._model.parent = null;
      }
   }

   _behaviour() {

      setInterval(() => {
         this._root.find(".model").text(JSON.stringify(this._model, null, "  "));
      }, 1000);

      this._name.on("keyup", () => {
         this._model.name = this._name.val();
      });

      this._title.on("keyup", () => {
         this._model.title = this._title.val();
      });

      this._type.on("change", () => {
         this._model.type = this._type.val();
      });

      this._parent.on("change", () => {
         this._model.parent = parseInt(this._parent.val());
      });

      this._deleteButton.click((e) => {
         e.preventDefault();
         this._eventHub.trigger("node-removed", this.getModel());
      });

      this._name.on("keyup", (e) => {
         this._eventHub.trigger("node-name-updated", this.getModel());
      });
   }

   _loadModelData() {
      this._name.val(this._model.name);
      this._title.val(this._model.title);
      this._type.val(this._model.type || "-");
   }
}

module.exports = NodeView;