import passport from 'passport';
import passportLocal from 'passport-local';
import GitHubStrategy from 'passport-github2';

import userModel from '../models/users.model.js';
import { createHash, isValidPassword } from '../utils.js';


// Declaramos nuestra estrategia
const localStrategy = passportLocal.Strategy;

const initializePassport = () => {
    // Github
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.85ba5053eb28f421',
            clientSecret: '943d549a1f306210273463d5ddcc4b390b32c69e',
            callbackUrl: 'http://localhost:8080/api/users/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtenido del usuario: ");
            console.log(profile);
            try {
                const user = await userModel.findOne({ email: profile._json.email });
                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 18,
                        email: profile._json.email,
                        password: '',
                        loggedBy: "GitHub"
                    };
                    const result = await userModel.create(newUser);
                    return done(null, result);
                } else {
                    //User exists
                    return done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        })
    );

    /**
      *  Inicializando la estrategia local, username sera para nosotros email.
      *  Done será nuestro callback
     */

    // Register
    passport.use('register', new localStrategy(
        // passReqToCallback: para convertirlo en un callback de request, para asi poder iteracturar con la data que viene del cliente
        // usernameField: renombramos el username
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {

                const exists = await userModel.findOne({ email });
                if (exists) {
                    console.log("User already exists.");
                    return done(null, false);
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                };
                const result = await userModel.create(user);
                //Todo sale OK
                return done(null, result);
            } catch (error) {
                return done("Error registering user: " + error);
            }
        }

    ))


    // Login
    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                console.log("User not found:");
                console.log(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + username);
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    console.warn("Invalid credentials for user: " + username);
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );


    //serializeUser & deserializeUser
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("There was an error deserializing the user: " + error);
        }
    });
}

export default initializePassport;