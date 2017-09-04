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
      this._name = name;
      this._model = model;
      this._clauses = clauses;
      this._eventHub = eventHub;
      this._configView;
      this._clausesView;
      this._parentId;
      this._childNodeViews = [];
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

   getChildNodeViews() {
      return this._childNodeViews;
   }

   setParentId(id) {
      this._parentId = id;
   }

   setParentName(name) {
      this._model._iub_parent = name;
   }

   appendChildNode(node) {
      this._childNodeViews.push(node);
      this._childrenContainer.append(node.getDomNode());
      this._childrenSection.show();
   }

   /** 
    * Removes a certain node from the list of child nodes.
    * 
    * Note how there is actually no dom removal performed here!
    * This is because the dom operations performed inside `appendChildNode` already take care of this. 
    * In fact appending a dom node automatically detaches it from its previous location.
    * The browser does it by itself;
    * 
    * @param {NodeView} nodeToRemove
    */
   removeChildNode(nodeToRemove) {
      for (var i = 0; i < this._childNodeViews.length; i++) {
         let node = this._childNodeViews[i];
         if (node.getId() === nodeToRemove.getId()) {
            this._childNodeViews.splice(i, 1);
            break;
         }
      }
      if (this._childNodeViews.length === 0) {
         this._childrenSection.hide();
      }
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

      this._nameInput = this._root.find(".name");
      this._titleInput_IT = this._root.find(".title_it");
      this._titleInput_EN = this._root.find(".title_en");
      this._titleInput_DE = this._root.find(".title_de");
      this._typeInput = this._root.find(".type");


      this._addButton = this._root.find("button.add");
      this._reparentButton = this._root.find("button.reparent");
      this._deleteButton = this._root.find("button.delete");
      this._clausesExpansionButton = this._root.find(".clauses .expand");
      this._configSection = this._root.find(".config");
      this._clausesSection = this._root.find(".clauses");
      this._clausesContainer = this._clausesSection.find(".container");
      this._childrenSection = this._root.find(".children");
      this._childrenContainer = this._childrenSection.find(".container");

      this._loadModelData();
      this._initializeReparentButtonBehaviour();
      this._renderSubViews();
      this._behaviour();

      this._rendered = true;

      return this._root;
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
         this._handleClausesVisibility();
      });

      this._addButton.click((e) => {
         this._eventHub.trigger("please-create-child-node", [this.getId(), this.getName()]);
      });

      this._deleteButton.click((e) => {
         var yes = window.confirm("Are you sure? This cannot be undone.");
         if (yes) {
            this._eventHub.off("config-has-been-updated", this._onConfigUpdatedBound);
            this._eventHub.trigger("please-remove-node", [this.getId()]);
         }
      });

      this._onConfigUpdatedBound = this._onConfigUpdated.bind(this);
      this._eventHub.on("config-has-been-updated", this._onConfigUpdatedBound);

      new Expander(this._root.find(".clauses .expand"), this._root.find(".clauses .container"), "Clauses", false).init();
   }

   _initializeReparentButtonBehaviour() {
      if (!this._model._iub_parent) {
         this._reparentButton.hide();
      } else {
         this._reparentButton.click(() => {
            this._eventHub.trigger("please-show-reparent-node-view", [this]);
         });
      }
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
      this._handleClausesVisibility();
   }

   _handleClausesVisibility() {
      var nodeType = this._getSelectTypeFromModel();
      if (nodeType === "checkbox" || nodeType === "radio") {
         this._clausesSection.show();
      } else {
         this._clausesSection.hide();
         this._clausesView.reset();
      }
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
}

module.exports = NodeView;