/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
   "main-view": __webpack_require__(9),
   "node-view": __webpack_require__(10),
   "clauses-view": __webpack_require__(11),
   "checkbox-config-view": __webpack_require__(12),
   "number-config-view": __webpack_require__(13),
   "text-config-view": __webpack_require__(14),
   "radio-config-view": __webpack_require__(15),
   "reparent-node-view": __webpack_require__(16)
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = _;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const $ = __webpack_require__(0);
const Expander = __webpack_require__(5);

class ConfigView {

   constructor(nodeViewId, model, eventHub) {
      this._nodeViewId = nodeViewId;
      this._model = model;
      this._eventHub = eventHub;
   }

   getModel() {
      throw "Abstract";
   }

   validate() {
      throw "Abstract";
   }

   _removeErrors() {
      this._root.find("input, select").removeClass("error");
   }

   _behaviour() {
      this._initExpander();

      this._root.find("input").on("keyup", () => {
         this._triggerConfigUpdate();
      });

      this._root.find("select").on("change", () => {
         this._triggerConfigUpdate();
      });
   }

   _triggerConfigUpdate() {
      this._eventHub.trigger("config-has-been-updated", [this._nodeViewId, this.getModel()]);
   }

   _initExpander() {
      new Expander(this._root.find(".expand"), this._root.find("section"), "Configuration", true).init();
   }
}

module.exports = ConfigView;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const _ = __webpack_require__(2);
const $ = __webpack_require__(0);
const templates = __webpack_require__(1);
const ClausesView = __webpack_require__(17);
const buildConfigView = __webpack_require__(18);
const Expander = __webpack_require__(5);
const NodesOrderManager = __webpack_require__(6);
const scrolling = __webpack_require__(7);

class NodeView {

   constructor(id, name, model, clauses, eventHub) {
      this._rendered = false;
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

      this._upButton = this._root.find("button.up");
      this._downButton = this._root.find("button.down");
      this._addNodeViewButton = this._root.find("button.add-child-node");
      this._addValueViewButton = this._root.find("button.add-value-input");
      this._reparentButton = this._root.find("button.reparent");
      this._deleteButton = this._root.find("button.delete");
      this._addGroupViewButton = this._root.find("button.add-group");
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

         if (trg.is(".buttons") || trg.is(".name-label")) {
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

      this._addGroupViewButton.click((e) => {
         e.preventDefault();
         this._eventHub.trigger("please-create-child-node", ["group-view", this.getId(), this.getName()]);
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
}

module.exports = NodeView;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

class Expander {

   constructor(trigger, panel, label, initiallyExpanded) {
      this._trigger = trigger;
      this._panel = panel;
      this._label = label;
      this._initiallyExpanded = initiallyExpanded;
   }

   init() {

      var label;
      this._trigger.text(this._label + " " + (this._initiallyExpanded ? "[-]" : "[+]"));

      this._trigger.click((e) => {
         e.preventDefault();
         label = this._trigger.text();

         if (label.indexOf("[-]") > -1) {
            label = this._label + " [+]";
         } else {
            label = this._label + " [-]";
         }

         this._trigger.text(label);
         this._panel.slideToggle();
      });
   }
}

module.exports = Expander;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

class NodesOrderManager {

   constructor(nodes) {
      this._maxPosition = 0;
      this._nodes = nodes;
      this._workOutMaxPositionBasedOnModelsData();
   }

   getMaxPosition() {
      return this._maxPosition;
   }

   addNode(node) {
      this._nodes.push(node);
      if (!node.getPosition()) { // fresh node, not previously saved!
         this._maxPosition++;
         node.setPosition(this._maxPosition);
      } else {
         this._workOutMaxPositionBasedOnModelsData();
      }
   }

   getPreviousNode(node) {
      var output;
      var nodePosition = node.getPosition();

      for (var i = 0; i < this._nodes.length; i++) {
         let currentNode = this._nodes[i];
         if (node.getId() !== currentNode.getId()) {
            if (!output && currentNode.getPosition() < nodePosition) {
               output = currentNode;
            } else {
               if (currentNode.getPosition() < nodePosition && currentNode.getPosition() > output.getPosition()) {
                  output = currentNode;
               }
            }
         }
      }

      return output;
   }

   getNextNode(node) {
      var output;
      var nodePosition = node.getPosition();

      for (var i = 0; i < this._nodes.length; i++) {
         let currentNode = this._nodes[i];
         if (node.getId() !== currentNode.getId()) {
            if (!output && currentNode.getPosition() > nodePosition) {
               output = currentNode;
            } else {
               if (currentNode.getPosition() > nodePosition && currentNode.getPosition() < output.getPosition()) {
                  output = currentNode;
               }
            }
         }
      }

      return output;
   }

   removeNode(node) {
      var newNodesList = [];
      var positionOfTheNodeToRemove = node.getPosition();

      this._nodes.forEach((current) => {
         let position = current.getPosition();
         if (node.getId() !== current.getId()) {
            if (position > positionOfTheNodeToRemove) {
               current.setPosition(position - 1);
            }
            newNodesList.push(current);
         }
      });

      this._nodes = newNodesList;
      this._workOutMaxPositionBasedOnModelsData();
   }

   moveNodeToLowerPosition(node) {
      var newPosition = node.getPosition() - 1;
      var effectedNode = this._findNodeByPosition(newPosition);
      if (effectedNode) {
         effectedNode.setPosition(node.getPosition());
         node.setPosition(newPosition);
      }
   }

   moveNodeToHigherPosition(node) {
      var newPosition = node.getPosition() + 1;
      var effectedNode = this._findNodeByPosition(newPosition);
      if (effectedNode) {
         effectedNode.setPosition(node.getPosition());
         node.setPosition(newPosition);
      }
   }

   _workOutMaxPositionBasedOnModelsData() {
      this._maxPosition = 0;
      this._nodes.forEach((n) => {
         let position = n.getPosition();
         if (this._maxPosition < position) {
            this._maxPosition = position;
         }
      });
   }

   _findNodeByPosition(position) {
      for (var i = 0; i < this._nodes.length; i++) {
         let node = this._nodes[i];
         if (node.getPosition() === position) {
            return node;
         }
      }
   }
}

module.exports = NodesOrderManager;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const $ = __webpack_require__(0);

module.exports = {

   scrollToTop: () => {
      $("html, body").animate({
         scrollTop: 0
      }, "slow");
   },

   scrollToBottom: () => {
      $("html, body").animate({
         scrollTop: $(document).height()
      }, "slow");
   },

   scrollToNode: (node) => {
      var px = node.geOffsetTop() - 100;
      $("html, body").animate({
         scrollTop: px
      }, "slow");
   }
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const _ = __webpack_require__(2);
const $ = __webpack_require__(0);
const NodeView = __webpack_require__(4);
const ValueView = __webpack_require__(23);
const GroupView = __webpack_require__(24);
const templates = __webpack_require__(1);
const SchemaBuilder = __webpack_require__(25);
const ReparentNodeView = __webpack_require__(26);
const NodesOrderManager = __webpack_require__(6);
const scrolling = __webpack_require__(7);
const FORBIDDEN_NAME_ERROR_MESSAGE = "You have chosen a name that is forbidden or that is already in use.\n\The name has been reverted to its last valid value.";

class MainView {

   constructor(eventHub, forbiddenNames) {
      this._lastUsedId = 0;
      this._eventHub = eventHub;
      this._forbiddenNames = forbiddenNames;
      this._nodeViews = [];
      this._clausesModel = null;
      this._orderManager = new NodesOrderManager([]);

      this._root = $(templates["main-view"]);
      this._addButton = this._root.find("button.add");
      this._saveButton = this._root.find("button.save");
      this._list = this._root.find(".list");
      this._noNodesYet = this._root.find(".no-nodes-yet");
   }

   static build(forbiddenNames) {
      return new MainView($({}), forbiddenNames);
   }

   /**
    * Validate all data and return a JSON schema in case data are valid.
    * 
    * @returns {Boolean}
    */
   getSchema() {

      for (var i = 0; i < this._nodeViews.length; i++) {
         let node = this._nodeViews[i];
         if (node.validate() === false) {
            scrolling.scrollToNode(node);
            return false;
         }
      }

      var sb = new SchemaBuilder(this._nodeViews);
      return sb.build();
   }

   render(schema, clauses) {

      var nodes = schema.properties;

      this._clausesModel = clauses;

      for (var name in nodes) {
         let type = this._getTypeByModel(nodes[name]);
         this._buildNode(type, String(this._getNextId()), name, nodes[name]);
      }

      this._setNodeViewsParentId(); // only done at startup to map parents names (available in the model) onto ids (assigned to nodes at runtime)

      for (var i = 0; i < this._nodeViews.length; i++) {
         let type = this._getTypeByModel(this._nodeViews[i].getModel());
         this._renderNode(type, this._nodeViews[i]);
      }

      this._reparentNodeview = new ReparentNodeView(this._eventHub);
      this._root.append(this._reparentNodeview.render());
      this._reparentNodeview.hide();
      this._handleNoNodesYetMessage();
      this._behaviour();

      return this._root;
   }

   _behaviour() {

      this._saveButton.click((e) => {
         e.preventDefault();
         console.log(JSON.stringify(this.getSchema(), null, "   "));
      });

      this._addButton.click((e) => {
         e.preventDefault();
         var newNode = this._buildNode("node-view", String(this._getNextId()), "", {});
         this._renderNode("node-view", newNode);
         this._handleNoNodesYetMessage();
         scrolling.scrollToBottom();
      });

      this._eventHub.on("please-delete-node", (e, id) => {
         var viewToDestroy = this._getViewById(id);
         var parentView = this._getViewByName(viewToDestroy.getParentName());
         var ids = viewToDestroy.destroy(true);
         console.warn("removed ones", ids);

         ids.forEach((id) => {
            for (var i = 0; i < this._nodeViews.length; i++) {
               if (this._nodeViews[i].getId() === id) {
                  this._nodeViews.splice(i, 1);
                  break;
               }
            }
         });

         if (parentView) {
            parentView.notifyOfChildrenDestruction(ids);
            scrolling.scrollToNode(parentView);
         }

         this._handleNoNodesYetMessage();

         console.log("remaining nodes and values referenced by main-view", this._nodeViews.length);
      });

      this._eventHub.on("node-name-has-been-updated", (e, id, newName) => {
         var node;
         var valid = this._validateNodeName(id, newName);
         if (valid) {
            this._getViewById(id).setLastValidName(newName);
            for (var i = 0; i < this._nodeViews.length; i++) {
               node = this._nodeViews[i];
               if (node.getParentId() === id) {
                  node.setParentName(newName);
               }
            }
         } else {
            this._getViewById(id).revertNameToLastValidOne();
            alert(FORBIDDEN_NAME_ERROR_MESSAGE);
         }
      });

      this._eventHub.on("please-create-child-node", (e, type, parentNodeId, parentNodeName) => {
         var newNode = this._buildNode(type, String(this._getNextId()), "", {});
         newNode.setParentId(parentNodeId);
         newNode.setParentName(parentNodeName);
         this._renderNode(type, newNode);
         scrolling.scrollToNode(newNode);
      });

      this._eventHub.on("please-show-reparent-node-view", (e, node) => {
         console.log("show reparent view for view " + node.getName());
         this._reparentNodeview.setNodeToBeReparented(node);
         this._reparentNodeview.show(this._nodeViews);
      });

      this._eventHub.on("please-reparent-this-node-view", (e, nameOfNodeToReparent, currentParentName, newParentName) => {
         console.log("node to reparent", nameOfNodeToReparent);
         console.log("from", currentParentName);
         console.log("to", newParentName);

         let nodeToReparent = this._getViewByName(nameOfNodeToReparent);
         let currentParentView = this._getViewByName(currentParentName);
         let newParentView = this._getViewByName(newParentName);

         if (currentParentView) { // the node might be a root one, in which case no current parent exists.
            currentParentView.detachNodeView(nodeToReparent);
         } else {
            this._orderManager.removeNode(nodeToReparent);
         }

         nodeToReparent.resetPosition();

         if (!newParentView) { // it has been asked to make it a root node
            this._orderManager.addNode(nodeToReparent);
            nodeToReparent.setParentId(null);
            nodeToReparent.setParentName(null);
            nodeToReparent.setMoveDownCommand(this._moveNodeDown.bind(this));
            nodeToReparent.setMoveUpCommand(this._moveNodeUp.bind(this));
            nodeToReparent.setRemoveFromPositionManagerCommand(this._removeFromOrderManager.bind(this));
            this._list.append(nodeToReparent.getDomNode());
         } else {
            nodeToReparent.setParentId(newParentView.getId());
            nodeToReparent.setParentName(newParentName);
            newParentView.appendNodeView(nodeToReparent);
         }

         scrolling.scrollToNode(nodeToReparent);
      });
   }

   _validateNodeName(id, name) {
      var node;

      if (this._forbiddenNames.indexOf($.trim(name).toLowerCase()) > -1) {
         return false;
      }

      for (var i = 0; i < this._nodeViews.length; i++) {
         node = this._nodeViews[i];
         if (node.getId() !== id) {
            if (node.getName() === name) {
               return false;
            }
         }
      }
      return true;
   }

   _buildNode(type, id, name, nodeModel) {
      var nodeView;
      if (type === "node-view") {
         nodeView = new NodeView(id, name, nodeModel, this._clausesModel, this._eventHub);
      } else if (type === "value-view") {
         nodeView = new ValueView(id, name, nodeModel, this._clausesModel, this._eventHub);
      } else if (type === "group-view") {
         nodeView = new GroupView(id, name, nodeModel, this._clausesModel, this._eventHub);
      } else {
         throw `Unknown type [${type}]`;
      }
      this._nodeViews.push(nodeView);
      return nodeView;
   }

   _moveNodeUp(node) {
      var prevNode = this._orderManager.getPreviousNode(node);
      if (prevNode) {
         node.getDomNode().insertBefore(prevNode.getDomNode());
         scrolling.scrollToNode(node);
      }
      this._orderManager.moveNodeToLowerPosition(node);
   }

   _moveNodeDown(node) {
      var nextNode = this._orderManager.getNextNode(node);
      if (nextNode) {
         node.getDomNode().insertAfter(nextNode.getDomNode());
         scrolling.scrollToNode(node);
      }
      this._orderManager.moveNodeToHigherPosition(node);
   }

   _removeFromOrderManager(node) {
      this._orderManager.removeNode(node);
   }

   _renderNode(type, node) {
      var parentId = node.getParentId();
      var parent = this._getViewById(parentId);
      var previousNode;
      var nextNode;

      node.render();

      if (parent) {
         if (type === "node-view" || type === "group-view") {
            parent.appendNodeView(node);
         } else if (type === "value-view") {
            parent.appendValueView(node);
         } else {
            throw `Unknown type [${type}]`;
         }
      } else {
         node.setMoveDownCommand(this._moveNodeDown.bind(this));
         node.setMoveUpCommand(this._moveNodeUp.bind(this));
         node.setRemoveFromPositionManagerCommand(this._removeFromOrderManager.bind(this));
         this._orderManager.addNode(node);
         previousNode = this._orderManager.getPreviousNode(node);
         nextNode = this._orderManager.getNextNode(node);
         if (!previousNode && !nextNode) { // it is the first being added
            this._list.append(node.getDomNode());
         } else if (previousNode) {
            node.getDomNode().insertAfter(previousNode.getDomNode());
         } else if (nextNode) {
            node.getDomNode().insertBefore(nextNode.getDomNode());
         }
      }
   }

   _handleNoNodesYetMessage() {
      if (this._nodeViews.length === 0) {
         this._noNodesYet.show();
      } else {
         this._noNodesYet.hide();
      }
   }

   _getViewByName(name) {
      for (var i = 0; i < this._nodeViews.length; i++) {
         var view = this._nodeViews[i];
         if (view.getName() === name) {
            return view;
         }
      }
   }

   _getViewById(id) {
      for (var i = 0; i < this._nodeViews.length; i++) {
         var view = this._nodeViews[i];
         if (view.getId() === id) {
            return view;
         }
      }
   }

   _doesViewExists(id) {
      for (var i = 0; i < this._nodeViews.length; i++) {
         var view = this._nodeViews[i];
         if (view.getId() === id) {
            return view;
         }
      }
   }

   _setNodeViewsParentId() {
      for (var i = 0; i < this._nodeViews.length; i++) {
         var view = this._nodeViews[i];
         var parentName = view.getParentName();
         var parentId;
         if (parentName) {
            if (!this._getViewByName(parentName)) {
               debugger
            }
            parentId = this._getViewByName(parentName).getId();
         }
         view.setParentId(parentId);
      }
   }

   _getNextId() {
      this._lastUsedId++;
      return this._lastUsedId;
   }

   _getTypeByModel(model) {
      if (model.type === "group") {
         return "group-view";
      }
      return model.type === "boolean" ? "node-view" : "value-view";
   }
}

module.exports = MainView;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-view\">\n\n   <header class=\"main-header\">\n      <button class=\"add btn btn-primary\">Add new node</button>\n      <button class=\"save btn btn-primary\">Save schema</button>\n   </header>\n\n   <div class=\"no-nodes-yet alert alert-warning\">there are no nodes yet</div>\n\n   <div class=\"list\"></div>\n\n</div>"

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "<div class=\"node-view container-fluid\" data-node-view-id=\"<%= id %>\">\n\n   <nav class=\"row\">\n\n      <div class=\"col-md-6\">\n         <span class=\"name-label\"></span>\n      </div>\n\n      <div class=\"buttons text-right col-md-6\">\n         <button class=\"up btn\">Move Up</button>\n         <button class=\"down btn\">Move Down</button>\n         <button class=\"add-child-node btn\">Add child node</button>\n         <button class=\"add-value-input btn\">Add value input</button>\n         <button class=\"add-group btn\">Add exclusive checkbox group</button>\n         <button class=\"reparent btn\">Reparent</button>\n         <button class=\"delete btn\">Delete</button>\n      </div>\n\n   </nav>\n\n   <div class=\"debugger row\"></div>\n\n   <div class=\"row\">\n\n      <div class=\"col-md-4\">\n         <div class=\"form-group\">\n            <label>Name</label>\n            <input name=\"name\" type='text' class='name form-control' />\n         </div>\n\n         <div class=\"form-group\">\n            <label>Type</label>\n            <select name=\"type\" class='type form-control'>\n               <option value=\"-\">-</option>\n               <option value=\"checkbox\">checkbox</option>\n               <option value=\"radio\">radio</option>\n               <option value=\"text\">text</option>\n               <option value=\"number\">number</option>\n            </select>\n         </div>\n\n         <div class=\"config\"></div>\n      </div>\n\n      <div class=\"col-md-4\">\n         <div class=\"form-group\">\n            <label>Title (IT)</label>\n            <input name=\"title_it\" type='text' class='title_it form-control' />\n         </div>\n\n         <div class=\"form-group\">\n            <label>Title (EN)</label>\n            <input name=\"title_en\" type='text' class='title_en form-control' />\n         </div>\n\n         <div class=\"form-group\">\n            <label>Title (DE)</label>\n            <input name=\"title_de\" type='text' class='title_de form-control' />\n         </div>\n      </div>\n\n   </div>\n\n   <div class=\"clauses\">\n      <button class=\"expand btn\"></button>\n      <div class=\"box\"></div>\n   </div>\n\n   <div class=\"value-views\">\n      <div class=\"box\"></div>\n   </div>\n\n   <div class=\"node-views\">\n      <div class=\"box\"></div>\n   </div>\n\n</div>"

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "<div class=\"clauses-view\">\n   <%= html %>\n</div>"

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "<div class=\"config-view checkbox-config-view\">\n   <header class=\"expand\"></header>\n\n   <section>\n   </section>\n\n</div>"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "<div class=\"config-view number-config-view\">\n\n   <button class=\"expand btn\"></button>\n\n   <section>\n      <div class=\"form-group\">\n         <label>Default</label>\n         <input type='text' name=\"default\" class='default form-control' />\n      </div>\n\n      <div class=\"form-group\">\n         <label>Min</label>\n         <input type='text' name=\"min\" class='min form-control' />\n      </div>\n\n      <div class=\"form-group\">\n         <label>Max</label>\n         <input type='text' name=\"max\" class='max form-control' />\n      </div>\n   </section>\n\n</div>"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "<div class=\"config-view text-config-view\">\n\n   <button class=\"expand btn\"></button>\n\n   <section>\n\n      <div class=\"form-group\">\n         <label>Validation type</label>\n         <select name=\"validation\" class=\"validation form-control\">\n            <option value=\"-\">-</option>\n            <option value=\"required\">required</option>\n         </select>\n      </div>\n\n      <div class=\"form-group\">\n         <label>Default</label>\n         <input type='text' name=\"default\" class='default form-control' />\n      </div>\n   </section>\n\n</div>"

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "<div class=\"config-view radio-config-view\">\n\n   <button class=\"expand btn\"></button>\n\n   <div class=\"prototype choice-box\" style=\"display: none\">\n      <div class=\"form-group\">\n         <label>Label</label>\n         <input type=\"text\" name=\"choice-label\" class=\"choice-label form-control\" />\n      </div>\n      <div class=\"form-group\">\n         <label>Value</label>\n         <input type=\"text\" name=\"choice-value\" class=\"choice-value form-control\" />\n      </div>    \n      <span class=\"remove-choice\">remove (-)</span>\n   </div>\n\n   <section>\n      <div class=\"form-group\">\n         <label>Default</label>\n         <input type=\"text\" name=\"default\" class=\"default form-control\" />\n      </div>\n\n      <div class=\"form-group\">\n         <label>Validation type</label>\n         <select name=\"validation\" class=\"validation form-control\">\n            <option value=\"-\">-</option>\n            <option value=\"required\">required</option>\n         </select>\n      </div>\n\n      <div class=\"radios\"></div>\n\n      <span class=\"add-choice\">Add a choice (+)</span>\n\n   </section>\n\n</div>"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "<div class=\"reparent-node-view\">\n\n   <span class=\"close\">Close (Esc)</span>\n\n   <div class=\"warning bg-warning\"></div>\n\n   <div class=\"form-group\">\n      <label>Choose the new parent</label>\n      <select class=\"form-control\"></select>\n   </div>\n\n   <button class=\"btn\">Reparent</button>\n\n</div>"

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const $ = __webpack_require__(0);
const _ = __webpack_require__(2);
const templates = __webpack_require__(1);

class ClausesView {

   constructor(clauses, selectedClauses) {
      this._clauses = clauses;
      this._selectedClauses = selectedClauses;
   }

   render() {
      var tmpl = _.template(templates["clauses-view"]);
      this._root = $(tmpl({
         html: this._createCheckboxesHTML()
      }));
      return this._root;
   }

   reset() {
      this._root.find("input").prop("checked", false);
   }

   getChosenClausues() {
      var clauses = [];
      var checked = this._root.find("input:checked");
      for (var i = 0; i < checked.length; i++) {
         clauses.push(checked[i].name);
      }
      return clauses;
   }

   _createCheckboxesHTML() {
      var html = "";
      for (var i = 0, len = this._clauses.length; i < len; i++) {
         let c = this._clauses[i];
         let checkedAttribute;
         if (this._selectedClauses) {
            checkedAttribute = this._selectedClauses.indexOf(c) > -1 ? "checked" : "";
         }
         html += `<div class="checkbox">
                     <label>
                        <input name="${c}" type="checkbox" ${checkedAttribute} />
                        ${c}
                     </label>
                  </div>`;
      }
      return html;
   }
}

module.exports = ClausesView;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const $ = __webpack_require__(0);
const ConfigView = __webpack_require__(3);
const CheckboxConfigView = __webpack_require__(19);
const NumberConfigView = __webpack_require__(20);
const RadioConfigView = __webpack_require__(21);
const TextConfigView = __webpack_require__(22);

module.exports = function(configType, nodeViewId, nodeModel, eventHub) {

   var view;

   if (configType === "checkbox") {
      view = new CheckboxConfigView(nodeViewId, {}, eventHub);
   } else if (configType === "number") {
      view = new NumberConfigView(nodeViewId, {
         default: nodeModel.default,
         _iub_min: nodeModel._iub_min,
         _iub_max: nodeModel._iub_max,
         _iub_validation: nodeModel._iub_validation
      }, eventHub);
   } else if (configType === "radio") {
      view = new RadioConfigView(nodeViewId, {
         enum: nodeModel.enum,
         default: nodeModel.default,
         _iub_labels: nodeModel._iub_labels,
         _iub_validation: nodeModel._iub_validation,
         _iub_triggering_value: nodeModel._iub_triggering_value
      }, eventHub);
   } else if (configType === "text") {
      view = new TextConfigView(nodeViewId, {
         default: nodeModel.default,
         _iub_validation: nodeModel._iub_validation
      }, eventHub);
   }

   return view;
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const $ = __webpack_require__(0);
const templates = __webpack_require__(1);
const ConfigView = __webpack_require__(3);

class CheckboxConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }

   render() {
      this._root = $(templates["checkbox-config-view"]);
      this._root.hide(); // no config for checkbox so far, so I just hide it.
      return this._root;
   }

   validate() {
      return true;
   }

   getModel() {
      return {};
   }
}

module.exports = CheckboxConfigView;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const $ = __webpack_require__(0);
const templates = __webpack_require__(1);
const ConfigView = __webpack_require__(3);

class NumberConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }

   render() {
      this._root = $(templates["number-config-view"]);
      this._defaultInput = this._root.find(".default");
      this._minInput = this._root.find(".min");
      this._maxInput = this._root.find(".max");
      this._loadData();
      this._behaviour();
      return this._root;
   }

   getModel() {
      var min = this._minInput.val();
      var max = this._maxInput.val();
      this._model.default = parseInt(this._defaultInput.val());
      this._model._iub_min = parseInt(min) ? parseInt(min) : min;
      this._model._iub_max = parseInt(max) ? parseInt(max) : max;
      return this._model;
   }

   validate() {
      var valid = true;
      var defaultValue = this._defaultInput.val();
      this._removeErrors();

      if (defaultValue !== "" && !parseInt(defaultValue)) {
         valid = false;
         this._defaultInput.addClass("error");
      }

      return valid;
   }

   _loadData() {
      this._defaultInput.val(this._model.default);
      this._minInput.val(this._model._iub_min);
      this._maxInput.val(this._model._iub_max);
   }
}

module.exports = NumberConfigView;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const $ = __webpack_require__(0);
const templates = __webpack_require__(1);
const ConfigView = __webpack_require__(3);

class RadioConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
      this._counter = 0;
   }

   render() {
      this._root = $(templates["radio-config-view"]);
      this._proto = this._root.find(".prototype");
      this._defaultInput = this._root.find("input.default");
      this._validationSelect = this._root.find("select.validation");
      this._radios = this._root.find(".radios");
      this._loadData();
      this._behaviour();
      return this._root;
   }

   getModel() {

      var defaultValue = this._defaultInput.val();
      var validation = this._validationSelect.val();

      if (defaultValue) {
         this._model.default = defaultValue;
      } else {
         delete this._model.default;
      }

      if (validation !== "-") {
         this._model._iub_validation = validation;
      } else {
         delete this._model._iub_validation;
      }

      this._model.enum = [];
      this._model._iub_labels = [];

      var radios = this._radios.find(".choice-box");

      for (var i = 0; i < radios.length; i++) {
         var radio = $(radios[i]);
         this._model.enum.push(radio.find(".choice-value").val());
         this._model._iub_labels.push(radio.find(".choice-label").val());
      }

      return this._model;
   }

   validate() {
      this._removeErrors();

      var valid = true;
      var inputs = this._radios.find("input");
      var radioValues = [];

      for (var i = 0; i < inputs.length; i++) {
         let input = $(inputs[i]);
         if (input.is(".choice-value") && $.trim(input.val() !== "")) {
            radioValues.push(input.val());
         }
         if ($.trim(input.val()) === "") {
            input.addClass("error");
            valid = false;
         }
      }

      if (inputs.length > 0 && this._defaultInput.val() !== "") {
         if (radioValues.indexOf(this._defaultInput.val()) === -1) {
            this._defaultInput.addClass("error");
            valid = false;
         }
      }

      return valid;
   }

   _behaviour() {

      this._initExpander();

      this._root.click((e) => {
         var trg = $(e.target);
         if (trg.is(".add-choice")) {
            this._appendRadio();
         } else if (trg.is(".remove-choice")) {
            this._removeRadio(trg.parents(".choice-box"));
         }
      });

      this._root.on("keyup", (e) => {
         this._triggerConfigUpdate();
      });

      this._root.find("select").on("change", () => {
         this._triggerConfigUpdate();
      });
   }

   _appendRadio(data) {
      this._counter++;
      var radio = this._proto.clone();
      radio.show();
      radio.removeClass("prototype");
      radio.find(".choice-label").attr("name", "choice-label-" + this._counter);
      radio.find(".choice-value").attr("name", "choice-value-" + this._counter);
      this._radios.append(radio);;
      if (data) {
         radio.find(".choice-label").val(data.label);
         radio.find(".choice-value").val(data.value);
      }
   }

   _removeRadio(el) {
      el.slideUp(() => {
         el.remove();
         this._eventHub.trigger("config-has-been-updated", [this._nodeViewId, this.getModel()]);
      });
   }

   _loadData() {
      this._defaultInput.val(this._model.default);
      this._validationSelect.val(this._model._iub_validation || "-");
      // when a new config view is created there is no `enum` attribute yet, so I need to make the following check
      if (this._model.enum) {
         for (var i = 0; i < this._model.enum.length; i++) {
            this._appendRadio({
               label: this._model._iub_labels[i],
               value: this._model.enum[i]
            });
         }
      }
   }
}

module.exports = RadioConfigView;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const $ = __webpack_require__(0);
const templates = __webpack_require__(1);
const ConfigView = __webpack_require__(3);

class TextConfigView extends ConfigView {

   constructor(nodeViewId, model, eventHub) {
      super(nodeViewId, model, eventHub);
   }

   render() {
      this._root = $(templates["text-config-view"]);
      this._defaultInput = this._root.find("input.default");
      this._validationSelect = this._root.find("select.validation");
      this._loadData();
      this._behaviour();
      return this._root;
   }

   getModel() {
      var validation = this._validationSelect.val();
      this._model.default = this._defaultInput.val();
      this._model._iub_validation = validation;
      return this._model;
   }

   validate() {
      return true;
   }

   _loadData() {
      this._defaultInput.val(this._model.default);
      this._validationSelect.val(this._model._iub_validation || "-");
   }
}

module.exports = TextConfigView;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const _ = __webpack_require__(2);
const $ = __webpack_require__(0);
const NodeView = __webpack_require__(4);

class ValueView extends NodeView {

   render() {
      super.render();
      this.getDomNode().addClass("value-view");
      this._addNodeViewButton.remove();
      this._addValueViewButton.remove();
      this._addGroupViewButton.remove();
      this._reparentButton.remove();      
      this._clausesSection.remove();
      this._nodeViewsSection.remove();
      this._valueViewsSection.remove();
   }

   _getTypeOptionsToRemove() {
      return ["checkbox"];
   }

   _loadModelType() {
      this._typeInput.val(this._getSelectTypeFromModel() || "-");
   }

   _renderClauses() {
      // does nothing as a value node has no clauses
   }
}

module.exports = ValueView;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const _ = __webpack_require__(2);
const $ = __webpack_require__(0);
const NodeView = __webpack_require__(4);

var counter = 0;

class GroupView extends NodeView {

   constructor(id, name, model, clauses, eventHub) {
      super(id, name, model, clauses, eventHub);
      if (name) {
         this._name = name;
         counter = parseInt(name.split("-")[1]);
      } else {
         this._name = "group-" + (++counter);
      }
   }

   render() {
      super.render();

      this.getDomNode().addClass("group-view");

      this._addValueViewButton.remove();
      this._clausesSection.remove();
      this._addGroupViewButton.remove();
      
      this._valueViewsSection.remove();

      this._nameInput.val(this._name).parent().hide();
      this._titleInput_IT.parent().remove();
      this._titleInput_EN.parent().remove();
      this._titleInput_DE.parent().remove();
      this._typeInput.parent().remove();
   }

   validate() {
      return true;
   }

   _getTypeOptionsToRemove() {
      return [];
   }

   _loadModelType() {
      this._model.type = "group";
   }

   _renderClauses() {
      // does nothing as a group node has no clauses
   }
}

module.exports = GroupView;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

class SchemaBuilder {

   constructor(nodeViews) {
      this._views = nodeViews;
   }

   build() {

      var schema = {
         $schema: "http://json-schema.org/draft-04/schema#",
         type: "object",
         properties: {

         }
      };

      this._views.forEach((v) => {
         var model = v.getModel();
         var clauses = v.getClauses();
         if (clauses && clauses.length > 0) {
            model.clauses = v.getClauses();
         } else {
            delete model.clauses;
         }
         schema.properties[v.getName()] = model;
      });

      return schema;
   }
}

module.exports = SchemaBuilder;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const $ = __webpack_require__(0);
const _ = __webpack_require__(2);
const templates = __webpack_require__(1);
const sameParentErrorMessage = "Please choose a new parent.";


class ReparentNodeView {

   constructor(eventHub) {
      this._eventHub = eventHub;
   }

   render() {
      var tmpl = _.template(templates["reparent-node-view"]);
      this._root = $(tmpl());
      this._warning = this._root.find(".warning");
      this._select = this._root.find("select");
      this._closeButton = this._root.find(".close");
      this._executeButton = this._root.find("button");
      this._behaviour();
      return this._root;
   }

   setNodeToBeReparented(node) {
      this._node = node;
   }

   show(nodes) {

      var view, option;
      var names = this._getSortedListOfNodeNames(nodes);

      this._warning.empty().text("You are about to choose a new parent for the node [" + this._node.getName() + "]");

      this._select.append("<option value='-'>- no parent (make it a root node) -</option>");

      for (var i = 0; i < names.length; i++) {
         name = names[i];
         view = this._getViewByName(nodes, name);
         if (view.canBeAParentNode() && view.getId() !== this._node.getId()) {
            option = $("<option />");
            option.attr("value", name);
            option.text(name);
            this._select.append(option);
         }
      }

      this._root.show();
   }

   hide() {
      this._root.hide();
      this._node = null;
      this._select.empty();
   }

   _behaviour() {

      $(document).on("keyup", (e) => {
         if (e.keyCode === 27) {
            this.hide();
         }
      });

      this._closeButton.click((e) => {
         e.preventDefault();
         this.hide();
      });

      this._executeButton.click((e) => {
         e.preventDefault();
         let newParentName = this._select.val();
         let currentParentName = this._node.getParentName();
         if (!currentParentName && newParentName === "-") {
            alert(sameParentErrorMessage);
         } else {
            if (newParentName !== currentParentName) {
               this._eventHub.trigger("please-reparent-this-node-view", [this._node.getName(), currentParentName, newParentName]);
               this.hide();
            } else {
               alert(sameParentErrorMessage);
            }
         }
      });
   }

   _getSortedListOfNodeNames(nodes) {
      var names = nodes.map((node) => {
         return node.getName();
      });

      names.sort((a, b) => {
         if (a < b) {
            return -1;
         }
         if (a > b) {
            return 1;
         }
         return 0;
      });

      return names;
   }

   _getViewByName(views, name) {
      for (var i = 0; i < views.length; i++) {
         let view = views[i];
         if (view.getName() === name) {
            return view;
         }
      }
   }
}

module.exports = ReparentNodeView;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const $ = __webpack_require__(0);
const MainView = __webpack_require__(8);
const forbiddenNames = ["iubenda", "mimmo", "jacopo"];

$.when($.get("/mock-data/schema.json"), $.get("/mock-data/clauses.json"))
   .then((schema, clauses) => {
      setTimeout(() => {
         $("body").append(MainView.build(forbiddenNames).render(schema[0], clauses[0]));
      }, 300);
   });



/***/ })
/******/ ]);