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

   getSchemaName() {
      return this.getParentName() + "." + this.getName();
   }

   _getTypeOptionsToRemove() {
      return ["checkbox", "radio"];
   }

   _parseName(name) {
      return name.split(".")[1];
   }
}

module.exports = ValueView;