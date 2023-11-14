import express from "express";
import userModel from "../dao/models/user.model.js";

const sessionRouter= express.Router();

sessionRouter.post('/singup', async (req,res)=>{
    const userInformation = req.body;
    const user = await userModel.create(userInformation);

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

export default sessionRouter;