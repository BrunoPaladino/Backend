import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import bodyParser from 'body-parser';
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';                     //Server es una clase que representa al servidor WebSocket para comunicacion en tiempo real
import http from 'http';
import ProductManager from './dao/ProductManager.js';
import usersRouter from './routes/users.router.js';
import mongoose from 'mongoose';

import messageModel from './dao/mongo/models/messages.model.js'
import cartModel from './dao/mongo/models/carts.model.js'

import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionRouter from './routes/session.router.js';

import passport from 'passport';
import initializePassport from './config/passport.config.js';

import dotenv from 'dotenv';
import config from './config/config.js';            //config es la configuracion de las variables de ambiente (pasadas por .env)
import productModel from './dao/mongo/models/products.model.js';
import userModel from './dao/mongo/models/user.model.js';
import { addDevelopmentLogger, addProductionLogger } from './utils/logger.js';

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);      //es un servidor para trabajar con socket

const productManager = new ProductManager();
const messages = [];    //array para almacenar los mensajes del chat

//Configuracion Express
app.use(bodyParser.json());
app.use(express.json());                            //para poder recibir req.body en formato JSON
app.use(express.urlencoded({extended:true}));

//Configuracion Session(debe ser configurado antes que las rutas que dependen de el)
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.MONGO_URL,
        dbName: config.MONGO_DBNAME,
        ttl: 100
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//WEBSOCKETS
socketServer.on('connection', (socket) => {     //socketServer.on se usa para escuchar la conexion de un socket nuevo
    console.log("User connected");
    socket.on('addProduct',(product)=>{    //socket.on espera la ocurrencia del evento "addProduct" (desde el lado del cliente) y un producto, para activarse
        productManager.addProduct(product);
        //socketServer.emit('productListUpdated', productManager.getProducts());
    });
    socket.on('addProductMongo', async (newProduct)=>{
        const listOfCarts = await cartModel.findOne();
        listOfCarts.products.push(newProduct);
        await listOfCarts.save();
    })
/*     socket.on('removeProductMongo', async (productIdToRemove)=>{
        const productToRemove = await productModel.findOne({code: productIdToRemove});
        console.log(productToRemove)
    }) */
    socket.on('addProductToCart', async (productIDToAdd, userLoggedEmail)=>{
        const userLogged = await userModel.findOne({ email: userLoggedEmail});
        if (userLogged) {
            console.log(userLogged)
        } else {
            console.log("User not found");
        }
        const productToAdd = await productModel.findById(productIDToAdd);
        console.log(productToAdd);
        const userCart = await userModel.findOne({ email: userLoggedEmail }).populate('cart');
        console.log(userCart);
        const productsInUserCart = userCart.cart.products
        console.log(productsInUserCart)
        productsInUserCart.push(productToAdd);
        userCart.cart.products = productsInUserCart
        console.log(productsInUserCart)
        console.log(userCart.cart)
        await userCart.save()
    })
    socket.on('removeProduct', (productID)=>{    //socket.on espera la ocurrencia del evento "removeProduct" (desde el lado del cliente) y un producto, para activarse
        productManager.deleteProduct(productID);
        //socketServer.emit('productListUpdated', productManager.getProducts());
    })    
    socket.on('message', async (data)=>{
        console.log(data);
        let existingMessage = await messageModel.findOne({userEmail: data.user});       //busco si el mismo usuario ingreso algun mensaje antes
        if(existingMessage){
            existingMessage.message = data.message;
            await existingMessage.save();
        } else {
            let newMessage = await messageModel.create({
                userEmail: data.user,
                message: data.message
            })
        }
        messages.push(data);    //guardamos los mensajes en el array messages
        socket.emit('messageLogs', messages);  //reenviamos los mensajes guardados en el array
    })

    socket.on('disconnect',()=>{
        console.log('User  disconnected');
    });
});

app.use(addDevelopmentLogger)
app.use(addProductionLogger)

app.get('/loggerTest', (req,res)=>{
    req.developMentLogger.debug('Testeo de developmentLogger');
})

app.get('/loggerTest2', (req,res)=>{
    req.productionLogger.info('Testeo de productionLogger');
})

//Routes
app.use('/api/products', productRouter);            // sintaxis : (endpoint, ruta vinculada al endpoint)
app.use('/api/cart', cartRouter);
app.use('/api/users', usersRouter);
app.use('/api/session', sessionRouter);

// Configuracion HANDLEBARS (es un motor de plantillas, una libreria para tomar HTML y reemplazar datos alli)
app.engine('handlebars', handlebars.engine());  //Se inicializa el motor de plantillas
app.set('views', __dirname+'/views');          //indicamos en que parte del proyecto estaran las vistas (las plantillas)
app.set('view engine', 'handlebars');          //indicamos con que motor de plantillas (handlebars en este caso) se debe renderizar las vistas
app.use(express.static(__dirname+'/public'));      //seteamos de forma estatica la carpeta public
app.use('/',viewsRouter);

//Ecommerce Data Base (MONGOOSE)
//la conexion de mongoose funciona como una promesa
mongoose.connect(config.MONGO_URL, {dbName: config.MONGO_DBNAME})                    //el segundo parametro especifica la Base de Datos a vincular
.then(() => {                                                   // la coleccion ya la definimos en el modelo(esquema)
    console.log("Database ecommerce connected");
    server.listen (config.PORT, () =>  //ACTIVACION DE SERVER, si en el lugar de "server" pusiera "app" no funcionaria el socket, sino que lo tomaria el server de express
    {console.log(`Server ${config.PORT} activated, with socket. `)
    });
})
    .catch ((error) => {
        console.error("Cannot connect to database ecommerce");
    });