# 🔁 Session Handoff — resume here next chat

> **Read this first (with `docs/CONTEXT.md`) to pick up exactly where we stopped.**
> This is a *mentor doc* (Claude's). My own words-notes live in `learnings/`. Keep this file overwritten/updated at the end of each session so it's always the live "you are here."
>
> **Last updated:** end of Day 4 session (Milestone 4 done — rooms working; game design captured).

---

## 0. One-line status

**Weeks 1–3 are complete. M3 (live drawing) confirmed with Amer's own eyes, M4 (rooms) shipped and tested (3-tab isolation works).** The entire networking spine is built. **Next session = Week 4 / Milestone 5: the game loop (the MVP).** Also this session: big creative pivot — the game is now a **police-sketch "describe → draw → rate" game**, fully captured in `docs/GAME-DESIGN.md`.

---

## 1. Where we are on the roadmap

| Milestone | What | Status |
|---|---|---|
| **M1** | Express server serves the page at `localhost:3000` | ✅ done (Day 1) |
| **M2** | Freehand mouse drawing on the canvas ("I can scribble") | ✅ done (Day 2) |
| **M3** | Drawing in one tab appears in another (Socket.IO) | ✅ **done & confirmed (Day 3)** |
| **M4** | **Rooms (private canvas via a code)** | ✅ **done & confirmed (Day 4)** |
| M5 | Game loop: prompt + roles + guessing/rating + scoring (MVP) | ⬜ **next (Week 4)** |
| M6 | Art + one unique twist (AI judge) + a fun visual | ⬜ |

My notes: `learnings/` (Day-4+5 learnings doc still to write — Amer deferred it). Design: `docs/GAME-DESIGN.md`.

---

## 2. 🟢 NEXT STEP (Week 4 — the game loop, Milestone 5)

Networking is done; now put a **game** on top of the working pipes. Same Socket.IO `emit`/`on` — just new message types (`prompt`, `guess`/`rate`, `score`). Suggested day-by-day:

1. **Server picks a prompt + assigns a witness/drawer role.** First real taste of *"server is the source of truth"* — and *why the target must live server-side* (if the browser knew it, players could cheat via dev tools). This is the Week-4 networking learning highlight ("never trust the client").
2. **Wire up the guess/rate box** (the `#guess` input has existed unused since Day 1). Player submits → `socket.emit(...)` → **server** decides → announces to the room.
3. **Scoring + reveal** — award points, reveal the target, tell the room.
4. **Rotate the role + loop** — new witness, new prompt. Once it loops → **playable game → tag `v0.1-mvp`.** By Amer's own tracker, reaching here = **summer success.**

**Heads-up on direction:** per `GAME-DESIGN.md`, the game is no longer generic draw-and-guess. Whatever loop we build should fit the **witness describes → others draw blind → witness rates** shape. But Amer explicitly is **NOT locking a "main mode" yet** — build **one simple-but-interesting mode first**, decide which idea becomes central later. Don't over-scope. Ship by Week 6.

---

## 2b. (archived) The old Day-3 verify step — DONE, kept for reference
Confirmed M3 by running:
- `npm run dev` (nodemon).
- Open `localhost:3000`. Console should log **"connected to server, my id is …"**; terminal should log **"A user connected: …"**.
- Open a **second window** side by side. Draw in one → it should appear in the other, live, both directions.
- If it connects but strokes don't cross: check the event name is exactly `"draw"` on both client `emit`/`on` and server `on`/`broadcast.emit`; check `last` is being updated at the end of `mousemove`.

Once two tabs draw to each other → **Milestone 3 is done. 🎉**

---

## 3. Exact state of each file

### `server.js` — ✅ correct, no changes needed
- Requires `express`, creates `app`.
- Requires Node's `http`, `const server = http.createServer(app)`.
- `const { Server } = require("socket.io")`, `const io = new Server(server)`.
- `app.use(express.static("public"))` — still serves the client files.
- `io.on("connection", socket => …)` logs connect + disconnect, and has:
  `socket.on("draw", data => socket.broadcast.emit("draw", data))` — relays strokes to everyone **except** the sender.
- Listens with **`server.listen(3000, …)`** (NOT `app.listen`). ✔

### `public/main.js` — ⚠️ has the bug above
- Top: `const socket = io();` + a `socket.on("connect", …)` logger. ✔
- Button/guess code from Day 1/2 (unrelated). ✔
- Canvas setup: `ctx.strokeStyle = "pink"`, `lineWidth = 4`, `lineCap`/`lineJoin = "round"`. ✔
- `drawLine(x0,y0,x1,y1)` helper (beginPath→moveTo→lineTo→stroke). ✔
- `let last = { x:0, y:0 }`, mousedown sets `last`, mousemove draws locally + `socket.emit("draw", {x0,y0,x1,y1})` + updates `last`, mouseup sets `drawing=false`. ✔
- `socket.on("draw", data => drawLine(data.x0,data.y0,data.x1,data.y1))`. ✔
- ❌ **Duplicate `let drawing = false;`** (declared twice) → SyntaxError. **← fix this.**
- ❌ **Stray `3`** line before the `socket.on("draw")` block. **← delete.**

### `public/index.html` — should include (confirm)
- `<script src="/socket.io/socket.io.js"></script>` **before** `<script src="main.js"></script>`. (This client library is auto-served by the Socket.IO server — we don't create the file.) Confirm the order is right next session.

### `package.json`
- Deps: `express ^5.2.1`, `socket.io ^4.x` (installed today). Dev: `nodemon`. Script: `npm run dev` → `nodemon server.js`.

---

## 4. What Amer just learned / debugged this session (build on it)
- **Why we need the server at all:** browsers can't reach each other directly (NAT/firewalls) → the server is the middle-man that relays.
- **HTTP vs WebSocket:** HTTP = browser asks, server answers, line closes; the server can't push. WebSocket = one persistent two-way line, either side sends anytime → what live games need.
- **Socket.IO API:** `emit` to send, `on` to receive — it's `addEventListener` over the network. `io` = all clients, a `socket` = one client, `socket.broadcast.emit` = everyone but the sender.
- **`http.createServer(app)` + `server.listen`** (not `app.listen`) so Socket.IO shares the port.
- **Debugging skill leveled up:** last session a `ReferenceError` (file ran, one line failed — missing `function (e)` param); this session a `SyntaxError` (file never ran at all — duplicate `let`). He can now tell parse-time vs run-time errors apart. Reinforce this distinction.
- **Notes captured** in `learnings/Day-03.md` (HTTP flow, the 4 steps, the pieces = hotel/manager/receptionist/phone-line analogies, the full emit→broadcast→on flow, task breakdowns).

**Still-open weak spot to keep reinforcing:** the browser/server boundary. M3 is the payoff — once he *sees* strokes cross tabs, tie it back explicitly.

---

## 5. After M3 — Milestone 4 (rooms)
Turn the single shared canvas into **private rooms** so friends join by a code and strokes only broadcast within their room:
- Client: send/pick a room code; `socket.emit("join", code)`.
- Server: `socket.join(code)`; relay with `io.to(code).emit("draw", data)` (or `socket.to(code).emit(...)` to exclude sender) instead of a global broadcast.
- Concept: "broadcasting to a room" = grouping players; sets up the actual game (each game = a room). This is still Week 3.

---

## 6. Standing preferences (already in CONTEXT.md — honor automatically)
- **Teaching style:** deep tutor mode, preemptively, every chat — big picture → line-by-line → mental model → Java comparison → common mistakes → experiments → what to understand. (Full brief in `CONTEXT.md` §2.)
- **Git commits:** always **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`, scopes, `!`/`BREAKING CHANGE`). Never plain messages.
- **Process:** Amer types every line; Claude guides with hints/snippets, doesn't orchestrate. Struggle-first. Each working day ends in something that works + a commit.
- **Docs separation:** `learnings/` = Amer's own-words notes; `docs/` = Claude's guides + this handoff.

---

## 7. Suggested commit once M3 is confirmed
```
git add .
git commit -m "feat(socket): broadcast strokes so other tabs draw live"
git push
```
(Or split: `chore: add socket.io dependency`, `feat(server): relay draw events to other clients`, `fix(canvas): remove duplicate drawing declaration`.)
