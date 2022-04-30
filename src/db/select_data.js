const { config } = require('./config.js');
const knex = require('knex')(config);

// knex.from('productos').select('*')
// .then((rows)=>{
//     for(row of rows){
//         console.log(`${row['id']}, ${row['producto']}, ${row['precio']}`)
//     }
// })
// .catch((err)=>{console.log(err)})
// .finally(()=> knex.destroy())

const getProducts = async ()=>{
    try {
        const resp = await knex.from('productos').select('*')
        return resp
    } catch (error) {
        return error
    }
}
module.exports = getProducts