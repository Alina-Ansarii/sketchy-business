# 🎨 Sketchy Business — Day 5: Milestone 5 (In-Depth) — the game loop begins

> **You type every line. I explain every line.** The struggle is where the skill forms.
>
> **Layout per task:** **explanation** (concept from scratch) → **how to do it** (steps) → **the code** (type it at the end) → **line-by-line** → **mental model** → **common mistakes** → **experiments** → **verify**. Today the app stops being "a shared whiteboard" and starts being **a game with rules** — and the server stops being a dumb relay and becomes the **referee**.

---

## Recap — where Days 3–4 left you

- **Milestone 3:** strokes leave your browser, hit the server, and come back down into other tabs. You *saw* the browser/server boundary in motion.
- **Milestone 4:** **rooms** — friends join a private canvas by a code (`socket.join(code)`), and strokes only relay within a room (`socket.to(room).emit(...)`).
- Big theme so far: the server has been a **relay** — it forwards whatever it's told (strokes, later prompts) **without understanding or judging it**.

Today that changes. The server starts to **decide things** and **enforce rules**. That's the whole point of Milestone 5, and it's the exact "never trust the client / server is the source of truth" idea from your networking thread — built, not read about.

---

## The big picture: from whiteboard to game

Your game (per `GAME-DESIGN.md`) is the police-sketch inversion:

```
witness gets a prompt  →  everyone else draws BLIND  →  witness rates  →  points  →  rotate witness  →  repeat
```

Milestone 5 puts that loop on top of the working pipes. **Crucial realisation: this is NOT new networking.** It's the same `emit` / `on` / rooms you already built — just carrying **new kinds of messages** (a prompt, a "start round" command, a role announcement) and, for the first time, the server **making decisions** about them.

We're building **custom mode → whole mode** first (the witness writes one description; *everyone* gets the full thing). Part mode (splitting the description) and character mode (reference image) come later. Ship the simple loop first.

### The one genuinely new idea today: the server holds state and enforces rules

Until now, every decision lived in the browser. Today:
- The **server** decides who the witness is (only it can see everyone in a room).
- The **server** remembers that decision (game state that outlives a single event).
- The **server** rejects prompts from anyone who isn't the witness (real enforcement — a hidden button in the browser is *not* security).

Say it out loud: **the browser only ever *asks* and *reacts*; the server *decides* and *enforces*.**

---

## Task 1 — The witness sends a prompt to the room (whole mode)

### Explanation

The loop starts with a description travelling from the witness to everyone else. This is the **same three-move pattern** as `draw`, with a new event name and a text payload:

- **Client emits:** `socket.emit("prompt", { text, room })`
- **Server relays:** `socket.on("prompt", data => socket.to(data.room).emit("prompt", data))`
- **Other clients listen:** `socket.on("prompt", data => show data.text)`

Two different elements do two different jobs, and mixing them up is the classic beginner trap:
- The **`<input id="prompt">`** is where the witness *types* (a tool for composing — belongs to the sender).
- The **`<p id="description">`** is where a *received* description *displays* (a read-only board — belongs to the receivers).

Data flows **input → over the wire → other tab's `<p>`**. It is *not* the same box round-tripping; they're different elements on different computers.

### How to do it

1. In `index.html`, add a prompt group: an `<input id="prompt">`, a `<p id="description">`, and a `<button id="promptBtn">`.
2. In `main.js`, grab all three; on click, read `promptInput.value` and `socket.emit("prompt", { text, room: myRoom })`.
3. Add `socket.on("prompt", data => descriptionEl.textContent = data.text)`.
4. In `server.js`, relay: `socket.to(data.room).emit("prompt", data)`.

### The code

`public/main.js`:
```js
const promptBtn = document.getElementById("promptBtn");
const promptInput = document.getElementById("prompt");
const descriptionEl = document.getElementById("description");   // El = it's an element, not a string

promptBtn.addEventListener("click", function () {
  const text = promptInput.value;
  socket.emit("prompt", { text, room: myRoom });   // { text } shorthand = { text: text }
});

socket.on("prompt", function (data) {
  descriptionEl.textContent = data.text;           // WRITE the received text onto the page
});
```

`server.js` (inside the connection handler):
```js
socket.on("prompt", function (description) {
  socket.to(description.room).emit("prompt", description);
});
```

### Line-by-line

- `const descriptionEl = document.getElementById("description");` — grabs the `<p>` **element object** (not its text). The `El` suffix reminds you it's an element.
- `const text = promptInput.value;` — `.value` pulls the **string** the user typed out of the input.
- `socket.emit("prompt", { text, room: myRoom });` — send a `"prompt"` event carrying an object. `{ text }` is **shorthand** for `{ text: text }` (JS lets you drop the repeat when key and variable share a name). `room` is included so the server knows *where* to relay — leave it out and `socket.to(undefined)` goes nowhere.
- `socket.on("prompt", data => descriptionEl.textContent = data.text)` — when a prompt arrives, **assign** its text into the `<p>`. Same move as `draw`'s receiver, just text instead of coordinates.
- Server `socket.to(description.room).emit("prompt", description)` — relay to everyone in the room **except the sender** (the witness already knows what they typed).

### Mental model

A prompt is **just another kind of letter** going through the same post office as your drawings. New label (`"prompt"`), new contents (text), same delivery system.

### Common mistakes

- **Sending the element, not the text:** `emit("prompt", { text: descriptionEl })` ships a DOM element (Socket.IO can't carry that). Send `promptInput.value`.
- **Reading instead of writing:** `myRole = roleEl.textContent` *reads* an empty `<p>`. To display, you **assign**: `roleEl.textContent = "..."`. Data flows into the element, not out of it.
- **Forgetting `room`** in the payload → the server can't scope the relay.
- **Testing in one tab:** the relay excludes the sender, so the witness's own `<p>` stays blank. Use **two tabs** in the **same room**.

### Verify

Two tabs, same room. Type a description in one, click Prompt → it appears in the *other* tab's `<p>`. (Sender's own `<p>` stays blank — expected.)

---

## Task 2 — The "Start Round" button (a command, not data)

### Explanation

Something has to say "a round begins **now**." A button is that trigger. Today it does exactly one thing: click → send a `"startRound"` command to the server. The server *reacting* (picking a witness) is Task 3.

Notice the shift in *intent*: `draw` and `prompt` are **data to pass along**. `startRound` is a **command** — "server, do something." Same `emit` mechanism, different purpose.

A button that carries **no typed data** needs **no `<input>`** — the only thing the server needs (which room) the client already knows from joining (`myRoom`). So it's a lone `<button>`. (Rule of thumb: **input = "user types data"; button = "user triggers an action."**)

### How to do it

1. In `index.html`, add a lone `<button id="startBtn">Start Round</button>`.
2. In `main.js`, grab it, add a click listener, `socket.emit("startRound", myRoom)`.

### The code

`public/index.html`:
```html
<button id="startBtn">Start Round</button>
```

`public/main.js`:
```js
const startBtn = document.getElementById("startBtn");   // id string must match the HTML exactly

startBtn.addEventListener("click", function () {
  socket.emit("startRound", myRoom);                    // reuse myRoom — don't re-read the box
  console.log("Round started in room:", myRoom);
});
```

### Line-by-line

- `document.getElementById("startBtn")` — the **string** must match the HTML `id` exactly (case-sensitive). Naming the *variable* `startBtn` but fetching `"joinBtn"` is a classic copy-paste bug — the variable name is just a label; the string is what actually connects.
- `socket.emit("startRound", myRoom)` — send the command with the room. Payload is just the room string (no object needed yet).
- **Use `myRoom`, not `roomInput.value`:** `myRoom` was set when you clicked Join. Re-reading the input would let someone "start a round" for a room they typed but never joined. Only act on state you actually established — a small taste of the server-truth mindset creeping into good client habits.

### Common mistakes

- **`id` mismatch** between HTML and `getElementById`.
- **Starting before joining:** `myRoom` is `null` until you Join. Join first when testing; we guard against it server-side in Task 3.
- **Expecting something visible:** nothing shows yet — success here is a `console.log`.

### Verify

Join a room, click Start Round → the console logs it fired. (Optional: add a temporary `socket.on("startRound", ...)` server log to see the signal land — a nice bridge into Task 3.)

---

## Task 3 — The server picks a witness (the heart of Milestone 5)

### Explanation

When the server receives `startRound`, it must (1) find everyone in that room, (2) randomly pick one to be the witness, and (3) announce it to the room.

**Why the SERVER and not the browser?** Your tab only knows about *itself* — it cannot see the other players. The **server** is the only thing that can see *all* the sockets in a room at once. If each browser picked independently, they'd disagree (two tabs both thinking they're the witness). There must be **one authority** that decides and everyone obeys. That authority is the server. **This is what "source of truth" means.**

**The new Socket.IO tool:** `io.sockets.adapter.rooms.get(room)` returns the **Set** of socket ids in that room (or `undefined` if the room doesn't exist). A JS `Set` is like Java's `Set<String>`. To pick by position, convert it to an array with `Array.from(...)` (like `new ArrayList<>(set)`), then index a random slot.

**Announcing — a subtle, important choice.** Each player really only needs to know *"am I the witness or a drawer?"* The clean way: the server tells **everyone the witness's id**, and each browser compares it to its **own** id (`socket.id`). Use **`io.to(room)`** (everyone) — **not** `socket.to(room)` (everyone-but-sender) — because the person who clicked Start might *be* the witness and must hear it too.

### How to do it

1. In `server.js`, add `socket.on("startRound", function (room) { ... })`.
2. Get the room's players, guard against an empty/missing room, convert to an array.
3. Pick a random **id** (index → element), and `io.to(room).emit("roundStarted", { witnessId })`.
4. On the client, add `socket.on("roundStarted", ...)` that compares `data.witnessId` to `socket.id` and logs the role.

### The code

`server.js` (inside the connection handler):
```js
socket.on("startRound", function (room) {
  const players = io.sockets.adapter.rooms.get(room);   // the Set of ids in this room
  if (!players) return;                                 // no such room → bail quietly

  const arr = Array.from(players);                      // Set → array so we can index it
  const witnessIndex = Math.floor(Math.random() * arr.length);
  const witnessId = arr[witnessIndex];                  // the ACTUAL id (not the index!)

  io.to(room).emit("roundStarted", { witnessId });      // io.to = EVERYONE in the room
});
```

`public/main.js`:
```js
socket.on("roundStarted", function (data) {
  if (data.witnessId === socket.id) {                   // is the announced id ME?
    console.log("I am the witness");
  } else {
    console.log("I am a drawer");
  }
});
```

### Line-by-line

- `io.sockets.adapter.rooms.get(room)` — asks Socket.IO for the **Set of socket ids** in `room`. The browser could never answer this; only the server sees all connections. **This is why the server must choose.**
- `if (!players) return;` — if the room is missing/empty (e.g. Start clicked before joining), `players` is `undefined`; bailing prevents `Array.from(undefined)` from crashing the server. The server **defending itself against bad input** — the "never trust the client" mindset in miniature.
- `Array.from(players)` — a Set has no random index; convert to an array first.
- `Math.floor(Math.random() * arr.length)` — a random **position** (0, 1, …). Same idea as Java's `Math.random()`.
- `arr[witnessIndex]` — the **element at that position** = the witness's real id string. *The index is just how you reach it; the id is the thing you send.* (Sending the index instead is the #1 bug — you'd be comparing a number to an id string, which never matches, so nobody's ever the witness.)
- `io.to(room).emit("roundStarted", { witnessId })` — announce to **everyone** in the room. `io.to` includes the sender; `socket.to` would exclude them.
- Client `data.witnessId === socket.id` — each tab compares the announced id to **its own** id. The server broadcast one id; each tab decides its *own* role by asking "is that me?" That's how one message produces two different roles.

### Mental model

The server is the **game host** who can see the whole table. It points at one person — "you're the witness" — and everyone hears the same announcement, but only the person pointed at reacts as the witness. A single player, seeing only themselves, could never point fairly.

### Java comparison

`io.sockets.adapter.rooms.get(room)` is like the server holding a `Map<String, Set<ClientId>>` of rooms → members; picking is `list.get(randomIndex)`. Socket.IO maintains that membership map for you.

### Common mistakes

- **Sending the index, not the id** (`{ witnessId: witnessIndex }`) → nobody is ever the witness.
- **`socket.to` instead of `io.to`** → the clicker never hears the announcement if they were picked.
- **Skipping `const`/`let`** → accidental sloppy globals; always declare.
- **No empty-room guard** → `Array.from(undefined)` crashes the server.
- **Comparing to the wrong id** on the client — compare against `socket.id` (this tab's own id).

### Verify

Two tabs, same room, click Start Round. Exactly **one** console says "I am the witness", the other "I am a drawer". Click again → the witness may change (random). 🎉

---

## Task 4 — Show the role + restrict prompting to the witness (server-enforced)

### Explanation

The role only lives in a `console.log` so far, and — more importantly — **nothing enforces it**: a drawer can still send a prompt. Task 4 fixes both, in three slices:

- **Slice A (client UX):** show the role on the page.
- **Slice B (client UX):** disable the prompt box for drawers.
- **Slice C (server SECURITY):** actually reject prompts from non-witnesses.

**The key lesson lives in the split between B and C.** Hiding a button in the browser is *pleasant*, but it is **not** enforcement — a drawer could open dev tools and `socket.emit("prompt", ...)` by hand. Real enforcement must happen on the **server**, which means the server has to **remember who the witness is** — its first piece of persistent **game state**.

### How to do it

1. **A:** add `<p id="role">`; in `roundStarted`, set `amWitness` from the comparison and write a sentence into the `<p>`.
2. **B:** in the same handler, `promptInput.disabled = !amWitness; promptBtn.disabled = !amWitness;`.
3. **C:** add `const rounds = {}` at the top of `server.js`; store `rounds[room] = witnessId` when the round starts; in the `prompt` handler, `return` early if the sender isn't the stored witness.

### The code

`public/main.js`:
```js
const roleEl = document.getElementById("role");
let amWitness = false;

socket.on("roundStarted", function (data) {
  amWitness = (data.witnessId === socket.id);     // decide the fact (a boolean)
  if (amWitness) {
    roleEl.textContent = "You are the WITNESS - describe the target";
  } else {
    roleEl.textContent = "You are a DRAWER - wait for the description";
  }
  promptInput.disabled = !amWitness;              // drawers: greyed out
  promptBtn.disabled = !amWitness;
});
```

`server.js` — **top of file, outside all handlers:**
```js
const rounds = {};   // server memory: rounds[roomName] = that room's witness id
```

`server.js` — inside `startRound`, after computing `witnessId`:
```js
rounds[room] = witnessId;   // write the decision down so we can check it later
```

`server.js` — the `prompt` handler now checks first:
```js
socket.on("prompt", function (description) {
  if (rounds[description.room] !== socket.id) return;   // not the witness → drop it
  socket.to(description.room).emit("prompt", description);
});
```

### Line-by-line

- `amWitness = (data.witnessId === socket.id)` — store the **fact** as a boolean (not the display sentence), because Slice B needs a true/false to set `disabled`. **Store the fact, derive the display.**
- `roleEl.textContent = "..."` — **write** the sentence onto the page (assign *to* the element).
- `promptInput.disabled = !amWitness` — `disabled` is a real boolean property on form elements. Witness → `false` (usable); drawer → `true` (greyed out). The `!` reads as "disabled when NOT the witness."
- `const rounds = {}` — **must be top-level**, not inside `io.on("connection")`. Inside the connection callback it'd be recreated empty for every user; at the top it's **one shared object** that persists for the life of the server. This is the server holding **state across events**.
- `rounds[room] = witnessId` — the server records its own decision so it survives after `startRound` returns.
- `if (rounds[description.room] !== socket.id) return;` — compare **who the server knows is the witness** against **who is actually sending** this prompt. Mismatch → drop it silently. Even a hand-crafted dev-tools emit dies here, because the real `socket.id` won't equal the stored witness. **This is the whole "never trust the client" payoff.**

### Mental model

The server keeps a **notebook** (`rounds`): "room ABC → witness aX7f." When a prompt arrives it checks the notebook before relaying — like a bouncer with a guest list. The browser can *lie about the button*, but it can't fake its own `socket.id`, and it can't see the server's notebook.

### Java comparison

`rounds` is a `Map<String, String>` (room → witnessId) held as a server field. The guard clause is a plain permission check before doing the work — exactly like verifying a user's role before letting them hit a protected method.

### Common mistakes

- **Enforcing only in the browser** (Slice B alone) — *feels* done, isn't secure. Slice C is the real one.
- **Putting `rounds` inside the connection handler** — it'd reset per user and never accumulate.
- **`disabled = "true"`** (a string) instead of the boolean `true`.
- **Single `let witnessId` instead of `rounds[room]`** — two simultaneous rooms would clobber each other. Key state by room.
- **Case-sensitivity typos** (`roleEL` vs `roleEl`) → `ReferenceError` that only fires in one branch.

### Verify (including the cheat test)

Two tabs, same room, Start Round:
- One tab shows **WITNESS** with a working prompt box; the other shows **DRAWER** with a greyed-out box.
- Witness types a description → it appears on the drawer's page.
- **The real test:** on the **drawer** tab's console, run
  ```js
  socket.emit("prompt", { text: "I am cheating", room: "YOUR_ROOM_CODE" });
  ```
  → **nothing appears** on the witness's page. The server refused it. That's server-side enforcement proven with your own hands. 🎉

---

## What you built today

- **Prompt relay (whole mode)** — the witness's description reaches the room (Task 1).
- **Start Round** — a client *command* to the server (Task 2).
- **Server picks a witness** — random, announced with `io.to(room)`; each tab derives its own role (Task 3). *Source of truth.*
- **Roles shown + prompting locked to the witness, server-enforced** — the server now holds **game state** (`rounds`) and **rejects** non-witness prompts (Task 4). *Never trust the client.*

You crossed the biggest conceptual line of the whole project: the server stopped being a relay and became the **referee**.

## Where Milestone 5 stands

| Step | What | Status |
|---|---|---|
| Prompt relay (whole mode) | witness → room | ✅ done |
| Start Round button | client command | ✅ done |
| Server picks witness | random, announced | ✅ done |
| Roles + witness-only prompting | server-enforced | ✅ done |
| **Rating** | witness rates the blind drawings | ⬜ next |
| **Scoring + reveal** | server awards points, reveals target | ⬜ |
| **Rotate witness + loop** | new round → new witness → repeat | ⬜ → tag `v0.1-mvp` |

About **halfway through M5.** The hardest ideas (server authority, server-side state, never-trust-the-client) are **done**. The remaining steps mostly *reuse* these exact patterns with new message types.

## Next (Milestone 5 continues)

- [ ] **Rating:** wire the long-dormant `#guess` box so the **witness** rates each drawing (only they know the target). Player acts → `emit` → **server** decides → announces.
- [ ] **Scoring + reveal:** points live on the **server** (source of truth again); reveal the target to the room.
- [ ] **Rotate + loop:** new witness, new prompt — the game *repeats*. When it loops cleanly → **playable MVP → tag `v0.1-mvp`** = summer success by your own tracker.

## Commit it (Conventional Commits)

```
git add server.js public/main.js public/index.html
git commit -m "feat(round): show roles and restrict prompting to the witness (server-enforced)"
git push
```

Earlier steps this session were their own commits:
```
feat(prompt): relay witness description to the room (whole mode)
feat(round): server picks a random witness and announces roles
```

---

*Companion to Day-1 through Day-4 guides. Write up Day 5 in your own words in `learnings/Day-05.md` — especially the two big ideas: **the server as source of truth** (only it can see everyone, so only it can pick the witness) and **never trust the client** (real enforcement lives on the server, which had to start remembering game state to do it).*
