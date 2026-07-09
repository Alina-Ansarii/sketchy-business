const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "pink"; // line colour
ctx.lineWidth = 4;

ctx.beginPath();
ctx.moveTo(100, 200);
ctx.lineTo(700, 500);
ctx.stroke();

const sendBtn = document.getElementById("sendBtn");
const guessInput = document.getElementById("guess");
const output = document.getElementById("output");

sendBtn.addEventListener("click", function() {
  const text = guessInput.value;
  console.log(output.textContent = "Your typed: " + text);
  console.log("Guess submitted:", text);
});