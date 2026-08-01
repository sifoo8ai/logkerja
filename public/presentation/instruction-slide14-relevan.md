# Slide 14 — Relevan

## Objective

Enhance **Slide 14 — Relevan** by replacing the existing three separate cards with one integrated **three-step infographic** based on the attached visual reference.

The slide must communicate that LogKerja is relevant because it transforms scattered work actions into a workflow that is:

1. **Sistematik**
2. **Berperanan**
3. **Boleh dijejak**

The final slide should feel:
- premium;
- cohesive;
- modern;
- clear from a projector;
- consistent with the main presentation theme;
- visually different from the previous card-based slides.

---

# Part A — Visual Reference and Design Direction

Use the attached infographic image as the **primary visual direction** for this slide.

The reference image is not merely inspiration. It defines the intended:
- overall layout;
- left-to-right flow logic;
- three-node structure;
- continuous connector line;
- icon placement;
- number badge placement;
- title and supporting-text hierarchy;
- spacing rhythm;
- integrated infographic feel.

Adapt the reference cleanly into the actual presentation system.

## Important reference adjustment

Remove the internal title shown at the top of the reference infographic:

**Transformasi Tindakan Pegawai**

Do not include that title in the final slide.

The existing presentation label at the top right and the slide context are sufficient.

---

# Part B — Required Content

Use only these three steps and preserve the wording exactly.

## Step 1
### Title
**Sistematik**

### Body
**Tindakan tidak lagi bergantung sepenuhnya pada ingatan atau mesej peribadi.**

### Icon direction
Use a checklist, structured-task, or organised-workflow icon.

---

## Step 2
### Title
**Berperanan**

### Body
**Setiap pegawai melihat tindakan mengikut tanggungjawabnya.**

### Icon direction
Use a role, people-and-gear, responsibility, or routed-workflow icon.

---

## Step 3
### Title
**Boleh dijejak**

### Body
**Rekod tindakan menyokong ketelusan dan pemantauan kerja.**

### Icon direction
Use a search, audit, document-trace, or magnifier icon.

---

# Part C — Infographic Structure

Replace the current three-card layout with one integrated horizontal infographic.

The structure must be:

**Sistematik → Berperanan → Boleh dijejak**

## Required visual structure

- One continuous cyan/teal flow line running from left to right.
- Three main nodes placed along the same flow.
- Each node contains:
  - one icon badge;
  - one numbered badge (`1`, `2`, `3`);
  - one title;
  - one supporting text block.
- The nodes must feel connected as one journey, not as three detached cards.
- The flow line should begin at the far left with a small starting dot.
- The flow line should end at the far right with a clear arrowhead.
- The overall infographic should occupy the central horizontal area of the slide.
- Maintain generous breathing space.

## Required hierarchy

For each stage:
- icon is the visual anchor;
- number badge supports sequence recognition;
- title is prominent and cyan;
- body text is white or soft off-white;
- supporting text remains readable from a projector.

---

# Part D — Theme Adaptation

Match the main presentation style.

## Required colour direction

- deep navy-to-teal background;
- bright cyan for the flow line, icons, titles, and active accents;
- white or soft off-white for body text;
- subtle teal/green secondary accents only where useful;
- no orange, yellow, or unrelated colours from the original inspiration image.

## Required styling direction

- premium corporate presentation aesthetic;
- clean modern sans-serif typography;
- soft glow, not excessive neon;
- rounded linework and circular node containers;
- subtle vertical grid or background texture consistent with the deck;
- no extra decorative clutter;
- no independent card boxes around each step.

---

# Part E — Asset Generation

If custom SVG assets are needed, generate them and save them inside:

`assets/`

## Recommended SVG asset structure

Use separate assets where it improves animation control:

- `assets/relevan-flow-line.svg`
- `assets/icon-systematik.svg`
- `assets/icon-berperanan.svg`
- `assets/icon-boleh-dijejak.svg`

If needed, also separate the badge or node assets:

- `assets/relevan-node-1.svg`
- `assets/relevan-node-2.svg`
- `assets/relevan-node-3.svg`

## Preferred implementation approach

- Use SVG for the connector line and icons.
- Keep titles and body text as HTML text for sharp rendering and easier responsive control.
- Use CSS and vanilla JavaScript for animation.

Do not embed text inside SVG unless there is a strong technical reason.

---

# Part F — Slide Entry Animation

Autoplay the full infographic animation once when Slide 14 is entered.

Do not auto-loop.

The animation must progress strictly from left to right.

---

## Phase 1 — Flow line introduction

1. Show the starting dot at the far left.
2. Draw the cyan flow line from left to right toward Step 1.
3. Keep all three nodes hidden or subdued at this stage.

### Motion style
- use SVG stroke-dash animation or equivalent path reveal;
- smooth and controlled;
- no abrupt flashing;
- duration approximately `600–800ms`.

---

## Phase 2 — Step 1: Sistematik

When the line reaches Step 1:

1. Reveal the Step 1 circular icon node.
2. Reveal the number badge `1`.
3. Pulse the icon once with a subtle cyan glow.
4. Reveal the title **Sistematik**.
5. Reveal the supporting text progressively.
6. Hold briefly.

### Suggested supporting-text reveal
Reveal by line group or short phrase, not letter by letter.

Meaning:
The workflow no longer depends fully on personal memory or scattered messages.

---

## Phase 3 — Transition from Step 1 to Step 2

1. Continue drawing the connector line toward Step 2.
2. Move one subtle cyan signal or light pulse along the path.
3. Keep movement strictly left to right.
4. When the signal reaches Step 2, begin Step 2 activation.

---

## Phase 4 — Step 2: Berperanan

When the line reaches Step 2:

1. Reveal the Step 2 circular icon node.
2. Reveal the number badge `2`.
3. Pulse the icon once.
4. Reveal the title **Berperanan**.
5. Reveal the supporting text progressively.
6. Hold briefly.

Step 2 may receive slightly stronger emphasis because role-based responsibility is central to the slide message.

Meaning:
Each officer sees actions according to their responsibility.

---

## Phase 5 — Transition from Step 2 to Step 3

1. Continue drawing the connector line toward Step 3.
2. Move the cyan signal along the path.
3. Keep the motion calm and directional.
4. When the signal reaches Step 3, begin Step 3 activation.

---

## Phase 6 — Step 3: Boleh dijejak

When the line reaches Step 3:

1. Reveal the Step 3 circular icon node.
2. Reveal the number badge `3`.
3. Pulse the icon once.
4. Reveal the title **Boleh dijejak**.
5. Reveal the supporting text progressively.
6. Hold briefly.

Meaning:
Action records support transparency and work monitoring.

---

## Phase 7 — Final completion state

After Step 3 completes:

1. Draw the final connector segment toward the right arrowhead.
2. Pulse the right arrowhead once.
3. Run one subtle glow sweep across the complete path from left to right.
4. Keep all three nodes fully visible.
5. Hold the completed infographic in a stable state.

Do not continue animating after the final settle.

---

# Part G — Replay Control

Add a small replay / refresh icon.

## Placement
Place it discreetly:
- below the infographic near the lower-right; or
- aligned neatly with the infographic content area.

Do not interfere with the existing slide navigation controls.

## Behaviour
When clicked, the replay button must:

1. reset the flow line;
2. hide or reset the three nodes;
3. reset the icons, number badges, titles, and body text;
4. replay the full left-to-right sequence;
5. finish in the same stable completed state.

Do not auto-loop.

## Accessibility
- add an `aria-label`, for example: `Ulang animasi aliran relevan`;
- provide visible keyboard focus;
- support activation by keyboard.

---

# Part H — Required Polish Behaviours

The following are required.

## Polish 1 — One coherent journey
The infographic must feel like one connected workflow.

Do not recreate three independent cards.

---

## Polish 2 — Strict left-to-right animation
Every animated element must support the same direction:

**Step 1 → Step 2 → Step 3**

Do not reverse, bounce backward, or animate nodes in random order.

---

## Polish 3 — Step 2 receives slightly stronger emphasis
Step 2 represents role-based responsibility and is central to the slide message.

Give it slightly stronger emphasis through one of these controlled methods:
- slightly brighter icon glow;
- slightly stronger pulse;
- slightly stronger active ring.

Do not make it visually overpower Steps 1 and 3.

---

## Polish 4 — Text remains HTML-based
Keep the titles and body text in HTML where possible.

Reason:
- sharper projector rendering;
- easier responsive sizing;
- easier animation and accessibility;
- easier content maintenance.

---

## Polish 5 — Final state must stop completely
After the completion sweep:
- stop all motion;
- keep the infographic readable;
- no looping glow;
- no continuous floating;
- no repeated icon pulses.

---

# Part I — Timing Guidance

Recommended timing:

- flow-line intro: `0.0–0.8s`
- Step 1 reveal: `0.8–1.8s`
- transition to Step 2: `1.8–2.2s`
- Step 2 reveal: `2.2–3.2s`
- transition to Step 3: `3.2–3.6s`
- Step 3 reveal: `3.6–4.6s`
- final path, arrow pulse, and settle: `4.6–5.3s`

The full animation should take approximately five seconds.

Adjust slightly if needed, but preserve readability.

---

# Part J — Reduced Motion Behaviour

If `prefers-reduced-motion` is enabled:

- show the completed infographic immediately;
- show all three nodes and texts clearly;
- keep the connector line fully visible;
- disable path-drawing motion and pulses;
- keep the replay button available if appropriate, but replay should use minimal motion.

---

# Part K — Technical Requirements

- Use only HTML, CSS, SVG, and vanilla JavaScript.
- Do not install external animation libraries.
- Save any generated SVG files in `assets/`.
- Use transform, opacity, and SVG stroke animation for performance.
- Apply all modifications only to Slide 14.
- Do not alter global slide navigation.
- Restart the infographic animation whenever Slide 14 is entered.
- Stop and reset the animation when Slide 14 is exited.
- Ensure the design remains responsive in presentation and projector view.

---

# Part L — Do Not

Do not:
- retain the old three-card design;
- add the title `Transformasi Tindakan Pegawai`;
- add extra steps or labels;
- use orange or yellow accents;
- auto-loop the animation;
- use excessive neon or glow;
- place titles or body text inside low-resolution raster images;
- animate all three steps simultaneously;
- add decorative particles or unrelated effects.

---

# Storyboard — Slide 14 Relevan

## Frame 1 — Initial state
### Visible
- slide background and existing global UI;
- infographic hidden or subdued;
- starting dot appears at the far left.

### Meaning
The relevance journey is about to begin.

---

## Frame 2 — Line reaches Step 1
### Visible
- connector line draws toward the first node;
- Step 1 node appears;
- number `1`, icon, title, and body text reveal.

### Meaning
Work action becomes systematic.

---

## Frame 3 — Line travels to Step 2
### Visible
- cyan signal moves along the path;
- Step 1 remains completed;
- Step 2 activates when reached.

### Meaning
The process becomes role-based.

---

## Frame 4 — Step 2 active
### Visible
- number `2`, role icon, title, and body text;
- slightly stronger emphasis than the other nodes.

### Meaning
Each officer sees actions according to their responsibility.

---

## Frame 5 — Line travels to Step 3
### Visible
- cyan signal continues right;
- Step 1 and Step 2 remain completed;
- Step 3 activates when reached.

### Meaning
The workflow reaches traceability.

---

## Frame 6 — Step 3 active
### Visible
- number `3`, audit/search icon, title, and body text.

### Meaning
Actions can be traced and monitored.

---

## Frame 7 — Completed state
### Visible
- full flow line;
- all three nodes visible;
- arrowhead at the far right pulses once;
- one final glow sweep runs left to right;
- replay icon is available.

### Meaning
The three qualities form one coherent digital workflow.

---

## Final Note to Implementer

Treat the attached infographic as the intended visual structure.

The most important requirements are:
- remove the internal title;
- replace the old cards with one integrated three-step flow;
- preserve the exact three messages;
- animate strictly left to right;
- no auto-loop;
- add a manual replay icon;
- save generated SVG assets inside `assets/`.
