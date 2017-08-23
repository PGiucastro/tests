const _ = require('underscore');
const $ = require('jquery');
const templates = require('./../templates');
const ClausesView = require('./clauses-view');

class NodeView {

   constructor(id, name, model, clauses, eventHub) {
      this._id = id;
      this._name = name;
      this._model = model;
      this._clauses = clauses;
      this._eventHub = eventHub;
      this._clausesView;
   }

   getRootNode() {
      return this._root;
   }

   getId() {
      return this._id;
   }

   getName() {
      return this._name;
   }

   getModel() {
      return this._model;
   }

   getClauses() {
      return this._clausesView.getChosenClausues();
   }

   getData() {
      return {
         id: this._id,
         name: this._name,
         model: this._model,
         clauses: this.getClauses()
      };
   }

   render() {

      var tmpl = _.template(templates["node-view"]);
      this._root = $(tmpl({
         id: this._id
      }));

      this._nameInput = this._root.find(".name");
      this._titleInput_IT = this._root.find(".title_it");
      this._titleInput_EN = this._root.find(".title_en");
      this._titleInput_DE = this._root.find(".title_de");
      this._typeInput = this._root.find(".type");
      this._parentInput = this._root.find(".parent");

      this._deleteButton = this._root.find("button");
      this._clausesExpansionButton = this._root.find(".clauses .expand");
      this._clausesContainer = this._root.find(".clauses .container");

      this._loadModelData();
      this._renderSubViews();
      this._behaviour();

      return this._root;
   }

   updateParentSelect(nodes) {

      var i, option, name, id, parentId, parentsIds = [];

      this._parentInput.empty();
      this._parentInput.append("<option value='-'>-</option>");
      this._sortByName(nodes);

      for (var i = 0; i < nodes.length; i++) {

         name = nodes[i].name;
         id = nodes[i].id;

         if (name === this._model._iub_parent) {
            parentId = id;
         }

         if (id === this.getId()) {
            continue;
         }

         parentsIds.push(id);

         if (!name) {
            name = "...";
         }
         option = $("<option>" + name + "</option>");
         option.attr("value", id);
         this._parentInput.append(option);
      }

      if (this._model._iub_parent && parentsIds.indexOf(parentId) > -1) {
         this._parentInput.val(parentId);
      } else {
         this._parentInput.val("-");
         this._model._iub_parent = null;
      }
   }

   _behaviour() {

      // Uncomment for debugging
      // setInterval(() => {
      //   this._root.find(".model").text(JSON.stringify(this._model, null, "  "));
      // }, 1000);

      // Comment out for debugging
      this._root.find(".model").hide();

      this._clausesExpansionButton.click((e) => {
         this._clausesContainer.toggle();
      });

      this._nameInput.on("keyup", () => {
         this._name = this._nameInput.val();
         this._eventHub.trigger("node-name-updated", this.getData());
      });

      this._titleInput_IT.on("keyup", () => {
         this._model._iub_title_it = this._titleInput_IT.val();
      });

      this._titleInput_EN.on("keyup", () => {
         this._model.title = this._titleInput_EN.val();
         this._model._iub_title_en = this._titleInput_EN.val();
      });

      this._titleInput_DE.on("keyup", () => {
         this._model._iub_title_de = this._titleInput_DE.val();
      });

      this._typeInput.on("change", () => {
         this._model.type = this._typeInput.val();
      });

      this._parentInput.on("change", () => {
         this._model._iub_parent = parseInt(this._parentInput.val());
      });

      this._deleteButton.click((e) => {
         e.preventDefault();
         var yes = window.confirm("Are you sure? This cannot be undone.");
         if (yes) {
            this._eventHub.trigger("node-removed", this.getId());
         }
      });
   }

   _renderSubViews() {
      this._clausesView = new ClausesView(this._clauses);
      this._clausesContainer.append(this._clausesView.render());
   }

   _loadModelData() {
      var type;

      if (this._model.type === "boolean") {
         type = "checkbox";
      } else if (this._model.type === "string" && !this._model.enum) {
         type = "text";
      } else if (this._model.type === "string" && this._model.enum) {
         type = "radio";
      } else if (this._model.type === "number") {
         type = "number";
      }

      this._nameInput.val(this._name);
      this._titleInput_IT.val(this._model.title_it);
      this._titleInput_EN.val(this._model.title);
      this._titleInput_DE.val(this._model.title_de);
      this._typeInput.val(type || "-");
   }

   _sortByName(nodes) {
      return nodes.sort((a, b) => {
         if (a.name < b.name) {
            return -1;
         }
         if (a.name > b.name) {
            return 1;
         }
         return 0;
      });
   }
}

module.exports = NodeView;