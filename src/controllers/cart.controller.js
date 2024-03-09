import storeModel from "../dao/mongo/models/stores.model.js";
import { createCheckoutButton } from "../mercadoPago.js";
import { CartService, StoreService } from "../services/index.js";
import { MercadoPagoConfig, Preference } from 'mercadopago';


export const getCarts = async (req, res) => {
    const result = await CartService.getCarts();
    res.json({status: 'success', payload: result})
}

export const getCartById = async (req, res) => {
    const id = req.params;
    const result = await CartService.getCartById(id)
    res.json({status: 'success', payload: result})
}

export const createCart = async (req, res) => {
    const cart = req.body;
    const result = await CartService.createCart(cart);
    res.send({status: 'success', payload: result})
}

export const resolveCart = async (req, res) => {
    const resolve = req.query;
    const id = req.params;
    
    const result = await CartService.resolveCart(id, resolve);
    res.send({status: 'success', payload: result})
}

export const addProductToCart = async (req, res) => {
    const userRol = req.body;
    const {cid, pid} = req.params;
    console.log(userRol);
    const productToAdd = await StoreService.getStoreById(pid);
    console.log(productToAdd);
    console.log(userRol.userRol);
    try{
        if(productToAdd.owner === 'Premium' && userRol.userRol === 'Premium'){
            console.log('The product cannot be added to your cart because you are a Premium user and you added that product to the store');
            res.status(500).send({ status: 'error', message: 'The product cannot be added to your cart because you are a Premium user and you added that product to the store' });
        } else {
            const result = await CartService.productCart(cid, pid);
            req.productionLogger.info(`Product added to cart. Cart ID: ${cid}, Product ID: ${pid}`)
            res.send({status: 'success', payload: result})
        }
    } catch(error) {
        req.productionLogger.error(`Error adding the product to cart: ${error}`)
        res.status(500).send({ status: 'error', message: 'Error adding the product to cart' });
    }
}

export const completePurchase = async (req, res) => {
    const {cid} = req.params;
    console.log(cid);
    try{
        req.productionLogger.info(`The customer is completing the purchase of the cart: ${cid}`);
        const cart = CartService.getCartById(cid);
        const resultTicket = await CartService.completePurchase(cid);
        const client = new MercadoPagoConfig({ accessToken: 'TEST-5960060632517163-030910-a55d849894a5de67015dedf87912897b-197709645' });
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    // llenar con items del carrito
                    { title: 'Mi producto', quantity: 1, unit_price: 2000 }
                ],
            }
        })

        console.log(result.id);
        res.status(200).send({status: 'success', payload: result.id})
    } catch (error){
        req.productionLogger.error(`Error finishing the purchase: ${error}`)
        res.status(500).send({ status: 'error', message: 'Error finishing the purchase' });
    }
}