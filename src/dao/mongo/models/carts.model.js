/*  
*   usaremos Mongoose para generar el esquema de la base de datos
*   para ello debe contener las propiedades y los tipos de datos de la DB 
*/
import mongoose from "mongoose";

const cartCollection = 'carts'; //cartCollection es la coleccion en la base de datos

/*
* Aqui planteamos las propiedades que queremos que tengan los carts de la DB
*/
const cartSchema = new mongoose.Schema({
    cartName: String,
    status: String,
    TotalPrice: Number,
    products: {
            type: [
                    {
                        productId:{
                            type: mongoose.Schema.Types.ObjectId,
                            ref : "products"      //especifica a que coleccion de la base de datos se refiere para usar el populate
                        },
                        quantity: Number,
                    }
            ],
            default : []
        }
})

/* 
* mongoose.model genera un modelo funcional del cart conectado a la BD.
* como cuerpo se pasa la coleccion y el esquema (cartCollection, cartSchema)
*/
const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;