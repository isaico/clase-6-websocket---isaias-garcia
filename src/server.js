// eslint-disable-next-line import/no-unresolved
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const app = express();
const PORT = 8080;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { config } = require('./db/config.js');
const { configSQLite } = require('./db/configSQLite');
const knex = require('knex')(config);
// const knex = require('knex')(configSQLite);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
/**
 * bueno como no explicaron como unificar todo yo intente con lo que se venia haciendo si  bien no funciona del todo bien es porque lo solucione como pude
 * estaria bueno que puedan mostrar como ensamblar todo en el modulo principal o en el server, lo que hice fue utilizar ECS5  y conectar la base de datos, lo q no pude desifrar bien
 * es porque no me incrusta nueva info que el usuario carga desde los inputs, en la base de datos, si lo hice tal cual mostraron...
 */
/* -------------------------------------------------------------------------- */
/*                                    data                                    */
/* -------------------------------------------------------------------------- */
const fecha = new Date();
const dateUTF = `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()} - ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
console.log(fecha.getSeconds());

const dataMsg = [
  {
    author: 'admin@mail.com',
    fecha: dateUTF,
    mensaje: 'Hola bienvenidos al chat!',
  },
];
module.exports={dataMsg}//lo exporto al modulo de insert_data para cargarlo a SQL
/* -------------------------------------------------------------------------- */
/*                                  SOCKET.IO                                 */
/* -------------------------------------------------------------------------- */
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado! 🙂');
  socket.on('disconnect', () => console.log('Usuario desconectado 👋'));
  /* -------------------------- funciones del socket -------------------------- */
  const cargarProds = async () => {
    /* ------------------------- leemos productos de la base de datos ------------------------ */
    try {
      const rows = await knex.from('productos').select('*');
      for (row of rows)
      console.log(`${row['id']}, ${row['producto']}, ${row['precio']}`);
      io.sockets.emit('productos', rows); //envio desde la base de datos
    } catch (err) {
      console.log(err);
    } finally {
      knex.destroy();
    }
  };
  cargarProds();
  /* ----------------- leemos mensajes de la base de datos ---------------- */
  const cargarMsjs = async () => {
    try {
      const rows = await knex.from('mensajes').select('*');
      console.log(rows)
      io.sockets.emit('mensajes', rows);
    } catch (err) {
      console.log(err);
    } finally {
      knex.destroy();
    }
  };
  cargarMsjs();
  // io.sockets.emit('mensajes', dataMsg); //envio el array de msj
  /* -------------------------- insertamos nuevo prod ------------------------- */
  socket.on('producto', (prod) => {
    (async () => {
      try {
        console.log(prod);
        await knex('productos').insert(prod);
        await cargarProds();
        // io.sockets.emit('productos', rows); //envio desde la base de datos
      } catch (err) {
        console.log(err);
      } finally {
        knex.destroy();
      }
    })();
    // data.push(prod);
    // io.sockets.emit('productos', data); //envio el array de productos modificado
  });

  socket.on('mensaje', (msg) => {
    (async ()=>{
      console.log(msg);
      try {
        await knex('mensajes').insert(msg)
        cargarMsjs();
      } catch (error) {
        console.log(error);
      }finally {
        knex.destroy();
      }
    })()
    // dataMsg.push(msg);
    // io.sockets.emit('mensajes', dataMsg); //envio el mensaje
  });
});
/* -------------------------------------------------------------------------- */
/*                                 HBS config                                 */
/* -------------------------------------------------------------------------- */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaulLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layout',
    partialsDir: __dirname + '/views/partials/',
  })
);
/* -------------------------------------------------------------------------- */
/*                                   RENDERS                                  */
/* -------------------------------------------------------------------------- */
app.get('/', (req, res) => {
  res.render('main', { layout: 'index' });
});

/* ------------------------------------ ----------------------------------- */
server.listen(PORT, () => {
  console.log(`server is runing at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.log(err);
});
