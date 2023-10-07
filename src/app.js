import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import bodyParser from 'body-parser';
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';

const app=express();
const httpServer = app.listen (8080, ()=>{console.log("Servidor 8080 activo")});
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

//WEBSOCKETS
const socket = io();
socket.emit('message', 'Hola, soy Bruno');
const socketServer = new Server(httpServer); //es un servidor para trabajar con sockets
socketServer.on('connection', socket=>{     //socketServer.on se usa para escuchar la conexion de un socket nuevo
    socket.on('message', data=>{
        console.log(data);
    })
});


//HANDLEBARS
app.engine('handlebars', handlebars.engine());  //Se inicializa el motor
app.set('views', __dirname+'/views'); //indicamos en que parte del proyecto estaran las vistas
app.set('view engine', 'handlebars'); //indicamos con que motor se debe renderizar las vistas
app.use(express.static(__dirname+'public'));      //seteamos de forma estatica la carpeta public
app.use('/',viewsRouter);




/* //SERVER ACTIVATION
app.listen('8080', ()=>{
    console.log("Active Server");
}); */