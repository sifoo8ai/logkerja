# Slide 07 — Complete Animation Instruction

## Objective

Enhance **Slide 07** with a clear and structured **vertical process pipeline animation**.

The slide should communicate the transformation:

> from a passive record into a guided, trackable action flow.

The animation must feel calm, controlled, progressive, and successful. It should contrast with Slide 06, where the signal fails at the action gap.

Do not change the existing:

* slide background;
* left-side wording;
* typography style;
* colour palette;
* top-right slide label;
* bottom navigation;
* overall visual identity.

The current single card on the right should be replaced with **three equal-sized process cards**, stacked vertically.

---

# Part A — Slide Entry Animation

Whenever the presenter enters Slide 07, restart the animation from the beginning.

## 1. Section label reveal

Reveal:

> PRINSIP PENYELESAIAN

Animation:

* fade in;
* slight upward movement;
* duration approximately `350–450ms`;
* use a smooth `ease-out`.

---

## 2. Headline reveal

Reveal the headline progressively in three visual beats:

### Beat 1

> Daripada

### Beat 2

> rekod kepada

### Beat 3

> tindakan.

Animation behaviour:

* each line fades in with a slight upward movement;
* stagger each line by approximately `150–220ms`;
* the cyan word **“tindakan.”** appears last;
* briefly increase the brightness or cyan intensity of “tindakan.” when it completes;
* do not continuously animate the headline after the entrance sequence.

The headline reveal should feel deliberate and confident, not dramatic or flashy.

---

## 3. Supporting paragraph reveal

After the headline is fully visible, reveal:

> LogKerja mengarah tindakan kepada pihak yang bertanggungjawab, bukan sekadar memaparkan maklumat.

Animation:

* fade in;
* slight upward movement;
* delay approximately `150–250ms` after the headline;
* duration approximately `400–500ms`.

After the paragraph finishes, begin the process pipeline animation on the right.

---

# Part B — Right-Side Process Pipeline

## Layout

Replace the current single right-side card with **three separate equal-sized cards**, vertically stacked.

The three cards are:

### Card 1

**Dokumen didaftarkan**
Maklumat masuk ke aliran tindakan.

### Card 2

**Peranan yang tepat dimaklumkan**
Tindakan disalurkan mengikut tanggungjawab.

### Card 3

**Tindakan direkodkan**
Status dan sejarah tindakan boleh ditelusuri.

Each card must contain:

* a numbered cyan circle;
* step title;
* supporting subtext.

Cards must have:

* identical dimensions;
* consistent internal padding;
* equal vertical spacing;
* alignment with the current design system;
* enough room for projector readability.

The numbered circles should form one clear vertical axis.

---

# Initial State

Before the pipeline begins:

* Card 1 is hidden;
* Card 2 is hidden;
* Card 3 is hidden;
* connector lines are hidden;
* no pulse is active.

Once the supporting paragraph finishes, Card 1 appears.

---

# Part C — Pipeline Animation Sequence

## Step 1 — Card 1 activation

### 1. Card 1 appears

Card 1 enters in an inactive state.

Inactive state:

* slightly reduced opacity;
* title less bright;
* subtext hidden;
* numbered circle visible but subdued;
* subtle upward movement during entrance.

Suggested appearance:

* opacity: `0 → 0.65`;
* translateY: `10px → 0`;
* duration: approximately `350–450ms`.

---

### 2. Number 1 activates

After Card 1 settles:

* number circle `1` pulses cyan;
* use a soft expansion and glow;
* do not use rapid blinking.

Suggested pulse:

* scale `1 → 1.15 → 1`;
* brief cyan glow;
* duration approximately `500–650ms`.

---

### 3. Card 1 content activates

Immediately after the first pulse:

* title **“Dokumen didaftarkan”** becomes brighter and slightly bolder;
* supporting subtext fades in;
* card opacity increases to the fully active state.

The activation should communicate:

> the document has entered the action workflow.

---

### 4. Card 1 completion pulse

After the title and subtext are fully visible:

* number `1` pulses once again;
* this second pulse signals that Step 1 is complete.

Immediately after this completion pulse, begin the connector animation toward Card 2.

---

## Connector 1 → 2

A thin cyan line grows downward from the vertical centre of number `1`.

The line should:

* start beneath the number `1` circle;
* grow vertically downward;
* remain aligned with the numbered circles;
* stop at number `2`;
* visually touch number `2`.

Animation:

* use `scaleY` or height growth;
* transform origin at the top;
* duration approximately `450–650ms`;
* use a smooth linear or ease-in-out movement.

Card 2 should not appear before the line reaches its position.

---

## Step 2 — Card 2 activation

### 1. Card 2 appears

When the descending cyan line reaches number `2`:

* Card 2 appears in an inactive state;
* number `2` is visible;
* title is dimmed;
* subtext remains hidden.

Use the same entrance style as Card 1.

---

### 2. Number 2 activates

As the connector touches number `2`:

* number `2` pulses cyan;
* briefly brighten the connecting point;
* the transition should feel like a signal being transferred.

---

### 3. Card 2 content activates

After the pulse:

* title **“Peranan yang tepat dimaklumkan”** becomes brighter and slightly bolder;
* supporting subtext fades in;
* Card 2 moves into its fully active state.

The activation should communicate:

> the action is routed to the correct responsible role.

---

### 4. Card 2 completion pulse

After Card 2 content fully appears:

* number `2` pulses once more;
* this marks the completion of Step 2.

Then begin the connector animation toward Card 3.

---

## Connector 2 → 3

A second thin cyan line grows downward from number `2` to number `3`.

Apply the same behaviour as the first connector:

* vertically aligned;
* grows from top to bottom;
* reaches number `3`;
* triggers Card 3 only when contact is made.

---

## Step 3 — Card 3 activation

### 1. Card 3 appears

When the second cyan line reaches number `3`:

* Card 3 appears in its inactive state;
* title is dimmed;
* subtext hidden;
* number `3` visible but subdued.

---

### 2. Number 3 activates

As the connector reaches number `3`:

* number `3` pulses cyan;
* the pulse visually confirms successful arrival at the final stage.

---

### 3. Card 3 content activates

After the pulse:

* title **“Tindakan direkodkan”** becomes brighter and slightly bolder;
* supporting subtext fades in;
* Card 3 reaches full opacity.

The activation should communicate:

> the action and its history are now recorded and traceable.

---

### 4. Pipeline completion state

After Card 3 is fully active:

* all three cards remain visible;
* all connector lines remain visible;
* all titles and subtexts remain readable;
* all number circles remain cyan;
* the entire pipeline appears complete and stable.

Optionally:

* apply a very subtle cyan glow travelling once from number `1` to number `3`;
* or gently brighten all three number circles together once.

Do not repeatedly flash all elements.

Hold the completed state for approximately `2–3 seconds`.

---

# Part D — Loop Behaviour

After the completed state hold:

1. Fade the three cards and connector lines back to their initial hidden state.
2. Pause briefly for approximately `400–700ms`.
3. Restart the pipeline from Card 1.
4. Do not replay the headline reveal during the loop.

Only the right-side process pipeline should loop.

The slide entry sequence should behave like this:

```text
Slide entered
→ section label
→ headline
→ paragraph
→ pipeline begins
→ pipeline completes
→ pipeline holds
→ pipeline resets
→ pipeline loops
```

The headline, paragraph, and section label remain static after their first reveal.

---

# Timing Guidance

Recommended overall timing:

* Section label: `0.0–0.4s`
* Headline Beat 1: `0.2–0.7s`
* Headline Beat 2: `0.45–0.95s`
* Headline Beat 3: `0.7–1.2s`
* Supporting paragraph: `1.1–1.6s`
* Card 1 activation: `1.7–3.0s`
* Connector 1 → 2: `3.0–3.6s`
* Card 2 activation: `3.6–4.9s`
* Connector 2 → 3: `4.9–5.5s`
* Card 3 activation: `5.5–6.8s`
* Completed-state hold: `6.8–9.0s`
* Reset and repeat pipeline

These timings may be adjusted slightly to match the presentation framework, but the sequence must remain clear.

---

# Important Visual Clarifications

* The three cards must not appear simultaneously.
* Card 2 only appears when the connector from Card 1 reaches number `2`.
* Card 3 only appears when the connector from Card 2 reaches number `3`.
* The cyan connector line is part of the storytelling, not merely decoration.
* The visual direction must always move from top to bottom.
* Every numbered circle has two pulses:

  * first pulse: step activation;
  * second pulse: step completion and handoff to the next step.
* The cards must remain equal in size.
* Avoid bouncing, spinning, flashing, particles, or exaggerated glow.
* The completed pipeline should feel organised, reliable, and traceable.

---

# Technical Requirements

* Use only HTML, CSS, and vanilla JavaScript.
* Do not install external animation libraries.
* Use CSS transforms and opacity for smooth performance.
* Avoid changing the global slide navigation.
* Apply all modifications only to Slide 07.
* Restart the full entry animation whenever Slide 07 is entered.
* Stop or reset animation when Slide 07 is exited.
* Support `prefers-reduced-motion`.
* For reduced-motion users:

  * reveal all content without animated movement;
  * retain the completed pipeline state;
  * disable the repeating loop.

---

# Storyboard — Slide 07

## Frame 1 — Slide entry

### Visible

* section label begins appearing;
* no right-side cards yet.

### Motion

* label fades upward gently.

### Visual meaning

The solution section is beginning.

---

## Frame 2 — Headline reveal

### Visible

* “Daripada”
* followed by “rekod kepada”
* followed by cyan “tindakan.”

### Motion

* each line appears sequentially;
* “tindakan.” receives a brief cyan emphasis.

### Right side

* still empty.

### Visual meaning

The audience first understands the central principle before seeing the mechanism.

---

## Frame 3 — Supporting statement

### Visible

* full headline;
* supporting paragraph fades in.

### Right side

* still empty or prepared for Card 1.

### Visual meaning

LogKerja is framed as a system that directs responsibility, not merely displays information.

---

## Frame 4 — Card 1 idle

### Visible

* Card 1 appears;
* number `1` is subdued;
* title visible but dim;
* subtext hidden;
* Cards 2 and 3 absent.

### Visual arrangement

```text
┌─────────────────────────────────┐
│  1   Dokumen didaftarkan        │
│      [subtext hidden]            │
└─────────────────────────────────┘
```

### Visual meaning

The first process stage is present but has not yet activated.

---

## Frame 5 — Card 1 active

### Visible

* number `1` pulses cyan;
* title brightens;
* subtext fades in;
* Card 1 becomes fully active.

```text
┌─────────────────────────────────┐
│ (1)  Dokumen didaftarkan        │
│      Maklumat masuk ke aliran   │
│      tindakan.                  │
└─────────────────────────────────┘
```

### Visual meaning

The document has entered the workflow.

---

## Frame 6 — Handoff from Card 1

### Visible

* number `1` pulses again;
* cyan line grows downward;
* Card 2 has not appeared yet.

```text
┌─────────────────────────────────┐
│ (1)  Dokumen didaftarkan        │
│      Maklumat masuk ke aliran   │
│      tindakan.                  │
└─────────────────────────────────┘
              │
              │ cyan line growing
              ▼
```

### Visual meaning

Step 1 is complete, and the process is being transferred to the next stage.

---

## Frame 7 — Card 2 idle

### Visible

* connector reaches number `2`;
* Card 2 appears dimmed;
* number `2` is ready to activate;
* Card 3 remains absent.

```text
┌─────────────────────────────────┐
│ (1)  Dokumen didaftarkan        │
│      Maklumat masuk ke aliran   │
│      tindakan.                  │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  2   Peranan yang tepat         │
│      dimaklumkan                │
│      [subtext hidden]           │
└─────────────────────────────────┘
```

### Visual meaning

The action has reached the responsible-role stage.

---

## Frame 8 — Card 2 active

### Visible

* number `2` pulses cyan;
* title brightens;
* subtext fades in;
* Card 2 reaches its active state.

```text
┌─────────────────────────────────┐
│ (1)  Dokumen didaftarkan        │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│ (2)  Peranan yang tepat         │
│      dimaklumkan                │
│      Tindakan disalurkan        │
│      mengikut tanggungjawab.    │
└─────────────────────────────────┘
```

### Visual meaning

The correct role has been informed.

---

## Frame 9 — Handoff from Card 2

### Visible

* number `2` pulses again;
* second cyan line grows downward;
* Card 3 remains hidden until the line reaches it.

```text
┌─────────────────────────────────┐
│ (2)  Peranan yang tepat         │
│      dimaklumkan                │
└─────────────────────────────────┘
              │
              │ cyan line growing
              ▼
```

### Visual meaning

Step 2 is complete, and the action proceeds to recording and traceability.

---

## Frame 10 — Card 3 idle

### Visible

* connector reaches number `3`;
* Card 3 appears in an inactive state;
* title dimmed;
* subtext hidden.

```text
┌─────────────────────────────────┐
│  3   Tindakan direkodkan        │
│      [subtext hidden]           │
└─────────────────────────────────┘
```

### Visual meaning

The final process stage has been reached but has not yet activated.

---

## Frame 11 — Card 3 active

### Visible

* number `3` pulses cyan;
* title brightens;
* subtext fades in;
* Card 3 becomes fully active.

```text
┌─────────────────────────────────┐
│ (3)  Tindakan direkodkan        │
│      Status dan sejarah         │
│      tindakan boleh ditelusuri. │
└─────────────────────────────────┘
```

### Visual meaning

The action is recorded and traceable.

---

## Frame 12 — Completed pipeline

### Visible

All three cards and connectors are fully visible.

```text
┌─────────────────────────────────┐
│ (1)  Dokumen didaftarkan        │
│      Maklumat masuk ke aliran   │
│      tindakan.                  │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│ (2)  Peranan yang tepat         │
│      dimaklumkan                │
│      Tindakan disalurkan        │
│      mengikut tanggungjawab.    │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│ (3)  Tindakan direkodkan        │
│      Status dan sejarah         │
│      tindakan boleh ditelusuri. │
└─────────────────────────────────┘
```

### Motion

* optional subtle completion glow;
* hold for 2–3 seconds;
* reset the right-side pipeline;
* restart from Card 1.

### Visual meaning

The record has successfully become a structured and traceable action flow.

---

Ini dah cukup rigid untuk ejen ikut flow tanpa dia improvise jadi “tiga kad muncul sambil menari zapin.”
