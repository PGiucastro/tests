const _ = require('underscore');
const $ = require('jquery');
const NodeView = require('./node-view');

class GroupView extends NodeView {

   constructor(id, model, clauses, eventHub) {
      super(id.replace("node", "group"), model, clauses, eventHub);
   }

   render() {
      super.render();

      this.getDomNode().addClass("group-view");

      this._addValueViewButton.remove();
      this._clausesSection.remove();
      this._addGroupViewButton.remove();

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

   _showTypeLabel() {
      this._root.find(".type-label .type-radio-group").css("display", "inline");
   }
}

module.exports = GroupView;