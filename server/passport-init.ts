/**
 * referenced Web Dev Simplified's video "Node.js Passport Login System Tutorial" from
 *  Jul 13, 2019. URL: https://www.youtube.com/watch?v=-RCnNyD0L-s
 */

const LocalStrategy = require("passport-local").Strategy;
const Bcrypt = require("bcrypt");

function initializePassport(passport: any, getUserByUsername: any) {
    console.log("INITIALIZE PASSPORT")
    const authenticateUser = async (username: string, password: string, done: any) => {
        console.log("AUTHENTICATE USER")
        const user = getUserByUsername(username);

        console.log("PP A")

        if (user === null) {
            return done(null, false, { message: "Username does not exist" });
        }

        console.log("PP B")
        try {
            if (await Bcrypt.compare(password, user.password)) {
                console.log("PP C");
                console.dir(done.toString())
                return done(null, user);
            } else {
                return done(null, false, { message: "Incorrect password" });
            }
        } catch (err) {
            return done(err);
        }
    }

    passport.use(new LocalStrategy({
        usernameField: "username"
    }, authenticateUser));

    passport.serializeUser((user: any, done: any) => {

    });
    
    passport.deserializeUser((id: any, done: any) => {

    });
}

module.exports = initializePassport;