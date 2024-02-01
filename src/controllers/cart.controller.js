import { CartService } from "../services/index.js";

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
    const {cid, pid} = req.params;
    const result = await CartService.productCart(cid, pid);
    res.send({status: 'success', payload: result})
}

export const completePurchase = async (req, res) => {
    const {cid} = req.params;
    console.log(cid)
    const result = await CartService.completePurchase(cid);
    res.send({status: 'success', payload: result})
}