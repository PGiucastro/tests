class NodesOrderManager {

   constructor(nodes) {
      this._maxPosition = 0;
      this._nodes = nodes;
      this._nodes.forEach((n) => {
         let position = n.getPosition();
         if (this._maxPosition < position) {
            this._maxPosition = position;
         }
      });
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

   }
}

module.exports = NodesOrderManager;