//import package
const express = require("express");
//create server object
const app = express();

//attaching behavior that if browser asks for file use public folder
//tell app to serve static filles from public folder
app.use(express.static("public"));

//server running and waiting for requests
app.listen(3000, function() {
  console.log("Sketchy Business running at http://localhost:3000");
});