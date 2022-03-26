// eslint-disable-next-line import/no-unresolved
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const app = express();
const PORT = 8081;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, '/public')))
/* -------------------------------------------------------------------------- */
/*                                    data                                    */
/* -------------------------------------------------------------------------- */
const fecha = new Date()
const dateUTF = `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()} - ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`
console.log(fecha.getSeconds())
const data = [
  {
    producto: 'teclado',
    precio: '$150',
    thumbnail: 'http://someurl.com',
  },
  {
    producto: 'mouse',
    precio: '$100',
    thumbnail: 'http://someurl.com',
  },
  {
    producto: 'monitor',
    precio: '$160',
    thumbnail: 'http://someurl.com',
  },
];
const dataMsg = [
  {
    author: 'admin@mail.com',
    fecha: dateUTF,
    mensaje: 'Hola bienvenidos al chat!',
  },
];

let listExist = true;
/* -------------------------------------------------------------------------- */
/*                                  SOCKET.IO                                 */
/* -------------------------------------------------------------------------- */
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado! 🙂'); //mensaje de bienvenida
  socket.on('disconnect', () => console.log('Usuario desconectado 👋')); //mensaje de desconexion
  /* -------------------------- funciones del socket -------------------------- */
  io.sockets.emit('productos', data); //envio el array de productos
  io.sockets.emit('mensajes', dataMsg); //envio el array de productos

  socket.on('producto', (prod) => {
    data.push(prod);
    io.sockets.emit('productos', data); //envio el array de productos
  });
  
  socket.on('mensaje', (msg) => {
    console.log(msg)
    dataMsg.push(msg)
    io.sockets.emit('mensajes', dataMsg); //envio el mensaje
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
