// DATABASE NAME IN TERMINAL: myFlix_db



// Required modules
const express = require("express");
const morgan = require("morgan");

const app = express();

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://127.0.0.1:27017/myFlix_db", { useNewUrlParser: true, useUnifiedTopology: true});


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


//---------------------------GET requests---------------------------//
// Default text response
app.get("/", (req, res) => {
    res.send("Welcome to myFlix");
});

//-------Movies-------//
// Route to topMovies data
app.get("/top-ten-list", (req, res) => {
    res.json(topMovies);
});

// Route to list of all movies
app.get("/movies", async (req, res) => {
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
app.get("/movies/:Title", async (req, res) => {
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
app.get("/movies/genres/:Genre", async (req, res) => {
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
app.get("/movies/directors/:Director", async (req, res) => {
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
app.get("/users", async (req, res) => {
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
app.get("/users/:Username", async (req, res) => {
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
app.post("/users", async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + " already exists.");
        } else {
            Users
                .create({
                    Username: req.body.Username,
                    Password: req.body.Password,
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
});

// Allows users to add movies to their favorites list
app.post("/users/:Username/favorites-list/:MovieID", async (req, res) => {
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
app.put("/users/:Username/update-info", async (req, res) => {
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
app.delete("/users/:Username/favorites-list/:MovieID", async (req, res) => {
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
app.delete("/users/:Username/update-info", async (req, res) => {
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
app.listen(8080, () => {
    console.log("Your app is listening on port 8080.");
});
