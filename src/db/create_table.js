const { config } = require('./config.js');
const knex = require('knex')(config);

knex.schema
.createTable('productos', (table) => {
  table.increments('id').primary().notNullable(),
      table.string('producto', 150).notNullable(),
      table.integer('precio', 150).notNullable(),
      table.string('thumbnail', 550)
  })
// .createTable('mensajes', (table) => {
//   table.increments('id').primary().notNullable(),
//       table.string('author', 150).notNullable(),
//       table.string('fecha', 150).notNullable(),
//       table.string('mensaje', 550).notNullable()
//   })
  .then(()=>{console.log('tabla creada con exito 🙂 ')})
  .catch(err=> console.log('la tabla ya existe')) 
  .finally(() => {
    knex.destroy();
  });


 
