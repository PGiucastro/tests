const _ = require('underscore');
const $ = require('jquery');
const NodeView = require('./node-view');

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