# 🎨 Sketchy Business — Game Design (my ideas)

> **My living design doc.** These are *my* ideas for what makes this game mine, not a Skribbl/Gartic clone.
> I'll keep editing this — I'm really into this game. Nothing here is final; it's a running brain-dump of decisions and possibilities.
>
> **Stance (important):** I am **not** locking in a "main mode" yet. For the build, we start with **one simple mode that's still interesting**, and decide which idea becomes central later. Ship *something* by **Week 6**. I'm not a pro game dev — this is meant to be fun and to keep evolving.

---

## 0. The core flip (what makes this game different)

Normal draw-and-guess (Skribbl, Gartic): the **drawer** holds the secret, guessers are passive.

**Sketchy Business inverts it — the police-sketch dynamic:**
- One person is the **witness** — they know the target.
- Everyone else are **sketch artists** — they draw *blind*, only from the witness's description.
- The witness is the only one who can judge, because only they know the truth.

The "Sketchy Business" name becomes a **criminal-profile / police-sketch theme**, not just a pun. Targets = "criminals," descriptions = witness statements, drawings = sketch-artist renders.

**Nobody has really built this as a party game.** That's the niche.

---

## 1. The core loop (the simple MVP shape)

```
Witness gets/writes a prompt  →  everyone else draws it BLIND  →  witness rates the drawings  →  points  →  rotate witness  →  repeat
```

That's the whole minimum game. Everything below is a variation on *where the prompt comes from* and *who does the rating*.

---

## 2. Scoring — why the WITNESS rates (settled)

- The **room can't rate** — the room is drawing blind, they don't know the target. Only the **witness** knows the truth, so only the witness can rate.
- Like Gartic, the prompt is a **free description** (not a fixed word), so there's **no objective "correct."** That means scoring **has to be subjective** — and that's fine, it's meant to be fun and a little unfair, not fair.
- So: witness looks at everyone's drawings, rates them (e.g. "B's is 8/10, C's is 5/10"), best drawing wins the round. Rotate so everyone gets a turn as witness.
- This deliberately keeps **Gartic's freedom** while adding **a way to earn points** (the thing Gartic lacks).

---

## 3. The two prompt modes

Both feed the **exact same** draw→rate loop. The only difference is *where the witness's prompt comes from*.

### 🅰️ Character mode
- The game shows the **witness only** a picture (e.g. the Lorax, Squidward). Nobody else sees it.
- Witness describes it from what they see; others draw blind.
- **AI can judge here** (see §4) — because there's a real reference image of what it's "supposed" to look like.

### 🅱️ Custom mode
- Witness describes a **real person / friend / anyone** from **memory** (e.g. Robert Pattinson, or a mutual friend).
- No picture — just what the witness types.
- **Custom prompts written by friends are the soul of this game** — describing a mutual friend or an inside joke is where it gets screenshot-worthy / viral with my actual friend group.

---

## 4. AI as the JUDGE (the CV twist — Week 6, not the foundation)

- In **character mode**, after drawings come in, send each drawing image to a **vision model** (an AI that can *see* images) and ask it to rate how recognizable it is as the target.
- This works in character mode specifically **because there's a real reference** — the AI knows what the target should look like.

### The hard part I already spotted
- Human party-doodles are **abstract and wobbly**. If the AI grades like a strict art teacher, everyone scores 2/10 and it's demoralizing.
- **The fix lives in the *prompt*, not the code:** tell the AI to be a chill party guest, not a critic. Something like:
  > "This is a fast, funny party-game doodle of the Lorax. Rate 1–10 on how *recognizable* it is as the Lorax. Be generous — reward the idea, not the art skill."
- Tuning this is a **later** problem. The instinct — *prompt the model to grade leniently* — is the right one. (This is a real, current AI-engineering skill worth showing on a CV.)

**Note on "agentic AI":** agentic = an AI that *takes actions in a loop* (decide → act → look at result → decide again), vs a chatbot that answers once. For this game I don't need full agentic — a vision model that judges, or a text model that generates prompts, is plenty.

### Other AI options (lighter, optional)
- **AI generates prompts** — "give me a funny criminal description" so I never run dry (text model, easy).
- **AI plays the witness** — describes a target for humans to draw.

**Sequencing (protect the timeline):** build the **human-only game first** (the MVP loop), then bolt AI on as the **Week-6 unique twist**. AI as the twist, *not* the foundation — so if the semester crowds me, there's still a finished game underneath.

---

## 5. Segmented description mode (my own invention)

Instead of the witness writing one blob of text, give them a **structured form** with a **timer** (~1 min) to fill in features:
- hair · ears · facial structure · eyes · eyebrows · nose · lips · special characteristics · clothes *(probably not full body)*

Two ways to deal the cards:
- **Everyone gets everything** → each drawer does their own full version from the same notes. Comparable, easy to rate.
- **Split features across drawers** → B gets nose + lips, C gets hair + eyes, etc., and the pieces get **combined** into one sketch. This is my **exquisite-corpse / chaos mode**, but *smarter* than Gartic's (see §6).

---

## 6. The translucent alignment template (my best idea — solves Gartic's biggest flaw)

**Why Gartic's exquisite-corpse mode often flops:** misalignment and sizing. People forget to extend past the seam, features land in the wrong place, and the result "sucks the fun out of it."

**My fix:** a faint **translucent gray human-body / face outline** sitting *under* the canvas as a guide.
- If someone wants to follow it, they can; if not, they don't have to.
- If the template has a face and B is told "you draw the nose," B knows *roughly where the nose goes*.
- Turns "chaotic mess" into "**chaotic but recognizable**" — and recognizable-chaos is way funnier than pure mess.

Small build (just a faint image behind the canvas), big payoff. Structurally solves the "where does this feature go" problem.

---

## 7. Feature map (where things sit)

| Piece | What | When |
|---|---|---|
| **Core loop** | witness prompt → draw blind → witness rates → rotate | MVP |
| **Character mode** | picture shown to witness only | early |
| **Custom mode** | witness describes real person/friend from memory | early |
| **Structured feature form + timer** | witness fills hair/eyes/nose/... | could be MVP (barely more work, much more "mine") |
| **Translucent alignment template** | faint guide under the canvas | pairs with chaos mode |
| **Exquisite-corpse (split features + combine)** | different people draw different parts | later / chaos mode |
| **AI judge (character mode)** | vision model rates leniently | Week 6 twist (CV) |
| **AI generates prompts** | never run dry | optional |

> Note to self: the **structured-form + translucent-template combo** might actually deserve to be the *main* loop instead of plain describe→draw→rate — it's barely more work and dramatically more *mine*. Not deciding yet.

---

## 8. Scope discipline (so I actually ship)

- This is now potentially **four modes + an AI integration**. I can't build all of it well before university — building all of it = finishing none of it.
- **Rule (from the tracker): ONE unique twist.** The AI judge is the natural pick for that.
- **Do NOT make anything "the main game" yet.** Build one simple-but-interesting mode first; promote/choose later.
- **Ship by Week 6.** A small finished game beats a big unfinished one.
- I'll keep editing this doc — the game keeps evolving, and that's the point.

---

*Companion to `docs/CONTEXT.md` (project + mentor brief) and `docs/HANDOFF.md` (you-are-here). This file = the creative/design side; those = the build/process side.*
