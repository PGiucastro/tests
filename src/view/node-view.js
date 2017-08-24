const _ = require('underscore');
const $ = require('jquery');
const templates = require('./../templates');
const ClausesView = require('./clauses-view');
const buildConfigView = require('./config/build-config-view');

class NodeView {

   constructor(id, name, model, clauses, eventHub) {
      this._id = id;
      this._name = name;
      this._model = model;
      this._clauses = clauses;
      this._eventHub = eventHub;
      this._configView;
      this._clausesView;
      this._parentId;
   }

   getRootNode() {
      return this._root;
   }

   getId() {
      return this._id;
   }

   getParentId() {
      return this._parentId;
   }

   getName() {
      return this._name;
   }

   getParentName() {
      return this.getModel()._iub_parent;
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

   setParentId(id) {
      this._parentId = id;
   }

   setParentSelectValue(parentId) {
      this._parentInput.val(parentId);
   }

   updateParentName(parentId) {
      var parentName;

      if (parentId !== "-") {
         parentName = this._parentInput.find(`option[value=${parentId}]`).text();
         this._model._iub_parent = parentName;
      } else {
         delete this._model._iub_parent;
      }
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
      this._configContainer = this._root.find(".config");
      this._clausesContainer = this._root.find(".clauses .container");

      this._loadModelData();
      this._renderSubViews();
      this._behaviour();

      return this._root;
   }

   drawParentSelect(nodes) {

      var i, option, name, id;

      this._sortByName(nodes);
      this._parentInput.empty();
      this._parentInput.append("<option value='-'>-</option>");

      for (var i = 0; i < nodes.length; i++) {

         id = nodes[i].id;
         name = nodes[i].name;

         if (id === this.getId()) {
            continue;
         }

         if (!name) {
            name = "...";
         }

         option = $("<option>" + name + "</option>");
         option.attr("value", id);
         this._parentInput.append(option);
      }
   }

   _behaviour() {

      // Uncomment for debugging
      setInterval(() => {
         this._root.find(".debugger").text(JSON.stringify({
            id: this._id,
            name: this._name,
            parentId: this._parentId,
            model: this._model
         }, null, "  "));
      }, 1000);

      // Comment out for debugging
      // this._root.find(".model").hide();

      this._clausesExpansionButton.click((e) => {
         this._clausesContainer.toggle();
      });

      this._nameInput.on("keyup", () => {
         this._name = this._nameInput.val();
         this._eventHub.trigger("node-name-updated");
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
         this._model.type = this._getModelTypeFromSelect(this._typeInput.val());
      });

      this._parentInput.on("change", () => {
         var parentId = this._parentInput.val();
         this.setParentId(parentId);
         this.updateParentName(parentId);
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
      this._configView = new buildConfigView(this._model);
      this._clausesView = new ClausesView(this._clauses);
      this._configContainer.append(this._configView.render());
      this._clausesContainer.append(this._clausesView.render());
   }

   _loadModelData() {
      this._nameInput.val(this._name);
      this._titleInput_IT.val(this._model.title_it);
      this._titleInput_EN.val(this._model.title);
      this._titleInput_DE.val(this._model.title_de);
      this._typeInput.val(this._getOptionTypeFromModel() || "-");
   }

   _getOptionTypeFromModel() {
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

      return type;
   }

   _getModelTypeFromSelect(v) {
      var type;

      if (v === "checkbox") {
         type = "boolean";
      } else if (v === "text") {
         type = "string";
      } else if (v === "radio") {
         type = "string";
      } else if (v === "number") {
         type = "number";
      }

      return type;
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