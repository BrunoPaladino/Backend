/*  
*   usaremos Mongoose para generar el esquema de la base de datos
*   para ello debe contener las propiedades y los tipos de datos de la DB 
*/
import mongoose from "mongoose";

import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products'; //productCollection es la coleccion en la base de datos

/*
* Aqui planteamos las propiedades que queremos que tengan los productos de la DB
*/
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    thumbnail : String,
    price: Number,
    status: String,
    code : String,
    stock: Number,
    category: String,
    owner: String,
});

/*
* Usamos el plugin para trabajar con la paginacion
*/
productSchema.plugin(mongoosePaginate);

/* 
* mongoose.model genera un modelo funcional del producto conectado a la BD.
* como cuerpo se pasa la coleccion y el esquema (productCollection, messageSchema)
*/
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;