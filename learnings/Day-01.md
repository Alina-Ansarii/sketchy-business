# 📓 Day 1 — Tuesday, July 9

> What I learnt today, in my own words. One file per day; the `learnings/` folder holds the rest.

### 🧩 The big picture: client vs server
- A web app has two halves: **clients** and a **server**.
- Each **client** lives in the **browser** and has three things: **HTML**, **CSS**, and **JavaScript**.
- The **server** runs **Node.js** and lives on a computer (not in the browser).
- Different browsers (clients) connect to the *same* server, and the server passes messages around between them.

### ⚡ JavaScript & events
- JavaScript attaches an **event listener** to an element.
- Unlike Java, it doesn't run top-to-bottom and stop — it **keeps running and keeps the page alive, waiting for events**.
- I don't call the functions myself — **the browser calls them when the events happen**.

### 🌳 The DOM & the document
- The browser reads the HTML and builds an internal object structure that represents it — this is the **DOM (Document Object Model)**.
- JavaScript **changes the DOM on the fly**, and I see the page change visibly.
- **`document`** is a built-in object — the **door to the page**. I use it to access elements in the DOM (e.g. `getElementById`).
- So I get a **live DOM object**, and every DOM element has its own **methods** — plus the **callback functions I write myself**.

### 🎨 Canvas & context
- We **draw on the canvas**, but to do that we need a **context**.
- **Context = a toolbox** — I make the canvas, then `getContext("2d")` gives me the tools (the pen and ink) to draw.
- Drawing commands I met: **`strokeStyle`, `lineWidth`, `beginPath`, `moveTo`, `lineTo`, `stroke`**.

### 🖥️ Node.js
- Node.js runs **JavaScript outside a browser, directly on the computer** — used for running servers and similar things.
- ❓ **Still fuzzy:** I don't fully grasp *how* this is different or what it really means. (See the clarification note below — revisit this.)

### 🛎️ What a server is (+ localhost, ports, Express)
- A **server** is a program that **waits for requests and sends back responses**.
- Web servers usually get asked for files like `style.css` and `index.html`.
- The pipeline: the **browser = the customer**, it **requests** something from the server, and the server **responds**.
- **localhost** = a hostname for *myself* (my own machine).
- A **port** = a **door** the server listens on. A computer runs many network programs, so a port is the specific door through which the server talks to the web page.
- **Express** = a library that makes all this **easier** for us.

### 🔧 The `server.js` pipeline
- We **imported** the package with `require` and made an object called **`app`**.
- We defined what to do when serving **static files**: `app.use(...)` serves static files **from the `public/` folder** whenever the browser asks for a file.
- We put the server **live** with **`app.listen(port, callback)`** — gave it the port and a callback function.
- End result: loading localhost → browser sends a request → server responds with `index.html` (or whatever's in `public/`).

### 🔁 nodemon (auto-restart)
- A **tool** we use in development — **not part of the shipped app**.
- It uses a **script** and **restarts the server automatically whenever I save**.
- ⏳ Haven't tested this yet — to do.

### 💅 CSS & HTML
- CSS: styled the **body** (background, font-family, text-align), and the **board**, **guess** input, and **send** button.
- These specific properties aren't things to memorize — just to **know they exist**.
- HTML was straightforward. **`<div>`** made a section that grouped/separated things. Covered buttons and inputs too.

---

### 🧠 Clarification note — Node.js (the thing I found fuzzy)
JavaScript was originally **trapped inside the browser** — it could only run as part of a web page, and could only touch web-page things (the DOM). It could *not* do computer-level jobs like reading files off my disk or listening on a network port.

Every browser has a small engine that runs JS (Chrome's is called **V8**). **Node.js took that engine out of the browser** and wrapped it so it runs as a normal program on my computer — like Java or Python does — straight from the terminal, no browser involved. On top of that, Node **gave JS new powers the browser never allowed**: reading/writing files, and **listening on a port to act as a server**.

So "running JS outside the browser" means: instead of my JavaScript being stuck inside a web page, it's now a regular app on my machine that can do OS-level things — which is *exactly* what a server needs to do. When I type `node server.js`, **Node is the program that runs my server file.**

**One-line version:** browser JS is an appliance that only works plugged into the browser; Node is the adapter that lets the same language run anywhere on my computer *and* gives it new tools (files, networking) — and that's what lets me write my server in JavaScript.
