# Slide 13 / 14 — Impact Nilai Instruction

## Objective

Enhance this slide so it clearly communicates the **before → after → value** story of LogKerja in a calm, premium, presentation-friendly way.

This slide must show:
- the previous condition (**Sebelum**);
- the improved condition (**Selepas**);
- the operational value created (**Nilai**).

The visual storytelling must feel:
- clear;
- structured;
- confident;
- easy to follow while presenting;
- non-looping and non-distracting.

Do not change:
- slide background;
- existing text content;
- overall layout structure;
- typography style;
- colour palette;
- top-right slide label;
- bottom navigation;
- overall visual identity.

---

## Core Direction

This slide is essentially a **3-part impact narrative**.

The audience should understand:
1. what the situation looked like before;
2. what changed after implementation;
3. what value that change creates for operations.

The three lower cards must therefore behave like a **guided sequential reveal**, not static boxes appearing all at once.

---

# Part A — Slide Entry

Whenever this slide is entered, restart the slide animation from the beginning.

## 1. Section Label Reveal
Reveal:

**IMPAK KEPADA OPERASI**

Animation:
- fade in;
- slight upward movement;
- duration approximately `350–450ms`;
- smooth ease-out.

---

## 2. Headline Reveal
Reveal the headline progressively in two main visual beats:

### Beat 1
**Tindakan lebih jelas.**

### Beat 2
**Rekod lebih telus.**

Required behaviour:
- Beat 1 fades in first with slight upward movement;
- Beat 2 appears just after Beat 1;
- the cyan-highlighted phrase **“Rekod lebih telus.”** should receive stronger emphasis;
- when Beat 2 completes, let it settle briefly before the card sequence begins;
- do not continuously re-animate the headline after it finishes.

The headline reveal should feel premium and readable.

---

# Part B — Three-Card Sequential Reveal

## Cards involved
There are three cards in the lower portion of the slide:

1. **Sebelum**  
   *Maklumat dan susulan tersebar merentas saluran.*

2. **Selepas**  
   *Status dan tanggungjawab dilihat dalam aliran yang lebih tersusun.*

3. **Nilai**  
   *Akauntabiliti proses menjadi lebih mudah untuk dipantau.*

These cards must not appear simultaneously.
They must appear in a clear narrative order:

**Sebelum → Selepas → Nilai**

---

## Step 1 — Card “Sebelum”

### Required entry motion
The **Sebelum** card must appear first.

It should enter by **dropping down from beneath the phrase “Rekod lebih telus.”**

### Clarified implementation meaning
Interpret this as:
- the card originates from a point visually aligned below the headline area, especially beneath the lower highlighted headline line;
- then it moves downward into its final left-card position;
- the motion should feel like the card is being introduced from the headline area into the comparison row.

### Motion style
- slight downward travel into place;
- fade in during motion;
- subtle ease-out on landing;
- optional very light settle / micro-bounce is acceptable, but keep it minimal.

### Internal reveal
Once the card lands:
1. reveal the small label **Sebelum**;
2. reveal the main body text;
3. hold briefly.

### Meaning
This establishes the original fragmented condition.

---

## Step 2 — Card “Selepas”

### Required entry motion
The **Selepas** card must appear second.

It should **enter from the right side and slide horizontally into its final middle position**.

### Clarified implementation meaning
Although the phrasing may be shorthand, the intended behaviour is:
- the card begins off to the right side of its final position;
- it slides leftward into place until it reaches the middle-card slot;
- it should not appear instantly.

### Motion style
- horizontal slide-in from the right;
- fade in during motion;
- ease-out when reaching final position;
- no overshooting.

### Internal reveal
Once the card settles:
1. reveal the small label **Selepas**;
2. reveal the main body text;
3. hold briefly.

### Meaning
This communicates the improved, more structured state after LogKerja.

---

## Step 3 — Card “Nilai”

### Required entry motion
The **Nilai** card must appear last.

It should **enter from below and rise upward into its final right-card position**.

### Motion style
- upward motion from slightly below;
- fade in during motion;
- smooth ease-out when it settles;
- no loop.

### Internal reveal
Once the card settles:
1. reveal the small label **Nilai**;
2. reveal the main body text;
3. hold in place.

### Meaning
This delivers the conclusion: the structured process creates operational value.

---

# Part C — Final State

After all three cards appear:
- keep all cards fully visible;
- keep the headline readable and static;
- no card should continue moving;
- hold the slide in a clean, readable completed state.

The final arrangement must clearly communicate:

**Sebelum → Selepas → Nilai**

This must feel like a completed narrative, not a looping animation.

---

# Part D — Replay Behaviour

## Autoplay
- autoplay the full sequence once when the slide is entered;
- do **not** auto-loop.

## Replay control
Add a small **replay / refresh icon** for this slide.

### Placement guidance
Place the replay icon:
- near the lower visual area of the slide; or
- aligned discreetly with the card row;
- without disturbing the existing layout.

The replay control should feel consistent with nearby slides that use replay.

### Replay behaviour
When clicked, the replay button must:
1. reset the three-card sequence;
2. hide or reset the cards back to their pre-entry state;
3. replay the three-card animation in order;
4. keep the headline static (do not replay the section label or headline unless necessary for system consistency).

### Important rule
Prefer replaying only:
- the three-card animation sequence.

Do not create a full-slide flash or heavy reset.

---

# Part E — Required Polish Behaviours

The following polish items are **required**.

## Polish 1 — Preserve the narrative order
The cards must always reveal in this exact order:

1. **Sebelum**
2. **Selepas**
3. **Nilai**

Reason:
The audience must first understand the original condition, then the improvement, then the resulting value.

---

## Polish 2 — Make each card movement direction distinct
Each card should have its own motion identity:
- **Sebelum** = drop downward from headline area;
- **Selepas** = slide in from the right;
- **Nilai** = rise upward from below.

Reason:
This creates rhythm and makes the sequence more memorable without being noisy.

---

## Polish 3 — Keep motion subtle and premium
Do not make the cards bounce excessively.

Allowed:
- fade;
- slide;
- drop;
- rise;
- subtle ease-out settle.

Not allowed:
- cartoon bounce;
- elastic overshoot;
- repeated floating;
- auto-loop.

Reason:
The slide should look premium and corporate, not playful.

---

## Polish 4 — Emphasise body text readability
Inside each card, the main message is more important than the small label.

Therefore:
- the small label should remain subtle;
- the main text should appear stronger and clearer;
- preserve visual hierarchy.

Reason:
The audience should read the meaning quickly from a projector screen.

---

# Part F — Timing Guidance

Exact timings may be adjusted slightly, but the sequence must remain readable.

Recommended structure:
- section label: `0.0–0.4s`
- headline beat 1: `0.2–0.8s`
- headline beat 2: `0.6–1.3s`
- short hold after headline: `1.3–1.6s`
- Sebelum card drop-in: `1.6–2.4s`
- hold: `2.4–2.7s`
- Selepas card slide-in: `2.7–3.5s`
- hold: `3.5–3.8s`
- Nilai card rise-in: `3.8–4.6s`
- final settle state: `4.6s onward`

The motion should not be rushed.
The audience should be able to read each card as it appears.

---

# Part G — Technical Requirements

- Use only HTML, CSS, and vanilla JavaScript.
- Do not install external animation libraries.
- Use transform and opacity for smooth performance where possible.
- Apply all modifications only to this slide.
- Restart the card animation sequence whenever the slide is entered.
- Stop or reset animation when the slide is exited, if needed.

---

# Part H — Reduced Motion Behaviour

If `prefers-reduced-motion` is enabled:
- show the completed slide state immediately;
- show all three cards clearly;
- keep the replay icon available if appropriate;
- avoid drop/slide/rise motion-heavy effects.

---

# Part I — Do Not

Do not:
- show all three cards at once;
- auto-loop the card sequence;
- animate the cards in the wrong order;
- use the same motion direction for all cards;
- add flashy decorative effects or particles;
- make the replay button intrusive;
- over-animate the headline after the cards start.

---

# Storyboard — Slide 13 / 14

## Frame 1 — Section label appears
### Visible
- section label enters
- headline not fully visible yet

### Meaning
The audience is introduced to the operational value section.

---

## Frame 2 — Headline reveal
### Visible
- “Tindakan lebih jelas.”
- then “Rekod lebih telus.”

### Meaning
The main message is established before the detail cards appear.

---

## Frame 3 — Sebelum card appears
### Visible
- Sebelum card drops down from beneath the lower headline area
- label **Sebelum** appears
- body text appears

### Meaning
The original fragmented situation is introduced.

---

## Frame 4 — Selepas card appears
### Visible
- Selepas card slides in from the right into the middle position
- label **Selepas** appears
- body text appears

### Meaning
The structured improvement is introduced.

---

## Frame 5 — Nilai card appears
### Visible
- Nilai card rises from below into the right position
- label **Nilai** appears
- body text appears

### Meaning
The operational value of the improvement is delivered.

---

## Frame 6 — Completed state
### Visible
- all three cards visible;
- headline visible;
- replay icon available;
- slide holds steady without looping.

### Meaning
The slide clearly communicates the progression from fragmented work to structured accountability value.

---

## Final Note to Implementer
Treat this slide as a **three-step impact-value reveal**.

The most important behaviour is:
- headline first;
- card sequence in exact order: Sebelum → Selepas → Nilai;
- each card has a distinct motion direction;
- no auto-loop;
- include a replay icon for manual rerun.
