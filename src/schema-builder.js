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
         model.clauses = v.getClauses();
         schema.properties[v.getName()] = model;
      });
      
      return schema;
   }
}

module.exports = SchemaBuilder;