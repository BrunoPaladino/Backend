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

    productCart = async (cid, pid, quantity = 1) =>{
        console.log(cid);
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

    }
}