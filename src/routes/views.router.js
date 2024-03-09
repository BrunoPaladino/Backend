import express from "express";
import ProductManager from "../dao/ProductManager.js";

import { Server } from "socket.io";
import http from 'http';
import productModel from "../dao/mongo/models/products.model.js";
import cartModel from "../dao/mongo/models/carts.model.js";
import userModel from "../dao/mongo/models/user.model.js";

import passport from "passport";

import nodemailer from 'nodemailer';

import crypto from 'crypto'
import { createHash } from "../utils.js";
import bcrypt from 'bcrypt';
import UserRepository from "../services/user.repository.js";
import { UserService } from "../services/index.js";

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
        
        if(user.rol === "Administrador"){
            const isAdmin = user.rol;
            console.log("Ingreso de administrador")
            res.render('home', { listOfProducts: listOfProducts.docs,user, isAdmin });  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
        }
        res.render('home', { listOfProducts: listOfProducts.docs,user });  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
    } else {
        const listOfProducts = await productModel.paginate( {} , {
            page,
            limit,
            sort: {price: sortByPrice},
            lean: true
        });
        listOfProducts.prevLink=listOfProducts.hasPrevPage? `/?page=${listOfProducts.prevPage}&limit=${limit}`:" "
        listOfProducts.nextLink=listOfProducts.hasNextPage? `/?page=${listOfProducts.nextPage}&limit=${limit}`:" "
        if(user != undefined && user.rol === "Administrador"){
            const isAdmin = user.rol;
            res.render('home', { listOfProducts: listOfProducts.docs,user, isAdmin });  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
        }
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
        if (user.rol === "Administrador"){
            const isAdmin = user.rol;
            res.render('cart', {listOfProducts:listOfProducts, cartName: cartName, user, isAdmin});  //metodo para renderizar render(nombre de plantilla, objeto para reemplazar en la plantilla)
        }
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
    if(user!= undefined && user.rol === "Administrador"){
        const isAdmin = user;
        res.render('profile',{isAdmin})
    } else if(user!= undefined && user.rol === "Premium"){
        const isPremium = user;
        res.render('profile',{isPremium})
        }else{
            if(user!= undefined && user.rol != "Administrador"){
                res.render('profile',{user});
            } else {
                res.render('profile',{});
        }
    }
})

//Control de usuarios desde el Administrador
router.get('/userscontrol', async (req,res)=>{
    try{
        const adminLogged= req.session.user;
        const users = await userModel.find()
        const listOfUsers = users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            rol: user.rol,
            _id: user._id
        }));
        console.log(listOfUsers)
        res.render('userscontrol', {listOfUsers: listOfUsers, adminLogged: adminLogged})
        } catch(error){
            console.error(`Error taking the list of users: `, error);
            res.status(500).send(`Error taking the list of users`)
        }
})

//Agregar Producto Mongo
router.get('/addproduct', (req, res) =>{
    const user = req.session.user;
    res.render('addProduct', {user})
})

//Eliminar Producto Mongo
router.get('/removeproduct', (req, res) =>{
    const user = req.session.user;
    res.render('removeProduct', {user})
})

//Actualizar Producto Mongo
router.get('/updateproduct', (req, res) =>{
    res.render('updateProduct')
})


//Configuracion para enviar por mail la restauracion de contraseña
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'bruno.s.paladino@gmail.com',
        pass: 'haibbvsvzhrhwaro'                //contraseña dada por gmail para aplicacion
    },
    tls: {
        rejectUnauthorized: false
    }
});

//Funcion para generar un token unico
function generateToken(){
    return crypto.randomBytes(20).toString('hex');
}

//Renderizar form para restaurar contraseña con mail
router.get('/mail', async (req, res) =>{
    res.render('mail')
})

//Restaurar contraseña por mail
router.post('/passwordRestore', async (req, res) =>{
    const {email} = req.body;
    try{
        const userToChangePassword = await userModel.findOne({email: email})
        if(!userToChangePassword){
            return res.status(400).send('User not found');
        }
        const token = generateToken();      //genera token para cambiar la contraseña del usuario
        const expires = Date.now() + 3600000;       // 1 hora
        userToChangePassword.resetPasswordToken = token;
        userToChangePassword.resetPasswordExpires = expires;
        await userToChangePassword.save();              //guarda el usuario en MongoDB

        const resetLink= `http://localhost:8080/resetPassword/${token}`;        //link para restaurar contraseña
        const result = await transport.sendMail({                               //enviar mail para restaurar contraseña
            from: 'bruno.s.paladino@gmail.com',
            to: 'bruno.s.paladino@gmail.com',
            subject: 'Restore your password',
            html: `
                <div>
                    <h1> Restore your password </h1>
                    <p> To do it use the link below: </p>
                    <a href ${resetLink}'> ${resetLink}</a>
                </div>
            `,
            attachments: []
        })
        res.send(`Email sent!`)
    } catch(error){
        console.error(`Error sending email: `, error);
        res.status(500).send(`Error sending email`)
    }
})


//Endpoint para restaurar contraseña
router.get('/resetPassword/:token', async(req,res)=>{           //el endpoint es el enviado por mail
    const {token} = req.params;
    try {
        const user = await userModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        console.log(user);
        if (!user) {
            res.status(400).send('El token de restablecimiento de contraseña no es válido o ha expirado');
            res.render('/mail', {})                                         //redirigimos a la pagina para que coloque el mail de nuevo para restaurar contraseña
        } else {
            res.render('restorePasswordPage', { token });                     // Renderizar la página para reestablecer la contraseña
        }
    } catch (error) {
        console.error('Error restoring password :', error);
        res.status(500).send('Error restoring password');
    }
})

// Endpoint para actualizar la contraseña
router.post('/restorePasswordPage/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const user = await userModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            res.status(400).send('El token de restablecimiento de contraseña no es válido o ha expirado');
            res.render('/mail', {})                                 //redirigimos a la pagina para que coloque el mail de nuevo para restaurar contraseña
        }

        if(bcrypt.compareSync(newPassword, user.password) == true ){          //se asegura que la nueva contraseña no sea la misma que la anterior
            res.status(400).send('The new password needs to be different from the last one');
        } else {
            // Actualizar la contraseña y eliminar el token de restablecimiento
            user.password = createHash(newPassword);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.status(200).send('Contraseña restablecida correctamente');
        }
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).send('Error al restablecer la contraseña');
    }
});

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