import express from 'express';
import ProductManager from '../classes/ProductManager.js';
import productModel from '../classes/models/products.model.js';     //importo el modelo de producto de MongoDB

const productRouter = express.Router();
const productManager = new ProductManager(); 

/* 
* FUNCTIONS WITH FILESYSTEM 
*/
/* //SEARCH FOR A LIMITED QUANTITY OF PRODUCTS OR ALL THE PRODUCTS
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
 */
/* 
* END FUNCTIONS WITH FILESYSTEM 
*/



/* 
* FUNCTIONS WITH MONGOOSE 
*/
//LIST OF PRODUCTS
productRouter.get('/', async (req,res)=>{         //las funciones vinculadas a la BD son asincronicas, por eso el "async"
    const products = await productModel.find();
    res.json({status: "success", payload: products});
});

//SEARCH PRODUCT BY ID
productRouter.get('/:pid', async (req,res)=>{
    const productID = req.params.pid;
    const result = await productModel.findOne({_id: productID});
    res.json({status: "success", payload: result});
});

//ADD PRODUCT
productRouter.post('/', async (req,res)=>{
    let{title, description, thumbnail, price, status, code, stock, category} = req.body;
    if(!title || !description || !thumbnail || !price || !status || !code || !stock || !category){  //si los datos no estan completos, da error
            return res.send({status:"error", error:"Incomplete values"});
    } else {
            let result = await productModel.create({
                title,
                description,
                thumbnail,
                price,
                status,
                code,
                stock,
                category
            });
            res.send({status:"success", payload: result});  //se devuelve el producto agregado
    }
});

//UPDATE PRODUCT
productRouter.put('/:pid', async (req, res) =>{
    const productID = req.params.pid;
    let dataToUpdate = req.body;
    const result = await productModel.updateOne({_id: productID}, dataToUpdate);
    res.send ({status: "success", payload: result});
});

//DELETE PRODUCT
productRouter.delete('/:pid', async (req,res)=>{
    const productID = req.params.pid;
    const result = await productModel.deleteOne({_id: productID});
    res.send ({status: "success", payload: result});
})
/* 
* END FUNCTIONS WITH MONGOOSE
*/


export default productRouter;