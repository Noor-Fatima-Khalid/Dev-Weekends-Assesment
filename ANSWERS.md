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

React was used because the timer's state machine (mode, seconds, running, history) needs to live in one place and navigate cleanly to multiple components. CSS Modules keep styles scoped without the weight of the library.

**Decision 1 — Circular SVG ring, not a progress bar.**
The ring wraps the `mm:ss` countdown so the visual progress and the numeric countdown share the same focal point. A horizontal bar at the top forces a split reading experience: check the bar *and* the number separately. With the ring, a single glance tells you the mode (label inside), exact time remaining (the number), session context (round x of y), and percentage done (how much arc is filled). 
**Decision 2 — Page background tints to match the mode.**
When the timer flips from focus to break, the background gradient shifts from a faint green wash to a faint teal wash over 600ms. Even if you're looking at a different window and glance back, you know at a glance whether you should be working or resting, without reading anything. It avoids adding an extra banner or status badge and uses ambient color instead, which is lower cognitive load.

---

## 3. Responsive & accessibility

**Responsive behavior:**
- At 360px (phone): the ring stays at 240px but the page container narrows with 1rem horizontal padding. Mode tabs shrink to 12px/112px padding. The feature grid on the landing page collapses from 2 columns to 1. Nothing clips or scrolls horizontally.
- At 1440px (laptop): content is max-width capped at 480px (timer) and 720px (landing) and centered. The extra white space is intentional — the timer should feel focused and unhurried, not stretched.

**Accessibility handled:**
- The SVG ring has `role="img"` and `aria-label` with the current mode and time, so screen readers announce it as "Focus timer: 24:15".
- The progress bar div has `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Mode tabs use `role="tablist"` / `role="tab"` / `aria-selected`.
- The settings modal traps keyboard focus and closes on Escape.
- All icon-only buttons have `aria-label`.
- Focus states use `focus-visible` outlines (2px solid purple, offset 2px) so keyboard users see them but mouse users don't get visual noise.

---

## 4. AI usage

**Tool used:** Claude.
**For:** 
- Formatting and rephrasing for README.md and ANSWERS.md files
- Widths in responsiveness 
- deciding usability techniques 
- pomodoro ring
- fixing animations in landing page "Work in rythm"

**What I asked:** I described the answers in detail and asked claude to rephrase the answers. Only rephrasing required, not tweaking the as=nswers.

**What I changed:**
I replaced the answers with polished ones. The main changes included better sentence structure and terms.

---

## 5. Gap

The bell sound is functional but thin. It's three sine-wave tones in sequence — clean and inoffensive, but not particularly satisfying as a "session complete" moment. What would make it noticeably better: a short envelope-shaped tone with a slight reverb tail, or two layers (a fundamental + a detuned fifth) to give it warmth. The Web Audio API supports all of this with a `ConvolverNode` for reverb and multiple oscillators mixed together. With another day I'd design a proper bell patch — attack around 10ms, decay over 1.5 seconds, a bit of subtle harmonic content — so the end-of-session moment feels genuinely rewarding rather than just audible.
