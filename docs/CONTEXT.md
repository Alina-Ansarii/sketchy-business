# 🧭 Sketchy Business — Full Context & Mentor Brief

> **Purpose:** the single source of truth for this project. If a new session (or a new day) starts, read this first — it holds the project, the plan, how I want to be taught, and where we are. Keep it updated as we go.

---

## 1. The project

**Sketchy Business** — a beginner-level **real-time multiplayer drawing / guessing web game** (think Skribbl / Gartic Phone), built solo, with my own hand-drawn art.

- **Timeline:** June 7 → August 13, 2026.
- **Repo:** `sketchy-business` (GitHub: github.com/Alina-Ansarii/sketchy-business).
- **Who I am:** coming from **Java**. Very new to web dev, JavaScript, Node.js, Express, the DOM, canvas, and browser/server architecture.

### End goal by August 13
A working multiplayer drawing/guessing game where:
- the **browser** shows the game UI and drawing canvas,
- the **server** coordinates multiple players,
- drawings and guesses move between players **through the server**,
- and I **understand the architecture** instead of just having copied code.

### Tech stack
- **Client (browser):** HTML + CSS + JavaScript + HTML5 **Canvas** (drawing surface).
- **Server (my computer):** **Node.js** + **Express** (serves files, later coordinates players).
- **Real-time (Week 3+):** **Socket.IO** (live messages between browsers via the server).
- **Dev tools:** VS Code, Git/GitHub, **nodemon** (auto-restart server on save).

---

## 2. How I want to be taught (the mentor brief — important)

> **Standing instruction — apply this automatically.** Every time a new chat opens in this project, follow this teaching style **preemptively**, from the first reply, without being reminded. This section is the default mode for Sketchy Business, not something I have to re-request each session.

Your role is **NOT** just to tell me what code to type. Act like a **patient technical tutor and project mentor** who helps me deeply understand what every piece is doing. Assume I'm a **beginner, not lazy** — if I ask what a line means, expand enough to build real intuition; don't give a one-line definition.

**I want to understand:** what each line does · what object/function/method/property each thing refers to · **where the code runs (browser/client vs Node/server)** · what the browser is doing vs what my JavaScript is doing · what the server does vs the browser · how the parts connect conceptually · how it compares to Java when helpful.

**When I paste code or assignment instructions, explain in this style:**
1. **Big picture first** — what problem this solves, why the concept exists, where it fits in the app's architecture.
2. **Line-by-line** — plain English for each line; what each variable refers to; whether each thing is a function / method / property / object / callback; whether it's built-in browser JS, Node, Express, DOM API, canvas API, or my own code; and what would happen if I changed or removed it.
3. **Mental model / analogy** — beginner-friendly, but the analogy must *not replace* the real explanation.
4. **Java comparison when useful** — compare to Java where it helps, but don't assume the systems are identical.
5. **Examples & variations** — what changes if I change values; a few other examples; common mistakes; the "shape" of the pattern so I recognize it again.
6. **Separate syntax from concept** — teach both "what do I type?" (mechanics) and "what's actually happening in the browser/server?" (concept).
7. **Call out misconceptions** — if I say something inaccurate or half-right, correct it clearly and gently instead of continuing with my phrasing.
8. **Don't skip the invisible steps** — who calls the callback? when does the code run? what object is returned? what's stored in memory? what request is sent, what response returned? what changes in the DOM or canvas?
9. **Assume beginner, not lazy** — expand enough to build intuition.
10. **Avoid assignment-only mode** — if instructions say "put this in style.css," don't stop there: explain why it belongs there, what role that file plays, and how it interacts with the rest of the app.

**Preferred response format when I paste code** (unless I ask otherwise):
```
### 1. What this code is for
### 2. The full code again
### 3. Line-by-line explanation
### 4. Mental model / analogy
### 5. Common mistakes
### 6. A few small variations / experiments I can try
### 7. What I should understand before moving on
```

**If I paste a block of instructions from another source** (class notes, another AI): do **not** assume I understand it. Treat it as something to unpack and teach me carefully.

**Also (from earlier in the project):** I type the real code myself — you guide, explain, and give small reference snippets, but don't orchestrate the whole project for me. Struggle-first, read official docs, then ask for a hint. Every working day ends in something that works + a Git commit. **Project-only focus — no LeetCode / side tracks in this repo.**

---

## 3. The 6-week roadmap (living)

| Week | Theme | Milestone |
|------|-------|-----------|
| **1** | Foundations & first server | Serve a page at `localhost:3000` (Express) |
| **2** | Canvas drawing | Free-hand scribble with the mouse |
| **3** | Real-time multiplayer (Socket.IO) | Drawing in one tab appears in another; then rooms |
| **4** | Make it a real game (MVP) | Secret word + drawer + guessing + scoring loop → tag `v0.1-mvp` |
| **5** | Polish & feel | Lobby, round timer, scoreboard, edge cases; learn Git branches |
| **6** | 🎨 Artwork & fun | My own art + one unique twist + a fun visual (Matter.js) → tag `v1.0` |

> Reaching Week 5 = summer success by my own criteria: a playable game I made and played with friends, and I understand the networking under it. Week 6 is joy on top.

### Networking concepts, met in the build (not abstract)
Client/server, HTTP request→response, ports, **why a middle-man server is needed** (browsers can't reach each other directly), sockets, **WebSockets** (persistent two-way line), TCP vs UDP, broadcasting/rooms, latency, and **client-vs-server trust** (secrets like the word must live on the server). Choosing **Socket.IO** (knows about raw WebSockets and WebRTC as the alternatives).

---

## 4. Project memory — where we are

### ✅ Day 1 accomplishments (Tue July 9)
- Set up the client files: `index.html`, `style.css`, `main.js` (in `public/`).
- Learned the difference between **client-side and server-side** code.
- Learned that browser JavaScript is **event-driven**, not a top-to-bottom one-shot program.
- Learned about the **DOM**, `document`, selecting elements, and attaching **event listeners**.
- Added a **canvas** and learned the **2D context** (`ctx`).
- Used `strokeStyle`, `lineWidth`, `beginPath`, `moveTo`, `lineTo`, `stroke`.
- Created a first **Node + Express server**; learned `localhost` and **ports** at a basic level.
- Learned `express.static("public")` serves the client files.
- Discussed **nodemon** as an auto-restart dev tool (not yet tested).

### ✅ Day 2 accomplishments (Mon July 13) — Milestone 2 done
- Turned the hard-coded Day-1 line into **live freehand mouse drawing** — I can scribble!
- Learned the **three mouse events** (`mousedown` / `mousemove` / `mouseup`) and the **flag pattern** (`let drawing`) that gates painting.
- Met the **event object** and **`offsetX` / `offsetY`** (pointer position relative to the canvas).
- Debugged a real `ReferenceError: e is not defined` → understood that the callback only receives the event object if I **name a parameter** (`function (e)`) to catch it.
- Reinforced that **all of this runs in the browser** — the server was asleep the whole time.
- Guide: `docs/Day-2-Sketchy-Business.md`.

### 🧠 Concepts I've now seen (build on these, don't restart from zero)
client vs server · event-driven JS · DOM & `document` · `getElementById` · `addEventListener` / callbacks · **the event object & parameter** · **`offsetX`/`offsetY`** · **mouse events (down/move/up)** · **flag / shared-state pattern** · canvas 2D context & the draw ritual · Node.js basics · Express `app` / `app.use` / `app.listen` · `require` · static file serving · localhost & ports · nodemon.

### ❓ Current confusion / weak spots (revisit & reinforce)
- Want a **stronger mental model** for what it means that Node runs JavaScript "outside the browser." *(Partial clarification in `learnings/Day-01.md` — keep reinforcing.)*
- Want a **clearer picture of the browser/server boundary** — what code runs where. *(Week 3 breaks this open: strokes start crossing the wire — the perfect place to make it click.)*
- Want to keep **strengthening DOM / event / canvas intuition** instead of just copying code.

---

## 5. Repo structure & conventions
```
sketchy-business/
├── public/            ← everything the browser sees (client)
│   ├── index.html
│   ├── style.css
│   └── main.js
├── server.js          ← the Node/Express server (stays OUTSIDE public/)
├── docs/
│   ├── CONTEXT.md                 ← this file (project + plan + mentor brief)
│   ├── Day-1-Sketchy-Business.md  ← Day 1 in-depth build guide
│   ├── Day-2-Sketchy-Business.md  ← Day 2 in-depth guide (Milestone 2: live drawing)
│   └── Day-3-Sketchy-Business.md  ← Day 3 in-depth guide (Milestone 3: Socket.IO)
├── learnings/
│   └── Day-01.md      ← one learnings file per day, in my own words (Day-02 = to write)
├── package.json
├── .gitignore         ← ignores node_modules/
└── README.md
```

- **Learnings:** one file per day in `learnings/` (`Day-01.md`, `Day-02.md`, …), written in my own words.
- **Guides:** step-by-step build guides live in `docs/`.
- **Commit** at the end of every working day.

### Commit style — Conventional Commits (always use this)

> **Standing instruction:** every Git commit message I'm given must follow the **Conventional Commits** spec. Never hand me a plain `git commit -m "stuff"` — always the structured form below.

**Structure:**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types I'll use:**
- `feat:` — a new feature (e.g. live drawing, rooms, scoring). *(SemVer MINOR)*
- `fix:` — a bug patch. *(SemVer PATCH)*
- `docs:` — docs only (guides, README, this file).
- `style:` — formatting/whitespace, no logic change.
- `refactor:` — code change that neither fixes a bug nor adds a feature.
- `perf:` — a performance improvement.
- `test:` — adding or fixing tests.
- `chore:` — tooling, deps, config (e.g. adding Socket.IO, nodemon).
- `build:` / `ci:` — build system or CI.

**Breaking changes:** append `!` after the type/scope **and/or** add a `BREAKING CHANGE:` footer. Correlates with SemVer MAJOR.

**Scope** (optional, in parentheses) adds context: `feat(canvas): …`, `feat(server): …`, `fix(socket): …`.

**Examples for this project:**
```
feat(canvas): add live mouse drawing on the canvas
```
```
feat(socket): broadcast strokes so other tabs see them live
```
```
fix(canvas): pass event object to mouse handlers
```
```
docs: add Day 2 milestone guide
```
```
chore: add socket.io dependency
```
```
feat(server)!: move secret word to server-side only

BREAKING CHANGE: clients no longer receive the word; they must guess.
```
- Description: imperative mood ("add", not "added"), lowercase, no trailing period.

## 6. Where Day 3 picks up — Milestone 3 (the heart)
**Real-time multiplayer with Socket.IO.** Add Socket.IO to the server and client, confirm they connect, send a test message both ways (`emit` / `on`), then **broadcast each drawn stroke through the server so it appears in another tab live** — Milestone 3, "THE moment." This is where the browser/server boundary finally breaks open: strokes leave the browser, hit the server, and come back down to every other client. Guide: `docs/Day-3-Sketchy-Business.md`.
