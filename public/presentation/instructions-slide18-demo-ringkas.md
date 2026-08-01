# INSTRUCTION FILE — SLIDE 18 DEMO RINGKAS

## Important numbering note
This file is intentionally named **`instructions-slide18-demo-ringkas.md`** because the new demo slide is inserted after the current Signifikan slide and before the current Penutup slide.

After insertion:

- the presentation navigation index becomes **19 scenes in total**;
- the new demo scene becomes **navigation item 18**;
- the current Penutup scene becomes **navigation item 19**;
- the visible screen label for the new demo slide becomes **`19 · DEMO RINGKAS`**;
- the visible screen label for the closing slide must be updated from **`19 · PENUTUP`** to **`20 · PENUTUP`**.

Do not confuse the internal/navigation scene number with the visible slide label.

---

# 1) Objective
Add one **optional interactive demo slide** immediately after the Signifikan slide and immediately before the Penutup slide.

The slide must allow the presenter to launch the Supademo walkthrough without leaving the HTML presentation.

The slide must also remain safe to skip completely when presentation time is limited.

This slide must communicate one clear message:

**A record from Putra Finance can be converted into a registered, categorized and monitorable action in LogKerja.**

---

# 2) Placement in the deck
Insert the new slide in this exact position:

1. current Signifikan slide;
2. **new Demo Ringkas slide**;
3. current Penutup slide.

Do not place the demo after the closing slide.
Do not make the demo part of the closing slide.

---

# 3) Exact slide content

## Visible slide label
`19 · DEMO RINGKAS`

## Section label
`DEMO RINGKAS`

## Main headline
`Daripada Putra Finance kepada tindakan dalam LogKerja.`

## Supporting text
`Lihat bagaimana nombor rujukan daripada Putra Finance didaftarkan, dikategorikan dan dipantau melalui satu aliran tindakan yang lebih jelas.`

## Demo duration badge
`PILIHAN · ± 60 SAAT`

## Primary button
`MULAKAN DEMO`

## Backup video control
`VIDEO SANDARAN`

## Small presenter note
`Gunakan hanya jika masa mengizinkan.`

---

# 4) Core visual direction
Maintain the established presentation style:

- dark navy / near-black background;
- cyan accent;
- premium corporate presentation look;
- translucent dark panels;
- refined glow;
- clean spacing;
- strong projector readability.

The slide must feel like a short transition from presentation mode into product demonstration mode.

It must not look like a generic website landing page.
It must not look like a software tutorial cover disconnected from the deck.

---

# 5) Required composition
Use a two-column layout.

## Left column — message and controls
Place the following in order:

1. section label;
2. main headline;
3. supporting text;
4. duration badge;
5. primary demo button;
6. smaller backup-video control;
7. presenter note.

The left column should occupy approximately **38%–42%** of the slide width.

## Right column — preview frame
Place a browser-style preview mockup using the Supademo cover image / a representative screenshot of the demo.

The preview frame should occupy approximately **58%–62%** of the slide width.

Use:

- rounded browser frame;
- subtle border;
- dark shadow;
- cyan edge light;
- minimal browser chrome;
- one clear preview image showing the ERP-to-LogKerja workflow.

Do not embed the full live Supademo inside the slide body.
The live demo must open as a popup overlay only after the presenter activates the button.

---

# 6) Preview visual treatment
The preview frame must show enough context to make the workflow recognizable.

Preferred preview content:

- Putra Finance / ERP source record;
- LogKerja interface;
- browser-frame presentation;
- clear visual implication of record moving into action.

Add one subtle visual connector between the ERP source and LogKerja destination inside the preview composition:

- a thin cyan path;
- a small directional arrow;
- or a restrained light transfer line.

This connector must remain subtle and premium.
Do not create a large diagram on top of the preview.

---

# 7) Supademo integration
Use **Popup Embed**, not Inline Embed.

Load the Supademo script once in the presentation document:

```html
<script src="https://script.supademo.com/supademo.js"></script>
```

Do not add the same script multiple times.

Use this exact demo ID:

`cms8csf8x07xnqm684zxzqc06`

The primary button must open the Supademo popup with:

```javascript
Supademo.open("cms8csf8x07xnqm684zxzqc06");
```

Use `addEventListener` instead of inline `onclick` attributes.

---

# 8) Primary button behavior
The `MULAKAN DEMO` button must:

- open the Supademo popup overlay;
- keep the HTML presentation loaded behind the overlay;
- not navigate to a new tab;
- not advance the slide automatically;
- return the presenter to the same demo slide after the popup is closed.

The button must be keyboard accessible.
Pressing `Enter` or `Space` while focused on the button must open the demo.

Do not auto-launch the demo when the slide enters.
The presenter must trigger it manually.

---

# 9) Backup video behavior
Prepare a local video fallback using the following exact expected asset path:

`assets/logkerja-demo-backup.mp4`

The `VIDEO SANDARAN` control must open the backup video in a presentation overlay that remains inside the HTML deck.

The backup overlay must include:

- the video element;
- native playback controls;
- a close button;
- dark overlay background;
- correct aspect ratio;
- no autoplay when the slide first loads.

When the presenter clicks `VIDEO SANDARAN`:

- open the video overlay;
- begin playback only after the user action;
- pause the deck timer if the existing deck has timer-pause support;
- resume the timer after the overlay is closed;
- return to the same demo slide after closing.

If the local video file is not present, hide the `VIDEO SANDARAN` control cleanly and do not show a broken player.

---

# 10) Internet-failure handling
The Supademo launch must fail gracefully.

If the Supademo script is unavailable or `Supademo.open` cannot be executed:

- do not crash the presentation;
- show a compact inline message near the controls:
  `Demo dalam talian tidak dapat dibuka. Gunakan video sandaran.`
- visually emphasize the `VIDEO SANDARAN` control;
- keep navigation and presentation controls working.

Do not open a raw browser error page.

---

# 11) Slide-entry animation
The slide animation must be short because this is an optional live-demo gateway.

Complete the main reveal in approximately **2.4–2.8 seconds**.

## Phase 1 — section label
**0.00s–0.30s**

Reveal `DEMO RINGKAS` with:

- soft fade;
- slight letter-spacing reveal;
- restrained cyan glow.

## Phase 2 — headline
**0.30s–1.05s**

Reveal the headline in two beats:

1. `Daripada Putra Finance`
2. `kepada tindakan dalam LogKerja.`

Apply the stronger cyan emphasis to:

`kepada tindakan dalam LogKerja.`

Use a left-to-right mask reveal and one subtle highlight sweep.

## Phase 3 — supporting text
**1.05s–1.45s**

Reveal the supporting text with:

- fade-in;
- slight upward motion;
- calm secondary hierarchy.

## Phase 4 — preview frame
**1.20s–2.05s**

Reveal the browser preview with:

- soft scale from approximately 0.97 to 1;
- opacity rise;
- subtle cyan edge activation;
- one restrained directional light travel from ERP toward LogKerja.

## Phase 5 — controls
**2.00s–2.70s**

Reveal in order:

1. `PILIHAN · ± 60 SAAT` badge;
2. `MULAKAN DEMO` button;
3. `VIDEO SANDARAN` control;
4. `Gunakan hanya jika masa mengizinkan.` note.

After this, the slide must remain stable.

---

# 12) Ambient motion
After the reveal completes, allow only the following subtle ambient motion:

## Preview edge glow
A very low-intensity cyan glow may breathe slowly around the browser frame.

## Primary button invitation
The `MULAKAN DEMO` button may use a restrained breathing effect:

- slight border brightness increase;
- maximum scale around `1.01`;
- no bounce;
- no rapid flashing;
- loop duration around 3 seconds.

Do not animate the backup-video control continuously.

---

# 13) Interaction with deck navigation
When the Supademo popup or backup-video overlay is open:

- suspend slide navigation keyboard shortcuts that would accidentally change slides;
- prevent left/right arrows from moving the deck while the overlay is active;
- allow `Escape` to close the active overlay;
- restore normal deck navigation immediately after the overlay closes.

Do not let the overlay interfere permanently with the deck controls.

---

# 14) Presenter flow
The intended live flow is:

1. presenter arrives at the Demo Ringkas slide;
2. presenter decides whether time permits;
3. if yes, click `MULAKAN DEMO`;
4. complete the Supademo walkthrough;
5. close the popup;
6. return to the Demo Ringkas slide;
7. advance to Penutup;
8. if online demo fails, use `VIDEO SANDARAN`;
9. if time does not permit, skip directly to Penutup.

This flow must be possible without refreshing the page or leaving the presentation.

---

# 15) Update the presentation navigator
Update the presenter navigation overlay shown through the existing navigation command / menu.

The navigator currently contains 18 items.
It must now contain **19 items**.

## Required final navigation items
Keep items 01–17 unchanged.

Then replace the final section with:

### Item 18
Top line:
`18 · PILIHAN`

Title:
`Demo Ringkas LogKerja`

### Item 19
Top line:
`19 · 14:25`

Title:
`Penutup`

The demo item deliberately uses `PILIHAN` instead of a fixed timestamp because it is only used when time permits.

Do not shift the core Penutup timestamp away from `14:25` in the navigator.
This preserves the planned 15-minute core presentation.

---

# 16) Update all slide counters
The presentation currently uses a total of 18 scenes.
Update all total-scene references to **19**.

Examples:

- `05/18` becomes `05/19`;
- `16/18` becomes `16/19`;
- final navigation index becomes `19/19`.

Update:

- bottom-left progress indicators;
- internal slide totals;
- navigation overlay totals;
- scene arrays / slide registries;
- keyboard-jump logic;
- any progress bar calculations that depend on total scene count.

Do not leave any stale `/18` indicators.

---

# 17) Update visible slide labels after insertion
Because the new demo slide is inserted before the current closing slide:

## New demo slide
Set visible label to:

`19 · DEMO RINGKAS`

## Current closing slide
Change visible label from:

`19 · PENUTUP`

to:

`20 · PENUTUP`

Do not alter the closing-slide content or animation while applying this numbering update.

---

# 18) Update direct-jump and keyboard navigation logic
The new demo scene must be included in all scene-navigation systems.

Update:

- direct scene index mapping;
- previous / next controls;
- arrow-key navigation;
- navigator-card click behavior;
- menu jump behavior;
- replay behavior;
- current-scene display;
- progress indicator;
- any slide lifecycle hooks.

Expected order:

- navigation item 17 → Signifikan;
- navigation item 18 → Demo Ringkas;
- navigation item 19 → Penutup.

The presenter must also be able to skip from item 17 directly to item 19 using the navigator.

---

# 19) Preserve presentation timing logic
The core presentation remains planned for approximately 15 minutes.
The demo is optional and must not be included as a mandatory fixed-duration scene in the main timing plan.

Therefore:

- navigator item 18 uses `PILIHAN`;
- Penutup keeps the planned `14:25` marker;
- do not automatically add 60 seconds to all later timestamps;
- do not force the presenter to remain on the demo slide;
- do not auto-start a countdown for the demo.

---

# 20) Visual hierarchy requirements
The slide must prioritize:

1. the headline;
2. the live demo button;
3. the preview frame;
4. the supporting text;
5. the optional duration and backup controls.

The `MULAKAN DEMO` button must be clearly visible from projector distance.
The `VIDEO SANDARAN` control must remain secondary.

---

# 21) Required accessibility and usability
Implement:

- semantic `<button>` elements;
- visible focus states;
- keyboard activation;
- `aria-label` where needed;
- meaningful alt text for the preview image;
- `Escape` support for closing overlays;
- focus restoration to the triggering button after an overlay closes.

---

# 22) Performance requirements
Keep the slide and overlays smooth.

Use:

- transform and opacity animations;
- one Supademo script load only;
- lazy video loading where possible;
- no large unnecessary background effects;
- no heavy particle systems.

The presentation must remain stable on projector hardware.

---

# 23) Things that must not happen
Do not do any of the following:

- do not embed the live Supademo inline inside the slide;
- do not open the demo in a new browser tab;
- do not auto-launch the demo on slide entry;
- do not make the demo mandatory;
- do not remove the Penutup slide;
- do not change Penutup content or its established animation;
- do not leave the navigation overlay at 18 items;
- do not leave any `/18` progress totals;
- do not add a fixed timeline timestamp to the optional demo item;
- do not allow slide-navigation keys to fire while an overlay is active;
- do not display a broken backup-video control when the local file is absent.

---

# 24) Final implementation expectation
The finished addition must feel like a seamless extension of the existing presentation.

The presenter must be able to:

- reach the demo slide;
- decide instantly whether to use it;
- launch Supademo as an overlay;
- use the local video backup if needed;
- close the demo cleanly;
- continue directly to the Penutup slide;
- skip the demo completely without disrupting the narrative.

The final slide sequence must be:

**Signifikan → Demo Ringkas → Penutup**

The final presentation navigator must contain **19 navigation items**, with the demo clearly marked as optional.

