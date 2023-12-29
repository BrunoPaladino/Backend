import dotenv from 'dotenv';

dotenv.config({path: './.env'});

const PORT = process.env.PORT;
console.log(PORT);

export default PORT;