const {dataMsg} = require('../server')
const { config } = require('./config.js');
const knex = require('knex')(config);
const data = 
    {
      producto: 'escritorio',
      precio: 1900,
      thumbnail: 'http://someurl.com',
    }
    
  
knex('productos')
  .insert(data)
  .then(() => console.log('data insertada'))
  .catch((err) => console.log(err))
  .finally(() => knex.destroy());
  
knex('mensajes')
  .insert(dataMsg)
  .then(() => console.log('data insertada'))
  .catch((err) => console.log(err))
  .finally(() => knex.destroy());
