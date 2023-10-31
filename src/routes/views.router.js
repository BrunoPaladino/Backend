import express from "express";
import ProductManager from "../dao/ProductManager.js";

import { Server } from "socket.io";
import http from 'http';
import productModel from "../dao/models/products.model.js";

const productManager = new ProductManager();
const router = express.Router();

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);

/* router.get('/', (req,res)=>{
    const listOfProducts = productManager.getProducts();
    res.render('home', {listOfProducts});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
}) */

router.get('/', async (req,res)=>{
    const listOfProducts = await productModel.find();       //trae todos los productos con el esquema

    const simplifiedProducts = listOfProducts.map(product => ({     //hago un map porque trae los productos como array
        title: product.title,
        description: product.description,
        thumbnail: product.thumbnail,
        price: product.price,
        status: product.status,
        code: product.code,
        stock: product.stock,
        category: product.category
    }));

    res.render('home', {listOfProducts:simplifiedProducts});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
})



router.get('/realtimeproducts', (req,res)=>{
    const listOfProducts = productManager.getProducts();
    res.render('realTimeProducts', {listOfProducts});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)

    socketServer.on('productListUpdated', ()=>{
        const updatedProducts = productManager.getProducts();
        socketServer.emit('productList', updatedProducts);
    })

})


//CHAT
router.get('/chat', (req,res)=>{

    res.render('chat', );  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
})

//METODO DE PRUEBA CON INDEX
router.get('/index', (req,res)=>{
    let testUser = {
            name: "Bruno",
            lastName : "Diaz"
    }
    res.render('index', {testUser});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
})

export default router;