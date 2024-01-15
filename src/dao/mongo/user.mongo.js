import userModel from "./models/user.model.js";

export default class User {

    getUsers = async () => {
        return await userModel.find();
    }

    getUserById = async (id) => {
        return await userModel.findById(id);
    }

    saveUser = async (user) => {
        return await userModel.create(user);
    }

}