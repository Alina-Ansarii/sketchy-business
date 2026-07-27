# 📓 Milestone 4 & 5 — Sketchy Business (my notes)

> Transcribed from my handwritten notebook. My own words, my own shorthand.

---

## Week 1: Day 4 — Rooms

**Room:** contain activities within a game
- a floor within the hotel
- we want `io` (receptionist) to page guests on a certain floor only

**floor number:**
```
socket.join("____")
io.to("floorno").emit(...)
```

### io.on vs socket.on
- **io.on:** callback fires once the new browser joins. socket.io hands `socket` → private connection line to that browser
- **socket.on:** that browser's specific phone line → setting a listener

```
socket.to(room).emit(...)
```

> me: so `io.to(room)` = everyone on that floor, `socket.to(room)` = everyone on that floor except me (the sender). that's why my own tab doesn't echo back.

---

## Week 1: Milestone 5

pipes → emit
      → on

1: custom prompt      2: character mode

### custom mode:
① prompt
→ witness types a description → server relays
→ everyone gets a part → draws it blind

② → part
   → whole

**whole:**
① prompt Btn → prompt → witness side
             → description → received

### ② Round Button:-
Round → button
→ start round manually

### ③ Pick Witness:-
→ after startRound
→ pick a witness → tell room
  (server)

### ④ Remember who the witness:-
→ server side game state
→ browser sends request to server to start the room
→ picks a witness →
```
rounds[room] = witnessId;
             = socketId
```

> me: the browser can't pick — it only sees itself. only the server sees everyone in the room, so only the server can pick fairly. that's "source of truth".

---

## The full flow (my walkthrough)

① A123    ② B456    room = FAST

① clicking startRound (browser) → sends msg to server to start round
② server receives
```
socket.emit(startRound, myRoom)
```

③ **inside the server:**
```
room[fast] = ____
```

② players =
```
[ A123 ]  → convert set to array
[ B456 ]  → calculate witness index
          → get witness at that index
          → save it
```
③ `room[fast] = witnessId`

④ emit to everyone → the round started
                   → who the witness is

⑤ **Back inside Browser**
→ round started
→ check if you are witness

⑥ **witness sends prompt**
```
rounds[fast] !== socket id
```
→ X   B456 !== B456
→ so allow prompt
→ else / witness so not allowed

> me: wait — read this carefully. if `rounds[fast]` IS my id, they're equal, so `!==` is false → don't return → prompt goes through. if I'm NOT the witness, they're not equal → `!==` is true → `return` → dropped. the check protects the prompt even if a drawer cheats in dev tools, because the server checks the REAL socket id, not the button.

---

## What I actually built in Milestone 4 & 5

- **M4 — rooms:** friends join by a code, strokes only go to their room. `socket.join(code)` + `socket.to(room).emit(...)`.
- **M5 so far:**
  - prompt relay (whole mode) — witness types, room receives
  - Start Round button — browser sends a *command* to the server
  - server picks a random witness and tells the room
  - roles shown on screen + prompt box locked to the witness — **enforced on the server** (`rounds[room]` + the `!==` check)

## The two big ideas (say them out loud)
1. **Server = source of truth.** Only the server can see everyone in a room, so only it can pick the witness. Browsers just *ask* and *react*.
2. **Never trust the client.** Hiding the prompt box in the browser is just for looks. Real enforcement is the server checking `rounds[room] !== socket.id` before relaying — the browser can lie about the button, but it can't fake its own socket id.

## Still to do (rest of M5)
- witness **rates** the drawings
- **scoring + reveal** the target
- **rotate** the witness → loop → tag `v0.1-mvp`
