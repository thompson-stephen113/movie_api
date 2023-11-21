// JWT secret
const jwtSecret = "your_jwt_secret";

// Required modules
const jwt = require("jsonwebtoken"),
    passport = require("passport");

require("./passport");

// JWT generator
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,             // Username to be encoded in the JWT
        expiresIn: "7d",                    // Specifies the token will expire in 7 days
        algorithm: "HS256"                  // Algorithm used to sign the values of the JWT
    });
}


// POST login //
module.exports = (router) => {
    router.post("/login", (req, res) => {
        passport.authenticate("local", { session: false }, (err, user, info) => {
            if (err || !user) {
                console.log(err.message);
                return res.status(400).json({
                    message: "Something is not right",
                    user: user
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}
