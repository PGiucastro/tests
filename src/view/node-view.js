const _ = require('underscore');
const $ = require('jquery');
const templates = require('./../templates');
const ClausesView = require('./clauses-view');
const buildConfigView = require('./config/build-config-view');
const Expander = require('./expander');

class NodeView {

   constructor(id, name, model, clauses, eventHub) {
      this._rendered = false;
      this._id = id;
      this._parentId;
      this._name = this._parseName(name);
      this._model = model;
      this._clauses = clauses;

      this._eventHub = eventHub;

      this._configView;
      this._clausesView;

      this._nodeViews = [];
      this._valueViews = [];
   }

   getDomNode() {
      return this._root;
   }

   geOffsetTop() {
      return this._root.offset().top;
   }

   getId() {
      return this._id;
   }

   getParentId() {
      return this._parentId;
   }

   getParentName() {
      return this.getModel()._iub_parent;
   }

   getName() {
      return this._name;
   }

   getSchemaName() {
      return this.getName();
   }

   getModel() {
      return this._model;
   }

   getClauses() {
      return this._clausesView && this._clausesView.getChosenClausues();
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

   setParentName(name) {
      if (!name) {
         delete this._model._iub_parent;
      } else {
         this._model._iub_parent = name;
      }
   }

   appendNodeView(view) {
      this._nodeViews.push(view);
      this._nodeViewsContainer.append(view.getDomNode());
      this._nodeViewsSection.show();
      console.log(this._name + " now references " + this._nodeViews.length + " nodes");
   }

   appendValueView(view) {
      this._valueViews.push(view);
      this._valueViewsContainer.append(view.getDomNode());
      this._valueViewsSection.show();
      console.log(this._name + " now references " + this._valueViews.length + " values");
   }

   /** 
    * Detach a certain node from the list of child nodes.
    * 
    * Note: there is actually no dom removal performed here!!!
    * 
    * This is because the dom operations performed inside `appendNodeView` already take care of this. 
    * In fact appending a dom node automatically detaches it from its previous location.
    * The browser does it by itself;
    * 
    * @param {NodeView} nodeToRemove
    */
   detachNodeView(nodeToRemove) {

      var index = -1;

      for (var i = 0; i < this._nodeViews.length; i++) {
         let node = this._nodeViews[i];
         if (node.getId() === nodeToRemove.getId()) {
            index = i;
            break;
         }
      }

      if (index !== -1) {
         this._nodeViews.splice(index, 1);
      }

      this._handleNodeViewsSectionVisibility();

      console.log(this._name + " has now " + this._nodeViews.length + " children", this._nodeViews.map((n) => {
         return n.getName();
      }));
   }

   notifyOfChildrenDestruction(ids) {
      ids.forEach((id) => {
         for (var i = 0; i < this._nodeViews.length; i++) {
            if (this._nodeViews[i].getId() === id) {
               this._nodeViews.splice(i, 1);
               break;
            }
         }

         for (var i = 0; i < this._valueViews.length; i++) {
            if (this._valueViews[i].getId() === id) {
               this._valueViews.splice(i, 1);
               break;
            }
         }
      });

      console.log("remaining nodes referenced by " + this._name, this._nodeViews.length);
      console.log("remaining values referenced by " + this._name, this._valueViews.length);

      this._handleNodeViewsSectionVisibility();
      this._handleValueViewsSectionVisibility();
   }

   /**
    * Recursively destroy a node and return all the destroyed ids.
    * 
    * @returns {Array}
    */
   destroy() {

      var destroyedIds = [this._id];
      var dom = this.getDomNode();

      dom.slideUp(() => {
         dom.remove();
      });

      for (var j = 0; j < this._nodeViews.length; j++) {
         let ids = this._nodeViews[j].destroy();
         ids.forEach((id) => {
            destroyedIds.push(id);
         });
      }

      for (var j = 0; j < this._valueViews.length; j++) {
         let ids = this._valueViews[j].destroy();
         ids.forEach((id) => {
            destroyedIds.push(id);
         });
      }

      this._nodeViews = [];
      this._valueViews = [];

      return destroyedIds;
   }

   canBeAParentNode() {
      var type = this._getSelectTypeFromModel();
      return type === "checkbox" || type === "radio";
   }

   render() {

      if (this._rendered) {
         throw "Double rendering";
      }

      var tmpl = _.template(templates["node-view"]);
      this._root = $(tmpl({
         id: this._id
      }));

      this._nameLabel = this._root.find(".name-label");
      this._nameInput = this._root.find(".name");
      this._titleInput_IT = this._root.find(".title_it");
      this._titleInput_EN = this._root.find(".title_en");
      this._titleInput_DE = this._root.find(".title_de");
      this._typeInput = this._root.find(".type");

      this._addNodeViewButton = this._root.find("button.add-child-node");
      this._addValueViewButton = this._root.find("button.add-value-input");
      this._reparentButton = this._root.find("button.reparent");
      this._deleteButton = this._root.find("button.delete");
      this._clausesExpansionButton = this._root.find(".clauses .expand");
      this._configSection = this._root.find(".config");
      this._clausesSection = this._root.find(".clauses");
      this._clausesContainer = this._clausesSection.find(".container");
      this._nodeViewsSection = this._root.find(".node-views");
      this._nodeViewsContainer = this._nodeViewsSection.find(".container");
      this._valueViewsSection = this._root.find(".value-views");
      this._valueViewsContainer = this._valueViewsSection.find(".container");

      this._loadModelData();
      this._renderSubViews();
      this._removeTypeOptions();
      this._behaviour();

      this._rendered = true;

      return this._root;
   }

   validate() {
      var result = true;

      this._removeErrors();

      if ($.trim(this._nameInput.val()) === "") {
         this._nameInput.addClass("error");
         result = false;
      }

      if ($.trim(this._typeInput.val()) === "-") {
         this._typeInput.addClass("error");
         result = false;
      }

      if ($.trim(this._titleInput_EN.val()) === "") {
         this._titleInput_EN.addClass("error");
         result = false;
      }

      if ($.trim(this._titleInput_IT.val()) === "") {
         this._titleInput_IT.addClass("error");
         result = false;
      }

      if ($.trim(this._titleInput_DE.val()) === "") {
         this._titleInput_DE.addClass("error");
         result = false;
      }

      return result;
   }

   _removeErrors() {
      this._root.find("input, select").removeClass("error");
   }

   _behaviour() {

      (() => {
         let debuggerBox = this._root.find(".debugger");
         let data;
         if (window.location.href.indexOf("debugger") > -1) {
            setInterval(() => {
               data = this.getData();
               data.parentId = this._parentId;
               let oldJSON = debuggerBox.text();
               let newJSON = JSON.stringify(data, null, "  ");
               if (oldJSON !== newJSON) {
                  debuggerBox.text(newJSON);
               }
            }, 1000);
         } else {
            debuggerBox.hide();
         }
      })();

      this._nameInput.on("keyup", () => {
         this._name = this._nameInput.val();
         this._nameLabel.text(this._name);
         this._eventHub.trigger("node-name-has-been-updated", [this._id, this._name]);
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
         var configType = this._typeInput.val();
         this._setModelTypeFromSelect(configType);
         this._renderConfigView(configType);
      });

      this._deleteButton.click((e) => {
         var yes = window.confirm("Are you sure? This cannot be undone.");
         if (yes) {
            this._eventHub.off("config-has-been-updated", this._onConfigUpdatedBound);
            this._eventHub.trigger("please-delete-node", [this.getId()]);
         }
      });

      this._reparentButton.click(() => {
         this._eventHub.trigger("please-show-reparent-node-view", [this]);
      });

      this._addNodeViewButton.click((e) => {
         this._eventHub.trigger("please-create-child-node", ["node-view", this.getId(), this.getName()]);
      });

      this._addValueViewButton.click((e) => {
         this._eventHub.trigger("please-create-child-node", ["value-view", this.getId(), this.getName()]);
      });

      this._onConfigUpdatedBound = this._onConfigUpdated.bind(this);

      this._eventHub.on("config-has-been-updated", this._onConfigUpdatedBound);

      new Expander(this._root.find(".clauses .expand"), this._root.find(".clauses .container"), "Clauses", false).init();
   }

   _handleNodeViewsSectionVisibility() {
      if (this._nodeViews.length === 0) {
         this._nodeViewsSection.hide();
      }
   }

   _handleValueViewsSectionVisibility() {
      if (this._valueViews.length === 0) {
         this._valueViewsSection.hide();
      }
   }

   _removeTypeOptions() {
      this._getTypeOptionsToRemove().forEach((value) => {
         this._typeInput.find(`option[value=${value}]`).remove();
      });
   }

   _onConfigUpdated(e, id, configModel) {
      if (id === this._id) {
         for (var p in configModel) {
            this._model[p] = configModel[p];
         }
      }
   }

   _renderSubViews() {
      var configType = this._typeInput.val();
      this._renderConfigView(configType);
      this._clausesView = new ClausesView(this._clauses);
      this._clausesContainer.append(this._clausesView.render());
   }

   _renderConfigView(type) {
      if (this._configView) {
         this._deleteCurrentConfigDataFromModel();
      }

      this._configView = buildConfigView(type, this._id, this._model, this._eventHub);

      if (this._configView) { // newly created nodes have empty model so the created config view undefined
         this._configSection.empty().append(this._configView.render());
      }
   }

   _deleteCurrentConfigDataFromModel() {
      var model = this._configView.getModel();
      for (var p in model) {
         delete this._model[p];
      }
   }

   _loadModelData() {
      this._nameLabel.text(this._name);
      this._nameInput.val(this._name);
      this._titleInput_IT.val(this._model.title_it);
      this._titleInput_EN.val(this._model.title);
      this._titleInput_DE.val(this._model.title_de);
      this._typeInput.val(this._getSelectTypeFromModel() || "-");
   }

   _getSelectTypeFromModel() {
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

   _setModelTypeFromSelect(v) {
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

      this._model.type = type;

      if (v === "radio") {
         this._model.enum = [];
      }
   }

   _getTypeOptionsToRemove() {
      return ["number", "text"];
   }

   _parseName(name) {
      return name;
   }
}

module.exports = NodeView;