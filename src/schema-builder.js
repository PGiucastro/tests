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
            title: m.title_EN,
            _iub_title_IT: m.title_IT,
            _iub_title_EN: m.title_EN,
            _iub_title_DE: m.title_DE,
            type: m.type,
            _iub_clauses: m.clauses,
            _iub_parent: m.parent
         };
      });

      return schema;
   }
}

module.exports = SchemaBuilder;