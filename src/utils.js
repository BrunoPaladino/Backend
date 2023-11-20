import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';


/* hashSync toma el password que enviamos como parametro y aplica el proceso de hasheo
con Salt (string random de 10 caracteres en este caso) */
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/* compareSync toma el primer password sin hashear y lo compara con el hasheado, devuelve un bool */
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;