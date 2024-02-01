import express from "express";
import userModel from "../dao/mongo/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const sessionRouter= express.Router();

//Crear usuario en la DB
/* sessionRouter.post('/singup', async (req,res)=>{
    const userInformation = req.body;
    if(userInformation.email === 'adminCoder@coder.com' && userInformation.password === 'adminCod3r123'){
        const rol = {rol: "Administrador"};
        userInformation.password = createHash(req.body.password);
        const userInformationWithRol = {...userInformation,...rol};
        const user = await userModel.create(userInformationWithRol);
    } else {
        const rol = {rol: "Usuario"};
        userInformation.password = createHash(req.body.password);
        const userInformationWithRol = {...userInformation,...rol};
        const user = await userModel.create(userInformationWithRol);
    }
    res.redirect('/login');
}); */
sessionRouter.post('/singup', passport.authenticate('register', {failureRedirect: '/failregister'}), async(req, res)=>{         //para la autenticacion usa un metodo personalizado "register"
    res.redirect('/login');
})
sessionRouter.get('/failregister', async(req, res)=>{
    console.log("Failed Strategy");
    res.send({error: "Failed"});
})

//Iniciar sesion de usuario cargado en la DB
/* sessionRouter.post('/login', async(req,res)=>{
    const {email , password} = req.body;
    const userLoged = await userModel.findOne({email});
    console.log(userLoged);
    if(!userLoged){
        return res.redirect('login', {error: 'The user doesnt exist in our data base'});
    }
    if(!isValidPassword(userLoged, password)){
        return res.status(403).send({status: 'error', error: 'Incorrect password'});
    }
    req.session.user = userLoged;
    res.redirect('/profile');
}) */
sessionRouter.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), async(req, res)=>{    //para la autenticacion usa un metodo personalizado "login"
    if(!req.user){
        return res.status(400).send({status:"error", error:"The user doesnt exist in our data base"})
    }
    req.session.user = {
        firstName : req.user.firstName,
        lastName : req.user.lastName,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol,
        cart: req.user.cart
    }
    res.redirect('/profile');
    /* res.send({status: "success", payload: req.user}); */
});

sessionRouter.get('/faillogin', async(req, res)=>{
    console.log("Failed Strategy");
    res.send({error: "Failed Login"});
})

//Restaurar contraseña de usuario
sessionRouter.post('/changePassword', async(req,res)=>{
    const {email , password} = req.body;
    const userToModify = await userModel.findOne({email});
    console.log(userToModify);
    if(userToModify == null){
        console.log('The user doesnt exist in our data base');
        return res.redirect('/login');
    }
    userToModify.password = createHash(password);
    req.session.user = userToModify;
    res.redirect('/profile');
})

//Cerrar sesion de usuario
sessionRouter.get('/logout', async (req,res)=>{
    req.session.destroy( error =>{
        if(error){
            return res.send('Logout error');
        } else {
            res.redirect('/login');
        }
    })
})


//Perfil de usuario
sessionRouter.get('/', (req,res)=>{
    const user = req.session.user;   //toma los datos del usuario desde la base de datos session

    res.render('home',{user});
})

//Ingresar con usuario de Github
sessionRouter.get(
    '/login-github',
    passport.authenticate('github', {scope: ['user:email']}),
    async(req,res) => {}
)

sessionRouter.get(
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

sessionRouter.get('/private', (req,res)=>{
    res.json(req.session.user);
});

export default sessionRouter;