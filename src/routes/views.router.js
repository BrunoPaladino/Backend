import express from "express";
import ProductManager from "../classes/ProductManager.js";

import { Server } from "socket.io";
import http from 'http';

const productManager = new ProductManager();
const router = express.Router();

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);

router.get('/', (req,res)=>{
    const listOfProducts = productManager.getProducts();
    res.render('home', {listOfProducts});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
})



router.get('/realtimeproducts', (req,res)=>{
    const listOfProducts = productManager.getProducts();
    res.render('realTimeProducts', {listOfProducts});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)

    socketServer.on('productListUpdated', ()=>{
        const updatedProducts = productManager.getProducts();
        socketServer.emit('productList', updatedProducts);
    })

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