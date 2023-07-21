import fetch from 'node-fetch';

import passport from 'passport';

import local from 'passport-local';

import { createHash, isValidPassword } from '../bcrypt.js';

import { UserModel } from '../DAO/models/users.model.js';

import GitHubStrategy from 'passport-github2';

const LocalStrategy = local.Strategy;



export function iniPassport() {

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await UserModel.findOne({ email: username }).exec();
                    if (!user) {
                        console.log("User Not Found with username (email) " + username);
                        return done(null, false);
                    }
                    if (!isValidPassword(password, user.password)) {
                        //considerar página de errores
                        console.log("Invalid Password");
                        return done(null, false);
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, username, password, done) => {
                try {
                    const { email, firstName, lastName, rol, age} = req.body;
                    const user = await UserModel.findOne({ email: username }).exec();
                    if (user) {
                        //considerar si hacer una página de erro bien hecha
                        console.log("User already exists");
                        return done(null, false);
                    }

                    if (!password) {
                        throw new Error("No password provided");
                    }

                    const newUser = {
                        email,
                        firstName,
                        lastName,
                        rol,
                        age,
                        password: createHash(password),
                    };
                    const userCreated = await UserModel.create(newUser);
                    console.log("User Registration succesful");
                    return done(null, userCreated);
                } catch (e) {
                    console.log("Error in register");
                    return done(e);
                }
            }
        )
    );


    passport.use(

        'github',

        new GitHubStrategy(

            {

                clientID: 'Iv1.1964ea7cd132e9c5',

                clientSecret: '8654a0092e8ad40d6fb6dea051313cc5e24528d1',

                callbackURL: 'http://localhost:8080/api/sessionsGit/githubcallback',

            },

            async (accesToken, _, profile, done) => {

                console.log(profile);

                try {

                    const res = await fetch('https://api.github.com/user/emails', {

                        headers: {

                            Accept: 'application/vnd.github+json',

                            Authorization: 'Bearer ' + accesToken,

                            'X-Github-Api-Version': '2022-11-28',

                        },

                    });

                    const emails = await res.json();

                    const emailDetail = emails.find((email) => email.verified == true);



                    if (!emailDetail) {

                        return done(new Error('cannot get a valid email for this user'));

                    }

                    profile.email = emailDetail.email;



                    let user = await UserModel.findOne({ email: profile.email });

                    if (!user) {

                        const newUser = {

                            email: profile.email,

                            firstName: profile._json.name || profile._json.login || 'noname',

                            lastName: 'nolast',

                            rol: "user",

                            password: 'nopass',

                        };

                        let userCreated = await UserModel.create(newUser);

                        console.log('User Registration succesful');

                        return done(null, userCreated);

                    } else {

                        console.log('User already exists');

                        return done(null, user);

                    }

                } catch (e) {

                    console.log('Error en auth github');

                    console.log(e);

                    return done(e);

                }

            }

        )

    );



    passport.serializeUser((user, done) => {

        done(null, user._id);

    });



    passport.deserializeUser(async (id, done) => {

        let user = await UserModel.findById(id);

        done(null, user);

    });

}