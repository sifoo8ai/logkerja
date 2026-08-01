# INSTRUCTION FILE — SLIDE 15 KELESTARIAN

## Important filename note
This file is intentionally named **`instruction-slide15-kelestarian.md`** to match the user’s requested naming.

However, the actual slide to implement is the slide **labelled on screen as `16 · KELESTARIAN`**.

Do not get confused by the filename.
The content of this instruction is for the slide with the headline:

**“Kelestarian datang daripada pemilikan proses.”**

---

# 1) Objective
Implement the **Kelestarian** slide in the HTML presentation using the **selected final concept image as the visual design reference**.

This slide must communicate that:
- sustainability does not come from the app alone;
- sustainability comes from **process ownership**;
- process ownership is supported by:
  - **Peranan**,
  - **Kategori**,
  - **Routing**,
  - **Jejak Audit**;
- together, these produce:
  - **pengurusan tindakan yang konsisten dan tersusun**.

This slide is **not to be redesigned from scratch**.
Use the attached reference image as the visual direction to reproduce in the presentation style.

---

# 2) Source of truth
Use the following as the only reliable sources for this slide:
1. this instruction file;
2. the attached reference image that will be provided by the user.

Do not reuse the older incorrect Kelestarian concept.
Do not switch back to the earlier **Relevan** 3-step infographic.

This slide must use the **radial / hub-and-spoke “Pemilikan Proses” concept**.

---

# 3) Exact slide identity and content

## Slide label
`16 · KELESTARIAN`

## Left-side section label
`BUKAN HANYA APLIKASI`

## Main headline
`Kelestarian datang daripada pemilikan proses.`

## Supporting paragraph
`Peranan, kategori, routing dan jejak audit membantu menjadikan pengurusan tindakan lebih tersusun dari semasa ke semasa.`

## Diagram center
**Main title:**
`PEMILIKAN PROSES`

**Subtitle:**
`Asas kelestarian pengurusan tindakan`

## Surrounding nodes and descriptions
### PERANAN
`Tindakan sampai kepada pegawai yang tepat.`

### KATEGORI
`Tindakan diklasifikasikan dengan lebih teratur.`

### ROUTING
`Aliran kerja jelas mengikut proses yang ditetapkan.`

### JEJAK AUDIT
`Rekod lengkap menyokong ketelusan dan pemantauan.`

## Bottom outcome box
`Pengurusan tindakan yang konsisten dan tersusun.`

The phrase **“konsisten dan tersusun.”** must remain visually highlighted in green/cyan accent, matching the design reference.

---

# 4) Overall design direction
Recreate the visual language from the provided reference image inside the HTML slide.

## Required visual style
- dark navy / near-black background;
- premium corporate presentation aesthetic;
- cyan / electric blue neon glow accents;
- glassmorphism / translucent dark cards for description boxes;
- soft glow rings and subtle depth;
- clean, modern infographic styling;
- highly readable typography.

## Required slide composition
The slide must have two major zones:

### Left zone
Text content block:
- section label;
- large headline;
- supporting paragraph;
- source note at bottom.

### Right zone
Main radial diagram:
- central glowing hub;
- four surrounding nodes;
- dotted / curved orbital path;
- small connector arrows between center and nodes;
- bottom outcome box.

Match the structure and relative placement shown in the reference image.

---

# 5) Layout specification
Use a wide-screen composition that matches the rest of the HTML presentation.

## Left column
Allocate approximately **42%** width.

### Left column order
1. section label;
2. main headline;
3. supporting paragraph;
4. source note anchored near the lower-left area.

### Typography intent
- section label: uppercase, small, spaced letters, cyan accent;
- headline: very large, bold, high contrast;
- keyword emphasis: the word **“pemilikan proses.”** must use the accent color treatment seen in the reference;
- supporting paragraph: medium-large size, readable, light grey/white;
- source note: small, subtle, low-contrast but still readable.

## Right column
Allocate approximately **58%** width.

### Right column structure
- center hub positioned slightly right of center overall;
- node positions:
  - **PERANAN** at top;
  - **KATEGORI** at left;
  - **ROUTING** at right;
  - **JEJAK AUDIT** at bottom;
- bottom outcome box centered beneath the main diagram;
- outer circular path / orbit drawn around the four nodes;
- description cards aligned next to each node as in the reference.

All spacing must be balanced and presentation-safe for projector viewing.

---

# 6) Required DOM structure
Use clean semantic grouping so the animation can be controlled clearly.

Implement the slide with dedicated wrappers so each animated component is targetable.

Use an internal structure equivalent to the following:

- slide root
  - left content wrapper
    - section label
    - headline
    - supporting paragraph
    - source note
  - right diagram wrapper
    - orbit path layer
    - center hub group
      - center ring
      - center glow
      - center icon
      - center title
      - center subtitle
    - node group: peranan
      - connector from center
      - node circle
      - icon
      - description card
      - title
      - description
    - node group: kategori
      - connector from center
      - node circle
      - icon
      - description card
      - title
      - description
    - node group: routing
      - connector from center
      - node circle
      - icon
      - description card
      - title
      - description
    - node group: jejak audit
      - connector from center
      - node circle
      - icon
      - description card
      - title
      - description
    - downward connector / arrow to result
    - result box
      - shield icon
      - result text line
      - highlighted phrase

The exact class names may follow the project’s naming convention, but the structure above must be preserved.

---

# 7) Motion design principles
This slide must follow the same presentation philosophy used elsewhere in the deck:
- readable;
- premium;
- corporate;
- purposeful;
- no distracting gimmicks;
- no noisy looping;
- main animation plays once on slide entry;
- after the main reveal, the slide settles into a stable final state.

Do not add playful, bouncy, cartoon-style motion.
Use smooth easing and restrained energy.

---

# 8) Locked animation concept
The animation concept is fixed.
Implement it exactly in the following narrative sequence:

## Core narrative
**Pemilikan proses** activates the system.
That activation flows outward into the supporting structures.
Those structures then produce the final outcome:
**pengurusan tindakan yang konsisten dan tersusun**.

This is the logic the animation must show.

---

# 9) Initial state before animation
When the slide first becomes active:

## Left side
- section label, headline, supporting paragraph and source note may already be visible;
- if the slide system uses a standard soft fade for the whole slide, keep it minimal and do not delay the text significantly.

## Right side initial state
The diagram must begin in a **dormant** state:
- center hub visible but dim;
- four node circles visible but subdued at low opacity;
- description cards subdued or hidden in their closed state;
- orbit path faint;
- connectors inactive;
- bottom outcome box hidden.

This initial state is required so the animation can visually “bring the system to life.”

---

# 10) Exact animation sequence and timing
The full main sequence should complete in approximately **4.8 to 5.0 seconds**.

Use the timeline below.

## Phase 1 — dormant hold
**0.00s–0.35s**
- keep the right-side system in its dim state for a brief beat;
- this creates anticipation and establishes contrast.

## Phase 2 — central hub activation
**0.35s–1.15s**
Animate the center hub first.

### Required steps
1. Draw / reveal the outer circular ring.
2. Run a cyan light sweep around the ring once.
3. Increase the inner hub brightness from dim navy to active illuminated state.
4. Reveal the center icon with scale-up and fade-in.
5. Reveal the title `PEMILIKAN PROSES`.
6. Reveal the subtitle `Asas kelestarian pengurusan tindakan`.
7. Emit one soft outward pulse from the center.

### Motion character
- smooth, confident, premium;
- no exaggerated pop;
- no repeated pulsing.

## Phase 3 — supporting structures activate one by one
This phase must animate in the following order:

1. **PERANAN**
2. **KATEGORI**
3. **ROUTING**
4. **JEJAK AUDIT**

This order is fixed and must not be changed.

### Narrative reason for this order
It corresponds to:
- who is responsible;
- how the action is classified;
- how it flows;
- how it is recorded.

### PERANAN activation
**1.15s–1.65s**
- animate a light particle traveling from the center to the top node;
- activate the center-to-top connector;
- brighten the top node ring;
- reveal the node icon;
- reveal the description card by sliding it out smoothly;
- reveal the label `PERANAN` first, then the description text.

### KATEGORI activation
**1.65s–2.15s**
- animate a light particle from the center to the left node;
- activate the connector;
- brighten the left node ring;
- reveal the node icon;
- reveal the description card;
- reveal the label `KATEGORI`, then the description.

### ROUTING activation
**2.15s–2.65s**
- animate a light particle from the center to the right node;
- activate the connector;
- brighten the right node ring;
- reveal the routing icon with directional line / arrow drawing;
- reveal the description card;
- reveal the label `ROUTING`, then the description.

### JEJAK AUDIT activation
**2.65s–3.30s**
- animate a light particle from the center to the bottom node;
- activate the connector;
- brighten the bottom node ring;
- reveal the icon so the document and magnifier feel progressively drawn / revealed;
- reveal the description card;
- reveal the label `JEJAK AUDIT`, then the description.

## Phase 4 — system completion
**3.30s–4.05s**
Once all four support nodes are active:
- complete the outer orbit / circular path visibly;
- bring the orbit to a full active state;
- equalize the glow across the four support nodes;
- keep the center hub as the dominant focal point;
- emit one final soft center pulse.

This moment must communicate that the system is now structurally complete.

## Phase 5 — outcome reveal
**4.05s–4.85s**
Reveal the final bottom outcome box as the payoff.

### Required steps
1. Animate a downward energy flow from the main system to the bottom connector.
2. Reveal the downward arrow.
3. Bring in the result box from slightly below with fade-in.
4. Reveal the shield icon.
5. Reveal the line `Pengurusan tindakan yang`.
6. Reveal the phrase `konsisten dan tersusun.` with a highlight emphasis sweep.

This final reveal must feel like the conclusion of the entire system.

---

# 11) Stable final state after main animation
After the main reveal completes:
- all nodes remain visible and active;
- all description cards remain visible;
- the center hub remains brightest;
- the result box remains visible;
- the slide becomes stable and readable.

Do not keep replaying the main animation automatically.

---

# 12) Ambient motion after completion
Only subtle ambient motion is allowed.

Implement the following and nothing more:

## Ambient motion 1
The center hub glow may breathe very gently at a slow rate.

## Ambient motion 2
A very subtle light point may travel slowly along the orbit path.

Constraints:
- keep both extremely subtle;
- no flashing;
- no aggressive continuous rotation;
- no multiple moving particles;
- no constant noisy motion.

The slide must feel alive but calm.

---

# 13) Replay and control behavior
Implement the slide so it works well during live presentation.

## On slide entry
The main animation must play once automatically when the slide becomes active.

## Replay behavior
The animation must be replayable through the presentation’s existing replay / refresh interaction system.
If the project already has a standard slide replay mechanism, connect this slide to that mechanism.

## Skip behavior
If the presenter navigates forward while the main animation is still playing:
- immediately finish all remaining animations;
- place the slide into the final stable state;
- only then allow the next navigation step to move to the next slide.

This is required so the presenter is never trapped waiting for animation completion.

## Re-entry behavior
If the user leaves the slide and later returns to it, the slide should reinitialize properly and replay from the beginning according to the project’s existing slide lifecycle pattern.

---

# 14) Text treatment requirements
Maintain strong readability at projector scale.

## Mandatory text treatment
- section label must be crisp and legible;
- headline must remain dominant on the left side;
- supporting paragraph must not become too small;
- all node titles must be uppercase and clearly emphasized;
- card body text must be readable at presentation distance;
- the highlighted final phrase must visually stand out.

Do not compress the typography too tightly.
Do not reduce contrast.

---

# 15) Icon and connector behavior
Icons must match the premium line-based visual language already shown in the selected concept.

## Icon requirements
- center icon: person + supporting process / gear motif;
- peranan: people / user-group style icon;
- kategori: folder/tag or classification style icon;
- routing: directional flow icon;
- jejak audit: document + magnifier style icon;
- result box: shield + check icon.

## Connector requirements
- connectors from center to nodes must visibly activate when each node is introduced;
- the downward connector to the result box must activate only during the final outcome reveal;
- all active connectors must use the cyan accent.

---

# 16) Responsiveness and fit
This slide is primarily for the presentation viewport and must be optimized for projector-scale viewing.

## Required fit rules
- the radial diagram must remain fully visible without clipping;
- description cards must not overlap awkwardly;
- the left text must not collide with the diagram;
- no text may extend beyond safe margins;
- the bottom outcome box must remain fully readable.

The layout must hold cleanly at the presentation’s standard aspect ratio.

---

# 17) Performance requirement
Keep animation smooth and presentation-safe.

## Technical requirement
- use efficient CSS transforms and opacity animation where possible;
- avoid heavy, jittery animation logic;
- avoid unnecessary reflow-heavy techniques;
- maintain good readability throughout the sequence.

The result must feel polished, stable, and premium on presentation hardware.

---

# 18) Source note requirement
Retain the source note at the bottom-left area.

Use:
`Sumber: Paparan tadbir urus dalam Borang Penyertaan HKIP dan Blueprint LogKerja.`

It should remain subtle but readable.

---

# 19) Things that must not happen
Do not do any of the following:
- do not reuse the older 3-step Relevan layout;
- do not redesign the slide into a different infographic format;
- do not randomize the animation order;
- do not animate all four nodes simultaneously;
- do not autoplay endless loops;
- do not add loud futuristic gimmicks;
- do not turn the slide into a dashboard;
- do not hide the meaning behind over-stylized animation;
- do not make the slide too busy.

The priority is clarity, elegance, and narrative logic.

---

# 20) Final implementation expectation
The implemented slide must feel like:
- a premium continuation of the existing HTML presentation;
- visually faithful to the provided reference image;
- narratively clear;
- presenter-friendly;
- stable after completion;
- easy to understand at a glance.

The end result must clearly express this story:

**Kelestarian datang daripada pemilikan proses. Pemilikan proses mengaktifkan struktur sokongan, dan struktur ini menghasilkan pengurusan tindakan yang konsisten dan tersusun.**

---

# 21) Deliverable expectation
Implement the slide directly in the presentation codebase.
Do not return with alternative concepts.
Do not offer different animation options.
Build the slide according to this instruction and the attached reference image.

