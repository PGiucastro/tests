class SchemaBuilder {

   constructor(nodeViews) {
      this._views = nodeViews;
   }

   build() {

      var schema = {
         $schema: "http://json-schema.org/draft-04/schema#",
         type: "object",
         properties: {

         }
      };

      this._views.forEach((v) => {
         var model = v.getModel();
         var clauses = v.getClauses();
         if (clauses && clauses.length > 0) {
            model.clauses = v.getClauses();
         } else {
            delete model.clauses;
         }
         schema.properties[v.getId()] = model;
      });

      return schema;
   }
}

module.exports = SchemaBuilder;