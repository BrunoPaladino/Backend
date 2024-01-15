import cartModel from "./models/carts.model.js";

export default class Cart {
    getCarts = async () => {
        return await cartModel.find()
    }

    getCartById = async (id) => {
        return await cartModel.findById(id)
    }

    createCart = async (cart) => {
        return await cartModel.create(cart)
    }

    updateCart = async (id, cart) => {
        return await cartModel.updateOne({_id:id},{$set: cart})
    }

}