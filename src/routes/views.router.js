import express from "express";
import ProductManager from "../classes/ProductManager.js";

const productManager = new ProductManager();
const router = express.Router();

router.get('/', (req,res)=>{
    const listOfProducts = productManager.getProducts();
    res.render('home', {listOfProducts});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
})



router.get('/realtimeproducts', (req,res)=>{
    const listOfProducts = productManager.getProducts();
    res.render('home', {listOfProducts});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
})

export default router;