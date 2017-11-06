const $ = require('jquery');
const _ = require('underscore');
const slug = require('slug');
const templates = require('./../templates');
const ClausesView = require('./clauses-view');
const buildConfigView = require('./config/build-config-view');
const Expander = require('./expander');
const NodesOrderManager = require('./../order/nodes-order-manager');
const scrolling = require('./../utils/scrolling');

class NodeView {

   constructor(id, name, model, clauses, eventHub) {
      this._rendered = false;
      this._root;
      this._id = id;
      this._parentId;
      this._name = name;
      this._lastValidName = name;
      this._model = model;
      this._clauses = clauses;

      this._eventHub = eventHub;

      this._moveUp;
      this._moveDown;
      this._removeFromPositionManager;

      this._configView;
      this._clausesView;

      this._nodeViews = [];
      this._valueViews = [];

      this._nodeViewsOrderManager = new NodesOrderManager([]);
      this._valueViewsOrderManager = new NodesOrderManager([]);

      if (!this._model.title) {
         this._model.title = "";
      }
   }

   getPosition() {
      return this._model._iub_position;
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

   setParentId(id) {
      if (id) {
         this._parentId = id;
      } else {
         delete this._parentId;
      }
   }

   setPosition(index) {
      return this._model._iub_position = index;
   }

   resetPosition() {
      delete this._model._iub_position;
   }

   setMoveUpCommand(f) {
      this._moveUp = f;
   }

   setMoveDownCommand(f) {
      this._moveDown = f;
   }

   setRemoveFromPositionManagerCommand(f) {
      this._removeFromPositionManager = f;
   }

   setParentName(name) {
      if (!name) {
         delete this._model._iub_parent;
      } else {
         this._model._iub_parent = name;
      }
   }

   setName(name) {
      this._name = name;
      this._nameInput.val(this._name);
      this._nameLabel.text(this._name);
   }

   setLastValidName(name) {
      this._lastValidName = name;
   }

   revertNameToLastValidOne() {
      this.setName(this._lastValidName);
   }

   appendNodeView(view) {
      this._nodeViews.push(view);
      this._nodeViewsOrderManager.addNode(view);

      var previousNode = this._nodeViewsOrderManager.getPreviousNode(view);
      var nextNode = this._nodeViewsOrderManager.getNextNode(view);

      view.setMoveUpCommand(this._moveNodeViewUp.bind(this));
      view.setMoveDownCommand(this._moveNodeViewDown.bind(this));
      view.setRemoveFromPositionManagerCommand(this._removeNodeViewFromOrderManager.bind(this));

      if (!previousNode && !nextNode) { // it is the first being added
         this._nodeViewsContainer.append(view.getDomNode());
      } else if (previousNode) {
         view.getDomNode().insertAfter(previousNode.getDomNode());
      } else if (nextNode) {
         view.getDomNode().insertBefore(nextNode.getDomNode());
      }

      this._handleNodeViewsSectionVisibility();
      console.log(this._name + " now references " + this._nodeViews.length + " nodes");
   }

   appendValueView(view) {
      this._valueViews.push(view);
      this._valueViewsOrderManager.addNode(view);

      var previousNode = this._valueViewsOrderManager.getPreviousNode(view);
      var nextNode = this._valueViewsOrderManager.getNextNode(view);

      view.setMoveUpCommand(this._moveValueViewUp.bind(this));
      view.setMoveDownCommand(this._moveValueViewDown.bind(this));
      view.setRemoveFromPositionManagerCommand(this._removeValueViewFromOrderManager.bind(this));

      if (!previousNode && !nextNode) { // it is the first being added
         this._valueViewsContainer.append(view.getDomNode());
      } else if (previousNode) {
         view.getDomNode().insertAfter(previousNode.getDomNode());
      } else if (nextNode) {
         view.getDomNode().insertBefore(nextNode.getDomNode());
      }

      this._handleValueViewsSectionVisibility();
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
         this._nodeViewsOrderManager.removeNode(nodeToRemove);
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
      return type === "checkbox";
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
      this._childrenExclusiveBehaviourCheckbox = this._root.find(".exclusive-behaviour");

      this._upButton = this._root.find("button.up");
      this._downButton = this._root.find("button.down");
      this._addNodeViewButton = this._root.find("button.add-child-node");
      this._addValueViewButton = this._root.find("button.add-value-input");
      this._reparentButton = this._root.find("button.reparent");
      this._deleteButton = this._root.find("button.delete");
      this._clausesExpansionButton = this._root.find(".clauses .expand");
      this._configSection = this._root.find(".config");
      this._clausesSection = this._root.find(".clauses");
      this._clausesContainer = this._clausesSection.find(".box");
      this._nodeViewsSection = this._root.find(".node-views");
      this._nodeViewsContainer = this._nodeViewsSection.find(".box");
      this._valueViewsSection = this._root.find(".value-views");
      this._valueViewsContainer = this._valueViewsSection.find(".box");


      this._loadModelData();
      this._removeTypeOptions();

      var configType = this._typeInput.val();

      this._renderConfigView(configType);
      this._renderClauses();
      this._showTypeLabel();

      this._behaviour();

      this._rendered = true;

      return this._root;
   }

   validate() {

      var valid = true;

      this._removeErrors();

      if ($.trim(this._nameInput.val()) === "") {
         this._nameInput.addClass("error");
         valid = false;
      }

      if ($.trim(this._typeInput.val()) === "-") {
         this._typeInput.addClass("error");
         valid = false;
      }

      if ($.trim(this._titleInput_EN.val()) === "") {
         this._titleInput_EN.addClass("error");
         valid = false;
      }

//      NOT YET
//      if ($.trim(this._titleInput_IT.val()) === "") {
//         this._titleInput_IT.addClass("error");
//         valid = false;
//      }
//
//      if ($.trim(this._titleInput_DE.val()) === "") {
//         this._titleInput_DE.addClass("error");
//         valid = false;
//      }

      if (this._configView) {
         let configValid = this._configView.validate();
         if (!configValid) {
            valid = false;
         }
      }

      return valid;
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

      this._root.click((e) => {
         e.stopPropagation(); // this prevents the event from being fired when clicking on child nodes
         var trg = $(e.target);
         if (trg.is("input, select")) {
            trg.removeClass("error");
         }
      });

      this._root.find(".node-info").click((e) => {
         var trg = $(e.target);
         if (!trg.is("button")) {
            this._root.toggleClass("collapsed");
         }
      });

      this._upButton.click((e) => {
         e.preventDefault();
         this._moveUp(this);
      });

      this._downButton.click((e) => {
         e.preventDefault();
         this._moveDown(this);
      });

      this._nameInput.on("keyup", () => {
         this._name = this._nameInput.val();
         this._nameLabel.text(this._name);
      });

      this._nameInput.on("blur", () => {
         this._eventHub.trigger("node-name-has-been-updated", [this._id, this._name]);
      });

      this._titleInput_EN.on("keyup", () => {
         var currentTitle = this._model.title;
         var newTitle = this._titleInput_EN.val();
         var slagCurrentTitle = slug(currentTitle).toLowerCase();
         var slagNewTitle = slug(newTitle).toLowerCase();
         this._model.title = newTitle;
         this._model._iub_title_en = newTitle;
         if (!this._name ||slagCurrentTitle === this._name) {
            this._name = slagNewTitle;
            this._nameInput.val(slagNewTitle).removeClass("error");
            this._nameLabel.text(slagNewTitle);
         }
      });

      this._titleInput_EN.on("blur", () => {
         this._nameInput.trigger("blur");
      });

      this._titleInput_IT.on("keyup", () => {
         this._model._iub_title_it = this._titleInput_IT.val();
      });

      this._titleInput_DE.on("keyup", () => {
         this._model._iub_title_de = this._titleInput_DE.val();
      });

      this._typeInput.on("change", () => {
         var configType = this._typeInput.val();
         this._setModelTypeFromSelect(configType);
         this._renderConfigView(configType);
      });

      this._childrenExclusiveBehaviourCheckbox.click((e) => {
         var trg = $(e.target);
         if (trg.is(":checked")) {
            this._model._iub_children_exclusive_behaviour = true;
         } else {
            delete this._model._iub_children_exclusive_behaviour;
         }
      });

      this._deleteButton.click((e) => {
         e.preventDefault();
         var yes = window.confirm("Are you sure? This cannot be undone.");
         if (yes) {
            this._removeFromPositionManager(this);
            this._eventHub.off("config-has-been-updated", this._onConfigUpdatedBound);
            this._eventHub.trigger("please-delete-node", [this.getId()]);
         }
      });

      this._reparentButton.click((e) => {
         e.preventDefault();
         this._eventHub.trigger("please-show-reparent-node-view", [this]);
      });

      this._addNodeViewButton.click((e) => {
         e.preventDefault();
         this._eventHub.trigger("please-create-child-node", ["node-view", this.getId(), this.getName()]);
      });

      this._addValueViewButton.click((e) => {
         e.preventDefault();
         this._eventHub.trigger("please-create-child-node", ["value-view", this.getId(), this.getName()]);
      });

      this._onConfigUpdatedBound = this._onConfigUpdated.bind(this);

      this._eventHub.on("config-has-been-updated", this._onConfigUpdatedBound);

      new Expander(this._root.find(".clauses .expand"), this._root.find(".clauses .box"), "Clauses", false).init();
   }

   _removeErrors() {
      this._root.find("input, select").removeClass("error");
   }

   _handleNodeViewsSectionVisibility() {
      if (this._nodeViews.length === 0) {
         this._nodeViewsSection.css("display", "none");
      } else {
         this._nodeViewsSection.css("display", "block");
      }
   }

   _handleValueViewsSectionVisibility() {
      if (this._valueViews.length === 0) {
         this._valueViewsSection.css("display", "none");
      } else {
         this._valueViewsSection.css("display", "block");
      }
   }

   _removeTypeOptions() {
      this._getTypeOptionsToRemove().forEach((value) => {
         this._typeInput.find(`option[value=${value}]`).remove();
      });
   }

   _onConfigUpdated(e, id, configModel) {

      // TODO: here the received config model might contains less properties than the model during the previous update
      // therefore stale data copied over from the previous version config model could remain in the node view model...
      // Address this defect!
      // A good example is the default, validation and triggering value of the radio config view.

      if (id === this._id) {
         for (var p in configModel) {
            this._model[p] = configModel[p];
         }
      }
   }

   _renderClauses() {
      this._clausesView = new ClausesView(this._clauses, this._model.clauses);
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
      this._childrenExclusiveBehaviourCheckbox.prop("checked", this._model._iub_children_exclusive_behaviour);
      this._loadModelType();
   }

   _loadModelType() {
      this._model.type = "boolean";
      this._typeInput.val("checkbox").attr("disabled", true);
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
      return ["number", "text", "radio"];
   }

   _moveNodeViewUp(node) {
      var prevNode = this._nodeViewsOrderManager.getPreviousNode(node);
      if (prevNode) {
         node.getDomNode().insertBefore(prevNode.getDomNode());
         scrolling.scrollToNode(node);
      }
      this._nodeViewsOrderManager.moveNodeToLowerPosition(node);
   }

   _moveNodeViewDown(node) {
      var nextNode = this._nodeViewsOrderManager.getNextNode(node);
      if (nextNode) {
         node.getDomNode().insertAfter(nextNode.getDomNode());
         scrolling.scrollToNode(node);
      }
      this._nodeViewsOrderManager.moveNodeToHigherPosition(node);
   }

   _removeNodeViewFromOrderManager(node) {
      this._nodeViewsOrderManager.removeNode(node);
   }

   _moveValueViewUp(node) {
      var prevNode = this._valueViewsOrderManager.getPreviousNode(node);
      if (prevNode) {
         node.getDomNode().insertBefore(prevNode.getDomNode());
         scrolling.scrollToNode(node);
      }
      this._valueViewsOrderManager.moveNodeToLowerPosition(node);
   }

   _moveValueViewDown(node) {
      var nextNode = this._valueViewsOrderManager.getNextNode(node);
      if (nextNode) {
         node.getDomNode().insertAfter(nextNode.getDomNode());
         scrolling.scrollToNode(node);
      }
      this._valueViewsOrderManager.moveNodeToHigherPosition(node);
   }

   _removeValueViewFromOrderManager(node) {
      this._valueViewsOrderManager.removeNode(node);
   }

   _showTypeLabel() {
      this._root.find(".type-label .type-node").css("display", "inline");
   }
}

module.exports = NodeView;