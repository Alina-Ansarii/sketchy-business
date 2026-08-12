# 🎨 Sketchy Business — Game Design (my ideas)

> **My living design doc.** These are *my* ideas for what makes this game mine, not a Skribbl/Gartic clone.
> I'll keep editing this — I'm really into this game. Nothing here is final; it's a running brain-dump of decisions and possibilities.
>
> **Confirmed (Aug 12):** the target is the **full timed loop below**, built piece-by-piece. Build order lives in `BUILD-ORDER.md`.

---

## 0. The core flip (what makes this game different)

Normal draw-and-guess (Skribbl, Gartic): the **drawer** holds the secret, guessers are passive.

**Sketchy Business inverts it — the police-sketch dynamic:**
- One person is the **witness** — they know the target.
- Everyone else are **sketch artists** — they draw *blind*, only from the witness's description.
- The witness is the only one who can judge, because only they know the truth.

The "Sketchy Business" name = a **police-sketch theme**. Targets = "suspects," descriptions = witness statements, drawings = sketch-artist renders. Payoff at the end: "the suspect got caught thanks to your sketch."

---

## 1. THE FULL ROUND (confirmed target — this is what we're building)

```
1. START      Server picks 1 WITNESS, everyone else are DRAWERS.
              A number of ITERATIONS is set at the start (e.g. 3).

2. DESCRIBE   Witness gets a SHORT timer. Types a free description of anything
              (a friend, a box, Pink Panther — witness's choice).
              → NO celebrity/AI mode, NO part-by-part mode for the MVP.

3. DRAW       Description is sent to the drawers. Each draws on their own canvas
              with a colour palette. LONGER timer (longer than the describe timer).
              → Optional head-outline guideline on the canvas: a TOGGLE (later),
                because not everything is a face (a box, Pink Panther).

4. COLLECT    When the DRAW timer ends, the server AUTOMATICALLY snapshots every
              drawing into a lineup (a police-sketch line-up list).

5. RATE       Communal room (like Gartic). One ADMIN clicks next/back through the
              line-up (each entry = a player's name + their drawing).
              The WITNESS rates each drawing: 1–5 STARS, half-stars allowed.
              Score is tallied per drawer.

6. LOOP       Repeat steps 2–5 for N iterations, a NEW witness each time.

7. RESULT     Add up scores across all iterations → winner → aesthetic payoff.
              (If only 1 iteration, just show that round's winner.)
```

**The engine:** phases end by **TIMER**, not a button. When a timer hits zero the SERVER advances everyone to the next phase automatically. The timer is the backbone of the whole game.

---

## 2. Scoring — why the WITNESS rates (settled)

- The **room can't rate** — everyone else drew blind, they don't know the target. Only the **witness** knows the truth, so only the witness can rate.
- The prompt is a **free description**, so there's **no objective "correct."** Scoring is deliberately **subjective** — meant to be fun and a little unfair.
- Witness rates each drawing 1–5 stars (half-stars ok). Best sketch wins the round. Rotate so everyone gets a turn as witness. Sum across iterations for the final winner.

---

## 3. Modes — DEFERRED (not in the MVP)

Keeping the design record, but **none of these are in the first playable loop**:
- **Character/AI mode** — a picture shown to the witness only; a vision model rates leniently. This is the Week-6 CV twist, bolted on AFTER the human loop works.
- **Custom mode** — witness describes a real person/friend from memory. (This is effectively what the MVP "free description" already is.)
- **Part-by-part / segmented description** — witness fills a structured feature form (hair/eyes/nose…). Deferred.
- **Translucent alignment template** — faint guide under the canvas for the split-feature chaos mode. Deferred; ties to the optional head-outline toggle.

---

## 4. AI as the JUDGE (the CV twist — Week 6, NOT the foundation)

- In **character mode**, after drawings come in, send each image to a **vision model** and ask it to rate how recognizable it is as the target. Works there because there's a real reference image.
- **The fix for harsh grading lives in the PROMPT, not the code:** tell the AI to be a generous party guest, not an art critic ("reward the idea, not the art skill").
- **Sequencing:** human-only loop first (the MVP), AI as the twist afterward — so if the semester crowds me, there's still a finished game underneath.

---

## 5. Aesthetics / payoff (later — I have lots of ideas)

- Police-lineup framing for the rating screen (mugshot cards, names underneath).
- End screen: "The suspect was caught thanks to [winner]'s sketch."
- Colour palette picker, my own hand-drawn UI, avatars. All Week-6 dessert.

---

## 6. Scope discipline (so I actually ship)

- **Rule (from the tracker): ONE unique twist.** The AI judge is the pick — LATER.
- Build the **full human loop first** (Sections 1–2). Modes, AI, aesthetics come after it's playable.
- **A small finished game beats a big unfinished one.** Ship the loop.

---

*Companion to `docs/CONTEXT.md` (project + mentor brief), `docs/HANDOFF.md` (you-are-here), and `docs/BUILD-ORDER.md` (the piece-by-piece checklist).*
