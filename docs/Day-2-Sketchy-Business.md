# 🎨 Sketchy Business — Day 2: Milestone 2 (In-Depth)

> Project-only. Just the game.
> **You type every line. I explain every line.** The struggle is where the skill forms.
>
> **How each task is laid out:** first the **explanation** (the concept, from scratch), then **how to do it** (the steps), then **the code** (the thing to type, at the end), then **verify**. New this time: a **line-by-line breakdown**, **common mistakes**, and **experiments** for each real code block — because today one small idea (a boolean flag) unlocks the entire drawing engine, and it's worth chewing slowly.

---

## Recap — where Day 1 left you

You already have, and understand:

- A **client** (`index.html` + `style.css` + `main.js`) that runs *in the browser*, and a **server** (`server.js`, Node + Express) that runs *on your computer* and serves those files. Milestone 1 = done.
- The **DOM**: the browser reads your HTML and builds a live in-memory model of the page; `document` is your handle to it; `getElementById` fetches an element as an object you can command.
- **Event-driven** JS: your code runs once to *set up listeners*, then the page idles, waiting. You don't call your functions — **the browser calls them when events happen**.
- The **canvas 2D context** (`ctx`) and the drawing ritual: `beginPath` → `moveTo` → `lineTo` → `stroke`. You drew one hard-coded pink line with it.

Today we take that *exact* ritual and drive it with your **mouse** instead of fixed numbers. That's the whole trick — no new drawing commands, just live coordinates.

---

## Where this fits (and a note for your "who runs what" confusion)

Here's the important thing to hold in your head all of Day 2:

> **Everything today happens inside the browser. The server does nothing.**

While you scribble, `server.js` is asleep. It did its one job already — it handed your browser the three files when the page loaded — and now it's just sitting on port 3000 waiting for the *next* request. Your mouse moving, the canvas painting, the flag flipping — that's all your `main.js` running in the browser's JavaScript engine, touching the browser's canvas. No request leaves your machine. No response comes back.

That matters because in **Week 3** this changes dramatically: every stroke you draw will be packaged up and *sent to the server*, which relays it to your friends. So it's worth noticing, right now, where the boundary is: today is 100% client-side. When we add multiplayer, you'll feel exactly which lines cross the wire and which don't. Keep that contrast in mind — it's the heart of "understanding the architecture instead of copying code."

```
   YOUR BROWSER (client)                         SERVER (Node.js)
 ┌──────────────────────────────────┐          ┌──────────────────┐
 │ mouse moves → main.js runs →     │          │  server.js       │
 │ ctx draws on the canvas          │  (idle)  │  asleep on :3000 │
 │ ALL of Milestone 2 lives here    │          │  did its job     │
 └──────────────────────────────────┘          └──────────────────┘
        ▲ today is entirely in this box
```

---

## The one big idea: drawing = tracking the mouse

A drawing isn't a single action. It's you **following the mouse** and painting a tiny straight line from *where the pointer just was* to *where it is now* — over and over, dozens of times a second. String enough of those little segments together and your eye reads it as a smooth curve.

You already own the tool that paints one segment: `moveTo` (put the pen here) then `lineTo` (drag to here) then `stroke` (paint it). On Day 1 you fed it fixed numbers. Today you feed it the mouse's live position.

But there's a catch that the whole milestone hinges on: the mouse is *always* moving over the canvas, whether or not you want to draw. You only want to paint while the button is **held down**. So you need a way to remember "is the pen currently pressed?" — a single true/false value. That's the **flag**. Learn the flag and you've learned Milestone 2.

**Three events do the whole job:**

| Event | Real-world meaning | What your code does |
|---|---|---|
| `mousedown` | pen touches paper | flag = **true**, start a fresh path at the click point |
| `mousemove` | pen slides across | **if flag is true**, draw a segment to the new point |
| `mouseup` | pen lifts off | flag = **false** |

That's it. Everything below is just saying that carefully in JavaScript.

---

## Task 1 — See the events before you draw from them

### Explanation

Before you draw anything, *watch the raw material*. You're going to build the drawing engine out of three mouse events and the coordinates they carry — so first, make those events and coordinates **visible** in the Console. No canvas, no flag yet. Just: move the mouse, watch numbers appear. This is the struggle-free confidence step; it makes the invisible visible so Task 2 isn't magic.

**What is an "event," concretely?** When you move the mouse over the canvas, the browser notices and creates a little **object** describing exactly what happened — where the pointer is, which button, whether Shift was held, etc. That object is called the **event object**. Then the browser looks up any listener you registered for that event type on that element, and **calls your function, handing it that event object as an argument**. You never call the function; you never build the object. The browser does both. Your job is only to *write* the function and say which event it listens for.

**Where do the coordinates come from?** The event object has properties on it. The two you want are **`offsetX`** and **`offsetY`** — the pointer's position measured *from the top-left corner of the canvas itself* (not the whole page). That's exactly the coordinate system the canvas draws in, so you can feed them straight into `moveTo`/`lineTo` later with zero math. (There are other coordinate properties — `clientX`, `pageX` — measured from the browser window or the whole document. `offset*` is the one that lines up with the canvas, so it's the one we want.)

**The invisible steps (important — this is the runtime behavior):**
1. Your `main.js` runs once, top to bottom, and hits `canvas.addEventListener("mousemove", handler)`. This does **not** run `handler`. It just *registers* it: "browser, remember this function and call it whenever the mouse moves over the canvas." Then your script finishes.
2. The page now idles. Nothing runs.
3. You move the mouse. The browser builds a `MouseEvent` object and **calls your `handler`, passing that object in**. Your `console.log` runs. The pointer moves one pixel more → the browser calls it again → another log. Move across the canvas and it fires a stream of them.

That gap between *registering* a function and it *being called later, by someone else* is the single biggest mental shift from Java's top-to-bottom `main`. Sit with it.

### How to do it

1. Open `public/main.js`. You can leave your Day-1 hard-coded line and the Send-button code where they are for now.
2. Grab the canvas into a variable (you may already have `const canvas = document.getElementById("board");` from Day 1 — reuse it, don't declare it twice).
3. Add three listeners on `canvas`: `"mousedown"`, `"mousemove"`, `"mouseup"`. Each gets a function that takes one parameter — call it `e` — and `console.log`s something useful.
4. For move, log `e.offsetX` and `e.offsetY` so you see live coordinates.
5. Save. Refresh `localhost:3000`. Open dev tools (**F12** → **Console**). Move and click over the canvas and watch.
6. Before peeking below, try to reach the [MDN `MouseEvent` page](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) and find `offsetX` yourself.

### The code

```js
// Task 1 — just watch the events (delete this block once Task 2 works)
canvas.addEventListener("mousedown", function (e) {
  console.log("DOWN at", e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", function (e) {
  console.log("move at", e.offsetX, e.offsetY);
});

canvas.addEventListener("mouseup", function (e) {
  console.log("UP at", e.offsetX, e.offsetY);
});
```

### Line-by-line

- `canvas.addEventListener("mousedown", function (e) { ... });`
  - `canvas` — your own variable, the canvas **element object** you pulled from the DOM. It's the thing you're listening *on*.
  - `.addEventListener(...)` — a **method** every DOM element has (it comes from the browser's DOM API, not from you). Its job: register a listener.
  - `"mousedown"` — a **string** naming which event to listen for. Spelling matters; it's all lowercase, no "on" prefix.
  - `function (e) { ... }` — the **callback**: a function you define but never call. You're handing it to the browser to call later. `e` is the **parameter** that will receive the event object at call time. The name `e` is your choice (`event`, `evt`, anything) — its *position* is what matters, not its name.
  - `e.offsetX` / `e.offsetY` — **properties** on the event object, read by the browser off the real pointer position. Numbers, in canvas pixels.
- `console.log("DOWN at", e.offsetX, e.offsetY);` — `console` is a built-in browser object; `.log` prints its arguments to the dev-tools Console. Passing several comma-separated values prints them all on one line — handy for labelling.

### Mental model

Registering a listener is like **leaving your phone number with a shop**: "call me *when* my order arrives." You don't stand at the counter (that'd be Java's blocking `main`). You go idle. The shop (the browser) calls *you* when the event happens, and tells you the details (the event object). You wrote the "what to do when they call" instructions in advance.

### Java comparison

This is almost exactly Swing's `addMouseListener` / `addMouseMotionListener`. In Java you'd write a `MouseListener` and override `mousePressed(MouseEvent e)`; here you pass a function for `"mousedown"` and receive a `MouseEvent e`. Same idea: **you supply a callback, the framework's UI thread calls it with an event object**. The difference is JS uses a plain function instead of an interface/anonymous class, and one single-threaded **event loop** dispatches everything (no separate EDT to worry about yet).

### Common mistakes

- Declaring `const canvas` **twice** (once on Day 1, once here) → `SyntaxError: Identifier 'canvas' has already been declared`. Reuse the existing one.
- Listening on `document` instead of `canvas`. It'll still fire, but then `offsetX/offsetY` are measured relative to whatever you moused over, not the canvas — your coordinates won't line up. Listen on `canvas`.
- Expecting `mousemove` to fire *once*. It fires **constantly** while moving — you'll flood the Console. That's correct; it's the firehose you'll harness in Task 2.

### What to understand before moving on

You should be able to say, out loud: "The browser builds an event object and calls my function with it. `offsetX/Y` is the pointer relative to the canvas. `mousemove` fires many times a second." If those three feel solid, Task 2 is easy.

---

## Task 2 — Milestone 2: make it scribble (the flag)

### Explanation

Now you connect the firehose of `mousemove` events to the drawing ritual — but **gated by the flag** so it only paints while the button is down.

**The flag.** Declare one variable that remembers whether the pen is currently pressed:

```js
let drawing = false;
```

`let` (not `const`) because you *will* reassign it — `mousedown` sets it `true`, `mouseup` sets it `false`. It lives at the top level of your script so all three listeners can see and change the *same* variable. (This is a first, gentle taste of **shared state**: several functions reading and writing one value. Week 3 and 4 are full of this.)

**The three handlers, now doing real work:**

- **`mousedown`** — the pen touches down. Two jobs: flip the flag on, and *start a fresh path at the click point* with `beginPath()` then `moveTo(e.offsetX, e.offsetY)`. `beginPath` says "forget the previous shape, begin a new one"; `moveTo` places the pen at the start **without painting**.
- **`mousemove`** — fires constantly. First line: `if (!drawing) return;` — if the pen isn't down, bail out immediately and draw nothing. If it *is* down: `lineTo(e.offsetX, e.offsetY)` extends the path to the new point, and `stroke()` paints it. Result: a segment from the last point to the current one.
- **`mouseup`** — pen lifts. Just `drawing = false;`. The next `mousemove`s now hit that early `return` and draw nothing, until the next `mousedown`.

**The invisible loop (what actually happens as you drag):** press → flag true, path started at the press point. Move one pixel → `lineTo` + `stroke` paints a 1px segment. Move again → another segment from there. Sixty-ish times a second, tiny segment after tiny segment, chaining into what looks like a smooth line. Release → flag false, painting stops. You are literally drawing the curve *as fast as the mouse reports its position*.

### How to do it

1. In `public/main.js`, **delete the Task-1 logging block** (it's served its purpose) and **delete or comment out the Day-1 hard-coded line** (`beginPath`/`moveTo(100,200)`/`lineTo(700,500)`/`stroke`) so it doesn't sit as a stray mark. Keep `const canvas` and `const ctx`, and keep `ctx.strokeStyle` / `ctx.lineWidth` — those set your pen and still apply.
2. Add `let drawing = false;` near the top, after you get `ctx`.
3. Write the three listeners as described. Struggle first: try to write `mousemove` yourself before reading the code below. The `if (!drawing) return;` guard is the piece to get right.
4. Save, refresh, and drag on the canvas. You should scribble.

### The code

```js
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "pink"; // pen colour  (keep from Day 1)
ctx.lineWidth = 4;        // pen thickness

let drawing = false;      // the flag: is the pen currently down?

canvas.addEventListener("mousedown", function (e) {
  drawing = true;                    // pen down
  ctx.beginPath();                   // start a fresh line
  ctx.moveTo(e.offsetX, e.offsetY);  // place pen at the click point (no mark yet)
});

canvas.addEventListener("mousemove", function (e) {
  if (!drawing) return;              // pen not down → do nothing
  ctx.lineTo(e.offsetX, e.offsetY);  // extend the line to where the mouse is now
  ctx.stroke();                      // paint it
});

canvas.addEventListener("mouseup", function (e) {
  drawing = false;                   // pen up → stop drawing
});
```

### Line-by-line

- `let drawing = false;` — declares the **flag variable**. `let` means "I may reassign this." It starts `false` (pen up). Because it's declared once at the top and the three callbacks are defined *below* it in the same scope, all three refer to the **same** `drawing` in memory. This shared visibility is called a **closure** — the functions "close over" the variable. (You don't need the word yet; just know they all see the one variable.)
- `drawing = true;` (in `mousedown`) — reassigns the flag. Now `mousemove` will paint.
- `ctx.beginPath();` — a **method** on the canvas 2D context. It throws away any path currently being built and starts a new, empty one. Without it, every new stroke would still be attached to the *entire* path from earlier strokes (see Common Mistakes — this is the exact `beginPath` question from before).
- `ctx.moveTo(e.offsetX, e.offsetY);` — moves the "pen" to the start point **without drawing**. This is why the first click doesn't leave a dot on its own — it just positions the pen.
- `if (!drawing) return;` — the **guard**. `!drawing` is "not drawing." If the pen is up, `return` exits the function immediately, so the two draw lines below never run. This one line is what stops the mouse from painting when you're just hovering. Remove it and you'd paint permanently the moment the page loads.
- `ctx.lineTo(e.offsetX, e.offsetY);` — adds a straight segment from the pen's current spot to the new mouse position. Defines geometry; paints nothing yet.
- `ctx.stroke();` — **now** it paints, using the current `strokeStyle` and `lineWidth`. Nothing on the canvas changes until `stroke` runs — the classic gotcha you already met on Day 1.
- `drawing = false;` (in `mouseup`) — flips the flag back. Painting stops.

### Mental model

The flag is a **light switch on the pen**. Mouse movement is always happening (the pen is always gliding over the paper), but the switch decides whether ink actually comes out. `mousedown` flips it on, `mouseup` flips it off, and `mousemove` checks the switch before laying down ink.

### Java comparison

`let drawing = false;` is an ordinary `boolean drawing = false;` field shared by your handlers — identical concept. `if (!drawing) return;` is a plain guard clause. The only unfamiliar part is *how* the handlers get called (the browser's event loop, from Task 1), not the logic inside them. Your Java instincts about booleans and early-return are exactly right here.

### Common mistakes

- **Forgetting `if (!drawing) return;`.** Then `mousemove` paints all the time — the instant your mouse enters the canvas it scribbles uncontrollably. This guard *is* the feature.
- **Forgetting `ctx.beginPath()` in `mousedown`.** Try it deliberately once to see the bug: without it, each new stroke keeps the *old* path attached, so `stroke()` re-paints everything every frame. You get weird performance drag and, if you later change colour mid-drawing, old segments recolour too. `beginPath` = "these are separate strokes." (This is the answer to the earlier "why does beginPath matter?" question — go break it on purpose, then fix it.)
- **Releasing the mouse *outside* the canvas.** `mouseup` is on the canvas, so if you let go past its edge, the event never fires, `drawing` stays `true`, and it keeps drawing when you come back. Fix (nice small upgrade): also stop on `mouseleave`, or attach `mouseup` to `window` instead of `canvas`. Try `canvas.addEventListener("mouseleave", function () { drawing = false; });`.
- **Using `clientX/clientY` instead of `offsetX/offsetY`.** Your strokes will be offset from the cursor because those measure from the window, not the canvas.

### A few experiments to try

1. **Smoother lines:** add `ctx.lineCap = "round";` and `ctx.lineJoin = "round";` once, near your pen setup. Corners and endpoints go from blocky to rounded — much nicer to draw with.
2. **Change the pen:** set `ctx.lineWidth = 12;` or `ctx.strokeStyle = "#2b2b40";` and feel the difference. (Next Build task turns these into a live colour picker + brush-size slider — you're one input away.)
3. **The cleaner segment pattern (peek at Week-3 hygiene):** replace the `mousemove` body with
   ```js
   if (!drawing) return;
   ctx.lineTo(e.offsetX, e.offsetY);
   ctx.stroke();
   ctx.beginPath();               // end this segment...
   ctx.moveTo(e.offsetX, e.offsetY); // ...and start the next from here
   ```
   This strokes only the newest segment each time instead of re-stroking the whole path. Same picture, less work per frame. Diff the two, notice they look identical — that tells you the first version was *correct but wasteful*.
4. **Stop-on-leave:** add the `mouseleave` handler above and drag off the edge to feel the difference.

### Verify

Refresh `localhost:3000`, press and drag on the canvas — you scribble in pink, and it **stops** when you release. Move without pressing → nothing. That's **Milestone 2: "I can scribble!"** 🎉 The Week-3 magic (your friends seeing this live) is *this exact code* plus a line that ships each point to the server.

### What you should understand before moving on

- Why `drawing` is `let` and not `const`, and why it lives at the top (shared by all three handlers).
- What each of the three events does, and why `mousemove` needs the guard.
- Why `beginPath` belongs in `mousedown` (you proved it by breaking it).
- That **all of this ran in the browser** — the server was uninvolved. Hold that thought; Week 3 breaks it open.

---

## What you built today

- Turned the hard-coded Day-1 line into a **live mouse-driven drawing engine**.
- Met the **event object** and `offsetX/offsetY`.
- Learned the **flag pattern** (shared boolean state gating an action) — you'll reuse this constantly.
- Reinforced the **browser-only** nature of client-side code, setting up the contrast for networking.

## Next Build tasks (Week 2 continues)

- [ ] **Colour picker + brush size** — add `<input type="color">` and `<input type="range">` to the HTML, read their `.value` in an event, and set `ctx.strokeStyle` / `ctx.lineWidth` from them. (Same DOM-reading you did for the guess box.)
- [ ] **Clear + eraser** — a Clear button that calls `ctx.clearRect(0, 0, canvas.width, canvas.height)`; an eraser that strokes in the background colour. Then tidy the file.

## Commit it

```
git add .
git commit -m "Milestone 2: live mouse drawing on the canvas"
git push
```

The shipping habit is the CV. Small working step → commit. Every time.

---

*Companion to Day-1-Sketchy-Business.md. When you've done this, write up Day 2 in your own words in `learnings/Day-02.md` — the "in my own words" pass is where it sticks.*
