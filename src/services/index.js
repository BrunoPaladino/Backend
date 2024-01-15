/*  
*   usaremos el archivo index exportar todos los repositorios
*   para ello los importo primero en index.js 
*/

import {User, Cart, Store} from '../dao/factory.js'

import UserRepository from "./user.repository.js";
import StoreRepository from "./stores.repository.js";
import CartRepository from "./cart.repository.js";

export const UserService = new UserRepository(new User());
export const StoreService = new StoreRepository(new Store());
export const CartService = new CartRepository(new Cart());