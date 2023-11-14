import express from "express";
import ProductManager from "../dao/ProductManager.js";

import { Server } from "socket.io";
import http from 'http';
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";

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
        res.render('home', listOfProducts/* {
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
        res.render('home', listOfProducts);
    }
});


//CART
router.get('/cart', async (req,res)=>{
    const listOfCarts = await cartModel.findOne();       //trae todos los carts con el esquema
    const cartName = listOfCarts.cartName;
    const listOfProductsFromCart = listOfCarts.products.map(product => ({     //hago un map porque trae los productos como array
        title: product.title,
        description: product.description,
        thumbnail: product.thumbnail,
        price: product.price,
        status: product.status,
        code: product.code,
        stock: product.stock,
        category: product.category
    }));

    res.render('cart', {listOfProducts:listOfProductsFromCart, cartName: cartName});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
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

//Perfil de usuario
router.get('/profile', (req,res)=>{
    const user = req.session.user;   //toma los datos del usuario desde la base de datos session

    res.render('profile',{user});
})

export default router;