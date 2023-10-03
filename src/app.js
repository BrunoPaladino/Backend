import express from 'express';
import bodyParser from 'body-parser';
import productRouter from './routes/products.js';
import ProductManager from '../classes/ProductManager.js';

const productManager = new ProductManager();
const app=express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productRouter);




/* //SEARCH WITH A DINAMIC ID
app.get('/products/:pid', (req, res)=>{
    let productID = Number(req.params.pid);
    const listOfProducts = productManager.getProducts();

    let productSearched = listOfProducts.find((element) => element.id === productID);
    if (productSearched){
        return res.send({productSearched});
    } else {
        return res.send({error: "Product not found"})
    }
}) */

//SERVER ACTIVATION
app.listen('8080', ()=>{
    console.log("Active Server");
});