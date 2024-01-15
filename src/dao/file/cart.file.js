import cartModel from "../mongo/models/carts.model.js";
import FileManager from "./file.manager.js";

export default class Cart extends FileManager{      //al hacer "extends" hacemos que en Cart esten los metodos de FileManager

    constructor(filename = './db/orders.json'){
        super(filename)                         //"super" se usa para que el constructor de FileManager se aplique
    }

    getCarts = async () => {
        return await this.get()
    }

    getCartById = async (id) => {
        return await this.getById(id)
    }

    createCart = async (cart) => {
        return await this.add(cart)
    }

    updateCart = async (id, cart) => {
        cart._id = id;
        return await this.update(cart)
    }
}