import { UserService } from "../services/index.js";

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
    const result = await UserService.addStore(user);
    res.send({status: 'success', payload: result})
}