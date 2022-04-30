const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config();

mongoose.connect(
  process.env.MONGOATLAS_URI,
  (err)=>{
    if(err){
        console.log('error al conectar MONGODB 😢')  

    }else{

        console.log('conectado correctamente MONGODB 😇')
    }
  }
);

const Schema = new mongoose.Schema({
    author:{

            id:{
                type:String,
                require:true,
            },
            nombre:{
                type:String,
                require:true,
            },
            apellido:{
                type:String,
                require:true,
            },
            edad:{
                type:Number,
                
            },
            alias:{
                type:String,
                
            },
            avatar:{
                type:String,
                require:true,
            },
        
    },
    text:{
        type:String,
        require:true,
        max:250
    }
})
const MensajeModel = mongoose.model('Mensajes',Schema)
module.exports = {MensajeModel}