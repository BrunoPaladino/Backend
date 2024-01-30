/*  
*   usaremos Mongoose para generar el esquema de la base de datos
*   para ello debe contener las propiedades y los tipos de datos de la DB 
*/
import mongoose from "mongoose";

const ticketCollection = 'ticket'; //userCollection es la coleccion en la base de datos

/*
* Aqui planteamos las propiedades que queremos que tengan los tickets de la DB
*/
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },

    purchaseDateTime: {
        type: Date,
        default: Date.now
    },

    amount: {
        type: Number,
        min: 0
    },

    //referencia al usuario
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,       //en el campo cart se aplicara un identificador unico (ID) generado por Mongo y que refiere a documentos en otra coleccion
        ref: 'users'                            //se aclara a que coleccion se hace referencia para aplicar el ID generado por Mongo
    }
});

/* 
* mongoose.model genera un modelo funcional del ticket conectado a la BD.
* como cuerpo se pasa el esquema (ticketSchema)
*/
const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;