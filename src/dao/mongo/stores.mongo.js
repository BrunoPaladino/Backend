import storeModel from "./models/stores.model.js"

export default class Store{
    getStores = async () =>{
        return await storeModel.find()
    }

    getStoreById = async (id) => {
        return await storeModel.findById(id)
    }

    saveStore = async (store) => {
        return await storeModel.create(store)
    }

    updateStore = async (id, store) => {
        return await storeModel.updateOne({_id: id},{$set: store})
    }

}