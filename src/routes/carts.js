import express from 'express';
import CartManager from '../dao/CartManager.js';
const cartRouter = express.Router();
import cartModel from '../dao/mongo/models/carts.model.js';
import productModel from '../dao/mongo/models/products.model.js';
import { addProductToCart, completePurchase, createCart, getCartById, getCarts, resolveCart } from '../controllers/cart.controller.js';
import { addProduct } from '../controllers/store.controllers.js';
import { addDevelopmentLogger, addProductionLogger } from '../utils/logger.js';

const cartManager = new CartManager();


/* 
* FUNCTIONS WITH FILESYSTEM 
*/
/* //ADD A CART
cartRouter.post('/', (req, res)=>{
    cartManager.addCart();
    const listOfCarts = cartManager.getCart();
    res.status(200).json({carts:listOfCarts});
})

//ADD A PRODUCT IN A CART
cartRouter.post('/:cid/product/:pid', (req,res)=>{
    let cartID = Number(req.params.cid);
    let productID = Number(req.params.pid);
    cartManager.addProduct(cartID,productID);

    const listOfCarts = cartManager.getCart();
    res.status(200).send({carts: listOfCarts});
})

//LOOK PRODUCTS IN A CART
cartRouter.get('/:cid', (req,res)=>{
    let cartID = Number(req.params.cid);
    const listOfProducts = cartManager.seeProducts(cartID);

    res.status(200).send({products: listOfProducts});
}); */
/* 
* END FUNCTIONS WITH FILESYSTEM 
*/


cartRouter.use(addProductionLogger)

/* 
* FUNCTIONS WITH FACTORY
*/
cartRouter.get('/', getCarts )
cartRouter.get('/:cid', getCartById)
cartRouter.post('/', createCart)
cartRouter.post('/:cid', resolveCart);
cartRouter.post('/:cid/product/:pid', addProductToCart);
cartRouter.post('/:cid/purchase', completePurchase);

/* 
*  END FUNCTIONS WITH FACTORY
*/



/* 
* FUNCTIONS WITH MONGOOSE 
*/
/* 
//LIST OF CARTS
cartRouter.get('/', async (req,res)=>{         //las funciones vinculadas a la BD son asincronicas, por eso el "async"
    const carts = await cartModel.find({_id:"653943a9988e3c2ecfba01b2"});
    res.json({status: "success", payload: carts});

});

//ADD A CART
cartRouter.post('/', async (req,res)=>{
    let{cartName} = req.body;
    if(!cartName){  //si los datos no estan completos, da error
            return res.send({status:"error", error:"Incomplete values"});
    } else {
            let result = await cartModel.create({
                cartName: cartName,
                products: []
            });
            res.send({status:"success", payload: result});  //se devuelve el cart agregado
    }
});

//LOOK PRODUCTS IN A CART
cartRouter.get('/:cid', async (req,res)=>{
    const cartID = req.params.cid;
    const result = await cartModel.findOne({_id: cartID}).populate('products.productId'); //los parametros del populate indican que se debe rellenar el campo "productId" del 
    console.log(result)                                                                   //array products con la coleccion especificada en el ref (en este caso coleccion products)
    const cartName = result.cartName;
    const listOfProductsFromCart = result.products.map(product => ({     //hago un map porque trae los productos como array
        title: product.productId.title,
        description: product.productId.description,
        thumbnail: product.productId.thumbnail,
        price: product.productId.price,
        status: product.productId.status,
        code: product.productId.code,
        stock: product.productId.stock,
        category: product.productId.category
    }));

    res.render('cart', {listOfProducts:listOfProductsFromCart, cartName: cartName});
});

//ADD A PRODUCT IN A CART
cartRouter.post('/:cid/products/:pid', async (req,res)=>{
    const cartID = req.params.cid;
    const productIDtoAdd = req.params.pid;
    const cartSearched = await cartModel.findOne({_id: cartID});
    cartSearched.products.push({productId : productIDtoAdd});
    const result = await cartSearched.save();
    res.send({status:"success", payload: result});
});


//DELETE A PRODUCT IN A CART
cartRouter.delete('/:cid/products/:pid', async (req,res)=>{
    const cartID = req.params.cid;
    const productID = req.params.pid;
    const cartSearched = await cartModel.findOne({_id: cartID});
    const productUbication = cartSearched.products.findIndex((element) => element.productId == productID);
    if(productUbication == -1){
        console.log("The product searched was not found in our data base");
        res.send({status: "error"});
    } else {
        const result = cartSearched.products.splice(productUbication,1);
        await cartSearched.save(); 
        res.send({status: "success", payload: result});
    }
});


//UPDATE PRODUCT QUANTITY IN A CART
cartRouter.put('/:cid/products/:pid', async (req, res) =>{
    const cartID = req.params.cid;
    const productID = req.params.pid;
    let dataToUpdate = req.body;
    console.log(dataToUpdate);
    const cartSearched = await cartModel.findOne({_id: cartID});
    const productUbication = cartSearched.products.findIndex((element) => element.productId == productID);
    if(productUbication == -1){
        console.log("The product searched was not found in our data base");
        res.send({status: "error"});
    } else {
        cartSearched.products[productUbication].quantity = dataToUpdate.quantity;
        console.log (cartSearched.products[productUbication]);
        await cartSearched.save(); 
        res.send({status: "success", payload: cartSearched.products[productUbication]});
    }
});

//DELETE ALL THE CONTENT FROM A CART
cartRouter.delete('/:cid', async (req,res)=>{
    const cartID = req.params.cid;
    const cartSearched = await cartModel.findOne({_id: cartID});
    const result = cartSearched.products = [];
    await cartSearched.save();
    res.send ({status: "success", payload: result});
});
*/


/* //DELETE CART
cartRouter.delete('/:cid', async (req,res)=>{
    const cartID = req.params.cid;
    const result = await cartModel.deleteOne({_id: cartID});
    res.send ({status: "success", payload: result});
}) */
/* 
* END FUNCTIONS WITH MONGOOSE
*/



export default cartRouter;