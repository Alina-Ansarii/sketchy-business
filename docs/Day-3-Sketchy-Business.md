# 🎨 Sketchy Business — Day 3: Milestone 3 (In-Depth)

> Project-only. Just the game.
> **You type every line. I explain every line.** The struggle is where the skill forms.
>
> **Layout per task:** **explanation** (concept from scratch) → **how to do it** (steps) → **the code** (type it at the end) → **line-by-line** → **mental model** → **common mistakes** → **experiments** → **verify**. This is the big one — the browser/server boundary you keep asking about finally breaks open today.

---

## Recap — where Day 2 left you

- You have **live freehand drawing**: `mousedown`/`mousemove`/`mouseup` + a `drawing` flag, feeding `ctx.moveTo/lineTo/stroke` the mouse's `offsetX/offsetY`.
- You met the **event object** and learned a callback only receives it if you **name a parameter** (`function (e)`).
- Big point you proved: **all of that ran in the browser. The server was asleep.**

Today that last sentence stops being true. Strokes are going to **leave your browser, travel to the server, and come back down into other browsers.** This is the exact "why a middle-man server?" idea from your networking thread — you're about to build it, not read about it.

---

## The big picture: why we even need the server

Right now you can draw. If your friend opens the same page, they can draw too — but on *their own* canvas. The two browsers know nothing about each other. **Why can't they just talk directly?**

Because home devices are hidden behind routers (NAT) and firewalls — your browser has no public address your friend's browser can reach, and vice versa. Two browsers *cannot* open a direct line to each other. But both browsers **can** reach one public thing: **your server**. So the server becomes the **middle-man / post office**:

```
   YOUR BROWSER  ──"draw" msg──►  SERVER  ──"draw" msg──►  FRIEND'S BROWSER
   (draws + sends)                (relays)                 (receives + draws)
```

You draw → your browser sends the stroke to the server → the server forwards it to everyone else → their browsers draw the same stroke. That round-trip **is** multiplayer. Everything today is about building that pipe.

### What Socket.IO gives you (and the words underneath it)

A normal web page uses **HTTP**: the browser *asks*, the server *answers*, done — one round-trip, then the line closes. That's how `express.static` served your files. But HTTP can't do "server pushes a message to me whenever a *friend* draws," because the server can't speak unless asked.

A **WebSocket** fixes that: it's a **persistent, two-way line** held open between browser and server. Either side can send a message at any time, as many times as it likes, without a fresh request. That's exactly what a live game needs.

**Socket.IO** is a library that sits on top of WebSockets and hands you a dead-simple API — `emit` to send, `on` to receive — plus free extras (auto-reconnect, rooms, fallbacks). You *could* use raw WebSockets; Socket.IO is the sane beginner choice, and knowing raw WS / WebRTC exist is enough for now.

> **The pattern you already know, now over a network.** `emit`/`on` is `addEventListener` again. On Day 2 you did `canvas.addEventListener("mousedown", fn)` — "when this happens locally, run this." Now: `socket.on("draw", fn)` — "when a **draw message arrives over the network**, run this." Same mental shape (register a callback, someone else calls it), new source of the event: the wire instead of the mouse.

---

## Task 1 — Install Socket.IO and open the line

### Explanation

Socket.IO has **two halves that must both be present**: a **server** part (a Node package you install and run inside `server.js`) and a **client** part (a small JS file that runs in the browser). They find each other and hold the WebSocket open between them. Today's Task 1 is purely plumbing: install the package, start the server side, load the client side, and confirm in the Console that a browser **connected**. No drawing yet — just prove the pipe exists.

**One important server change.** Until now you ran `app.listen(3000)` — Express owns the port. But Socket.IO needs to attach to the *same underlying HTTP server* that Express uses, so it can upgrade connections to WebSockets. So you create an explicit HTTP server, hand Express to it, hand the same server to Socket.IO, and call **`server.listen(3000)`** instead of `app.listen`. Express still serves your files exactly as before; Socket.IO now shares the door.

**Where each piece runs (say it out loud):**
- `require("socket.io")` and `io.on(...)` → **server**, in Node.
- `const socket = io()` and `socket.on(...)` → **browser**, in `main.js`.
- The `/socket.io/socket.io.js` `<script>` → the **client library**, which the Socket.IO *server* serves automatically (you don't create that file).

### How to do it

1. In the terminal, at the project root: `npm install socket.io`. (This adds it to `dependencies` — it *is* part of the shipped app, unlike nodemon.)
2. Edit `server.js`: create the HTTP server, wrap Express, attach Socket.IO, add an `io.on("connection", ...)` handler that logs, and switch to `server.listen`.
3. Edit `public/index.html`: add the client `<script src="/socket.io/socket.io.js"></script>` **above** your `<script src="main.js"></script>`.
4. Add `const socket = io();` at the **top** of `public/main.js`.
5. Run `npm run dev` (your nodemon script), open `localhost:3000`. Watch **the terminal** for "a user connected" and the **browser Console** for "connected to server".

### The code

`server.js`:
```js
const express = require("express");
const app = express();

const http = require("http");                 // Node's built-in HTTP module
const server = http.createServer(app);        // an HTTP server that uses Express

const { Server } = require("socket.io");       // pull the Server class out of the package
const io = new Server(server);                 // attach Socket.IO to that same server

app.use(express.static("public"));             // (unchanged) serve the client files

io.on("connection", function (socket) {        // runs each time a browser connects
  console.log("a user connected:", socket.id);

  socket.on("disconnect", function () {
    console.log("a user left:", socket.id);
  });
});

server.listen(3000, function () {              // note: server.listen, NOT app.listen
  console.log("Sketchy Business running at http://localhost:3000");
});
```

`public/index.html` — add inside `<body>`, just before your existing `main.js` script:
```html
<script src="/socket.io/socket.io.js"></script>
<script src="main.js"></script>
```

`public/main.js` — at the very top:
```js
const socket = io();                           // connect to the server that served this page

socket.on("connect", function () {
  console.log("connected to server, my id is", socket.id);
});
```

### Line-by-line

- `const http = require("http");` — loads Node's **built-in** HTTP module (no install needed). `require` is Node's import, same as you used for Express.
- `const server = http.createServer(app);` — creates a real HTTP server and tells it "use `app` (Express) to handle normal web requests." So Express still answers file requests; this just wraps it so Socket.IO can also grab the connection.
- `const { Server } = require("socket.io");` — the package exports several things; `{ Server }` is **destructuring** — "give me the `Server` property out of what `require` returned." (In Java terms, roughly like importing one specific class from a package.)
- `const io = new Server(server);` — creates the Socket.IO server **object** and binds it to your HTTP `server`. `io` represents *all* connected clients collectively. `new` calls a constructor, just like Java.
- `io.on("connection", function (socket) { ... })` — register a callback that the Socket.IO server calls **every time a new browser connects**. The `socket` parameter is **that one specific client's private line**. `io` = everyone; a `socket` = one person.
- `socket.id` — a unique string Socket.IO assigns to each connection. Handy for logging / later identifying players.
- `socket.on("disconnect", ...)` — fires when that client closes the tab / loses connection. `"connect"` and `"disconnect"` are built-in event names Socket.IO provides.
- `server.listen(3000, ...)` — start listening on port 3000. **Must be `server`, not `app`**, or Socket.IO isn't on the port and connections fail.
- `const socket = io();` (client) — `io` is a **global function** provided by the `/socket.io/socket.io.js` script. Calling `io()` with no argument opens a connection back to the server that served the page. The returned `socket` is *this browser's* end of the line.
- `socket.on("connect", ...)` — built-in client event; fires once the line is open.

### Mental model

Think of `io` (server) as the **switchboard operator** and each `socket` as **one phone line to one caller**. `io.on("connection", ...)` is "a new caller just dialed in — here's their line (`socket`)." You'll talk to *one* person over their `socket`, or announce to *everyone* over `io`.

### Java comparison

`io.on("connection", socket => …)` is like a server-socket accept loop: in Java you'd `serverSocket.accept()` and get a `Socket` per client. Same idea — one object per connected client — except Socket.IO hands it to you via a callback instead of a blocking `accept()`, and keeps the connection event-driven (no thread-per-client to manage yet).

### Common mistakes

- **Leaving `app.listen`** instead of `server.listen`. Express files still load, but Socket.IO never gets the port → the client's `io()` can't connect. Switch it.
- **Putting the `main.js` script *before* the socket.io script.** `main.js` calls `io()`, so the library must load first. Order: socket.io script, then `main.js`.
- **Forgetting `npm install socket.io`.** `require("socket.io")` throws `Cannot find module`. Install it first.
- **Editing the wrong side.** `io()` in the browser, `new Server` in Node — don't cross them.

### Verify

Run `npm run dev`, open `localhost:3000`. Terminal prints **"a user connected: <id>"**; Console prints **"connected to server…"**. Open a **second tab** → the terminal logs a *second* connection with a different id. Close a tab → "a user left". The pipe is open. (Nothing draws across yet — that's Task 3.)

---

## Task 2 — Send a message both ways (the handshake)

### Explanation

Before broadcasting real strokes, prove you can send a message **client → server** and **server → client** with your *own* event name. `emit` sends; `on` receives. You pick the event name (a string) — it just has to match on both ends, exactly like agreeing on a label.

The flow you'll build: when the page connects, the client `emit`s a `"hello"` with some text → the server has `socket.on("hello", ...)` and logs it → the server `emit`s a `"welcome"` back → the client has `socket.on("welcome", ...)` and logs it. That's a full round-trip you can *see*.

### How to do it

1. In `public/main.js`, inside the `"connect"` handler, `socket.emit("hello", "hi from the browser")`.
2. In `server.js`, inside `io.on("connection", ...)`, add `socket.on("hello", ...)` that logs the text and then `socket.emit("welcome", "hi back from the server")`.
3. In `public/main.js`, add `socket.on("welcome", ...)` that logs what came back.
4. Save (nodemon restarts the server), refresh, watch both the terminal and the Console.

### The code

Client (`public/main.js`), extend your connect block:
```js
socket.on("connect", function () {
  console.log("connected, id:", socket.id);
  socket.emit("hello", "hi from the browser");   // send TO the server
});

socket.on("welcome", function (msg) {            // receive FROM the server
  console.log("server said:", msg);
});
```

Server (`server.js`), inside `io.on("connection", function (socket) { ... })`:
```js
socket.on("hello", function (text) {             // receive FROM this client
  console.log("client says:", text);
  socket.emit("welcome", "hi back from the server");  // send TO this client
});
```

### Line-by-line

- `socket.emit("hello", "hi from the browser");` — **send** a message named `"hello"` carrying a string payload. `emit` = "fire an event across the wire." The second argument is the data (can be a string, number, or object — Socket.IO serializes it for you).
- `socket.on("hello", function (text) { ... })` (server) — **listen** for `"hello"` on this client's line; `text` is the payload that arrived. Mirror image of `emit`.
- `socket.emit("welcome", ...)` (server) — send back down **this same socket** → only this one client receives it.
- `socket.on("welcome", function (msg) { ... })` (client) — receive it; `msg` is the payload.

### Mental model

`emit` = **drop a labelled letter in the mailbox**; `on` = **a mailbox that fires when a letter with that label arrives**. The label (event name) must match, or the letter waits forever in a box nobody's watching.

### Java comparison

Very close to sending an object over a Java socket's stream and the other side reading it — but instead of manually reading bytes and parsing, you name an event and get the parsed payload handed to a callback. The naming (`emit("draw", data)` / `on("draw", …)`) replaces writing your own message-type protocol by hand.

### Common mistakes

- **Event name mismatch:** `emit("hello")` but `on("Hello")` (or a typo) → nothing fires, no error. Names are case-sensitive strings; keep them identical.
- **`emit` on the wrong object:** on the server, `io.emit(...)` goes to *everyone*; `socket.emit(...)` goes to *just this client*. For the handshake you want `socket.emit`.

### Verify

Refresh. Terminal: **"client says: hi from the browser"**. Console: **"server said: hi back from the server"**. A message went up and a different one came back down — you now control the pipe in both directions. Delete this handshake once you've seen it; Task 3 is the real payload.

---

## Task 3 — Milestone 3: strokes appear in another tab 🎉

### Explanation

Now the real thing. When you draw a segment, you'll do **two** things: draw it locally (as you already do) **and** `emit` it to the server. The server **broadcasts** it to every *other* client. Each other client has a `socket.on("draw", ...)` that draws the same segment on its canvas. Result: you scribble in one tab, it appears in the other, live.

**Design choice that keeps it simple: send self-contained segments.** Instead of syncing pen state across the network, each message carries a whole little segment — start point and end point: `{ x0, y0, x1, y1 }`. The receiver can draw it with no memory of what came before. To do that cleanly, you'll:

1. Track the **last point** (`last`) as you draw, so each `mousemove` knows where the previous point was.
2. Pull the actual drawing into a small **`drawLine(x0, y0, x1, y1)`** helper, so *both* your local drawing and incoming remote strokes use the exact same code. (Reuse! And it re-proves your Day-2 insight: a stroke is just a chain of segments.)

**Why broadcast (not `io.emit`)?** `socket.broadcast.emit("draw", data)` sends to everyone **except the sender**. You already drew your own segment locally, so you don't want it echoed back to you (that'd draw it twice / could feel laggy). The sender draws locally; everyone else gets it via broadcast. Clean.

**The invisible round-trip for one segment:** mouse moves → `mousemove` fires in your browser → you `drawLine` locally *and* `socket.emit("draw", {…})` → the message rides the open WebSocket to the server → `socket.on("draw")` fires on the server → `socket.broadcast.emit("draw", data)` → the message rides down every *other* client's WebSocket → their `socket.on("draw")` fires → `drawLine` paints it on their canvas. Dozens of times a second. *That* is the boundary you kept asking about, in motion.

### How to do it

1. In `public/main.js`, add the `drawLine` helper and refactor your Day-2 handlers to track `last` and call `drawLine`.
2. In each `mousemove`, after drawing locally, `socket.emit("draw", { x0, y0, x1, y1 })`.
3. Add `socket.on("draw", ...)` that calls `drawLine` with the received data.
4. In `server.js`, add `socket.on("draw", data => socket.broadcast.emit("draw", data))` inside the connection handler.
5. Struggle-first: try to write the `last`-tracking yourself before peeking. The trick is updating `last` at the end of each `mousemove`.
6. Run `npm run dev`, open **two** browser windows side by side on `localhost:3000`, and draw in one.

### The code

`public/main.js` (drawing section — replaces your Day-2 mouse block):
```js
// one helper both local + remote strokes use
function drawLine(x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

let drawing = false;
let last = { x: 0, y: 0 };            // where the pen was on the previous event

canvas.addEventListener("mousedown", function (e) {
  drawing = true;
  last = { x: e.offsetX, y: e.offsetY };   // pen down: remember the start
});

canvas.addEventListener("mousemove", function (e) {
  if (!drawing) return;
  const x = e.offsetX;
  const y = e.offsetY;

  drawLine(last.x, last.y, x, y);                       // 1. draw it here
  socket.emit("draw", { x0: last.x, y0: last.y, x1: x, y1: y }); // 2. send it up

  last = { x: x, y: y };               // remember this point for the next segment
});

canvas.addEventListener("mouseup", function () {
  drawing = false;
});

// draw strokes that OTHER players sent (relayed by the server)
socket.on("draw", function (data) {
  drawLine(data.x0, data.y0, data.x1, data.y1);
});
```

`server.js` (inside `io.on("connection", function (socket) { ... })`):
```js
socket.on("draw", function (data) {
  socket.broadcast.emit("draw", data);   // relay to everyone EXCEPT the sender
});
```

### Line-by-line

- `function drawLine(x0, y0, x1, y1) { ... }` — your **own** function (not a browser/Node API). It bundles the four-command draw ritual so you never repeat it. Called by both local and remote drawing.
- `let last = { x: 0, y: 0 };` — an **object** with `x`/`y`, holding the previous point. `let` because you reassign it every move. Starts at 0,0 but is overwritten on `mousedown` before any drawing.
- `last = { x: e.offsetX, y: e.offsetY };` (mousedown) — record the start point so the first segment has a valid origin.
- `const x = e.offsetX; const y = e.offsetY;` — snapshot the current point into short names (used twice below).
- `drawLine(last.x, last.y, x, y);` — paint the segment from the previous point to the current one, **locally**.
- `socket.emit("draw", { x0: last.x, y0: last.y, x1: x, y1: y });` — send that same segment to the server as a `"draw"` event. The payload is a plain **object**; Socket.IO serializes it to JSON across the wire and hands the receiver an equivalent object.
- `last = { x: x, y: y };` — **crucial:** update `last` so the *next* move draws from here, not from the original click. Forget this and every segment starts from the first point (a fan of lines).
- `socket.on("draw", function (data) { ... })` (client) — fires when the server relays someone else's segment; `data` is the object they sent; `drawLine` paints it.
- `socket.broadcast.emit("draw", data)` (server) — `socket.broadcast` means "everyone connected **except** this socket"; `.emit("draw", data)` sends them the segment. Swap for `io.emit` and the sender would also receive it (drawing their own stroke twice).

### Mental model

You're a courier who **draws a copy for yourself** and **mails the original to the post office** (server). The post office **photocopies it to every other member** (broadcast). Each member's mailbox (`on("draw")`) opens and they draw the copy. Everyone's canvas converges because they're all drawing the same little segments.

### Java comparison

`socket.broadcast.emit` is the classic chat-server "relay to all other clients" loop — in raw Java you'd iterate your list of client sockets and write to each except the sender. Socket.IO gives you that loop as one call. The `{x0,y0,x1,y1}` object is your **message protocol**; in Java you'd define a class or serialize fields yourself.

### Common mistakes

- **Forgetting to update `last`** at the end of `mousemove` → every segment radiates from the first point instead of following the pen.
- **Using `io.emit` instead of `socket.broadcast.emit`** → you receive your own strokes back and draw them twice.
- **Only emitting, not drawing locally** (or vice versa) → either your own canvas stays blank, or the other tab does. You need both: draw here *and* send.
- **Different `strokeStyle`/`lineWidth` per client** → strokes look different on each screen. Fine for now; later you can send colour/width in the payload so it matches everywhere.
- **Expecting two *different computers* to work yet** — right now `localhost` only reaches your own machine. Two tabs/windows on your PC is the correct test today; real friends over the internet is a deployment step (Week 5 "Explore").

### Experiments to try

1. **Send the pen too:** add `color` and `width` to the payload, and in the `on("draw")` handler set `ctx.strokeStyle`/`ctx.lineWidth` from `data` before drawing — now each player's colour shows correctly on every screen.
2. **Count players:** on the server, log how many are connected (`io.engine.clientsCount`) on connect/disconnect.
3. **`io.emit` vs `socket.broadcast.emit`:** temporarily switch to `io.emit` and watch your own stroke double — that *shows* you what broadcast excludes.
4. **Break the pipe on purpose:** stop the server mid-draw; note the other tab freezes, then reconnects when you restart (Socket.IO's free auto-reconnect).

### Verify

Two windows on `localhost:3000`, side by side. Draw in the left one — it appears in the right one **live**, and vice versa. **That's Milestone 3 — "THE moment."** 🎉 Your strokes are leaving the browser, crossing to the server, and coming back down into another browser. The boundary you kept asking about is now something you can *see*.

### What you should understand before moving on

- **Where each line runs:** `io()`, `socket.emit`, `socket.on` (browser) vs `new Server`, `io.on`, `socket.broadcast.emit` (server).
- **Why the server is required** (browsers can't reach each other directly; the server relays).
- **`emit`/`on` is `addEventListener` over the network** — register a callback, someone else fires it; the "someone else" is now the wire.
- **`io` = everyone, a `socket` = one client, `socket.broadcast` = everyone but the sender.**
- Why HTTP wasn't enough and a **WebSocket** (persistent two-way line) is.

---

## What you built today

- Installed and wired **Socket.IO** on both server and client; opened a persistent line.
- Sent messages **both directions** (`emit`/`on`) with your own event names.
- **Broadcast live drawing** so a stroke in one tab appears in another — Milestone 3.
- Finally *saw* the **browser ↔ server boundary** in motion (your standing weak spot — revisit `learnings/` and write how it clicked).

## Next (Week 3 continues → Milestone 4)

- [ ] Test with a friend on the same network / two windows (done as you verify).
- [ ] **Milestone 4 — rooms:** friends join a private canvas via a code, so strokes only broadcast within a room (`socket.join(code)`, `io.to(code).emit(...)`). That sets up the actual game.

## Commit it (Conventional Commits)

```
git add .
git commit -m "feat(socket): broadcast strokes so other tabs draw live"
git push
```

If you split it into steps, commit each: `chore: add socket.io dependency`, then `feat(server): relay draw events to other clients`, then the client feature above.

---

*Companion to Day-1 and Day-2 guides. Write up Day 3 in your own words in `learnings/Day-03.md` — especially the browser/server boundary, now that you've watched it happen.*
