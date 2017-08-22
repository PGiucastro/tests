class SchemaBuilder {

   static build(nodeViews) {

      var schema = {
         $schema: "http://json-schema.org/draft-04/schema#",
         type: "object",
         properties: {

         }
      };

      nodeViews.forEach((node) => {
         var m = node.getModel();
         schema.properties[m.name] = {
            title: m.title,
            type: m.type,
            _iub_clauses: m.clauses,
            _iub_parent: m.parent
         };
      });

      return schema;
   }
}

module.exports = SchemaBuilder;