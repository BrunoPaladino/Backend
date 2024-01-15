import express from 'express';
import userModel from '../dao/mongo/models/user.model.js';

import { getUsers, getUserById, saveUser } from '../controllers/user.controller.js';

const usersRouter = express.Router();


//Rutas usando factory
usersRouter.get('/', getUsers);
usersRouter.get('/:uid', getUserById);
usersRouter.post('/', saveUser);



/* 
* FUNCTIONS WITH MONGOOSE 
*/
/* 
//LIST OF USERS
usersRouter.get('/', async (req,res)=>{         //las funciones vinculadas a la BD son asincronicas, por eso el "async"
        const users = await userModel.find();
        res.json({status: "success", payload: users});
});

//SEARCH USER BY ID
usersRouter.get('/:uid', async (req,res)=>{
        const userID = req.params.uid;
        const result = await userModel.findOne({_id: userID});
        res.json({status: "success", payload: result});
});

//ADD USERS
usersRouter.post('/', async (req,res)=>{
        let{firstName,lastName,email} = req.body;
        if(!firstName || !lastName || !email){  //si los datos no estan completos, da error
                return res.send({status:"error", error:"Incomplete values"});
        } else {
                let result = await userModel.create({
                        firstName,
                        lastName,
                        email
                });
                res.send({status:"success", payload: result});  //se devuelve el usuario agregado
        }
});

//UPDATE USERS
usersRouter.put('/:uid', async (req, res) =>{
        const userID = req.params.uid;
        let dataToUpdate = req.body;
        const result = await userModel.updateOne({_id: userID}, dataToUpdate);
        res.send ({status: "success", payload: result});
});

//DELETE USER
usersRouter.delete('/:uid', async (req,res)=>{
        const userID = req.params.uid;
        const result = await userModel.deleteOne({_id: userID});
        res.send ({status: "success", payload: result});
})
 */

export default usersRouter;