const _ = require('underscore');
const $ = require('jquery');
const NodeView = require('./node-view');

class ValueView extends NodeView {

   render() {
      super.render();
      this.getDomNode().addClass("value-view");
      this._addNodeViewButton.remove();
      this._addValueViewButton.remove();
      this._reparentButton.remove();
      this._clausesSection.remove();
      this._nodeViewsSection.remove();
      this._valueViewsSection.remove();
      this._childrenExclusiveBehaviourCheckbox.parent().remove();
   }

   _getTypeOptionsToRemove() {
      return ["checkbox"];
   }

   _loadModelType() {
      this._typeInput.val(this._getSelectTypeFromModel() || "-");
   }
}

module.exports = ValueView;