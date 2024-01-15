import mongoose from "mongoose";

const storeModel = mongoose.model('stores', new mongoose.Schema({
    name:String,
    products:[]
}))

export default storeModel