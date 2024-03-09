import { UserService } from "../services/index.js";
import userModel from "../dao/mongo/models/user.model.js";

export const getUsers = async (req, res) => {
    const result = await UserService.getUsers();
    res.json({status: 'success', payload: result})
}

export const getUserById = async (req, res) => {
    const id = req.params;
    const result = await UserService.getUserById(id)
    res.json({status: 'success', payload: result})
}

export const saveUser = async (req, res) => {
    const user = req.body;
    const result = await UserService.saveUser(user);
    res.send({status: 'success', payload: result})
}

export const changeRol = async(req,res)=>{    
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
}

export const deleteUser = async(req,res)=>{
    const uid = req.params.uid;
    const userToDelete = await userModel.findByIdAndDelete(uid);
    console.log(userToDelete)
    try{
        console.log(`The user ${userToDelete.firstName} ${userToDelete.lastName} was deleted succesfully`);
        res.status(200).send(`The user was deleted succesfully`)
    }catch(error){
        console.error('The user cannot be deleted');
        res.status(500).send('Error trying to delete the user')
    }
}