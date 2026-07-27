//socket.io server obj and binds it to http serve
const socket = io(); 

//notifies everytime a new browser connects 
socket.on("connect", function () {
  console.log("connected to server, my id is ", socket.id);
});

//----------------------------room details:
const roomInput = document.getElementById("roomCode");
const joinBtn = document.getElementById("joinBtn");

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
  console.log(output.textContent = "You typed: " + text);
  console.log("Guess submitted:", text);
});

//----------------------------prompt button details:
const promptBtn = document.getElementById("promptBtn");
const promptInput = document.getElementById("prompt");
const descriptionEl = document.getElementById("description");
                                  
promptBtn.addEventListener("click", function() {
  const text = promptInput.value;
  console.log("Prompt submitted:", text); 

  socket.emit("prompt", { text, room: myRoom });
});

socket.on("prompt", function(data) {
  descriptionEl.textContent = data.text;
});

//----------------------------start button details:
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", function() {
  socket.emit("startRound", myRoom);
  console.log("Round started in room:", myRoom);
});

const roleEl = document.getElementById("role");
let amWitness = false;

socket.on("roundStarted", function(data) {
  amWitness = (data.witnessId === socket.id);
  if (amWitness) {
    roleEl.textContent = "You are the WITNESS - describe the target";
  }
  else {
    roleEl.textContent = "You are a DRAWER - wait for the description";
  }
  promptInput.disabled = !amWitness;
  promptBtn.disabled = !amWitness;

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


