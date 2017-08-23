class SchemaBuilder {

   constructor(models) {
      this._models = models;
   }

   build() {

      var schema = {
         $schema: "http://json-schema.org/draft-04/schema#",
         type: "object",
         properties: {

         }
      };

      this._models.forEach((m) => {
         schema.properties[m.name] = {
            title: m.title_EN,
            _iub_title_IT: m.title_IT,
            _iub_title_EN: m.title_EN,
            _iub_title_DE: m.title_DE,
            type: m.type,
            _iub_clauses: m.clauses,
            _iub_parent: m.parent ? this._findModelId(m.parent).name : null
         };
      });

      return schema;
   }

   _findModelId(id) {
      var m;
      for (var i = 0; i < this._models.length; i++) {
         m = this._models[i];
         if (m.id === id) {
            return m;
         }
      }
   }
}

module.exports = SchemaBuilder;