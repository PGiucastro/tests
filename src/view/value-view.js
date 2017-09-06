const _ = require('underscore');
const $ = require('jquery');
const NodeView = require('./node-view');

class ValueView extends NodeView {

   render() {
      super.render();
      this.getDomNode().addClass("value-view");
      this._clausesSection.remove();
      this._addChildNodeButton.remove();
      this._addValueInputButton.remove();
      this._reparentButton.remove();
      this._clausesSection.remove();
      this._childrenSection.remove();
   }

   _getTypeOptionsToRemove() {
      return ["checkbox", "radio"];
   }
}

module.exports = ValueView;