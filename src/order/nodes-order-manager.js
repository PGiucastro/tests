class NodesOrderManager {

   constructor(nodes) {
      this._maxPosition = -1;
      this._nodes = nodes;
      this._workOutMaxPositionBasedOnModelsData();
   }

   getMaxPosition() {
      return this._maxPosition;
   }

   addNode(node) {
      this._maxPosition++;
      this._nodes.push(node);
      node.setPosition(this._maxPosition);
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

   _workOutMaxPositionBasedOnModelsData() {
      this._maxPosition = 0;
      this._nodes.forEach((n) => {
         let position = n.getPosition();
         if (this._maxPosition < position) {
            this._maxPosition = position;
         }
      });
   }
}

module.exports = NodesOrderManager;