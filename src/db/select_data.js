const { config } = require('./config.js');
const knex = require('knex')(config);

knex.from('productos').select('*')
.then((rows)=>{
    for(row of rows){
        console.log(`${row['id']}, ${row['producto']}, ${row['precio']}`)
    }
})
.catch((err)=>{console.log(err)})
.finally(()=> knex.destroy())