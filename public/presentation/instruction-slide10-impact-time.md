# Slide 10 — Impact Animation Instruction: Daily Monitoring Time

## Objective

Enhance **Slide 10** with a clear before-and-after impact animation that communicates the reduction in daily monitoring time from **30 minutes per day** to **10 minutes per day**.

This slide must communicate:
- the original operational monitoring time;
- the reduced monitoring time after LogKerja;
- the difference of approximately 20 minutes per day;
- the fact that the comparison is based on real operational observation, not a formal academic study.

The animation must feel:
- clear;
- measurable;
- professional;
- easy to follow while presenting;
- stable after completion so the audience can read slowly.

Do not change:
- the existing slide background;
- the headline wording;
- typography style;
- colour palette;
- top-right slide label;
- bottom navigation;
- the Evidence Gallery area on the right;
- the overall slide composition.

The Evidence Gallery on the right will continue to be used for dashboard and audit-trail screenshots, including the existing lightbox behaviour.

---

# Core Animation Principle

The visual story is:

**Sebelum: 30 minit sehari → Selepas: 10 minit sehari**

The number animation and the bar animation must work together.

The final completed state must remain data-consistent:
- the **Sebelum** bar remains at 30 minutes;
- the **Selepas** bar settles at 10 minutes;
- the final comparison remains clearly visible.

Do not animate the **Sebelum** bar permanently down to 10 minutes, because that would make the final before-and-after comparison visually confusing.

---

# Part A — Slide Entry Animation

Whenever Slide 10 is entered, restart the slide animation from the beginning.

## 1. Section Label Reveal

Reveal:

**PEMERHATIAN OPERASI SEBELUM / SELEPAS**

Animation:
- fade in;
- slight upward movement;
- duration approximately `350–450ms`;
- smooth ease-out.

---

## 2. Headline Reveal

Reveal the headline in visual beats:

### Beat 1
**Masa**

### Beat 2
**pemantauan**

### Beat 3
**harian turun**

### Beat 4
**20 minit.**

Animation behaviour:
- each line fades in with slight upward motion;
- stagger each line by approximately `120–180ms`;
- the green phrase **“20 minit.”** appears last;
- briefly increase its brightness/emphasis when it completes;
- do not continuously animate the headline afterward.

---

## 3. Supporting Label Reveal

Reveal:

**Purata masa pemantauan dokumen**

Animation:
- fade in;
- slight upward motion;
- delay approximately `150–250ms` after the headline;
- duration approximately `350–450ms`.

After this label settles, begin the metric animation.

---

# Part B — Metric Animation

## Initial State

Before the metric sequence begins:
- the large left number is hidden;
- the arrow is hidden;
- the right-side `10 minit/hari` result is hidden;
- the **Sebelum** bar is hidden or at zero width;
- the **Selepas** bar is hidden or at zero width;
- bar labels may remain visible at low emphasis or reveal with the bars.

---

## Step 1 — Reveal Original Value

Reveal the original monitoring time:

**30 minit/hari**

Required behaviour:
- the large number `30` appears first;
- the unit `minit/hari` appears with it or immediately after;
- the value must feel like the starting operational baseline;
- use subtle fade and upward motion;
- do not pulse excessively.

At the same time:
- reveal the **Sebelum** bar;
- animate it from zero to full 30-minute width;
- reveal the label `30 minit` at the end of the bar.

The **Sebelum** bar must represent the full 30-minute baseline and remain at that width in the final state.

---

## Step 2 — Countdown Transition

After the original `30 minit/hari` value settles, animate the large number downward:

`30 → 29 → 28 → ... → 10`

Required behaviour:
- the countdown must be smooth and readable;
- do not make it so fast that it appears as a blur;
- use a consistent rhythm;
- the number must remain in the same physical position during the countdown;
- the unit `minit/hari` remains stable;
- do not move the number horizontally during the count.

Recommended duration:
- approximately `1.8–2.6 seconds` for the full countdown;
- use a slightly accelerated but still readable cadence.

During the countdown:
- keep the **Sebelum** bar at its full 30-minute width;
- do not permanently shrink the **Sebelum** bar;
- a temporary transition sweep or moving highlight may pass across it to visually support the countdown;
- this temporary effect must not alter the final 30-minute data state.

---

## Step 3 — Transition to Final Comparison

When the countdown reaches `10`:

1. Hold briefly on the value `10`.
2. Reset the left-side comparison display back to the original value `30`.
3. Reveal the horizontal arrow moving or drawing from left to right.
4. Reveal the final right-side value:

**10 minit/hari**

Required behaviour:
- the arrow appears after the countdown completes;
- the arrow must move or draw from left to right;
- the final `10` appears at the arrow destination;
- the final `10` must use the green impact colour;
- the final display must clearly read:

`30 minit/hari → 10 minit/hari`

The reset from countdown `10` back to the left-side `30` should feel intentional and clean, not abrupt.

Use one of these approved methods:
- a very brief fade/crossfade from countdown `10` back to left-side `30`, followed by arrow and right-side `10`;
- or a short snap-back with a subtle opacity transition.

Do not animate the left number flying across the slide.

---

# Part C — Bar Animation

## 1. Sebelum Bar

The **Sebelum** bar must:
- animate from zero to full 30-minute width during the original-value reveal;
- remain at 30 minutes in the final state;
- keep the `30 minit` label visible;
- use the current blue/cyan visual style.

During the countdown, the bar may use a temporary animated sweep, highlight, or mask effect to suggest time reduction, but:
- the bar must return to or remain at full 30-minute width;
- the final before-and-after comparison must not be distorted.

---

## 2. Selepas Bar

The **Selepas** bar must remain hidden or at zero width until the final result is introduced.

When the right-side `10 minit/hari` appears:
- animate the **Selepas** bar from zero to the proportional 10-minute width;
- animate it more slowly than a simple instant fill;
- stop exactly at the value representing 10 minutes;
- reveal the `10 minit` label at the end of the bar;
- use the current green visual style.

The **Selepas** bar fill must be synchronised with the appearance of the final right-side `10 minit/hari` value.

The bar should complete at the same time or slightly after the final number appears.

---

# Part D — Required Synchronisation

The number and bar animations must be tightly synchronised.

Required sequence:

1. Original `30 minit/hari` appears.
2. **Sebelum** bar fills to 30 minutes.
3. Large number counts down from 30 to 10.
4. Temporary transition effect may occur across the **Sebelum** bar.
5. Countdown reaches 10 and pauses.
6. Left-side display resets cleanly to `30`.
7. Arrow draws or moves to the right.
8. Final `10 minit/hari` appears.
9. **Selepas** bar fills to 10 minutes.
10. Final before-and-after state holds still.

Do not allow the bar sequence to finish before the number comparison is understandable.

---

# Part E — Final Completed State

After all animations complete, hold a stable final state:

- headline remains visible;
- `30 minit/hari → 10 minit/hari` remains visible;
- **Sebelum** bar remains at 30 minutes;
- **Selepas** bar remains at 10 minutes;
- both bar-end labels remain visible;
- the Evidence Gallery remains available for manual navigation and lightbox viewing;
- no continuous looping occurs.

A single subtle settle emphasis is allowed after completion:
- brief soft glow on the green `10`;
- or a brief, subtle brightness emphasis on the **Selepas** bar.

This completion emphasis must happen once only.

---

# Part F — Replay Behaviour

## Autoplay
- The full metric animation must autoplay once when Slide 10 is entered.
- It must not auto-loop.

## Manual Replay Control
Add a small replay / refresh icon button near the metric section.

### Placement
Place it neatly:
- below the bars;
- or aligned near the lower-right of the metric area;
- without disturbing the Evidence Gallery or slide navigation.

### Replay behaviour
When clicked, the button must:
1. reset the large number sequence;
2. reset the arrow;
3. reset the right-side `10 minit/hari` value;
4. reset both bars;
5. replay the metric sequence from the original 30-minute state.

Do not replay:
- section label;
- headline;
- supporting label;
- Evidence Gallery entrance.

Replay only the time-comparison metric animation.

---

# Part G — Evidence Gallery Behaviour (with lightbox)

The Evidence Gallery on the right is not part of the time-count animation.

Keep the existing gallery behaviour:
- manual previous/next navigation;
- pagination dots;
- counter outside the image;
- short caption outside the image;
- floating arrows over the image;
- click-to-open lightbox;
- press `Esc` or use close control to exit the lightbox;
- no autoplay.
- file imej yang akan dipaparkan:
  1. evidence-impacttime-before01.png | Sebelum LogKerja
  2. evidence-after01.png | Selepas LogKerja

The metric replay button must not interfere with Evidence Gallery controls.

---

# Part H — Timing Guidance

Recommended structure:

- Section label reveal: `0.0–0.4s`
- Headline reveal: `0.2–1.2s`
- Supporting label reveal: `1.1–1.5s`
- Original `30 minit/hari` reveal: `1.5–2.0s`
- **Sebelum** bar fill: `1.6–2.2s`
- Countdown `30 → 10`: `2.2–4.6s`
- Hold on countdown 10: `4.6–4.9s`
- Reset left display to 30: `4.9–5.2s`
- Arrow draw/movement: `5.1–5.6s`
- Final right-side 10 reveal: `5.4–5.9s`
- **Selepas** bar fill: `5.5–6.3s`
- Completion emphasis: `6.3–6.7s`
- Final stable hold: after `6.7s`

These timings may be adjusted slightly, but the narrative order must remain unchanged.

---

# Part I — Technical Requirements

- Use only HTML, CSS, and vanilla JavaScript.
- Do not install external animation libraries.
- Use `requestAnimationFrame`, CSS transforms, width/scale transforms, and opacity where appropriate.
- Avoid layout shift during number changes.
- Use a fixed-width or tabular-number style for the counter so the number does not jump horizontally.
- Apply all modifications only to Slide 10.
- Do not alter global slide navigation.
- Restart the full slide-entry sequence whenever Slide 10 is entered.
- Stop or reset active animations when Slide 10 is exited.

---

# Part J — Reduced Motion Behaviour

If `prefers-reduced-motion` is enabled:
- skip the countdown animation;
- show the final `30 minit/hari → 10 minit/hari` comparison immediately;
- show the **Sebelum** bar at 30 minutes;
- show the **Selepas** bar at 10 minutes;
- keep the Evidence Gallery fully usable;
- the replay button may reveal the same final state instantly or with minimal fade.

---

# Part K — Do Not

Do not:
- permanently shrink the **Sebelum** bar to 10 minutes;
- leave both bars at the same final length;
- auto-loop the animation;
- make the countdown too fast to read;
- move the large number horizontally during the count;
- flash the final `10` repeatedly;
- replay the headline when the replay button is clicked;
- animate the Evidence Gallery automatically;
- change the source disclaimer at the bottom.

---

# Storyboard — Slide 10

## Frame 1 — Slide Entry
### Visible
- section label appears;
- headline begins revealing;
- metric area is still idle;
- Evidence Gallery remains in its initial state.

### Meaning
The audience is introduced to the before-and-after operational impact.

---

## Frame 2 — Headline Complete
### Visible
- full headline;
- green phrase `20 minit.` emphasised briefly;
- supporting label appears.

### Meaning
The key result is stated before the detailed comparison is shown.

---

## Frame 3 — Original Baseline
### Visible
- `30 minit/hari` appears;
- **Sebelum** bar fills to 30 minutes;
- `30 minit` label appears at the bar end;
- right-side result remains hidden;
- **Selepas** bar remains empty.

### Meaning
The original daily monitoring burden is established.

---

## Frame 4 — Countdown Begins
### Visible
- large number counts down from 30;
- unit remains stable;
- **Sebelum** bar remains full;
- a temporary transition sweep may move across the bar.

### Meaning
The audience visually experiences the reduction in time.

---

## Frame 5 — Countdown Reaches 10
### Visible
- large number reaches 10;
- short pause;
- **Sebelum** bar still represents 30 minutes.

### Meaning
The reduced time has been reached, but the final comparison has not yet been laid out.

---

## Frame 6 — Comparison Builds
### Visible
- left-side display resets cleanly to `30`;
- arrow draws to the right;
- green `10 minit/hari` appears at the destination.

### Meaning
The audience now sees the explicit before-and-after comparison.

---

## Frame 7 — Selepas Bar Fills
### Visible
- **Selepas** bar grows from zero to 10-minute width;
- `10 minit` label appears;
- **Sebelum** bar remains at 30 minutes.

### Meaning
The visual bars confirm the numerical reduction.

---

## Frame 8 — Completed Impact State
### Visible
- `30 minit/hari → 10 minit/hari`;
- **Sebelum** bar at 30;
- **Selepas** bar at 10;
- one subtle completion emphasis;
- all elements hold still;
- replay button available;
- Evidence Gallery remains interactive.

### Meaning
The operational impact is clear, measurable, and easy to verify visually.

---

## Final Note to Implementer

Treat the countdown as a **transition device**, not as the final data state.

The final slide must always end with a clear and truthful comparison:

**Sebelum = 30 minit/hari**  
**Selepas = 10 minit/hari**

The animation should help the audience feel the reduction, while the final layout must preserve the data comparison without ambiguity.
