import config from '../config/config.js'
import mongoose from "mongoose";

export let Cart;
export let User;
export let Store;

console.log(`Persistence with ${config.PERSISTENCE}`)

switch (config.PERSISTENCE) {

    case "FILE":

        const{ default: CartFile} = await import ('./file/cart.file.js');
        const{ default: UserFile} = await import ('./file/user.file.js');
        const{ default: StoreFile} = await import ('./file/stores.file.js');

        Cart = CartFile;
        User = UserFile;
        Store = StoreFile;
    break;

    case "MONGO":

        await mongoose.connect(config.MONGO_URL, {dbName: config.MONGO_DBNAME})
            .then(() => console.log('DB Connected'))
        const{ default: CartMongo} = await import ('./mongo/cart.mongo.js');
        const{ default: UserMongo} = await import ('./mongo/user.mongo.js');
        const{ default: StoreMongo} = await import ('./mongo/stores.mongo.js');
        
        Cart = CartMongo;
        User = UserMongo;
        Store = StoreMongo;
    break;

    default:
        throw "Persistence doesnt found"
        break;
}