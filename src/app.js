import ProductManager from '../classes/ProductManager.js';
import express from 'express';

const productManager = new ProductManager();        //INSTANCIO UN OBJETO CON LA CLASE PRODUCT MANAGER IMPORTADA
const app=express();
app.use(express.urlencoded({extended:true}));

//SEARCH FOR A LIMITED QUANTITY OF PRODUCTS
app.get('/products', (req,res)=>{
    let quantity = req.query.limit;
    const listOfProducts = productManager.getProducts();

if(quantity){
    const limitedProducts = listOfProducts.slice(0, quantity);
    return res.send(limitedProducts);
    } else {
        return res.send({listOfProducts});
    }
});

//SEARCH WITH A DINAMIC ID
app.get('/products/:pid', (req, res)=>{
    let productID = Number(req.params.pid);
    const listOfProducts = productManager.getProducts();

    let productSearched = listOfProducts.find((element) => element.id === productID);
    if (productSearched){
        return res.send({productSearched});
    } else {
        return res.send({error: "Product not found"})
    }
})

//SERVER ACTIVATION
app.listen('8080', ()=>{
    console.log("Active Server");
});