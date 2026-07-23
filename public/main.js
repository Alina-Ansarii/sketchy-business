//socket.io server obj and binds it to http nserve
const socket = io(); 

//notifies everytime a new browser connects 
socket.on("connect", function () {
  console.log("connected to server, my id is ", socket.id);
});

const roomInput = document.getElementById("roomCode");
const joinBtn = document.getElementById("joinBtn");

let myRoom = null;

joinBtn.addEventListener("click", function() {
  myRoom = roomInput.value;
  socket.emit("join", myRoom);
  console.log("joined room:", myRoom);
});


//----------------------------button details:
const sendBtn = document.getElementById("sendBtn");
const guessInput = document.getElementById("guess");
const output = document.getElementById("output");

sendBtn.addEventListener("click", function() {
  const text = guessInput.value;
  console.log(output.textContent = "Your typed: " + text);
  console.log("Guess submitted:", text);
});


//--------------------------canvas details:
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "pink"; // line colour
ctx.lineWidth = 4;
ctx.lineCap = "round";
ctx.lineJoin = "round";



function drawLine(x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

let drawing = false;
let last = { x: 0, y:0 };

canvas.addEventListener("mousedown", function(e) {
  drawing = true;
  last = {  x: e.offsetX, y: e.offsetY};
});

canvas.addEventListener("mousemove", function(e) {
  if (!drawing) return;
  const x = e.offsetX;
  const y = e.offsetY;

  //draw it here
  drawLine(last.x, last.y, x, y);
  //send it to others
  socket.emit("draw", { x0: last.x, y0: last.y, x1:x, y1:y, room: myRoom });

  last = { x:x, y:y };
});

canvas.addEventListener("mouseup", function(e) {
  drawing = false;
});

//draws when server send someone elses object
//data is what they send
socket.on("draw", function(data) {
  drawLine(data.x0, data.y0, data.x1, data.y1);
});