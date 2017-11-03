const _ = require('underscore');
const $ = require('jquery');
const NodeView = require('./node-view');

var counter = 0;

class GroupView extends NodeView {

   constructor(id, name, model, clauses, eventHub) {
      super(id, name, model, clauses, eventHub);
      this._name = "group-" + (++counter);
   }

   render() {
      super.render();

      this.getDomNode().addClass("group-view");

      this._addValueViewButton.remove();
      this._clausesSection.remove();
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