# Slide 12 — Impact Process / Accountability Instruction

## Objective

Enhance **Slide 12** so that it clearly communicates the **process impact** of LogKerja beyond time savings.

This slide must show that:
- status is more centralised and easier to see;
- actions are more traceable;
- follow-up becomes more directed and less dependent on general messages;
- the evidence on the right supports the accountability message.

The slide should feel:
- clear;
- professional;
- calm;
- structured;
- readable during live presentation.

Do not change:
- slide background;
- overall colour palette;
- typography style;
- text content already on the slide;
- top-right slide label;
- bottom navigation;
- overall visual identity.

---

## Core Direction

This slide is not mainly about charts or counting.
It is about **clarity, traceability, and accountability**.

So the animation and layout behaviour should focus on:
1. a strong headline reveal;
2. a sequential checklist-style reveal of the three impact points on the left;
3. replacing the static image on the right with an **Evidence Gallery with lightbox**;

---

# Part A — Left-Side Content Animation

## 1. Section Label Reveal
Reveal:

**LEBIH DARIPADA MASA**

Animation:
- fade in;
- slight upward movement;
- duration approximately `350–450ms`;
- smooth ease-out.

---

## 2. Headline Reveal
Reveal the headline progressively in three visual beats:

### Beat 1
**Status lebih kelihatan.**

### Beat 2
**Tindakan lebih**

### Beat 3
**boleh dijejak.**

Required behaviour:
- each beat fades in with slight upward movement;
- stagger each beat by approximately `140–220ms`;
- the cyan-highlighted words must receive slightly stronger emphasis;
- the phrase **“boleh dijejak.”** should land last with a subtle emphasis settle;
- do not continuously re-animate the headline after it finishes.

The reveal should feel premium and readable, not dramatic.

---

## 3. Sequential Impact Point Reveal
Below the headline are three impact points with check icons:

1. **Status berpusat**  
   *Tindakan dokumen dilihat dengan lebih tersusun.*
2. **Rekod tindakan**  
   *Perjalanan tindakan boleh disemak semula.*
3. **Susulan lebih terarah**  
   *Makluman tidak hanya bergantung pada mesej umum.*

These must not all appear at once.

### Required reveal sequence
Reveal them one by one from top to bottom.

For each item:
1. the circular check icon appears first;
2. the check icon pulses subtly once;
3. the bold item title appears or brightens;
4. the supporting sentence fades in just after the title;
5. hold briefly before moving to the next item.

### Motion style
- use subtle fade and upward motion;
- the check icon may scale in gently;
- avoid flashy bouncing or repeated pulsing;
- preserve readability.

### Meaning
This sequence should feel like the audience is being shown three concrete process improvements, one by one.

---

# Part B — Right-Side Evidence Gallery Replacement

## Replace the static image panel
The current static image on the right must be replaced with an **Evidence Gallery with lightbox**.

Use the existing Evidence Gallery design language already established in earlier slides.

### Required evidence image
Display this image in the gallery:

- **`evidence-impacttime-after01.png`**

### Required caption
Use this exact caption:

- **Tindakan yang boleh disaring dan dijejak.**

---

# Part D — Final State

After the left-side animation completes:
- all three impact points remain visible;
- the right-side gallery remains visible and readable;
- the gallery image is ready for manual click-to-lightbox interaction;
- the slide holds in a stable, readable final state;
- do not auto-loop the left-side animation.

This slide should end with a calm “explainer” feel.

---

# Part E — Replay / Autoplay Behaviour

## Autoplay
- autoplay the left-side reveal sequence once when Slide 12 is entered;
- do **not** auto-loop.

## Replay control
A replay button is optional only if the current slide system already uses it consistently for nearby animated slides.

If a replay button is included:
- replay only the left-side content reveal;
- do not reset or unnecessarily flicker the right-side evidence image;
- do not replay the entire slide in a distracting way.

If there is no replay button on this slide, that is acceptable.

---

# Part F — Required Polish Behaviours

The following polish items are **required**.

## Polish 1 — Emphasise meaning, not spectacle
All motion must support readability and meaning.

Do not over-animate this slide.
The audience should be able to read each point comfortably.

---

## Polish 2 — Reveal checklist items one at a time
The three process-impact points must appear sequentially, not simultaneously.

Reason:
This helps the presenter pace the explanation and gives each impact point its own moment.

---

# Part G — Timing Guidance

Exact timings may be adjusted slightly, but the sequence must remain readable.

Recommended structure:
- section label: `0.0–0.4s`
- headline beat 1: `0.2–0.7s`
- headline beat 2: `0.45–0.95s`
- headline beat 3: `0.7–1.2s`
- impact point 1: `1.2–2.0s`
- impact point 2: `2.0–2.8s`
- impact point 3: `2.8–3.6s`
- final settle state: `3.6s onward`

The right-side gallery may appear immediately in its stable state or fade in gently during the early slide entry, as long as it does not compete with the left-side reveal.

Recommended behaviour:
- the gallery itself may fade in softly near the beginning;
- the presenter focus remains on the left text first.

---

# Part H — Technical Requirements

- Use only HTML, CSS, and vanilla JavaScript.
- Do not install external animation libraries.
- Use transform and opacity for smooth performance where possible.
- Apply all modifications only to Slide 12.
- Use the image asset: **`evidence-impacttime-after01.png`**.
- Wire the right-side panel to the Evidence Gallery with lightbox.
- Restart the left-side reveal animation whenever Slide 12 is entered.
- Stop or reset animation when Slide 12 is exited, if needed.

---

# Part I — Reduced Motion Behaviour

If `prefers-reduced-motion` is enabled:
- show the completed left-side content immediately;
- show all three impact points clearly;
- show the right-side evidence gallery immediately;
- keep lightbox functionality available;
- avoid motion-heavy staggered transitions.

---

# Storyboard — Slide 12

## Frame 1 — Section label appears
### Visible
- section label enters
- headline not fully visible yet

### Meaning
The audience is introduced to an impact beyond time savings.

---

## Frame 2 — Headline reveal
### Visible
- “Status lebih kelihatan.”
- then “Tindakan lebih”
- then “boleh dijejak.”

### Meaning
The core process/accountability message is introduced.

---

## Frame 3 — First impact point appears
### Visible
- check icon 1 appears
- **Status berpusat** appears
- supporting sentence appears

### Meaning
Document actions can be seen in a more centralised and structured way.

---

## Frame 4 — Second impact point appears
### Visible
- check icon 2 appears
- **Rekod tindakan** appears
- supporting sentence appears

### Meaning
The journey of actions can be reviewed again.

---

## Frame 5 — Third impact point appears
### Visible
- check icon 3 appears
- **Susulan lebih terarah** appears
- supporting sentence appears

### Meaning
Follow-up no longer depends only on general messaging.

---

## Frame 6 — Stable completed state
### Visible
- all three impact points are visible;
- right-side Evidence Gallery is visible;
- the gallery shows `evidence-impacttime-after01.png`;
- caption reads: **Tindakan yang boleh disaring dan dijejak.**

### Meaning
The slide now shows both the interpreted impact and the evidence supporting it.

---

## Final Note to Implementer
Treat this slide as a **process impact and accountability explainer**.

The most important behaviour is:
- clear headline first;
- reveal the three process-impact points sequentially;
- replace the right-side static image with a Evidence Gallery with lightbox;
- keep the slide calm, readable, and credible.
