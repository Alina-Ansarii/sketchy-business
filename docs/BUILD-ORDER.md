# 🧱 Sketchy Business — Build Order (piece-by-piece)

> **Why this file exists:** the full game (see `GAME-DESIGN.md §1`) is ~8 features. Trying to hold them all in my head at once = drowning. This file breaks the loop into ONE buildable piece at a time. Each session: take the next unchecked piece, build it, test it, commit it. Nothing else.
>
> **Confirmed target:** the full timed N-iteration loop. **Rule:** finish the loop before any mode/AI/aesthetics.

---

## ✅ Already built (the networking spine — done & confirmed)

- [x] Server serves the page (Express)
- [x] Freehand drawing on canvas
- [x] Drawing appears live in another tab (Socket.IO)
- [x] Rooms (join by code, strokes stay in the room)
- [x] Prompt relay — witness types, room receives (server-guarded)
- [x] Start Round — server picks a random witness, announces roles
- [x] Roles shown + prompt box locked to the witness (server-enforced `!==`)
- [x] Rating message — witness rates, relayed to room (server-enforced) *(v1: single score, being replaced by the star/lineup flow below)*

---

## 🟥 The MVP loop — build in THIS order

Each row = one focused session. Test + commit before moving on.

### Phase A — Collect the drawings (turn scribbles into a lineup)
- [ ] **A1. Snapshot a canvas.** On a signal, each drawer's browser does `canvas.toDataURL()` → gets its drawing as one image string → `emit("myDrawing", { image, room })`. Server logs what arrives. *(New: `toDataURL`.)*
- [ ] **A2. Server collects them.** Server gathers all drawings for the room into `drawings[room] = { drawerId: image }`. When it has everyone's, it emits the whole lineup to the room. *(New: server accumulates a set, like `scores` will.)*
- [ ] **A3. Show the lineup.** Each browser receives the lineup and displays every drawing in a list, name under each. *(New: building HTML elements from data — `<img>` per drawing.)*

### Phase B — Rate the lineup with stars
- [ ] **B1. Star widget.** Under each drawing, 1–5 clickable stars (half-stars later). Clicking sends `emit("rate", { targetId, stars, room })`. *(New: star UI.)*
- [ ] **B2. Server keeps score.** `scores[room] = { drawerId: points }`. On a valid rating (witness only, `!==` guard), add the stars, broadcast the scoreboard. *(New: server remembers a running tally between messages.)*
- [ ] **B3. Show the scoreboard.** Room sees each player's total update.

### Phase C — The timer engine (the backbone)
- [ ] **C1. One server timer.** Server runs a countdown for a phase; when it hits 0, it emits "phase over" and moves on. *(New: `setInterval`/`setTimeout` on the SERVER; server drives the clock, not the browser.)*
- [ ] **C2. Describe timer.** Short timer on the witness's describe phase → auto-forwards the description when it ends.
- [ ] **C3. Draw timer.** Longer timer on the draw phase → auto-triggers A1 (collect) when it ends. *(This replaces any manual "end round" — the timer ends it.)*
- [ ] **C4. Show the timer** ticking on screen for players. *(New: server sends time-left, browser displays it.)*

### Phase D — The loop + result
- [ ] **D1. Iterations count.** Set N at the start; server tracks which iteration we're on.
- [ ] **D2. Rotate witness.** Each iteration picks a new witness; the loop repeats B→C.
- [ ] **D3. Clear canvas between rounds.** `ctx.clearRect` + a `clear` broadcast so round 2 isn't drawn over round 1. *(Easy but essential.)*
- [ ] **D4. Final result.** After N iterations, sum scores → announce the winner.

### → tag `v0.1-mvp` = the full playable loop = summer success. 🎉

---

## 🟨 After the loop works (polish — Week 5-ish)
- [ ] Admin role (one player controls next/back in the rating lineup; passes on if they leave)
- [ ] Lobby (who's joined; start when enough players)
- [ ] Colour palette picker for drawers (send `color`/`width` in the draw payload)
- [ ] Handle someone leaving mid-round
- [ ] Optional head-outline guideline toggle on the canvas

## 🟩 Dessert (Week 6 — the reward)
- [ ] My own hand-drawn UI / avatars / mugshot cards
- [ ] AI judge (character mode — the CV twist)
- [ ] "Suspect caught" end-screen payoff
- [ ] One Matter.js fun visual (kinetic-typography title)

---

## How we work this list
1. Take the **top unchecked box**. Only that one.
2. I get a full explanation (what each new line is + why), then I type it.
3. Test it works. Commit (Conventional Commits). Check the box.
4. Next session, next box.

**Right now, next up: A1 — snapshot a canvas.**
