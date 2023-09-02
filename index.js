// Required modules
const express = require("express");
const morgan = require("morgan");

const app = express();


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

// Route to topMovies data
app.get("/top-ten-list", (req, res) => {
    res.json(topMovies);
});

// Route to list of all movies
app.get("/movies", (req, res) => {
    res.send("Successful GET request returning data on all movies.");
});

// Route to description of a single movie by title
app.get("/movies/:movie-title", (req, res) => {
    res.send("Successful GET request returning data on :movie-title.");
});

// Route to description of a genre by name
app.get("/movies/genres/:genre-name", (req, res) => {
    res.send("Successful GET request returning data on :genre-name.");
});

// Route to data about a director by name
app.get("/movies/:director-name", (req, res) => {
    res.send("Successful GET request returning data on :director-name.");
});


//---------------------------POST requests---------------------------//
// Allows new users to register
app.post("/user/register", (req, res) => {
    res.send("Successful POST request creating new user.");
});


//----------------------------PUT requests---------------------------//
// Allows existing users to update their info
app.put("/user/:username/update-info", (req, res) => {
    res.send("Successful PUT request updating user info.");
});

// Allows users to add movies to their favorites list
app.put("/user/:username/favorites-list", (req, res) => {
    res.send("Successful PUT request updating user favorites.");
});


//----------------------------DELETE requests-------------------------//
// Allows user to remove movies from their favorites list
app.delete("/user/:username/favorites-list", (req, res) => {
    res.send("Successful DELETE request removing movie from user favorites.");
});

// Allows existing users to deregister their account
app.delete("/user/:username/update-info", (req, res) => {
    res.send("Successful DELETE request removing user email.");
});



// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});


// Listening for requests
app.listen(8080, () => {
    console.log("Your app is listening on port 8080.");
});
