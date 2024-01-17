import productModel from "./models/products.model.js"
import storeModel from "./models/stores.model.js"

export default class Store{
    getStores = async () =>{
        return await productModel.find()        //pongo el esquema de producto, porque los productos no estan dentro de stores
    }

    getStoreById = async (id) => {
        return await productModel.findOne({_id: id})
    }

    saveStore = async (store) => {
        return await storeModel.create(store)
    }

    updateStore = async (id, store) => {
        return await storeModel.updateOne({_id: id},{$set: store})
    }

}