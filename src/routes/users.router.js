import express from 'express';
import userModel from '../dao/mongo/models/user.model.js';

import { getUsers, getUserById, saveUser } from '../controllers/user.controller.js';
import { UserService } from '../services/index.js';

const usersRouter = express.Router();

/*
/RUTAS USANDO FACTORY
*/

//Traer los datos de todos los usuarios
usersRouter.get('/', getUsers);  

//Grabar un usuario
usersRouter.post('/', saveUser);

//Traer los datos principales de los usuarios
usersRouter.get('/data', async(req,res)=>{             
        try {
                const users = await userModel.find({}, { firstName: 1, email: 1, rol: 1, _id: 0 });
                if (users.length === 0) {
                        return res.status(404).json({ message: 'The users data base is empty' });
                }
                res.status(200).json(users);
        } catch (error) {
                console.error('Error searching the users data:', error);
                res.status(500).json({ message: 'Error searching the users data.' });
        }
        ;
});

//Buscar usuario por Id
usersRouter.get('/:uid', getUserById);

//Cambiar de usuario premium a estandar y viceversa
usersRouter.post('/premium/:uid', async(req,res)=>{    
        const uid = req.params.uid;                           // Extraer el _id del parámetro uid
        const user = await userModel.findById(uid);
        console.log(user)
        try{
                let newRol;
                if(user.rol ==='Premium'){
                        newRol = 'Usuario';
                } else if(user.rol ==='Usuario') {
                        newRol = 'Premium';
                } else {
                        console.log('The user is an Administrator')
                        return res.status(403).send('The user is an Administrator')
                }
                user.rol=newRol;
                await user.save();
                console.log(`The user ${user.firstName} has changed his rol to ${newRol}`);
                res.status(200).send(`The user has changed his rol to ${newRol}`)
        } catch(error){
                console.error('The user rol cannot be changed');
                res.status(500).send('Error changing the user rol')
        }
});

//Eliminar usuario con ultima conexion mayor a 2 dias
usersRouter.delete('/lastLogin', async(req,res)=>{             //date.now da la hora actual en milisegundos
        try{
        const timeLimitation = (Date.now() - (2*24*60*60*1000) )        //hora actual menos 2 dias en segundos
        const usersDeleted = await userModel.deleteMany({lastLogin: {$lt:timeLimitation}})
        res.status(200).json({ message: `${usersDeleted.deletedCount} users deleted successfully.` });
        } catch (error) {
        console.error('Error deleting users:', error);
        res.status(500).json({ message: 'Internal server error.' });
        }
})


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