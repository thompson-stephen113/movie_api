# movie_api

## Overview

A REST API of a collection of movies and users for a web application. The web app will allow users to search for different movies, directors, and genres. Users will be able to register, update their personal information, and add movies to a favorites list.

## Endpoints
 
### GET All movies

Route to list of all movies

#### Authentication

This endpoint requires authentication using JSON Web Tokens (JWT). The JWT should be included in the request headers.

#### Request

- Method: GET
- Endpoint: `/movies`

#### Response

- Status Code: 201 (Success)
- Content Type: JSON

##### Successful Response Body Example

```json
[
    {
        "_id": "6504769bf089e4deba99c43e",
        "Title": "Star Wars: Episode III - Revenge of the Sith",
        "Description": "It has been three years since...",
        "Genre": {
            "Name": "Science fiction",
            "Description": "Science fiction is a..."
        },
        "Director": {
            "Name": "George Lucas",
            "Bio": "George Walton Lucas Jr. is...",
            "Birth": "1944-05-14",
            "Death": null
        },
        "ImagePath": "https://upload.wikimedia...",
        "Featured": false
    },
    // More movie objects...
]
```

<br>

### GET Movie by title

Route to data of a single movie by title

#### Authentication

This endpoint requires authentication using JSON Web Tokens (JWT). The JWT should be included in the request headers.

#### Request

- Method: GET
- Endpoint: `/movies/:Title`

#### Response

- Status Code: 201 (Success)
- Content Type: JSON

##### Successful Response Body Example

```json
{
    "_id": "6504769bf089e4deba99c43e",
    "Title": "Star Wars: Episode III - Revenge of the Sith",
    "Description": "It has been three years since...",
    "Genre": {
        "Name": "Science fiction",
        "Description": "Science fiction is a..."
    },
    "Director": {
        "Name": "George Lucas",
        "Bio": "George Walton Lucas Jr. is...",
        "Birth": "1944-05-14",
        "Death": null
    },
    "ImagePath": "https://upload.wikimedia...",
    "Featured": false
}
```

<br>

### GET Genre

Route to data of a genre by name

#### Authentication

This endpoint requires authentication using JSON Web Tokens (JWT). The JWT should be included in the request headers.

#### Request

- Method: GET
- Endpoint: `/movies/genres/:Genre`

#### Response

- Status Code: 201 (Success)
- Content Type: JSON

##### Successful Response Body Example

```json
{
    "Genre": {
        "Name": "Science fiction",
        "Description": "Science fiction is a..."
    }
}
```

<br>

### GET Director

Route to data about a director by name

#### Authentication

This endpoint requires authentication using JSON Web Tokens (JWT). The JWT should be included in the request headers.

#### Request

- Method: GET
- Endpoint: `/movies/directors/:Director`

#### Response

- Status Code: 201 (Success)
- Content Type: JSON

##### Successful Response Body Example

```json
{
    "Director": {
        "Name": "George Lucas",
        "Bio": "George Walton Lucas Jr. is...",
        "Birth": "1944-05-14",
        "Death": null
    }
}
```

<br>

### GET All users

Gets all users

#### Authentication

This endpoint requires authentication using JSON Web Tokens (JWT). The JWT should be included in the request headers.

#### Request

- Method: GET
- Endpoint: `/users`

#### Response

- Status Code: 201 (Success)
- Content Type: JSON

<br>

### GET User

Gets a user by username

#### Authentication

This endpoint requires authentication using JSON Web Tokens (JWT). The JWT should be included in the request headers.

#### Request

- Method: GET
- Endpoint: `/users/:Username`

#### Response

- Status Code: 201 (Success)
- Content Type: JSON

##### Successful Response Body Example

```json
{
    "_id": "6544229ad677375d2bbdf09e",
    "Username": "fakeuser123",
    "Password": "$2b$10...",
    "Email": "fakeuser@fakeema.il",
    "Birthday": 2001-01-01T00:00:00.000+00:00,
    "FavoriteMovies": []
}
```

<br>

### POST User

Allows new users to register

#### Request

- Method: POST
- Endpoint: `/users`

#### Response

- Status Code: 201 (Success)
- Content Type: JSON

<br>

### POST User favorite

Allows users to add movies to their Favorites List

#### Authentication

This endpoint requires authentication using JSON Web Tokens (JWT). The JWT should be included in the request headers.

#### Request

- Method: POST
- Endpoint: `/users/:Username/favorites-list/:MovieID`

#### Response

- Status Code: 201 (Success)
- Content Type: JSON

##### Successful Response Body Example

```json
{
    "_id": "6544229ad677375d2bbdf09e",
    "Username": "fakeuser123",
    "Password": "$2b$10...",
    "Email": "fakeuser@fakeema.il",
    "Birthday": 2001-01-01T00:00:00.000+00:00,
    "FavoriteMovies": [
        {
            "_id": "6504769bf089e4deba99c43e",
            "Title": "Star Wars: Episode III - Revenge of the Sith",
            "Description": "It has been three years since...",
            "Genre": {
                "Name": "Science fiction",
                "Description": "Science fiction is a..."
            },
            "Director": {
                "Name": "George Lucas",
                "Bio": "George Walton Lucas Jr. is...",
                "Birth": "1944-05-14",
                "Death": null
            },
            "ImagePath": "https://upload.wikimedia...",
            "Featured": false
        }
    ]
}
```

<br>

### PUT User info

Allows existing users to update their info

#### Authentication

This endpoint requires authentication using JSON Web Tokens (JWT). The JWT should be included in the request headers.

#### Request

- Method: PUT
- Endpoint: `/users/:Username/update-info`

#### Response

- Content Type: JSON

<br>

### DELETE User favorite

Allows user to remove movies from their favorites list

#### Authentication

This endpoint requires authentication using JSON Web Tokens (JWT). The JWT should be included in the request headers.

#### Request

- Method: DELETE
- Endpoint: `/users/:Username/favorites-list/:MovieID`

#### Response

- Content Type: JSON

<br>

### DELETE User account

Allows existing users to deregister their account

#### Authentication

This endpoint requires authentication using JSON Web Tokens (JWT). The JWT should be included in the request headers.

#### Request

- Method: DELETE
- Endpoint: `/users/:Username/update-info`

#### Response

- Status code: 200 (Success)
- Content type: text

##### Example

If the user is successfully deleted: "user123 was deleted."

If the user is not found: "user123 was not found."

<br>

## Dependencies

- "bcrypt": "^5.1.1",
- "body-parser": "^1.20.2",
- "cors": "^2.8.5",
- "express": "^4.18.2",
- "express-validator": "^7.0.1",
- "jsonwebtoken": "^9.0.2",
- "lodash": "^4.17.21",
- "mongoose": "^7.5.2",
- "morgan": "^1.10.0",
- "passport": "^0.6.0",
- "passport-jwt": "^4.0.1",
- "passport-local": "^1.0.0"
