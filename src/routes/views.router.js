import express from "express";
import ProductManager from "../dao/ProductManager.js";

import { Server } from "socket.io";
import http from 'http';
import productModel from "../dao/mongo/models/products.model.js";
import cartModel from "../dao/mongo/models/carts.model.js";
import userModel from "../dao/mongo/models/user.model.js";

import passport from "passport";

const productManager = new ProductManager();
const router = express.Router();

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);


//PRODUCTS
router.get('/', async (req,res)=>{
    const limit = parseInt(req.query?.limit?? 10);  //el "?."" accede al valor de limit, si es nulo aplica 10
    const page = parseInt(req.query?.page?? 1);
    const categorySearched = req.query.category;      //busqueda por categoria
    //Ordenamiento por precio, si el query es "asc" ordena ascendente, si es "desc" ordena descendente, y si no se da un query sort no ordena
    const sortByPrice = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : undefined; 
    const user = req.session.user                   //toma los datos del usuario desde la base de datos session
    if(categorySearched){
        const listOfProducts = await productModel.paginate( {category: categorySearched} , {      //trae todos los productos y el esquema
            page,
            limit,
            sort: {price: sortByPrice},     //ordenamiento de productos por precio
            lean: true    //con esta propiedad del paginado pasamos el contenido en formato json para que el handlebars lo pueda incorporar
        });
        listOfProducts.prevLink=listOfProducts.hasPrevPage? `/?page=${listOfProducts.prevPage}&limit=${limit}`:" "
        listOfProducts.nextLink=listOfProducts.hasNextPage? `/?page=${listOfProducts.nextPage}&limit=${limit}`:" "

        console.log(listOfProducts.nextPage)
        res.render('home', { listOfProducts: listOfProducts.docs,user }/* {
            status: listOfProducts.status,
            payload: listOfProducts,
            totalPages: listOfProducts.totalPages,
            prevPage: listOfProducts.prevPage,
            nextPage: listOfProducts.nextPage,
            page: listOfProducts.page,
            hasPrevPage: listOfProducts.hasPrevPage,
            hasNextPage: listOfProducts.hasNextPage,
            prevLink: listOfProducts.prevLink,
            netxLink: listOfProducts.netxLink
            } */);  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
    } else {
        const listOfProducts = await productModel.paginate( {} , {
            page,
            limit,
            sort: {price: sortByPrice},
            lean: true
        });
        listOfProducts.prevLink=listOfProducts.hasPrevPage? `/?page=${listOfProducts.prevPage}&limit=${limit}`:" "
        listOfProducts.nextLink=listOfProducts.hasNextPage? `/?page=${listOfProducts.nextPage}&limit=${limit}`:" "
        res.render('home', { listOfProducts: listOfProducts.docs,user });       //al hacer el paginado los productos se guardan en un array "docs", por eso pasamos asi la lista de productos
    }
});


//CART
router.get('/cart', async (req,res)=>{
    const user = req.session.user
    if(user != undefined){
        const userCart = await userModel.findOne({ email: user.email }).populate('cart');   //usamos "populate" para rellenar en el campo "cart" con los productos que corresponden al cart de Mongo que tenga la id correspondiente
        const cartName= userCart.cart.cartName;
        const listOfProducts = await Promise.all(               //el Promise.all espera a que se aplique a todos los productos del array el map y genera un array nuevo "listOfProducts"
            userCart.cart.products.map(async (product) => {     //hago un map sobre cada producto del array del usuario para obtener los datos
                const productDetails = await productModel.findById(product.productId);
                return {
                    title: productDetails.title,
                    description: productDetails.description,
                    thumbnail: productDetails.thumbnail,
                    price: productDetails.price,
                    status: productDetails.status,
                    code: productDetails.code,
                    stock: productDetails.stock,
                    category: productDetails.category
                };
            })
        );
        res.render('cart', {listOfProducts:listOfProducts, cartName: cartName, user});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
    } else {
        res.render('cart',{user})
    }
});


//PRODUCTS IN REAL TIME
router.get('/realtimeproducts', (req,res)=>{
    const listOfProducts = productManager.getProducts();
    res.render('realTimeProducts', {listOfProducts});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)

    socketServer.on('productListUpdated', ()=>{
        const updatedProducts = productManager.getProducts();
        socketServer.emit('productList', updatedProducts);
    })
});


//CHAT
router.get('/chat', (req,res)=>{
    res.render('chat', );  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
});

//METODO DE PRUEBA CON INDEX
router.get('/index', (req,res)=>{
    let testUser = {
            name: "Bruno",
            lastName : "Diaz"
    }
    res.render('index', {testUser});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
});

//RUTAS DE SESSION
//Inicio de sesion de usuario
router.get('/login', (req,res)=>{
    if(req.session?.user){      //si en session encontramos un usuario, redigirimos a profile
        return res.redirect('/profile')
    } else {
        res.render('login',{});
    }
})

//Registrar usuario
router.get('/singup', (req,res)=>{
    if(req.session?.user){
        return res.redirect('/profile')
    } else {
        res.render('singup',{});
    }
})


//Modificar contraseña
router.get('/changePassword', (req,res)=>{

    res.render('changePassword');
})


//Perfil de usuario
router.get('/profile', (req,res)=>{
    const user = req.session.user;   //toma los datos del usuario desde la base de datos session

    res.render('profile',{user});
})


//Ingresar con usuario de Github
router.get(
    '/login-github',
    passport.authenticate('github', {scope: ['user:email']}),
    async(req,res) => {}
)

router.get(
    '/githubcallback',
    passport.authenticate('github', {failureRedirect: '/'}),
    async(req,res) => {
        console.log('Callback: ', req.user);
        req.session.user = req.user;

        console.log(req.session);
        res.redirect('/');
    })

function auth(req, res, next){
    if(req.session?.user){
        next();
    }
    return res.status(401).send('Auth error');
}

router.get('/private', (req,res)=>{
    res.json(req.session.user);
});



export default router;