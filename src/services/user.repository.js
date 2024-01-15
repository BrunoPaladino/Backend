export default class UserRepository{

    constructor(dao){
        this.dao=dao
    }

    getUsers = async () => {
        return await this.dao.getUsers()
    }

    getUserById = async (id) => {
        return await this.dao.getUserById(id)
    }

    saveUser = async (user) => {
        return await this.dao.saveUser(user)
    }

}