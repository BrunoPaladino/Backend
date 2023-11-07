import express from 'express';
import CartManager from '../dao/CartManager.js';
const cartRouter = express.Router();
import cartModel from '../dao/models/carts.model.js';
import productModel from '../dao/models/products.model.js';

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





/* 
* FUNCTIONS WITH MONGOOSE 
*/
//LIST OF CARTS
cartRouter.get('/', async (req,res)=>{         //las funciones vinculadas a la BD son asincronicas, por eso el "async"
/*     const carts = await cartModel.find();
    res.json({status: "success", payload: carts}); */

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
    const result = await cartModel.findOne({_id: cartID});
    const cartName = result.cartName;
    const listOfProductsFromCart = result.products.map(product => ({     //hago un map porque trae los productos como array
        title: product.title,
        description: product.description,
        thumbnail: product.thumbnail,
        price: product.price,
        status: product.status,
        code: product.code,
        stock: product.stock,
        category: product.category
    }));

    res.render('cart', {listOfProducts:listOfProductsFromCart, cartName: cartName});
});

//ADD A PRODUCT IN A CART
cartRouter.post('/:cid', async (req,res)=>{
    let{title, description, thumbnail, price, status, code, stock, category} = req.body;
    if(!title || !description || !thumbnail || !price || !status || !code || !stock || !category){  //si los datos no estan completos, da error
            return res.send({status:"error", error:"Incomplete values of the product"});
    } else {
            let productToAdd = await new productModel({    //lo instancio como modelo (parecido a instanciar como clase) ya que si uso 
                title,                                     // "productModel.create" se guarda el nuevo producto en la coleccion de "products" tambien
                description,
                thumbnail,
                price,
                status,
                code,
                stock,
                category
            });
    const cartID = req.params.cid;
    const cartSearched = await cartModel.findOne({_id: cartID});
    console.log(cartSearched)
    cartSearched.products.push(productToAdd);
    await cartSearched.save();      //debo agregar el "save()" para que los cambios se guarden en la base de datos 
    res.send({status:"success", payload: cartSearched});  //se devuelve el usuario obtenido
    }
});


//DELETE A PRODUCT IN A CART
cartRouter.delete('/:cid/products/:pid', async (req,res)=>{
    const cartID = req.params.cid;
    const productID = req.params.pid;
    const cartSearched = await cartModel.findOne({_id: cartID});
    const productUbication = cartSearched.products.findIndex((element) => element._id == productID);
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
    const productUbication = cartSearched.products.findIndex((element) => element._id == productID);
    if(productUbication == -1){
        console.log("The product searched was not found in our data base");
        res.send({status: "error"});
    } else {
        cartSearched.products[productUbication].stock = dataToUpdate.stock;
        console.log (cartSearched.products[productUbication]);
        await cartSearched.save(); 
        res.send({status: "success", payload: cartSearched.products[productUbication]});
    }
});     //cuando guardo el carrito ya actualizado, no se guarda la actualizacion en la base de datos
        //aunque el stock del producto si se actualice

//DELETE ALL THE CONTENT FROM A CART
cartRouter.delete('/:cid', async (req,res)=>{
    const cartID = req.params.cid;
    const cartSearched = await cartModel.findOne({_id: cartID});
    const result = cartSearched.products = [];
    await cartSearched.save();
    res.send ({status: "success", payload: result});
});

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