// Imports HTTP, file system, and URL modules and stores them as constants
const http = require("http"),
    fs = require("fs"),
    url = require("url");

// Creates the server and stores/parses the URL and sets up the file path
http.createServer((request, response) => {
    let addr = request.url,
        q = url.parse(addr, true),
        filePath = ""

    // Logs recent requests to server
    fs.appendFile("log.txt", "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n", (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Added to log.");
        }
    });
    
    // Checks for "documentation" within the requested URL and redirects to that page
    if (q.pathname.includes("documentation")) {
        filePath = (__dirname + "/documentation.html");
    } else {
        filePath = "index.html";
    }

    // Sends the appropriate file back to the server
    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(data);
        response.end();
    });
}).listen(8080);

console.log("My test server is running on Port 8080.");
