# 🗺️ Sketchy Business — Remaining Work Map

> **Purpose:** the whole path from "the loop technically works" to "a finished game," so I can see everything at once and choose what actually matters. Companion to `CONTEXT.md` (plan + mentor brief), `GAME-DESIGN.md` (creative), and `HANDOFF.md` (you-are-here).
>
> **The one rule that governs this doc (from my tracker):** *a small finished game beats a big unfinished one.* Finish the MVP before polishing. Colors and admin roles feel important but quietly eat weeks while the game still can't score.

---

## The framing: three buckets

| Bucket | Meaning | When |
|---|---|---|
| 🟥 **MVP** | Without it, it isn't a game yet | **Now — rest of Milestone 5** |
| 🟨 **Polish** | Makes it feel like a real game | Week 5 |
| 🟩 **Dessert** | Nice-to-have, makes it *mine* / shiny | Week 6 |

The trap to avoid: pulling 🟨/🟩 work forward before 🟥 is done. Admin roles and color pickers are the classic time-sinks.

---

## 🟥 Bucket 1 — Finish the MVP (the rest of Milestone 5)

The finish line for "playable." Reaching the end of this = **tag `v0.1-mvp`** = summer success by my own tracker. The hard part (networking) is already done; these reuse the same `emit`/`on` + server-state patterns.

| # | Step | Why it's required | Difficulty | New concept? |
|---|---|---|---|---|
| 1 | **Rating** | No way to win without it. Witness rates the blind drawings; only the witness can (only they know the target). Repurpose the dormant `#guess` box. Server-checked (only the stored witness's rating counts). | Medium | Reuses `rounds[room]` guard |
| 2 | **Scoring + reveal** | Nothing tracks score right now. Server tallies points from ratings, reveals the target to the room. Points live server-side. | Medium | Server holds more state (scores per player) |
| 3 | **Rotate witness + loop** | Without repeating, it's a one-shot, not a game. New round → new witness → new prompt. | Medium | Advancing/looping game state |
| 4 | **Clear canvas between rounds** | Hit this immediately — drawings never erase, so round 2 draws over round 1. | Easy | `ctx.clearRect` + a `clear` broadcast |

> **Distance to MVP: ~4 steps.** The networking — the whole reason this project exists — is essentially done. This is close.

---

## 🟨 Bucket 2 — Makes it feel like a real game (Week 5 polish)

Legit, learnable, *not* MVP. Most of my "intricacies" questions live here. Each builds on server-side state, which I now understand.

- **Admin / host role.** One player controls "Start Round"; if they leave, the role passes to the next player in line.
  - *Why it's a great lesson:* it's the same pattern as `rounds[room]` — the host is just more per-room state (`hosts[room] = socketId`), and "pass it on" is logic inside the existing `disconnect` handler. Clean, contained, builds directly on what I just learned.
  - *Why it's not MVP:* right now anyone can click Start, and that's fine for shipping. **This is the best FIRST polish item after MVP.**
- **Lobby.** A "who's joined" list; Start only appears when enough players are in. Pairs with the host role.
- **Round timer.** Drawing time runs out → round auto-advances (`setInterval`). On my Week-5 plan.
- **Handle players leaving mid-round.** What if the witness disconnects while everyone's drawing? Edge-case handling is what separates a demo from a game.
- **Live scoreboard on screen.** Show points as they change (I'll already be tracking them server-side from Bucket 1).

---

## 🟩 Bucket 3 — Dessert (Week 6 — the reward)

- **Colors / brush tools** — color picker, brush size, eraser.
  - *Reality check:* this is polish, **not** core. The game *works* with one pink line; colors make it nicer. My Week-2 plan even listed color as optional. Send `color`/`width` in the `draw` payload so it matches on every screen. Low priority despite feeling important.
- **My own art / UI** — hand-drawn lobby, word cards, avatars, buttons. What makes it *mine*, not a clone.
- **AI judge** — my one unique CV twist (character mode: vision model rates leniently). AI as the twist, not the foundation (`GAME-DESIGN.md §4`).
- **My inventions** — structured feature form + timer, translucent alignment template, part mode (split description → combine). (`GAME-DESIGN.md §5–6`.)
- **Fun visual** — one Matter.js flourish (kinetic-typography title). Dessert of dessert.

---

## Recommended order (the honest path)

1. 🟥 **Finish Bucket 1** → `v0.1-mvp`. This *is* summer success.
2. 🟨 **Admin/host role** — best first polish item (contained server-state lesson).
3. 🟨 Lobby → timer → leave-handling → scoreboard, as time allows.
4. 🟩 Then dessert in priority: my art → AI judge (the CV twist) → colors → inventions → fun visual.

> Ship Bucket 1. Everything after is a bonus on top of an already-finished game. If the semester crowds me, I still have a real, playable, networked game I built and understand.

---

## Quick self-check: "is this MVP or polish?"
- Does the game have **no way to score / win / repeat** without it? → 🟥 MVP.
- Does it make the game **nicer/smoother** but the game works without it? → 🟨 Polish.
- Is it about **art, flair, or my unique twist**? → 🟩 Dessert.

Colors → 🟩. Admin role → 🟨. Rating/scoring/loop → 🟥.
