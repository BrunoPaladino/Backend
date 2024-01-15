import dotenv from 'dotenv';

dotenv.config({path: '../.env'});

export default {
    PERSISTENCE: process.env.PERSISTENCE,
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,            //MONGOOSE link, constante para ingresar el link para conectar con Mongo Atlas (DB en internet)
    MONGO_DBNAME: process.env.MONGO_DBNAME,
}