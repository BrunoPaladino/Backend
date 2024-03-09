import mongoose from "mongoose"
import { CartService, StoreService, TicketService, UserService } from "./index.js"
import UserRepository from "./user.repository.js"
import productModel from "../dao/mongo/models/products.model.js"

export default class CartRepository{

    constructor(dao){
        this.dao=dao
    }

    getCarts = async () => {
        return await this.dao.getCarts()
    }

    getCartById = async (cid) => {
        return await this.dao.getCartById(cid)
    }

    createCart = async (cart) => {
        cart.this.status = 'pending'
        return await this.dao.createCart(cart)
    }

    deleteProductFromCart = async (cid, pid) =>{
        const cart = await this.getCartById(cid);
        const productInCartIndex = cart.products.findIndex ((product) => product.productId.equals(pid));
        if(productInCartIndex !== -1){
            cart.products.splice(productInCartIndex,1);
            await cart.save();
        } else {
            console.log("The product is not in the cart");
    }
    }

    resolveCart = async (cid, resolve) => {
        const cart = this.getCartById(cid)
        cart.status = resolve

        return await this.dao.updateCart(cid, cart)
    }

    productCart = async (cid, pid, quantity = 1) =>{
        const cart = await this.getCartById(cid);
        const productInCartIndex = cart.products.findIndex (product => product.productId.equals(pid));
        if(productInCartIndex !== -1){
            cart.products[productInCartIndex].quantity = cart.products[productInCartIndex].quantity +1;
        } else {
            const productToAdd = {productId : pid, quantity};
            cart.products.push(productToAdd);
        }
        return await this.dao.updateCart(cid, cart);
    }

    completePurchase = async (cid) => {
        const cart = await this.getCartById(cid);
        console.log(cart);
        let totalAmountPurchase = 0;
        const listOfProductsInStore = await StoreService.getStores();
        for (const product of cart.products){           //uso for..of, en lugar de map, para poder usar await despues y poder actualizar el stock de los productos comprados
            const actualProductIndex = listOfProductsInStore.findIndex( (productInStore) => product.productId.toString() === productInStore._id.toString());
            if((actualProductIndex !== -1) && (listOfProductsInStore[actualProductIndex].stock >= product.quantity) ){
                let productAmountPurchase = listOfProductsInStore[actualProductIndex].price * product.quantity;
                listOfProductsInStore[actualProductIndex].stock = listOfProductsInStore[actualProductIndex].stock - product.quantity;
                console.log(productAmountPurchase)
                totalAmountPurchase = totalAmountPurchase + productAmountPurchase;
                await CartService.deleteProductFromCart(cid, product.productId);
            }
        }
        await Promise.all(listOfProductsInStore.map( async (productInStore) => {            //Promise.all espera a que se actualicen todos los stocks y despues pasa a crear el ticket de compra
            await productModel.findByIdAndUpdate(productInStore._id, {stock: productInStore.stock});
        }))
        
        const ticket = {
            code: cid,
            purchaseDateTime: new Date(),
            amount: totalAmountPurchase,
            //purchaser: mongoose.Types.ObjectId(String(cart.cartName))
        };
        await TicketService.createTicket(ticket);
        console.log(`Purchase completed, ticket code: ${ticket.code}, amount: ${ticket.amount}`);
        return(ticket)
    }
}