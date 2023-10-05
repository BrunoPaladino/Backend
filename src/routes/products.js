import express from 'express';
import ProductManager from '../classes/ProductManager.js';
const productRouter = express.Router();

const productManager = new ProductManager(); 

//SEARCH FOR A LIMITED QUANTITY OF PRODUCTS OR ALL THE PRODUCTS
productRouter.get('/', (req,res) =>{
    let quantity = req.query.limit;
    const listOfProducts = productManager.getProducts();

if(quantity){
    const limitedProducts = listOfProducts.slice(0, quantity);
    return res.status(200).send(limitedProducts);
    } else {
        return res.status(200).send({listOfProducts});
    }
});

//SEARCH WITH A DINAMIC ID
productRouter.get('/:pid', (req, res)=>{
    let productID = Number(req.params.pid);
    const listOfProducts = productManager.getProducts();

    let productSearched = listOfProducts.find((element) => element.id === productID);
    if (productSearched){
        return res.status(200).send({productSearched});
    } else {
        return res.status(400).send({error: "Product not found"})
    }
})

//ADD A PRODUCT
productRouter.post('/', (req,res)=>{
    let productToAdd = req.body;

    productManager.addProduct(productToAdd);        //agrega el producto por medio del metodo de ProductManager
    const listOfProducts = productManager.getProducts();    //me trae el listado de productos con el metodo de ProductManager
    res.status(200).json({products: listOfProducts});
})

//UPDATE PRODUCT
productRouter.put('/:pid', (req, res)=>{
    let productID = Number(req.params.pid);
    let dataToUpdate = req.body;
    productManager.updateProduct(productID, dataToUpdate);
    const listOfProducts = productManager.getProducts();    //me trae el listado de productos con el metodo de ProductManager
    res.status(200).json({products: listOfProducts});
})

//DELETE PRODUCT
productRouter.delete('/:pid', (req,res)=>{
    let productID = Number(req.params.pid);
    productManager.deleteProduct(productID);
    const listOfProducts = productManager.getProducts();    //me trae el listado de productos con el metodo de ProductManager
    res.status(200).json({products: listOfProducts});
})

export default productRouter;