// DATABASE NAME IN TERMINAL: myFlix_db


// Required modules
const express = require("express");
const morgan = require("morgan");
const { check, validationResult } = require("express-validator");

const app = express();

const mongoose = require("mongoose");
const Models = require("./models.js");
const bodyParser = require("body-parser");

const Movies = Models.Movie;
const Users = Models.User;

// // Local connection
// mongoose.connect("mongodb://127.0.0.1:27017/myFlix_db", { useNewUrlParser: true, useUnifiedTopology: true});

// Online connection
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB: ", error);
    }
);

//-------------------------Use functions----------------------------//
// Invoke Morgan
app.use(morgan("common"));

// Serving static files from "public" folder
app.use(express.static("public"));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));


//------------------------CORS Integration--------------------------//
const cors = require("cors");

app.use(cors({
    origin: "*"
}));

// let allowedOrigins = [
//     "http://localhost:8080", 
//     "http://localhost:1234", 
//     "http://localhost:4200", 
//     "https://myflix-db-app-24338506cd5a.herokuapp.com",
//     "https://myflix-cf.netlify.app",
//     "https://thompson-stephen113.github.io/myFlix-Angular-app",
// ];

// app.use(cors({
//     origin: (origin, callback) => {
//         if(!origin) return callback(null, true);
//         if(allowedOrigins.indexOf(origin) === -1){
//             let message = "The CORS policy for this application doesn't allow access from origin " + origin;
//             return callback(new Error(message ), false);
//         }
//         return callback(null, true);
//     }
// }));


//--------------------------File Imports----------------------------//
// Imports auth.js
let auth = require("./auth")(app);

// Import passport.js
const passport = require("passport");
require("./passport");


//---------------------------GET requests---------------------------//
// Default text response
app.get("/", (req, res) => {
    res.send("Welcome to myFlix");
});

//-------Movies-------//
/**
 * Route to list of all movies
 * @function
 * @name getAllMovies
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once the movies are retrieved.
 * @throws {Error} Will throw an error if there is an issue retrieving movies from database.
 */
app.get("/movies", passport.authenticate("jwt", { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * Route to data of a single movie by title
 * @function
 * @name getMovie
 * @param {Object} req - Express request object.
 * @param {string} req.params.Title - The title of the movie to retrieve.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once the movie is retrieved.
 * @throws {Error} Will throw an error if there is an issue retrieving the movie from database.
 */
app.get("/movies/:Title", passport.authenticate("jwt", { session: false }), async (req, res) => {
    await Movies.findOne({ "Title": req.params.Title })
        .then((movie) => {
            res.status(201).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * Route to data of a genre by name
 * @function
 * @name getGenre
 * @param {Object} req - Express request object.
 * @param {string} req.params.Genre - The category of genre to retrieve.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once the genre is retrieved.
 * @throws {Error} Will throw an error if there is an issue retrieving the genre from database.
 */
app.get("/movies/genres/:Genre", passport.authenticate("jwt", { session: false }), async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.Genre })
    .then((movie) => {
        res.status(201).json(movie.Genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

/**
 * Route to data about a director by name
 * @function
 * @name getDirector
 * @param {Object} req - Express request object.
 * @param {string} req.params.Director - The name of the director to retrieve.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once the director is retrieved.
 * @throws {Error} Will throw an error if there is an issue retrieving the director from database.
 */
app.get("/movies/directors/:Director", passport.authenticate("jwt", { session: false }), async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.Director })
    .then((movie) => {
        res.status(201).json(movie.Director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

//-------Users-------//
/**
 * Gets all users
 * @function
 * @name getAllUsers
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once all users are retrieved.
 * @throws {Error} Will throw an error if there is an issue retrieving users from database.
 */
app.get("/users", passport.authenticate("jwt", { session: false }), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * Gets a user by username
 * @function
 * @name getUser
 * @param {Object} req - Express request object.
 * @param {string} req.params.Username - The username to be retrieved.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once the user is retrieved.
 * @throws {Error} Will throw an error if there is an issue retrieving the user from database.
 */
app.get("/users/:Username", passport.authenticate("jwt", { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});


//---------------------------POST requests---------------------------//
//-------Users-------//
/**
 * Allows new users to register
 * @function
 * @name registerUser
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once the user is registered.
 * @throws {Error} Will throw an error if there is an issue registering the user or if validation fails.
 */
app.post("/users",
    [
        check("Username", "Username is required").isLength({min: 5}),
        check("Username", "Username contains non alphanumeric characters - not allowed").isAlphanumeric(),
        check("Password", "Password is required").not().isEmpty(),
        check("Email", "Email does not appear to be valid").isEmail()
    ],
    async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + " already exists.");
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => {res.status(201).json(user) })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).send("Error: " + err);
                    })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err)
        });
    }
);

/**
 * Allows users to add movies to their Favorites List
 * @function
 * @name addFavorite
 * @param {Object} req - Express request object.
 * @param {string} req.params.Username - The username of the user whose Favorites List is being updated.
 * @param {string} req.params.MovieID - The ID of the movie being added to the Favorites List.
 * @param {Oject} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once the movie is added to the user's Favorites List.
 * @throws {Error} Will throw an error if there is an issue updating the user's Favorites List in the database.
 */
app.post("/users/:Username/favorites-list/:MovieID", passport.authenticate("jwt", { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true })
    .then((updatedUser) => {
       res.json(updatedUser);
    })
    .catch((err) => {
       console.error(err);
       res.status(500).send("Error: " + err);
    });
});


//----------------------------PUT requests---------------------------//
//-------Users-------//
/**
 * Allows existing users to update their info
 * @function
 * @name updateUser
 * @param {Object} req - Express request object.
 * @param {string} req.params.Username - The username of the user whose information is being updated.
 * @param {string} req.body.Username - The new username.
 * @param {string} req.body.Password - The new password.
 * @param {string} req.body.Email - The new email.
 * @param {string} req.body.Birthday - The new birthday.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once the user information is updated.
 * @throws {Error} Will throw an error if there is an issue updating the user information in the database or if the user does not have permission to update the information.
 */
app.put("/users/:Username/update-info", passport.authenticate("jwt", { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send("Permission denied")
    }
    
    await Users.findOneAndUpdate({ Username: req.params.Username }, {$set: 
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new: true })
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});


//----------------------------DELETE requests-------------------------//
//-------Users-------//
/**
 * Allows user to remove movies from their favorites list
 * @function
 * @name removeFavorite
 * @param {Object} req - Express request object.
 * @param {string} req.params.Username - The username of the user whose Favorites List is being updated.
 * @param {string} req.params.MovieID - The ID of the movie in the Favorites List to be removed.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once the movie is removed and the Favorites List is updated.
 * @throws {Error} Will throw an error if there is an issue removing the movie from the user's Favorites List.
 */
app.delete("/users/:Username/favorites-list/:MovieID", passport.authenticate("jwt", { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true })
    .then((updatedUser) => {
       res.json(updatedUser);
    })
    .catch((err) => {
       console.error(err);
       res.status(500).send("Error: " + err);
    });
});

/**
 * Allows existing users to deregister their account
 * @function
 * @name deleteUser
 * @param {Object} req - Express request object.
 * @param {string} req.params.Username - The username of the user to be deleted.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that is resolved once the user is deleted.
 * @throws {Error} Will throw an error if there is an issue deleting the user from database.
 */
app.delete("/users/:Username/update-info", passport.authenticate("jwt", { session: false }), async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + " was not found.");
            } else {
                res.status(200).send(req.params.Username + " was deleted.");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});


//----------------------------Miscellaneous-------------------------//

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});


// Listening for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
    console.log("Listening on Port " + port);
});
