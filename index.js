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

// Local connection
// mongoose.connect("mongodb://127.0.0.1:27017/myFlix_db", { useNewUrlParser: true, useUnifiedTopology: true});

// Online connection
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true});


// Data for top 10 movies list
let topMovies = [
    {
        title: "Harry Potter and the Sorcerer\'s Stone",
        release: 2001,
        starring: [
            "Daniel Radcliffe",
            "Emma Watson",
            "Rupert Grint"
        ]
    },
    {
        title: "The Lord of the Rings: The Two Towers",
        release: 2002,
        starring: [
            "Elijah Wood", 
            "Andy Serkis", 
            "Viggo Mortensen"
        ]
    },
    {
        title: "Captain America: The Winter Soldier",
        release: 2014,
        starring: [
            "Chris Evans", 
            "Sebastian Stan",
            "Scarlett Johansson"
        ]
    },
    {
        title: "The Mummy",
        release: 1999,
        starring: [
            "Brendan Fraser",
            "Rachel Weisz",
            "Arnold Vosloo"
        ]
    },
    {
        title: "Indiana Jones and the Last Crusade",
        release: 1989,
        starring: [
            "Harrison Ford",
            "Sean Connery",
            "Alison Doody"
        ]
    },
    {
        title: "Batman: The Dark Knight",
        release: 2008,
        starring: [
            "Christian Bale",
            "Heath Ledger",
            "Gary Oldman"
        ]
    },
    {
        title: "Sleepy Hollow",
        release: 1999,
        starring: [
            "Johnny Depp",
            "Christiana Ricci",
            "Christopher Walken"
        ]
    },
    {
        title: "Pirates of the Caribbean: The Curse of the Black Pearl",
        release: 2003,
        starring: [
            "Johnny Depp",
            "Keira Knightley",
            "Orlando Bloom"
        ]
    },
    {
        title: "Star Wars: Episode III - Revenge of the Sith",
        release: 2005,
        starring: [
            "Hayden Christensen",
            "Ewan McGregor",
            "Ian McDiarmid"
        ]
    },
    {
        title: "Young Frankenstein",
        release: 1974,
        starring: [
            "Gene Wilder",
            "Marty Feldman",
            "Peter Boyle"
        ]
    }
];


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

let allowedOrigins = ["http://localhost:8080", "https://myflix-db-app-24338506cd5a.herokuapp.com/"];

app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            let message = "The CORS policy for this application doesn't allow access from origin " + origin;
            return callback(new Error(message ), false);
        }
        return callback(null, true);
    }
}));


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
// Route to topMovies data
app.get("/top-ten-list", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json(topMovies);
});

// Route to list of all movies
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

// Route to data of a single movie by title
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

// Route to data of a genre by name
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

// Route to data about a director by name
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
// Gets all users
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

// Gets a user by username
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
// Allows new users to register
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

// Allows users to add movies to their favorites list
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
// Allows existing users to update their info
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
// Allows user to remove movies from their favorites list
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

// Allows existing users to deregister their account
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
