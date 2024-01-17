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

    resolveCart = async (cid, resolve) => {
        const cart = this.getCartById(cid)
        cart.status = resolve

        return await this.dao.updateCart(cid, cart)
    }
}