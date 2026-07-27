# 🔁 Session Handoff — resume here next chat

> **Read this first (with `docs/CONTEXT.md`) to pick up exactly where we stopped.**
> This is a *mentor doc* (Claude's). Amer's own words-notes live in `learnings/`. Keep this file overwritten/updated at the end of each session so it's always the live "you are here."
>
> **Last updated:** end of the Milestone 5 (part 1) session — roles + witness-only prompting shipped and server-enforced.

---

## 0. One-line status

**Weeks 1–3 complete; Milestone 5 is about HALF done.** The networking spine (live drawing, rooms) is built and confirmed. On top of it, the game loop has begun: the witness's prompt relays to the room, a **Start Round** button triggers a round, the **server picks a random witness**, roles show on screen, and **only the witness can prompt — enforced on the server** (proven with a dev-tools cheat test). **Next step = the rating step** (witness rates the blind drawings). Game direction is the police-sketch "describe → draw blind → rate" design in `docs/GAME-DESIGN.md`.

---

## 1. Where we are on the roadmap

| Milestone | What | Status |
|---|---|---|
| **M1** | Express server serves the page at `localhost:3000` | ✅ done |
| **M2** | Freehand mouse drawing on the canvas | ✅ done |
| **M3** | Drawing in one tab appears in another (Socket.IO) | ✅ done & confirmed |
| **M4** | Rooms (private canvas via a code) | ✅ done & confirmed |
| **M5** | Game loop / MVP | 🚧 **~half done — see below** |
| M6 | Art + one unique twist (AI judge) + a fun visual | ⬜ |

### Milestone 5 — internal progress
| Step | What | Status |
|---|---|---|
| Prompt relay (whole mode) | witness types → room receives | ✅ done |
| Start Round button | browser sends a *command* to the server | ✅ done |
| Server picks a witness | random, announced with `io.to(room)` | ✅ done |
| Roles + witness-only prompting | shown on screen + **server-enforced** | ✅ done |
| **Rating** | witness rates the blind drawings | 🟢 **NEXT** |
| Scoring + reveal | server awards points, reveals target | ⬜ |
| Rotate witness + loop | new round → new witness → repeat | ⬜ → tag `v0.1-mvp` |

Guides: `docs/Day-1.md` … `docs/Day-5.md` (Day-5 covers this M5 session). Design: `docs/GAME-DESIGN.md`. Amer's notes: `learnings/Milestone-1.md`, `Milestone-2-3.md`, `Milestone-4-5.md`.

---

## 2. 🟢 NEXT STEP — the rating step (Milestone 5 continues)

The hardest ideas (server authority, server-side state, never-trust-the-client) are **done**. Remaining steps reuse those exact patterns with new message types (`rate`, `score`).

1. **Rating.** After drawers make their blind sketches, the **witness** rates them (only the witness knows the target, so only they can judge — settled in `GAME-DESIGN.md §2`). Wire the long-dormant `#guess` box (unused since Day 1) into a rate action: witness acts → `socket.emit(...)` → **server** records → announces to the room. Server-side check again: only accept ratings from the room's stored witness (`rounds[room]`).
2. **Scoring + reveal.** Server awards points from the ratings and reveals the target. Points live on the **server** (source of truth again).
3. **Rotate + loop.** New witness, new prompt — the game *repeats*. When it loops cleanly → **playable MVP → tag `v0.1-mvp`** = summer success by Amer's own tracker.

**Direction reminder:** building **custom mode → whole mode** first (everyone gets the full description). Part mode (split description) and character mode (reference image) come later. Amer is **NOT** locking a "main mode" yet — build one simple-but-interesting loop, ship by Week 6, don't over-scope.

---

## 3. Exact state of each file (current & correct)

### `server.js` — ✅ current
- Express + `http.createServer(app)` + `new Server(server)`; `app.use(express.static("public"))`; `server.listen(3000)`.
- `const rounds = {};` at the top — **server-side game state** (`rounds[room] = witnessId`).
- Inside `io.on("connection", ...)`:
  - `join` → `socket.join(room)`.
  - `draw` → `socket.to(data.room).emit("draw", data)` (room-scoped relay).
  - `prompt` → **guarded:** `if (rounds[description.room] !== socket.id) return;` then `socket.to(description.room).emit("prompt", description)`.
  - `startRound` → gets `io.sockets.adapter.rooms.get(room)`, guards empty room, `Array.from` → random index → `witnessId`, stores `rounds[room] = witnessId`, then `io.to(room).emit("roundStarted", { witnessId })`.

### `public/main.js` — ✅ current
- `const socket = io()` + connect logger.
- Room join (`#roomCode` / `#joinBtn`, `myRoom`).
- Prompt: `#prompt` / `#promptBtn` / `descriptionEl`; emits `{ text, room }`; `socket.on("prompt")` writes `data.text` into `descriptionEl`.
- Start Round: `#startBtn` → `socket.emit("startRound", myRoom)`.
- `socket.on("roundStarted")` → `amWitness = (data.witnessId === socket.id)`; writes role into `#role`; sets `promptInput.disabled` / `promptBtn.disabled = !amWitness`.
- Canvas drawing block (mousedown/move/up + `drawLine`), `socket.on("draw")` receiver.
- Note: the `#guess` / `#sendBtn` box is still the Day-1 stub — **this is what the rating step will repurpose.**

### `public/index.html` — ✅ current
- Room group, canvas, guess group (stub), prompt group (`#prompt` + `#description` + `#role` + `#promptBtn`), lone `#startBtn`.
- `<script src="/socket.io/socket.io.js"></script>` before `main.js`. ✔

### `package.json`
- Deps: `express ^5.2.1`, `socket.io ^4.x`. Dev: `nodemon`. Script: `npm run dev`.

---

## 4. Where Amer's understanding is (build on it)
- **Solid:** `emit`/`on` as networked `addEventListener`; `io` = everyone, `socket` = one client; `io.to(room)` (all) vs `socket.to(room)` (all but sender); rooms; the prompt relay; the Start button as a *command*.
- **Now landed (this session):** **server as source of truth** (only the server sees everyone, so only it can pick the witness) and **never trust the client** (real enforcement is the server's `rounds[room] !== socket.id` check, not a hidden button). Confirmed with the cheat test.
- **Watch:** a couple of the M5 slices Amer placed the code but wanted the *why* reinforced — keep going slow, keep the explain-back checks (they worked). In his notes the `!==` allow/deny logic was written slightly flipped; corrected in `learnings/Milestone-4-5.md`.

---

## 5. Standing preferences (from CONTEXT.md — honor automatically)
- **Teaching style:** deep tutor mode, preemptively, every chat — big picture → line-by-line → mental model → Java comparison → common mistakes → experiments → what to understand. (Full brief in `CONTEXT.md §2`.)
- **Git commits:** always **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`, scopes, `!`/`BREAKING CHANGE`). Never plain messages.
- **Process:** Amer types every line; Claude guides with hints/snippets, doesn't orchestrate. Struggle-first. Each working day ends in something that works + a commit.
- **Docs separation:** `learnings/` = Amer's own-words notes (named `Milestone-*`); `docs/` = Claude's guides (`Day-*`) + this handoff.

---

## 6. Uncommitted / loose ends to check at session start
- Confirm the latest work is committed: the roles/enforcement feature, `docs/Day-5.md`, the `learnings/` renames + `Milestone-4-5.md`. Suggested messages if not yet pushed:
  - `feat(round): show roles and restrict prompting to the witness (server-enforced)`
  - `docs: add Day 5 guide and refresh handoff`
  - `docs(learnings): rename to milestones and add Milestone 4 & 5 notes`
