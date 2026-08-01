# INSTRUCTION FILE — SLIDE 16 SKOP

## Important filename note
This file is intentionally named **`slide16-skop.md`** to match the user’s requested naming convention.

The actual slide shown on screen is labelled:

`17 · SKOP`

Do not get confused by the filename.
This instruction applies to the slide with the headline:

**“Dibina untuk masalah sebenar. Dilaksanakan dalam skop sebenar.”**

---

# 1) Objective
Implement and animate the **Skop** slide in the existing HTML presentation.

The slide must communicate three things clearly:
1. LogKerja was created to solve a real operational problem.
2. The current implementation has a clearly defined real-world scope.
3. The same approach has potential to be adapted to other contexts facing similar challenges.

This slide is a **scope clarification slide**, not a process diagram and not a system-feature slide.

The animation must feel:
- confident;
- minimal;
- premium;
- clear;
- deliberate;
- suitable for a formal innovation presentation.

---

# 2) Exact slide content

## Slide label
`17 · SKOP`

## Section label
`KENYATAAN SKOP YANG TEPAT`

## Main headline
First line:
`Dibina untuk masalah sebenar.`

Second line:
`Dilaksanakan dalam skop sebenar.`

## Main scope statement
Use this revised sentence:

`Pelaksanaan semasa tertumpu kepada Pejabat Timbalan Dekan Penyelidikan & Antarabangsa, FPSK.`

Do not use the earlier wording:
`Pelaksanaan semasa adalah terhad kepada...`

The word **“tertumpu”** is intentional and must be retained.

## Secondary adaptability statement
Replace the old sentence completely with:

`LogKerja mempunyai potensi untuk disesuaikan dalam konteks lain yang menghadapi cabaran serupa.`

Do not include the previous clause about not claiming use at other PTJs or university level.

---

# 3) Source of truth
Use the following as the source of truth for this slide:
1. this instruction file;
2. the current implemented slide layout;
3. the attached slide reference image, if provided by the user.

Do not redesign the slide into a new infographic.
Do not introduce maps, organisational charts, branching diagrams, or feature icons.

The current visual concept is already appropriate:
- strong headline at upper-left;
- scope statement inside a large glass-style panel;
- secondary sentence positioned inside the same panel;
- dark navy background with cyan accent.

The task is to refine the text and implement the animation sequence below.

---

# 4) Overall visual direction
Keep the established presentation style:
- dark navy / near-black background;
- cyan accent;
- white high-contrast headline;
- premium corporate presentation aesthetic;
- large, readable typography;
- restrained glassmorphism panel;
- subtle cyan borders and highlights;
- no clutter.

The slide must feel like a moment of clarification and confidence.

---

# 5) Layout requirements
Maintain the existing overall composition.

## Upper-left content
- section label at the top;
- large white first headline;
- large cyan second headline;
- generous spacing between lines;
- no visual overlap.

## Scope panel
The panel remains below the headline and must contain:
- the main scope statement;
- a vertical cyan accent line on the left;
- the secondary adaptability statement near the bottom of the panel.

## Slide balance
Keep substantial negative space on the right side.
This negative space is intentional and supports the confident, minimal composition.

Do not fill the empty right side with decorative content.

---

# 6) Required DOM grouping
Structure the slide so every animation stage can be controlled separately.

Use an internal structure equivalent to:

- slide root
  - section label
  - headline group
    - headline line 1
    - headline line 2
  - scope panel
    - vertical cyan line
    - main scope statement group
      - line 1
      - line 2
      - line 3
    - secondary adaptability statement
    - subtle directional light sweep layer
  - presentation controls / existing navigation

Exact class names may follow the current project convention, but each animation target must remain separately controllable.

---

# 7) Motion design principles
The slide must use a restrained reveal sequence.

Do not use:
- typing effects;
- bouncing;
- elastic overshoot;
- rotating shapes;
- continuous looping;
- multiple decorative particles;
- aggressive glow effects.

Use:
- opacity;
- mask reveal;
- slight vertical movement;
- line drawing;
- one-time highlight sweep;
- smooth easing.

The visual story must progress from:

**problem reality → implementation scope → adaptability potential**

---

# 8) Locked animation concept
Implement the animation as a **Scope Clarification Reveal**.

The sequence is fixed:
1. section label;
2. first headline;
3. second headline;
4. scope panel and main scope statement;
5. adaptability statement;
6. subtle visual expansion cue inside the panel.

Do not change the order.

---

# 9) Initial state
When the slide becomes active:
- all animated elements start hidden or softly subdued;
- no element should flash into view;
- the background and presentation controls remain stable;
- the right side remains intentionally empty.

Use initial states based on:
- `opacity: 0`;
- slight `translateY` offsets;
- clipped / masked text reveal;
- vertical line height set to zero before drawing.

---

# 10) Exact animation sequence and timing
The full animation must complete in approximately **3.4 seconds**.

## Phase 1 — section label reveal
**0.00s–0.35s**

Animate:
`KENYATAAN SKOP YANG TEPAT`

Required behavior:
- fade in;
- slight upward movement;
- one subtle cyan highlight pass from left to right;
- settle immediately after reveal.

The label must remain small and secondary.

---

## Phase 2 — first headline reveal
**0.35s–1.10s**

Animate:
`Dibina untuk masalah sebenar.`

Required behavior:
- left-to-right mask reveal;
- slight upward movement from approximately 12–16px below;
- smooth easing;
- no glow pulse;
- full white high-contrast final state.

This line must establish that LogKerja was created from a real operational problem.

---

## Phase 3 — second headline reveal
**1.10s–1.95s**

Animate:
`Dilaksanakan dalam skop sebenar.`

Required behavior:
- reveal the first line segment `Dilaksanakan dalam`;
- reveal `skop sebenar.` approximately 100–150ms later;
- use cyan accent for the entire second headline as currently designed;
- run one restrained highlight sweep through the phrase `skop sebenar.`;
- settle into a stable final state.

The second headline is the main visual emphasis of the slide.

---

## Phase 4 — scope panel reveal
**1.95s–2.75s**

Animate the full scope panel.

Required panel behavior:
- fade in;
- move upward from approximately 18–20px below;
- border and panel surface appear smoothly;
- the panel must not scale dramatically.

### Vertical cyan line
Draw the vertical cyan line from top to bottom.

### Main statement reveal
Reveal the sentence in three controlled line groups:

1. `Pelaksanaan semasa tertumpu kepada`
2. `Pejabat Timbalan Dekan Penyelidikan &`
3. `Antarabangsa, FPSK.`

Required behavior:
- reveal by line, not by individual letters;
- each line appears with a short stagger;
- keep the body text large and readable;
- maintain strong contrast against the panel.

---

## Phase 5 — adaptability statement reveal
**2.75s–3.40s**

Animate:

`LogKerja mempunyai potensi untuk disesuaikan dalam konteks lain yang menghadapi cabaran serupa.`

Required behavior:
- fade in;
- slight upward movement;
- keep it visually secondary to the main scope statement;
- use a calmer, smaller typography treatment;
- apply a subtle cyan emphasis to the phrase:
  `potensi untuk disesuaikan`

The emphasis must remain restrained and readable.

Do not make the entire sentence cyan.

---

# 11) Required additional visual cue
Include the additional visual treatment described below.

This is mandatory.

## Meaning
The panel must visually suggest:

**the implementation begins within a defined scope, but the approach has room to extend into other similar contexts.**

## Implementation
After the main scope statement has appeared and as the adaptability statement begins:
- keep the vertical cyan line fully active on the left;
- animate one soft cyan light sweep starting from the left-side vertical line;
- move the light gently toward the lower-right area of the panel;
- let it fade before reaching the far edge;
- run this sweep only once.

The sweep must feel like a subtle transition from:

**current defined scope → future adaptability potential**

Do not turn this into a literal arrow.
Do not add branches, map pins, external nodes, or expansion icons.

The effect must remain abstract, elegant, and minimal.

---

# 12) Final resting state
After approximately 3.4 seconds:
- all content remains fully visible;
- the slide becomes completely stable;
- no continuous animation remains;
- the cyan accents remain softly illuminated;
- the scope panel remains readable without motion.

Do not add ambient looping movement to this slide.

This slide must settle fully because it supports a verbal clarification moment.

---

# 13) Replay and slide lifecycle behavior
Follow the presentation’s existing animation lifecycle.

## On slide entry
Play the animation once automatically.

## Replay
Connect the slide to the presentation’s existing replay / refresh mechanism.

## Re-entry
If the presenter leaves the slide and later returns:
- reset all animated states;
- replay the sequence from the beginning.

## Skip behavior
If navigation is triggered before the animation finishes:
- complete the remaining slide animation immediately;
- place the slide into its final stable state;
- allow the next navigation input to move to the next slide.

Do not trap the presenter inside the animation.

---

# 14) Typography requirements
Maintain projector-safe readability.

## Section label
- uppercase;
- cyan;
- spaced letters;
- small but clearly readable.

## First headline
- large;
- bold;
- white;
- visually dominant.

## Second headline
- large;
- bold;
- cyan;
- equal or slightly stronger impact than the first line.

## Main scope statement
- large body text;
- clear line spacing;
- high contrast;
- no excessive bolding.

## Secondary statement
- smaller than the main statement;
- lighter visual weight;
- still readable on a projector;
- phrase emphasis must not reduce readability.

---

# 15) Panel polish requirements
The panel should feel premium and restrained.

Apply:
- translucent dark fill;
- soft border;
- subtle inner depth;
- restrained cyan accent line;
- clean padding;
- generous spacing between main and secondary statements.

Do not add:
- heavy glow;
- bright gradient fills;
- large shadows;
- multiple borders;
- decorative icons.

---

# 16) Responsiveness and fit
Ensure the slide holds cleanly at the presentation’s target aspect ratio.

Required behavior:
- no clipping;
- no text overflow;
- no collision between headline and panel;
- no collision with navigation controls;
- sufficient safe margin at the top and left;
- panel remains fully visible above the lower presentation controls.

The right-side negative space must remain intact.

---

# 17) Performance requirement
Use efficient animation techniques.

Prefer:
- `transform`;
- `opacity`;
- CSS masking / clipping;
- SVG or CSS line drawing for the cyan vertical rule;
- one lightweight pseudo-element for the light sweep.

Avoid:
- layout-thrashing animation;
- unnecessary timers;
- heavy canvas rendering;
- repeated DOM measurement during animation.

The animation must remain smooth on presentation hardware.

---

# 18) Things that must not happen
Do not:
- redesign the slide;
- add a diagram on the right;
- add maps or organisational structures;
- introduce multiple options;
- change the approved wording;
- reinsert the removed disclaimer about other PTJs or university-level use;
- change `tertumpu` back to `terhad`;
- animate text letter by letter;
- add looping animation;
- overemphasize the secondary sentence;
- make the slide look defensive.

The slide must feel clear, positive, and strategically scoped.

---

# 19) Final intended narrative
The completed slide must visually and verbally support this message:

**LogKerja was built to solve a real operational problem and has been implemented within a real, clearly defined scope. Although the current implementation is focused on the Pejabat Timbalan Dekan Penyelidikan & Antarabangsa, FPSK, the approach has potential to be adapted to other contexts facing similar challenges.**

---

# 20) Deliverable expectation
Implement the slide directly in the presentation codebase.

Do not return with alternative concepts.
Do not ask the user to choose between animation styles.
Do not provide optional versions.

Follow this instruction exactly and preserve the existing presentation’s visual and technical conventions.
