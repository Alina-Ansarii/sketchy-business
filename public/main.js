//button details:
const sendBtn = document.getElementById("sendBtn");
const guessInput = document.getElementById("guess");
const output = document.getElementById("output");

sendBtn.addEventListener("click", function() {
  const text = guessInput.value;
  console.log(output.textContent = "Your typed: " + text);
  console.log("Guess submitted:", text);
});


//canvas details:

//flag for pen press
let drawing = false;

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "pink"; // line colour
ctx.lineWidth = 4;
ctx.lineCap = "round";
ctx.lineJoin = "round";



canvas.addEventListener("mousedown", function(e) {
  console.log("DOWN at", e.offsetX, e.offsetY);
  drawing = true;
  ctx.beginPath();
  moveTo(e.offsetX, e.offsetX);
});

canvas.addEventListener("mousemove", function(e) {
  console.log("move at", e.offsetX, e.offsetY);
 
  if (!drawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});

canvas.addEventListener("mouseup", function(e) {
  console.log("UP at", e.offsetX, e.offsetY);
  drawing = false;
});



