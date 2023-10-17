import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import bodyParser from 'body-parser';
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';     //Server es una clase que representa al servidor WebSocket para comunicacion en tiempo real
import http from 'http';
import ProductManager from './classes/ProductManager.js';


const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);      //es un servidor para trabajar con socket

const productManager = new ProductManager();

//WEBSOCKETS
socketServer.on('connection', (socket) => {     //socketServer.on se usa para escuchar la conexion de un socket nuevo
    console.log("User connected");

    socket.on('addProduct',(product)=>{    //socket.on espera la ocurrencia del evento "addProduct" (desde el lado del cliente) y un producto, para activarse
        productManager.addProduct(product);
        //socketServer.emit('productListUpdated', productManager.getProducts());
    });

    socket.on('removeProduct', (productID)=>{    //socket.on espera la ocurrencia del evento "removeProduct" (desde el lado del cliente) y un producto, para activarse
        productManager.deleteProduct(productID);
        //socketServer.emit('productListUpdated', productManager.getProducts());
    })

    socket.on('disconnect',()=>{
        console.log('User  disconnected');
    });
});

//Configuracion Express
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


//HANDLEBARS
app.engine('handlebars', handlebars.engine());  //Se inicializa el motor
app.set('views', __dirname+'/views'); //indicamos en que parte del proyecto estaran las vistas
app.set('view engine', 'handlebars'); //indicamos con que motor se debe renderizar las vistas
app.use(express.static(__dirname+'/public'));      //seteamos de forma estatica la carpeta public
app.use('/',viewsRouter);


//SERVER ACTIVATION
server.listen (8080, () =>            //si en el lugar de "server" pusiera "app" no funcionaria el socket, sino que lo tomaria el server de express
    {console.log("Server 8080 activated, with socket")
});