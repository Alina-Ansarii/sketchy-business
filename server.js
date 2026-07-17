//load express library & create express application
const express = require("express");
const app = express();

//node loads in http module
const http = require("http");
//create http server that USES express app
const server = http.createServer(app);

//node loads socket.io
const { Server } = require("socket.io");
//create socket.io server and pass the HTTP server
//because it cares only about connections
const io = new Server(server);

//attaching behavior that if browser asks for file use public folder
//tell app to serve static filles from public folder
app.use(express.static("public"));

//callback called by socket.io when a browser connects
//passes the socket it creates to us
io.on("connection", function(socket) {
  console.log("A user connected: ", socket.id);

  socket.on("disconnect", function() {
    console.log("A user left: ", socket.id);
  });

  //everyone draws
  socket.on("draw", function(data) {
    socket.broadcast.emit("draw", data);
  });

});


//server running and waiting for requests
server.listen(3000, function() {
  console.log("Sketchy Business running at http://localhost:3000");
});
