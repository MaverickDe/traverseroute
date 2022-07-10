
const express = require("express");
// const { contentType } = require("express/lib/response")
const app = express();


const path = require("path");
// const app2 = http.createServer(app)
let port = process.env.PORT || 2000;

const io = require("socket.io")(app.listen(port));
app.use(express.static("public"));

// app2.listen("5000")

app.get("/", (req, res) => {
  // res.writeHead({contentType:"text/html"})
  res.sendFile(__dirname + "/pathfinder.html");
});


