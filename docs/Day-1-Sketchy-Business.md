# 🎨 Sketchy Business — Day 1 (In-Depth)

> Project-only. No LeetCode, no side tracks. Just the game.
> **You type every line. I explain every line.** The struggle is where the skill forms.
>
> **How each task is laid out:** first the **explanation** (the concept, from scratch), then **how to do it** (the steps), then **the code** (the thing to type, at the end).

---

## Where we're going (so today has a point)

The end goal is a **real-time multiplayer draw-and-guess game**: you and your friends open a link, one person draws on a canvas, everyone else sees the strokes *live* and types guesses.

That splits into two halves:

1. **The client** — the web page each player sees (HTML + CSS + JavaScript + a `<canvas>` to draw on). This runs *in the browser*.
2. **The server** — one program (Node.js) that sits in the middle and relays messages between all the players. This runs *on a computer*, not in the browser.

Every player's browser talks to the *same* server, and the server passes messages around. That "middle-man server" is the entire reason the game can be multiplayer — two browsers can't talk to each other directly (you'll learn exactly why in Week 3).

**Today (Day 1) we build the skeleton of both halves:** a real web page (the client) and a real server that serves it (the server). By the end you'll have the exact shape every future feature bolts onto. Nothing today is throwaway — this *is* the foundation the whole game sits on.

Here's the map. Today builds the two boxes on the ends and the pipe between them, empty for now:

```
   YOUR BROWSER (client)          SERVER (Node.js)            FRIEND'S BROWSER (client)
 ┌─────────────────────┐        ┌──────────────────┐        ┌─────────────────────┐
 │ HTML  = structure   │        │  server.js       │        │ HTML                │
 │ CSS   = looks       │  ───►  │  serves the page │  ───►  │ CSS                 │
 │ JS    = behaviour   │        │  (later: relays  │        │ JS                  │
 │ <canvas> = drawing  │        │   drawings)      │        │ <canvas>            │
 └─────────────────────┘        └──────────────────┘        └─────────────────────┘
        ▲ Day 1 builds this            ▲ Day 1 builds this
```

---

## The task list for today

| # | Task | What it moves toward |
|---|------|----------------------|
| 1 | Set up the project folder structure | Clean client/server split the whole game needs |
| 2 | Build `index.html` — heading, canvas, input, button | The client every player will see |
| 3 | Style it with CSS | Making the canvas visible + the game feel like *yours* |
| 4 | JavaScript: the page reacts to a click | The event-driven core all game interaction runs on |
| 5 | Read the input and show it on the page | The mechanic behind typing guesses later |
| 6 | Draw your first line on the canvas | The literal core of a *drawing* game |
| 7 | **Milestone 1:** a Node + Express server at `localhost:3000` | The middle-man server that makes multiplayer possible |
| 8 | Auto-restart the server with `nodemon` | A fast dev loop so building the rest is pleasant |
| 9 | Commit + push to GitHub | The shipping habit = your CV |

Work top to bottom. Each task ends in *something that works*. Don't rush to task 9 — understanding beats speed.

---

## Task 1 — Project structure

### Explanation
Our game has two halves — a client (the page in the browser) and a server (our program) — so our folders should reflect that from the very start. If we dump everything in one pile, it gets messy the moment the server arrives.

The web convention is this: put **everything the browser is allowed to see** (HTML, CSS, client-side JS, art) inside a folder called **`public/`**. The server file stays *outside* `public/`, because it's *our* private program — players should never be able to download it. This split isn't just tidiness: in Task 7 the server will say "serve everything in `public/`," so the structure itself is what keeps the server simple. You're setting up a habit that pays off all summer.

### How to do it
Inside your existing `sketchy-business` repo:
1. Create a new folder called `public` (in VS Code: right-click in the file explorer → New Folder).
2. Inside `public/`, create three empty files: `index.html`, `style.css`, and `main.js` (right-click → New File for each).
3. Leave `server.js` for Task 7 — it will live in the *root* of the repo, not in `public/`.

You don't type any code here — you're just making the shape. This is the target layout:

### The layout
```
sketchy-business/
├── public/          ← everything the browser sees
│   ├── index.html
│   ├── style.css
│   └── main.js
├── server.js        ← our server (Task 7) — stays OUTSIDE public/
├── package.json     ← created for us in Task 7
├── .gitignore       ← already have this
└── README.md        ← already have this
```

---

## Task 2 — `index.html` (the page structure)

### Explanation
This file is the client — the actual page every player loads. Everything visual bolts onto it.

**What HTML is:** HTML (HyperText Markup Language) describes the **structure** of a page — *what things are*, not what they look like. You write it as **elements**. An element is usually an opening tag, some content, and a closing tag:

```
<h1>Hello</h1>
 │      │    │
 │      │    └── closing tag (note the slash)
 │      └─────── the content
 └────────────── opening tag
```

Some elements carry **attributes** — extra info inside the opening tag, written `name="value"` (e.g. `<canvas id="board" width="800">`). A few elements are "empty" — no content, no closing tag — like `<input>`.

**What each piece of our page will be**, so the code reads like sense when you get there:
- `<!DOCTYPE html>` — declares "modern HTML5." Always the first line.
- `<html lang="en">` — the root; everything lives inside it. `lang="en"` marks the content as English.
- `<head>` — the **invisible** part: info *about* the page, nothing you see on screen.
  - `<meta charset="UTF-8">` — character encoding, so symbols/emoji render right. Boilerplate.
  - `<title>` — the text on the browser tab.
  - `<link rel="stylesheet" href="style.css">` — pulls in our CSS. `rel` = what kind of link, `href` = where it is. This is how HTML and CSS connect.
- `<body>` — the **visible** part; everything here renders.
  - `<h1>` — the biggest heading; the game's title.
  - `<canvas id="board" width="800" height="600">` — a blank rectangle we draw pixels onto with JS. `id="board"` is a **name tag** so our JS can find this exact element. Set canvas size with these `width`/`height` *attributes*, **not** CSS — CSS stretches and blurs it (you'll see why in Week 2).
  - `<div>` — a generic **box/container** with no look of its own; it just groups the input and button so we can position them as a unit.
  - `<input type="text" placeholder="...">` — a text box. `placeholder` is the grey hint shown when empty.
  - `<button>` — a clickable button.
  - `<script src="main.js">` — loads our JavaScript. **Placed at the bottom of `<body>` on purpose:** the browser reads top-to-bottom, so by the time it reaches this line the canvas/input/button already exist and the JS can find them. In `<head>` it would run too early and fail.

### How to do it
1. Open `public/index.html`.
2. Type the HTML5 skeleton first: `<!DOCTYPE html>`, then `<html>` containing a `<head>` and a `<body>`.
3. In the `<head>`, add the `<meta>`, a `<title>`, and the `<link>` to `style.css`.
4. In the `<body>`, add — in this order — the `<h1>`, the `<canvas>` (with `id`, `width`, `height`), a `<div>` holding the `<input>` and `<button>`, and finally the `<script>` tag pointing to `main.js`.
5. Give the canvas `id="board"`, the input `id="guess"`, and the button `id="sendBtn"` — we'll need those names in JS.

Type it from memory where you can; muscle memory matters more than speed.

### The code
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Sketchy Business</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Sketchy Business</h1>

    <canvas id="board" width="800" height="600"></canvas>

    <div>
      <input id="guess" type="text" placeholder="Type a guess..." />
      <button id="sendBtn">Send</button>
    </div>

    <script src="main.js"></script>
  </body>
</html>
```

### Verify
Double-click `index.html` to open it in your browser. You should see the title, the input with its placeholder, and the Send button. **You won't see the canvas yet** — it's transparent with no border. That's exactly what Task 3 fixes, and it teaches the lesson: HTML defines *existence*, CSS defines *appearance*.

---

## Task 3 — CSS (make it visible, make it yours)

### Explanation
Right now the canvas is invisible and the page is plain. CSS is where the game starts to *feel* like something.

**What CSS is:** CSS (Cascading Style Sheets) controls **appearance**. You write **rules**, and a rule has two parts:

```
#board {
  border: 2px solid black;
}
│          │
│          └── declarations: property: value; (what to change)
└───────────── selector: WHICH elements this rule targets
```

**Selectors** — how you point at elements:
- `h1` (a plain name) targets *every* `<h1>`.
- `#board` (`#` + name) targets the *one* element with `id="board"`. `#` means "id".
- `.name` (`.` + name) targets elements with `class="name"` (we'll use classes later).

**What each rule we write will do:**
- `body { ... }` — the whole page: a soft off-white `background-color`, a clean `sans-serif` `font-family`, and `text-align: center` to centre the inline content.
- `h1 { color: ... }` — the heading's *text* colour (vs `background-color`, which is the fill behind it). Colours are **hex**: `#RRGGBB`, two hex digits each for red/green/blue (`#ffffff` white, `#000000` black).
- `#board { ... }` — the canvas, finally visible: a `border`, a `white` background, and centring via `display: block` + `margin: 20px auto` (`auto` on left/right splits the leftover space equally, pushing it to the middle).
- `#guess` / `#sendBtn` — `padding` for breathing room, `font-size` for readability, and `cursor: pointer` so the mouse shows a hand over the button (makes it *feel* clickable).

**The cascade** (why it's *Cascading*): styles flow down and combine. `body { font-family: sans-serif }` also affects the `h1`, input, and button, because they live inside `body` and **inherit** it. Set broad defaults high up; override narrowly below.

### How to do it
1. Open `public/style.css` (already linked from your HTML in Task 2).
2. Write a rule for `body` first (background, font, centre).
3. Add a rule for `h1` (text colour).
4. Add a rule for `#board` — **border first** so you can finally see the canvas, then background and centring.
5. Add small rules for `#guess` and `#sendBtn` (padding, font size, pointer cursor).
6. Save and refresh the browser after each rule if you want to watch each change land.

### The code
```css
body {
  background-color: #f0f4f8;
  font-family: sans-serif;
  text-align: center;
}

h1 {
  color: #2b2b40;
}

#board {
  border: 2px solid #333;
  background-color: white;
  display: block;
  margin: 20px auto;
}

#guess {
  padding: 8px;
  font-size: 16px;
}

#sendBtn {
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}
```

### Verify
Refresh the browser. The canvas is now a visible white bordered box, centred, on a soft background. That's HTML (structure) + CSS (appearance) working together — the two halves of every page you'll ever build.

---

## Task 4 — JavaScript reacts to a click (the big mental shift)

### Explanation
The entire game is "when something happens, do something": *when* the mouse moves, draw; *when* a guess arrives, check it; *when* a player clicks Send, submit. That pattern is **event-driven programming**, and here you meet it in its simplest form: click a button → something happens.

**Coming from Java:** in Java, `main` runs top-to-bottom and the program **ends**. In the browser it's the opposite — your JS runs once to **set up listeners**, then the page just *sits there waiting*. It doesn't end; it idles until the user does something. Each "something" (a click, keypress, mouse move) is an **event**. You register a **listener** — "when *this* event happens on *this* element, run *this* function" — and the browser calls your function every time it fires. You don't call it yourself; the browser calls it for you.

**Three things the code needs:**
1. **The DOM** — when the browser loads your HTML, it builds a live in-memory model of the page called the **DOM** (Document Object Model). Your JS reads and changes the DOM and the screen updates to match. `document` is your handle to it.
2. **Selecting an element** — `document.getElementById("sendBtn")` finds the element whose `id` is `sendBtn` and hands it back as an object you can command.
3. **`addEventListener`** — every element object has this method. You give it an event name (`"click"`) and a **callback** function; the browser runs your function each time that event fires.

**What each line will do:**
- `const sendBtn = document.getElementById("sendBtn");` — `const` declares a **variable** (a named box for a value; `const` = "won't reassign this name," your default; use `let` only when you'll reassign). This one finds the button and stores it.
- `sendBtn.addEventListener("click", function () { ... });` — start listening for a `"click"` on the button; run the given function each time.
- `console.log("...")` — print to the browser's developer **Console**. This is your #1 debugging tool all summer: it shows what your code is actually doing.

### How to do it
1. Open `public/main.js`.
2. Grab the button into a variable with `document.getElementById("sendBtn")`.
3. Call `.addEventListener("click", ...)` on it, passing a function.
4. Inside that function, `console.log` a message.
5. Save. Refresh the page, open dev tools with **F12** → **Console** tab, and click the button.
6. Try to reach `addEventListener` from the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) yourself before peeking — that struggle is the point.

### The code
```js
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", function () {
  console.log("Button was clicked!");
});
```

### Verify
Click the Send button with the Console open. Each click prints `Button was clicked!` — three clicks, three lines. You just made the page *react*. Every future feature is a fancier version of this.

---

## Task 5 — Read the input and show it on the page

### Explanation
This is the guessing mechanic in miniature: read what the player typed, then do something with it. Today we just display it; in Week 4 the server will check it against the secret word. Same first step.

**Two new ideas:**
1. **Reading a value out of the DOM** — a text input has a `.value` property holding whatever's currently typed. `guessInput.value` gives you that string, live.
2. **Changing the DOM** — set an element's `.textContent` (the text inside it) and the screen updates instantly.

**What each new line will do:**
- `const guessInput = document.getElementById("guess");` — grab the text box.
- `const output = document.getElementById("output");` — grab a new empty paragraph we'll add to the HTML.
- `const text = guessInput.value;` — read the box's current contents into a variable.
- `output.textContent = "You typed: " + text;` — set the paragraph's text. `+` **concatenates** (glues) strings. The instant this runs, the page updates — that's you changing the DOM.
- `console.log("Guess submitted:", text);` — you can pass `console.log` several things separated by commas; it prints them all (handy for labelling).

### How to do it
1. In `public/index.html`, add an empty paragraph where the result should show — put `<p id="output"></p>` just under the `<div>` that holds the input. (`<p>` is a paragraph; the `id` lets JS find it.)
2. In `public/main.js`, add two more `getElementById` calls — one for the input (`guess`), one for the output paragraph.
3. Inside your existing click listener, read `guessInput.value` into a variable, then assign a string to `output.textContent`.
4. Save, refresh, type something, click Send.

### The code
HTML — add this line inside `<body>`, under the input's `<div>`:
```html
<p id="output"></p>
```

`public/main.js`:
```js
const sendBtn = document.getElementById("sendBtn");
const guessInput = document.getElementById("guess");
const output = document.getElementById("output");

sendBtn.addEventListener("click", function () {
  const text = guessInput.value;
  output.textContent = "You typed: " + text;
  console.log("Guess submitted:", text);
});
```

### Verify
Type in the box, click Send. The paragraph shows "You typed: ..." and the Console logs it. That's input → process → output — the loop every interactive feature is built on.

---

## Task 6 — Draw your first line on the canvas

### Explanation
It's a *drawing* game — the `<canvas>` is where it all happens. Today you make one hard-coded line appear: proof you can control pixels. Week 2 turns this into free-hand drawing with the mouse; Week 3 sends those strokes to friends. It all starts here.

**The canvas 2D context:** a `<canvas>` by itself is just a blank rectangle. To draw, you ask it for a **context** — a toolbox object full of drawing commands — with `canvas.getContext("2d")`. Then you issue commands to that context. Drawing a line is a little ritual:
1. `beginPath()` — "start a new shape."
2. `moveTo(x, y)` — "lift the pen and place it here" (no mark).
3. `lineTo(x, y)` — "draw toward here" (defines the line, doesn't paint yet).
4. `stroke()` — "actually paint it." **Nothing appears until `stroke()`** — the classic beginner gotcha.

**Coordinates:** the grid starts at `(0, 0)` in the **top-left**. `x` grows to the **right**, `y` grows **downward** (not upward like maths class). So `(800, 600)` is the bottom-right of our 800×600 canvas.

**What each line will do:**
- `const canvas = document.getElementById("board");` — grab the canvas element.
- `const ctx = canvas.getContext("2d");` — get the 2D drawing toolbox. `ctx` ("context") is what we send every draw command to — a universal naming convention.
- `ctx.strokeStyle = "#2b2b40";` — line colour (same colour values as CSS).
- `ctx.lineWidth = 4;` — line thickness in pixels.
- then the `beginPath → moveTo → lineTo → stroke` ritual above.

### How to do it
1. At the **top** of `public/main.js` (above the click code), grab the canvas with `getElementById("board")`.
2. Get its 2D context with `canvas.getContext("2d")` and store it in `ctx`.
3. Set `ctx.strokeStyle` and `ctx.lineWidth`.
4. Run the ritual: `beginPath()`, `moveTo(startX, startY)`, `lineTo(endX, endY)`, `stroke()`.
5. Save and refresh — a diagonal line should appear.

### The code
Add to the **top** of `public/main.js`:
```js
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "#2b2b40"; // line colour
ctx.lineWidth = 4;           // line thickness

ctx.beginPath();
ctx.moveTo(100, 100);        // start point (x, y)
ctx.lineTo(700, 500);        // end point
ctx.stroke();                // paint it
```

### Verify
Refresh. A thick diagonal line runs across the white canvas — you're officially drawing with code. Play: change the numbers, add a second `moveTo`/`lineTo`/`stroke`, make a shape. The Week 2 drawing engine is just this, driven by your mouse instead of fixed numbers.

---

## Task 7 — Milestone 1: a Node + Express server

### Explanation
Everything so far ran by opening a *file* (check the address bar — it says `file:///...`). A multiplayer game can't work that way: your friends can't open a file on *your* computer. There must be a **server** — one running program every player's browser connects to over the network. That server is the middle-man that will later relay drawings between players. Today it does the simplest server job: hand the browser your page. But once it exists, multiplayer is *possible*. This is the most important task of the week.

**The concepts, from scratch:**
- **Node.js** — normally JavaScript only runs inside a browser. **Node** runs JavaScript *outside* the browser, directly on your computer — which is what lets us write a server in JS. (You already installed it: `v24.18.0`.)
- **A server** — a program that waits for requests and sends back responses. A **web server** waits for a browser to ask "give me the page at this address" and responds with the HTML/CSS/JS.
- **`localhost`** — a special address meaning *this very computer* (numeric form `127.0.0.1`). Visiting `localhost` talks to a server on your own machine.
- **A port** — one computer runs many servers, so each listens on a numbered **port** — a specific door. Web dev commonly uses **3000**. `localhost:3000` = "door 3000 on this computer."
- **npm** — the tool (installed with Node) that downloads reusable code packages. We'll use it to grab Express.
- **Express** — Node *can* build a server alone, but it's clunky. **Express** is a small, popular library that makes serving pages (and later, routes) easy. The standard choice.

**What each `server.js` line will do:**
- `const express = require("express");` — `require(...)` is Node's way of loading a package. Pulls in Express.
- `const app = express();` — create your application object; `app` represents the whole server.
- `app.use(express.static("public"));` — the key line: make every file in `public/` downloadable by browsers, so `/` returns `public/index.html`, `/style.css` returns your CSS, etc. **This is exactly why we split files into `public/` in Task 1** — one line serves the whole client, and `server.js` stays private (it's outside `public/`).
- `app.listen(3000, function () { ... });` — start the server and **listen** on port 3000; the function runs once when it's up — a good place to log "ready."

### How to do it
1. Open a terminal **in your project folder** (VS Code: Terminal → New Terminal — it opens in the folder already).
2. Run `npm init -y` — creates `package.json` (a manifest recording your project and its packages). `-y` = accept defaults.
3. Run `npm install express` — downloads Express into `node_modules/` and records it in `package.json`. (`node_modules/` is already ignored by your `.gitignore`, so it won't clutter the repo.)
4. Create `server.js` in the project **root** (not in `public/`) and write the four lines.
5. Run `node server.js` — it prints your message and *stays running* (a server waits for requests). Stop it later with **Ctrl+C**.
6. Open `http://localhost:3000` in the browser. Your page loads — but now it's *served*, not a file. That's Milestone 1. 🎉

### The code
Terminal, in order:
```bash
npm init -y
npm install express
```

`server.js` (in the repo root):
```js
const express = require("express");
const app = express();

app.use(express.static("public"));

app.listen(3000, function () {
  console.log("Sketchy Business running at http://localhost:3000");
});
```

Then run it:
```bash
node server.js
```

### Verify + the networking idea (log this)
The address bar now reads `localhost:3000`, not `file://`. When you typed that, your browser sent an **HTTP request** ("GET me the page") to the server on port 3000; Express **responded** with `index.html`. That request→response round-trip is the foundation of the whole web — and the thing you'll extend in Week 3, when browsers keep a *permanent* connection open to stream drawings back and forth. Write one line in your log: "learned what a port is / what localhost means."

---

## Task 8 — Auto-restart with nodemon (a kinder dev loop)

### Explanation
Right now, every change to `server.js` means stop the server (Ctrl+C) and re-run `node server.js`. That gets old fast, and you'll be editing the server constantly from Week 3 on. **nodemon** watches your files and restarts the server automatically when you save. Setting up a comfortable workflow now makes the whole summer smoother.

**Two small concepts:**
- A **dev dependency** — a tool you use *while developing*, not part of the shipped app. Installing with `--save-dev` records it separately in `package.json` under "devDependencies," keeping tools distinct from what the app actually needs to run.
- A **script** — a named shortcut for a command, stored in `package.json`. `npm run dev` will run whatever you map `"dev"` to.

### How to do it
1. Install nodemon as a dev dependency: `npm install --save-dev nodemon`.
2. Open `package.json`, find the `"scripts"` section, and add a `"dev"` script that runs `nodemon server.js`.
3. Start working with `npm run dev`.
4. Edit `server.js`, save, and watch the terminal restart the server by itself. (Ctrl+C still stops it.)

### The code
Terminal:
```bash
npm install --save-dev nodemon
```

In `package.json`, set the scripts section to:
```json
"scripts": {
  "dev": "nodemon server.js"
}
```

Then, from now on, start the server with:
```bash
npm run dev
```

---

## Task 9 — Commit and push (never skip this)

### Explanation
Your GitHub history *is* the proof you built this — the thing that unlocks internships next year. Every working day ends with a commit, even tiny ones. Build → commit → push is a muscle.

**The concepts:**
- **Git** tracks your files' history — snapshots you can return to.
- A **commit** is one saved snapshot with a message describing what changed.
- **GitHub** is your repo's online home; **push** uploads your local commits there.

**What each command will do:**
- `git add .` — **stage** all changes (the `.` = "everything in this folder"). Staging means "include these in my next snapshot." (`.gitignore` skips `node_modules/` automatically.)
- `git commit -m "..."` — save the snapshot; `-m` attaches the **message** — write what you did in plain words for future-you.
- `git push` — upload the commits to GitHub.

### How to do it
1. Stop the server (Ctrl+C) or open a second terminal.
2. Stage everything with `git add .`.
3. Commit with a clear message describing Day 1.
4. Push, then refresh your repo page in the browser to see the new files and commit appear.

### The code
```bash
git add .
git commit -m "Day 1: client page (canvas, input), first line, Express server"
git push
```

---

## ✅ End-of-day checklist

- [ ] `public/` folder with `index.html`, `style.css`, `main.js`
- [ ] Page shows heading, a visible bordered canvas, an input + Send button
- [ ] Clicking Send logs to the Console and shows your text on the page
- [ ] A diagonal line is drawn on the canvas
- [ ] `http://localhost:3000` serves the page (Milestone 1 ✅)
- [ ] `npm run dev` auto-restarts the server
- [ ] Everything committed and pushed to GitHub

## What you actually learned today (say it out loud, it cements it)
- HTML is **structure**, CSS is **appearance**, JavaScript is **behaviour** — three separate jobs.
- The **DOM** is the live model of the page your JS reads and changes.
- **Event-driven**: JS sets up listeners and waits — "when X happens, do Y" — unlike Java's top-down `main`.
- The **canvas 2D context** (`getContext`, `beginPath`, `moveTo`, `lineTo`, `stroke`) is how you draw with code.
- A **server** serves your page; **localhost** = your machine, a **port** = a numbered door; **Express** makes it easy; the **request→response** round-trip is the base of the whole web.

## Where Day 2 picks up
We turn that one hard-coded line into **real freehand drawing** — tracking the mouse (`mousedown`, `mousemove`, `mouseup`) so you can actually scribble on the canvas. That's Week 2, the fun visual week, and the direct next step toward the game.
