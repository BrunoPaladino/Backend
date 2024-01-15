import passport from "passport";
import local from 'passport-local';
import userModel from "../dao/mongo/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

import GitHubStrategy from 'passport-github2';
import cartModel from "../dao/mongo/models/carts.model.js";

const LocalStrategy = local.Strategy;

const initializePassport = () =>{

    //Registro de usuario en BD con Passport
    passport.use ('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'                          //determinamos el email como el username
    }, async(req, username, password, done) => {        //done es el callback de como resolver el passport, el prier argumento es el error y el segundo el resultado
        const userInformation = req.body;
        let email = userInformation.email
        
        try{
            const user = await userModel.findOne({email: username});
            if (user){
                console.log('User already exists');
                return done (null, false);
            }

            //Crea un carrito nuevo para el usuario creado
            const newCart = await cartModel.create({
                cartName: `Cart for: ${userInformation.firstname}`,         //en la DB no guarda el nombre del usuario, da undefined
                products: []
            })

            if(userInformation.email === 'adminCoder@coder.com' && userInformation.password === 'adminCod3r123'){
                const rol = {rol: "Administrador"};
                userInformation.password = createHash(req.body.password);
                const userInformationWithRol = {...userInformation,...rol};
                userInformationWithRol.cart = newCart._id;                  //asigno a la propiedad cart, del esquema de usuario, el carrito creado
                const user = await userModel.create(userInformationWithRol);
                return done (null, user);
            } else {
                const rol = {rol: "Usuario"};
                userInformation.password = createHash(req.body.password);
                const userInformationWithRol = {...userInformation,...rol};
                userInformationWithRol.cart = newCart._id;                  //asigno a la propiedad cart, del esquema de usuario, el carrito creado
                const user = await userModel.create(userInformationWithRol);
                return done (null, user);
            }
        } catch(error){
            return done ('Error looking for the user');
        }
    }));


    //Registro de usuario en BD con Passport
    passport.use('login', new LocalStrategy({usernameField:'email'}, async(username,password,done)=>{
        try{
            const user = await userModel.findOne({email: username});
            if (!user){
                console.log("User doesn't exists");
                return done (null, false);
            }
            if(!isValidPassword(user, password)){
                return done (null, false);
            }
            return done(null,user);
        } catch (error){
            return done(error);
        }
    }));

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.a26621a0219a14ec',
            clientSecret: '7f33ad83d4507cccc71f4dcb1eb929ece375f8c5',
            callbackURL: 'http://localhost:8080/githubcallback'
        },
        async(accessToken, refreshToken, profile, done) => {
            console.log(profile);
            try{
                const user = await userModel.findOne({email: profile._json.email})
                if(user){
                    console.log('The user already exists');
                    return done(null, user);
                }
                const newUser = {
                    firstName: profile._json.name,
                    lastName: '',
                    age: '',
                    email: profile._json.email,
                    password: ''
                }
                const result = await userModel.create(newUser);
                return done(null, result);
            } catch (error){
                return done ('Error to login with Github');
            }

        }
    ));


    passport.serializeUser((user, donde) =>{
        donde (null, user._id)
    })


    passport.deserializeUser(async(id, donde) =>{
        const user = await userModel.findById(id);
        donde(null, user);
    })
}

export default initializePassport;