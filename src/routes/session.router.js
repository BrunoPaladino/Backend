import express from "express";
import userModel from "../dao/models/user.model.js";

const sessionRouter= express.Router();

sessionRouter.post('/singup', async (req,res)=>{
    const userInformation = req.body;
    if(userInformation.email === 'adminCoder@coder.com' && userInformation.password === 'adminCod3r123'){
        const rol = {rol: "Administrador"};
        const userInformationWithRol = {...userInformation,...rol};
        const user = await userModel.create(userInformationWithRol);
    } else {
        const rol = {rol: "Usuario"};
        const userInformationWithRol = {...userInformation,...rol};
        const user = await userModel.create(userInformationWithRol);
    }
    res.redirect('/login');
});

sessionRouter.post('/login', async(req,res)=>{
    const {email , password} = req.body;
    const userLoged = await userModel.findOne({email, password});
    console.log(userLoged);
    if(!userLoged){
        return res.redirect('login', {error: 'The user doesnt exist'});
    } else {
        req.session.user = userLoged;
        res.redirect('/profile');
    }
})

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

export default sessionRouter;