import express from 'express';
import CartManager from '../../classes/CartManager.js';
const cartRouter = express.Router();

const cartManager = new CartManager();

//ADD A CART
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
})

export default cartRouter;