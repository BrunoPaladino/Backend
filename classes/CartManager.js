import fs from 'fs';

class CartManager{
    constructor(){
        this.carts = [];
        this.cartId = 1;
        this.path = "../cart.json";

        this.productId = 1;
    }

    //TRAER CARRITO
    getCart(){
        if(fs.existsSync(this.path)){
            const JSONreaded = fs.readFileSync(this.path, "utf-8");
            const productsToObject = JSON.parse(JSONreaded);
            console.log(productsToObject);
            return productsToObject ;
        } else {
            console.log("The file does not exist");
        }
    }

    //AGREGAR UN CARRITO
    addCart = () => {
        const newCart = {
            id: this.cartId++,
            products: [],
        };

        if(fs.existsSync(this.path)){
            const JSONreaded = fs.readFileSync(this.path, "utf-8");
            const productsToObject = JSON.parse(JSONreaded);
            productsToObject.push(newCart);
            const productsToJSON = JSON.stringify(productsToObject);       //transformo el array a archivo tipo JSON y lo escribo con fs.write
            fs.writeFileSync(this.path, productsToJSON);
        } else {
            this.carts.push(newCart);
            const productsToJSON = JSON.stringify(this.carts);       //transformo el array a archivo tipo JSON y lo escribo con fs.write
            fs.writeFileSync(this.path, productsToJSON);
        }
    }

    //AGREGAR PRODUCTO A UN CARRITO
    addProduct = (idCartToAdd, idProductToAdd) => {
        const JSONreaded = fs.readFileSync(this.path, "utf-8");
        const productsToObject = JSON.parse(JSONreaded);
        let cartSearched = productsToObject.find((element) => element.id === idCartToAdd);
        if(cartSearched){

            const newProduct ={
                id: idProductToAdd,
                quantity: 1
            };

            cartSearched.products.push(newProduct);
            const productsToJSON = JSON.stringify(productsToObject);       //transformo el array a archivo tipo JSON y lo escribo con fs.write
            fs.writeFileSync(this.path, productsToJSON);
        } else {
            console.error("The code of the cart does not belongs to our system");
        }
    }

    //VER CONTENIDO DE CARRITO
    seeProducts = (idCartToWatch) =>{
        const JSONreaded = fs.readFileSync(this.path, "utf-8");
        const productsToObject = JSON.parse(JSONreaded);
        let cartSearched = productsToObject.find((element) => element.id === idCartToWatch);
        if(cartSearched){
                return cartSearched.products;
            } else {
                console.error("The code of the cart does not belongs to our system");
        }
    }

}

export default CartManager;

//PRUEBAS DE FUNCIONAMIENTO DE LOS METODOS
//const cartManager = new CartManager();

/* cartManager.addCart();
cartManager.addCart(); */
/* cartManager.addProduct(1,4); */