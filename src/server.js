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
// const { configSQLite } = require('./db/configSQLite');
// const knex = require('knex')(configSQLite);
const knex = require('knex')(config);
const { fakerArray } = require('./faker/fakeData.js');
const { MensajeModel } = require('./db/configMongo.js');
const { normalize, schema } = require('normalizr');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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
module.exports = { dataMsg }; //lo exporto al modulo de insert_data para cargarlo a SQL
/* -------------------------------------------------------------------------- */
/*                                  SOCKET.IO                                 */
/* -------------------------------------------------------------------------- */
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado! 🙂');
  socket.on('disconnect', () => console.log('Usuario desconectado 👋'));
  /* -------------------------- funciones del socket -------------------------- */
  const cargarProds = async (dataBase, socket) => {
    /* ------------------------- leemos productos de la base de datos ------------------------ */
    try {
      const rows = await knex.from(dataBase).select('*');

      for (row of rows)
        console.log(`${row['id']}, ${row['producto']}, ${row['precio']}`);
      io.sockets.emit(socket, rows); //envio desde la base de datos
    } catch (err) {
      console.log(err);
    } finally {
      knex.destroy();
    }
  };
  cargarProds('productos', 'productos');
  // cargarProds('productos','productos-test')
  const cargarTestProd = () => {
    io.sockets.emit('productos-test', fakerArray);
  };
  cargarTestProd();

  /* ----------------- leemos mensajes de la base de datos ---------------- */
  // const cargarMsjs = async () => {
  //   try {
  //     const rows = await knex.from('mensajes').select('*');
  //     console.log(rows);
  //     io.sockets.emit('mensajes', rows);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     knex.destroy();
  //   }
  // };
  // cargarMsjs();
  const normalizar = (msj) => {
    const authSchema = new schema.Entity('author');
    const textSchema = new schema.Entity('text');
    const mensajeSchema = new schema.Entity('text', {
      author: authSchema,
      text: textSchema,
    });

    const dataNormalizada = normalize(msj, mensajeSchema);
    console.log(dataNormalizada, 'data normalizada--------------');
    return dataNormalizada;
  };

  const cargarMsj = async (mensaje) => {
    // let msj = {
    //   author: {
    //     id: 'email de prueba',
    //     nombre: 'nombre test',
    //     apellido: 'apellido test',
    //     edad: 2,
    //     alias: 'alias test',
    //     avatar: 'url test',
    //   },
    //   text: 'algun texto de prueba',
    // };

    const msjNormalizado = normalizar(mensaje);
    try {
      const msj = await MensajeModel.create(msjNormalizado);
      return msj;
    } catch (error) {
      console.log(error);
    }
  };

  const getMensajes = async () => {
    try {
      cargarMsj();
      const mensajes = await MensajeModel.find();
      console.log(mensajes);
      normalizar(mensajes)
      io.sockets.emit('mensajes', mensajes);
      return mensajes;
    } catch (error) {
      console.log(error);
    }
  };
  getMensajes();
  /* -------------------------- insertamos nuevo prod ------------------------- */
  socket.on('producto', (prod) => {
    (async () => {
      try {
        console.log(prod);
        await knex.from('productos').insert(prod);
        await getProducts();
      } catch (err) {
        console.log(err);
      } finally {
        knex.destroy();
      }
    })();
  });

  socket.on('mensaje', (msg) => {
    (async () => {
      console.log(msg);
      try {
        await knex('mensajes').insert(msg);
        cargarMsjs();
      } catch (error) {
        console.log(error);
      } finally {
        knex.destroy();
      }
    })();
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
app.get('/api/productos-test', (req, res) => {
  res.render('main-test', { layout: 'index-test' });
});
/* ------------------------------------ ----------------------------------- */
server.listen(PORT, () => {
  console.log(`server is runing at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.log(err);
});
