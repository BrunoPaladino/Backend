/*  
*   usaremos Mongoose para generar el esquema de la base de datos
*   para ello debe contener las propiedades y los tipos de datos de la DB 
*/
import mongoose from "mongoose";

const userCollection = 'users'; //userCollection es la coleccion en la base de datos

/*
* Aqui planteamos las propiedades que queremos que tengan los usuarios de la DB
*/
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    }
});

/* 
* mongoose.model genera un modelo funcional del usuario conectado a la BD.
* como cuerpo se pasa el esquema (userSchema)
*/
const userModel = mongoose.model(userCollection, userSchema);

export default userModel;