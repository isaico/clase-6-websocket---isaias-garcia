const { config } = require('./config.js');
const knex = require('knex')(config);

knex.schema
  .createTable('author_normalizados', (table) => {
    // table.increments('id').primary().notNullable(),
    // table.array('', 150).notNullable(),
    // table.string('fecha', 150).notNullable(),
    // table.string('text', 550).notNullable();
    table.string('id',150).notNullable(),
    table.string('nombre',150).notNullable(),
    table.string('apellido',150).notNullable(),
    table.string('alias',150),
    table.string('edad',3).notNullable(),
    table.string('avatar',500).notNullable()
  })
  .then(() => {
    console.log('tabla creada con exito 🙂 ');
    
    // para la db que necesita nested objects
    
  })
  .catch((err) => console.log(err,'la tabla ya existe'))
  .finally(() => {
    knex.destroy();
  });
