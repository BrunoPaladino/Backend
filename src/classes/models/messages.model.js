/*  
*   usaremos Mongoose para generar el esquema de la base de datos
*   para ello debe contener las propiedades y los tipos de datos de la DB 
*/
import mongoose from "mongoose";

const messageCollection = 'users'; //messageCollection es la coleccion en la base de datos

/*
* Aqui planteamos las propiedades que queremos que tengan los mensajes de la DB
*/
const messageSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        unique: true
    },
    message: String,
});

/* 
* mongoose.model genera un modelo funcional del usuario conectado a la BD.
* como cuerpo se pasa la coleccion y el esquema (messageCollection, messageSchema)
*/
const messageModel = mongoose.model(messageCollection, messageSchema);

export default userModel;