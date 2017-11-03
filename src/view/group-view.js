const _ = require('underscore');
const $ = require('jquery');
const NodeView = require('./node-view');

class GroupView extends NodeView {

   render() {
      super.render();
      this.getDomNode().addClass("group-view");
      this._addValueViewButton.remove();
      this._clausesSection.remove();
      this._nodeViewsSection.remove();
   }

   _getTypeOptionsToRemove() {
      return [];
   }

   _loadModelType() {

   }

   _renderClauses() {
      // does nothing as a group node has no clauses
   }
}

module.exports = ValueView;