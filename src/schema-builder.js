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
            title: m.title_en,
            _iub_title_it: m.title_it,
            _iub_title_en: m.title_en,
            _iub_title_de: m.title_de,
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