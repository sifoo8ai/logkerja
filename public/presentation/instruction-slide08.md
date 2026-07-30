# Slide 08 — Complete Animation Instruction

## Objective

Enhance **Slide 08** with a clear, directional animation that communicates a **single document journey** through the relevant roles, followed by the supporting functions that make the process visible, responsive, and traceable.

The slide should communicate this idea:

> Every party sees only the action relevant to their responsibility, while the system supports the journey through dashboard visibility, notifications, and audit traceability.

The animation must feel structured, calm, professional, and easy to follow during a live presentation.

Do not change the existing:

- slide background;
- headline wording;
- typography style;
- colour palette;
- top-right slide label;
- bottom navigation;
- overall visual identity.

---

# Part A — Slide Entry and Headline Reveal

Whenever the presenter enters Slide 08, restart the full entrance sequence from the beginning.

## 1. Section label reveal

Reveal:

> SATU PERJALANAN DOKUMEN

Animation:

- fade in;
- slight upward movement;
- duration approximately `350–450ms`;
- use a smooth `ease-out`.

## 2. Headline reveal

Reveal the headline in two visual beats:

### Beat 1

> Setiap pihak melihat

### Beat 2

> tindakan yang relevan.

Animation behaviour:

- each line fades in with a slight upward movement;
- stagger the second line by approximately `180–240ms`;
- the cyan line **“tindakan yang relevan.”** appears last;
- briefly increase its brightness or cyan intensity when the reveal completes;
- do not continuously animate the headline after the entrance sequence.

The headline should feel confident and deliberate, not dramatic or flashy.

---

# Part B — Role Flow Animation

The role flow contains three role pills:

1. **Penyemak**
2. **Pengesah**
3. **Pelulus**

The role flow must animate in one direction only:

> Penyemak → Pengesah → Pelulus

The animation should communicate that the document moves through a defined responsibility path.

## Initial state

Before the role flow begins:

- all three role pills are visible but inactive or slightly dimmed;
- arrows are visible but subdued;
- no signal tracer is active;
- no role is highlighted.

## Step 1 — Penyemak activation

1. Activate the **Penyemak** pill first.
2. Apply a subtle cyan pulse or brightness emphasis.
3. A small cyan signal tracer appears near the centre or right edge of the Penyemak pill.
4. Keep the motion restrained and professional.

Meaning:

> The document journey begins at the reviewer stage.

## Step 2 — Signal moves to Pengesah

1. Animate the cyan tracer moving from **Penyemak** toward **Pengesah**.
2. The direction must remain strictly left to right.
3. As the tracer passes through the arrow:
   - briefly brighten or fill the arrow in cyan;
   - return the arrow to its normal completed state after the tracer passes.
4. When the tracer reaches **Pengesah**:
   - pulse or brighten the Pengesah pill;
   - keep Penyemak visible as a completed step with slightly lower emphasis.

Meaning:

> The action progresses to the validation stage.

## Step 3 — Signal moves to Pelulus

1. Animate the tracer from **Pengesah** toward **Pelulus**.
2. As it passes through the second arrow:
   - briefly brighten or fill the arrow in cyan;
   - preserve the left-to-right direction.
3. When the tracer reaches **Pelulus**:
   - pulse or brighten the Pelulus pill;
   - keep Penyemak and Pengesah visible as completed stages;
   - allow the full role journey to settle into a connected completed state.

Meaning:

> The document reaches the final responsible role in the journey.

## Role flow completion state

After the signal reaches Pelulus:

- all three role pills remain visible;
- all arrows remain visible;
- the role journey appears complete;
- no reverse animation occurs;
- no continuous tracer loop occurs.

Hold this state briefly before revealing the supporting function cards.

---

# Part C — Supporting Function Cards

The bottom section contains three supporting function cards:

1. **Dashboard**
2. **Notifikasi**
3. **Jejak audit**

These cards must not appear simultaneously.

They should reveal sequentially from **left to right** after the role flow has completed.

The order must be:

> Dashboard → Notifikasi → Jejak audit

All three cards should retain their existing wording and visual style.

## Card 1 — Dashboard

Reveal **Dashboard** first.

Animation:

- fade in;
- slight upward movement;
- title brightens first;
- subtext fades in immediately after;
- optionally apply one subtle horizontal glow sweep across the card.

Meaning:

> A central dashboard provides a single view of the current action status.

## Card 2 — Notifikasi

Reveal **Notifikasi** second, after Dashboard has settled.

Animation:

- fade in;
- slight upward movement;
- title brightens;
- subtext fades in;
- optionally apply one subtle pulse or notification ping effect.

Meaning:

> Notifications draw attention to actions that require a response.

## Card 3 — Jejak audit

Reveal **Jejak audit** last.

Animation:

- fade in;
- slight upward movement;
- title brightens;
- subtext fades in;
- optionally apply one subtle trace or scan-line effect across the card.

Meaning:

> The audit trail records the action, the person responsible, and the time of action.

## Bottom-card completion state

After all three cards are revealed:

- all cards remain visible;
- all text remains fully readable;
- no card continues pulsing or moving;
- the slide settles into a calm, completed state.

---

# Part D — Final State and Manual Replay Control

After the entire sequence completes:

- keep the role flow visible;
- keep Dashboard, Notifikasi, and Jejak audit visible;
- stop all automatic animation;
- do not loop the sequence continuously.

## Replay / Refresh control

Add a small refresh or replay icon button beneath the supporting cards, aligned neatly with the animated content area.

Recommended placement:

- centered beneath the three bottom cards; or
- aligned discreetly near the lower-right edge of the animated content block.

The control should:

- use a subtle presentation-friendly style;
- not compete visually with the slide navigation;
- include a hover state;
- include a keyboard focus state;
- include an accessible `aria-label`, for example:

```html
aria-label="Ulang animasi aliran kerja"
```

## Replay behaviour

When the replay button is clicked:

1. reset the role flow to its initial inactive state;
2. reset the cyan tracer and arrows;
3. reset the Dashboard, Notifikasi, and Jejak audit cards;
4. replay the role flow from Penyemak to Pengesah to Pelulus;
5. reveal the bottom cards again from left to right;
6. return to the completed stable state.

Do not replay:

- the section label;
- the headline reveal;
- the global slide transition.

The replay control should replay only the role flow and supporting function cards.

---

# Part E — Recommended Timing

Suggested timing sequence:

- Section label: `0.0–0.4s`
- Headline Beat 1: `0.2–0.8s`
- Headline Beat 2: `0.5–1.1s`
- Role row reveal: `1.1–1.5s`
- Penyemak activation: `1.5–2.1s`
- Signal to Pengesah: `2.1–2.8s`
- Pengesah activation: `2.8–3.3s`
- Signal to Pelulus: `3.3–4.0s`
- Pelulus activation and hold: `4.0–4.7s`
- Dashboard reveal: `4.7–5.3s`
- Notifikasi reveal: `5.3–5.9s`
- Jejak audit reveal: `5.9–6.5s`
- Completed state: hold indefinitely until the presenter changes slide or clicks replay.

Timing may be adjusted slightly to fit the current presentation framework, but the sequence and left-to-right logic must remain unchanged.

---

# Part F — Important Visual Clarifications

- The role flow must move in one direction only: left to right.
- The tracer must not reverse direction.
- The role pills must not activate simultaneously.
- Each next role activates only when the tracer reaches it.
- The arrows should briefly brighten or fill when the tracer passes through them.
- The three bottom cards must reveal from left to right.
- Dashboard must appear first.
- Notifikasi must appear second.
- Jejak audit must appear last.
- Do not continuously loop the slide animation.
- The final state should remain stable for reading.
- Avoid bouncing, spinning, flashing, excessive particles, or strong glow.
- The motion should feel clear, calm, premium, and suitable for a formal competition presentation.

---

# Part G — Technical Requirements

- Use only HTML, CSS, and vanilla JavaScript.
- Do not use external animation libraries.
- Reuse the current slide structure where possible.
- Apply changes only to Slide 08.
- Do not modify the global slide navigation.
- Use `transform` and `opacity` for smooth performance.
- Restart the full entrance sequence whenever Slide 08 is entered.
- Stop and reset the sequence when Slide 08 is exited.
- The replay button must remain available after the first completed run.
- Support `prefers-reduced-motion`.

For reduced-motion users:

- show the completed role flow immediately;
- show all three bottom cards immediately;
- disable tracer travel and motion-heavy effects;
- allow the replay button to re-establish the completed state with minimal or no animation.

---

# Storyboard — Slide 08

## Frame 1 — Section label enters

Visible:

- section label appears;
- headline has not fully appeared;
- role flow is still inactive;
- bottom cards are hidden.

Meaning:

> The audience is introduced to the idea of one document journey.

## Frame 2 — Headline reveal

Visible:

- “Setiap pihak melihat” appears first;
- “tindakan yang relevan.” appears second in cyan;
- role flow remains idle.

Meaning:

> The core principle is understood before the process begins.

## Frame 3 — Role row appears

Visible:

- Penyemak;
- Pengesah;
- Pelulus;
- arrows between them.

All roles appear slightly inactive.

Meaning:

> The full responsibility path is visible.

## Frame 4 — Penyemak active

Visible:

- Penyemak pulses or brightens;
- cyan tracer appears near Penyemak;
- Pengesah and Pelulus remain inactive.

Meaning:

> The document journey begins.

## Frame 5 — Signal reaches Pengesah

Visible:

- tracer moves right;
- first arrow briefly fills or brightens;
- Pengesah pulses when reached;
- Penyemak remains completed.

Meaning:

> The action moves to the validation stage.

## Frame 6 — Signal reaches Pelulus

Visible:

- tracer moves right again;
- second arrow briefly fills or brightens;
- Pelulus pulses when reached;
- the full role journey is now complete.

Meaning:

> The document reaches the final responsible role.

## Frame 7 — Dashboard appears

Visible:

- Dashboard card fades upward into view;
- its title brightens;
- its subtext appears.

Meaning:

> Status is visible in one central view.

## Frame 8 — Notifikasi appears

Visible:

- Notifikasi card appears to the right of Dashboard;
- a subtle ping effect occurs once;
- its subtext appears.

Meaning:

> Required actions are brought to the user’s attention.

## Frame 9 — Jejak audit appears

Visible:

- Jejak audit card appears last;
- a subtle trace or scan effect occurs once;
- its subtext appears.

Meaning:

> Actions, users, and timestamps are recorded and traceable.

## Frame 10 — Completed state

Visible:

- full role flow completed;
- Dashboard visible;
- Notifikasi visible;
- Jejak audit visible;
- replay icon visible beneath the animated content.

Motion:

- all animation stops;
- slide remains stable for reading.

Meaning:

> Every party sees the relevant action, supported by visibility, notification, and traceability.

---

# Final Behaviour Summary

```text
Enter Slide 08
→ reveal section label
→ reveal headline
→ reveal role row
→ activate Penyemak
→ move tracer to Pengesah
→ move tracer to Pelulus
→ reveal Dashboard
→ reveal Notifikasi
→ reveal Jejak audit
→ hold completed state
→ replay only when refresh button is clicked
```

