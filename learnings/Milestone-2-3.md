# 📓 Day 3 — Sketchy Business (my notes)

> Transcribed from my handwritten notebook. My own words, my own shorthand.

## HTTP
HTTP → language browsers & servers use to communicate
- indpendent requests
- browser starts every request
- server is not allowed to randomly send messages

1. http://localhost → Browser → GET / → Server
2. express looked inside public & returned index.html
3. Then browser saw link to css & asked → GET /styles.css & server returned it
4. Then browser saw main.js reft & asked → GET /main.js & server returned it

## limitation
player A draws, player B should see it BUT server cant start talking & has to wait for Player B

\# bad solution: repeatedly ask

## Solution → WebSocket
- instead of req → respond → open, keep 1 connection → websocket open forever
- Browser → Server → Browser ⟷ Server

## Socket.IO
- helper library to help w/ Websockets
- simple API → emit() → sends msg
- → on() → listening for socket event

---

## The 4 steps
1. Browser drew
2. Sent to server
3. server broadcasted
4. Other Browser drew what was broadcastd

## The pieces
1. **http server:** obj that listens on network port & accepts incomming browser connections. e.g hotel building
2. **express:** web frame work, decides how to deal w/ HTTP req. e.g manager
3. **socket.IO server (io):** io represents entire socket.IO server, it knows every connected client. e.g receptionist
4. **socket:** created automatically by socket.io, represents one connection to one browser tab. e.g phone line b/w server & browser
5. **payload:** data attached to event, draw → X0 X1 ...

## The flow
Browser A → mouse move → drawLine() locally → socket.emit("draw", data)
→ Websocket → server → socket.on("draw") →
socket.broadcast("draw", data) → WebSocket → Browser B → socket.on("draw")
→ drawLine() → Canvas update

---

## task 2
1. const socket = io(); → opens a socket.io connection to server (browser does)
2. triggers socket.on("connect", ...) → browser does callback
3. inside callback → socket.emit → browser to server

on(): register a callback & hand to socket io → socket.on(—, —)

emit(): called by US → sends a message → socket.emit("—", "—")

io.on **vs** socket.on
- io.on → serverside, socketio server, new
- socket.on → browser related stuff

## task 3
X0   X1
y0   y1   [canvas box with a diagonal line]

1. def a fun for drawing
2. draw
3. emit it data
4. server → draw
5. server emit
6. browsers get drawline
