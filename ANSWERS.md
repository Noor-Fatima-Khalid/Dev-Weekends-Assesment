# ANSWERS.md

## 1. How to run

Requirements: Node.js 18+

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

To build and preview production output:

```bash
npm run build
npm run preview
```

No environment variables or external services needed.

---

## 2. Stack & design choices

**Stack:** React 18 + React Router v6 + Vite + CSS Modules. No UI component library — every element is hand-rolled. Web Audio API for sound, `localStorage` for persistence.

React was the right call here because the timer's state machine (mode, seconds, running, history) needs to live in one place and propagate cleanly to multiple components. CSS Modules keep styles colocated and scoped without the weight of a CSS-in-JS library. Vite keeps the dev loop instant.

**Decision 1 — Circular SVG ring, not a progress bar.**
The ring wraps the `mm:ss` countdown so the visual progress and the numeric countdown share the same focal point. Your eye never has to travel. A horizontal bar at the top forces a split reading experience: check the bar *and* the number separately. With the ring, a single glance tells you the mode (label inside), exact time remaining (the number), session context (round x of y), and rough percentage done (how much arc is filled). The ring also gave a natural place to put a subtle color transition — purple for focus, teal for break — without redesigning the layout.

**Decision 2 — Page background tints to match the mode.**
When the timer flips from focus to break, the background gradient shifts from a faint purple wash to a faint teal wash over 600ms. This is a peripheral cue — even if you're looking at a different window and glance back, you know at a glance whether you should be working or resting, without reading anything. It avoids adding an extra banner or status badge (more clutter) and uses ambient color instead, which is lower cognitive load.

---

## 3. Responsive & accessibility

**Responsive behavior:**
- At 360px (phone): the ring stays at 240px but the page container narrows with 1rem horizontal padding. Mode tabs shrink to 12px/112px padding. The feature grid on the landing page collapses from 2 columns to 1. Nothing clips or scrolls horizontally.
- At 1440px (laptop): content is max-width capped at 480px (timer) and 720px (landing) and centered. The extra white space is intentional — the timer should feel focused and unhurried, not stretched.

**Accessibility handled:**
- The SVG ring has `role="img"` and `aria-label` with the current mode and time, so screen readers announce it as "Focus timer: 24:15" rather than reading SVG internals.
- The progress bar div has `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Mode tabs use `role="tablist"` / `role="tab"` / `aria-selected`.
- The settings modal traps keyboard focus and closes on Escape.
- All icon-only buttons have `aria-label`.
- Focus states use `focus-visible` outlines (2px solid purple, offset 2px) so keyboard users see them but mouse users don't get visual noise.

**Skipped:** Color contrast for the muted text (var(--text-muted), #888780 on white) is approximately 3.5:1, which passes AA for large text but not for the 12–13px labels used in the history and round counter. Fixing it properly would require either darkening the muted color (which changes the visual hierarchy) or bumping those labels to 14px. With another day I'd run the palette through a contrast checker and adjust the muted stop to hit 4.5:1 across the board without flattening the typographic scale.

---

## 4. AI usage

**Tool used:** Claude (this conversation).

**What I asked:** I described the full feature spec and design brief (ring, mode tabs, three controls, gear icon for settings, bell sound, daily history) and asked for all source files in one pass.

**What I changed:**

The AI's initial `useTimer` hook used a `useRef` to store the interval and re-created it on every `isRunning` change, which works, but also had the `completeSession` function close over stale `mode` and `settings` values. When a session auto-completed, it would read the mode from the closure snapshot rather than the current value, causing wrong mode transitions on the second or third cycle. I fixed this by adding `modeRef` and `settingsRef` — refs that track current values — and reading from those inside `completeSession` instead of from the closed-over state. This is a standard React pattern (the "ref for the latest value" trick) that the AI's first draft missed because it generated the hook without fully thinking through the stale-closure implications of the auto-advance logic.

The AI also generated the ring's `textTransform="uppercase"` attribute on SVG `<text>` elements, which is not valid SVG (it's a CSS property, not an SVG attribute). Browsers ignore it silently. I moved it to `text-transform: uppercase` in the CSS class that styles those text nodes.

---

## 5. Honest gap

The bell sound is functional but thin. It's three sine-wave tones in sequence — clean and inoffensive, but not particularly satisfying as a "session complete" moment. What would make it noticeably better: a short envelope-shaped tone with a slight reverb tail, or two layers (a fundamental + a detuned fifth) to give it warmth. The Web Audio API supports all of this with a `ConvolverNode` for reverb and multiple oscillators mixed together. With another day I'd design a proper bell patch — attack around 10ms, decay over 1.5 seconds, a bit of subtle harmonic content — so the end-of-session moment feels genuinely rewarding rather than just audible.
