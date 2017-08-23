const templates = require('./templates');
const _ = require('underscore');
const $ = require('jquery');
const ClausesView = require('./clauses-view');

class NodeView {

   constructor(model, clauses, eventHub) {
      this._model = model;
      this._clauses = clauses;
      this._eventHub = eventHub;
      this._clausesView;
   }

   getRootNode() {
      return this._root;
   }

   getModel() {
      var model = this._model;
      model.clauses = this._clausesView.getChosenClausues();
      return model;
   }

   render() {

      var tmpl = _.template(templates["node-view"]);
      this._root = $(tmpl(this._model));

      this._name = this._root.find(".name");
      this._title_it = this._root.find(".title_it");
      this._title_en = this._root.find(".title_en");
      this._title_de = this._root.find(".title_de");
      this._type = this._root.find(".type");
      this._parent = this._root.find(".parent");
      this._deleteButton = this._root.find("button");
      this._clausesExpansionButton = this._root.find(".clauses .expand");
      this._clausesContainer = this._root.find(".clauses .container");

      this._loadModelData();
      this._renderSubViews();
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

      // Uncomment for debugging
      // setInterval(() => {
      //   this._root.find(".model").text(JSON.stringify(this._model, null, "  "));
      // }, 1000);

      // Comment out for debugging
      this._root.find(".model").hide();

      this._clausesExpansionButton.click((e) => {
         this._clausesContainer.toggle();
      });

      this._name.on("keyup", () => {
         this._model.name = this._name.val();
      });

      this._title_it.on("keyup", () => {
         this._model.title_it = this._title_it.val();
      });

      this._title_en.on("keyup", () => {
         this._model.title_en = this._title_en.val();
      });

      this._title_de.on("keyup", () => {
         this._model.title_de = this._title_de.val();
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

   _renderSubViews() {
      this._clausesView = new ClausesView(this._clauses);
      this._clausesContainer.append(this._clausesView.render());
   }

   _loadModelData() {
      this._name.val(this._model.name);
      this._title_it.val(this._model.title_it);
      this._title_en.val(this._model.title_en);
      this._title_de.val(this._model.title_de);
      this._type.val(this._model.type || "-");
   }
}

module.exports = NodeView;