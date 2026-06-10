# AOHP — Launch Video Script

A Remotion video (**1080×700, 30fps, ~41s**) for **AOHP — the Android Open Harness Project**, an open fork of
Android redesigned to be **agent-native**. Source: https://github.com/aohp-os/aohp

Dark theme (`#0A0F0A` background, Android-green accent `#3DDC84`). Optional background music with a 1s fade-in and
2s fade-out at ~28% volume. Light UI sound effects (whoosh on word reveals, pop on cards, typing on terminal).
6 scenes in series, each wrapped in an Android-style phone/window chrome where appropriate.

Color palette: `#0A0F0A` bg, `#11160F` surfaces, `#1F2A1C` borders, `#3DDC84` green accent, `#7CFFB2` light green,
`#F5F7F5` white text, `#9BA89B` muted text, `#5F6B5F` dim text. Amber warning `#F5B544`, red `#FF6B6B`.
Fonts: **Urbanist** for headings, **Inter** for UI/body, **JetBrains Mono** for code/terminal.
All scene transitions fade + slight scale.

---

## Scene 1 — Intro & Logo (210 frames / 7s)

Black background. A word-by-word hook reveals on one line, each word sliding up + fading in with a soft whoosh:
**"AI agents now operate your phone."** Hold briefly, then the line slides up and fades.

Then a second line types/reveals: **"But the OS still assumes you're human."** with the word *human* in green.

Finally everything clears and the **AOHP** wordmark resolves via a quick character-scramble/decrypt effect in green,
with a subtle glow. Tagline fades in below in muted text: **"Android Open Harness Project"** and a second line
**"An agent-native open fork of Android."** A thin green underline draws in beneath the logo.

## Scene 2 — Stock Android vs AOHP (240 frames / 8s)

Section label fades in at top: **"Two operating models."** A vertical divider wipes in down the middle splitting the
screen into two panels.

- **Left panel — "Stock Android"** (muted/desaturated): a single human icon at top, then a 3×2 grid of isolated app
  tiles (Amazon, Temu, eBay, Browser, Notes, Settings) that pop in. Curved arrows hop between them one at a time to
  convey manual, sequential app-switching. Caption: **"Isolated app silos · manual navigation."**
- **Right panel — "AOHP"** (green-accented, alive): a central **OS Agent** node with a pulsing ring. Service nodes
  (API, CLI, UI, GUI) orbit it; animated connector lines fire outward in parallel to small app nodes. Caption:
  **"OS agent orchestrates services in parallel."**

The right panel subtly out-glows the left to imply the shift from app-first to agent-native.

## Scene 3 — Three Core Capabilities (210 frames / 7s)

Heading reveals word-by-word: **"Three core capabilities."** Then three cards slide up + fade in, staggered, each
with an icon, title, and two bullet sub-points:

1. **Personalized Interaction** — Generated service entrances · Cross-service OS memory
2. **Efficient Agent Interfaces** — Parallel background displays · Structured agent-aware UI · Native sandbox
3. **Secure Information Flow** — Data-flow taint tracking · Trusted vault & executor

Cards have green top-accents and a thin border; a faint scanline/grid texture sits behind them. Each card icon
animates (draw-in). Sub-points tick in with small green check dots.

## Scene 4 — One Task, Composed (240 frames / 8s)

Android phone frame center-left. A user intent bubble types in:
**"Find me the best running shoes under $80."**

The OS agent fans out **three parallel service calls** as animated chips (Amazon, Temu, eBay) that light up green
with check marks as each "returns". A **policy / taint** badge passes the inputs, and a sensitive value is shown
sanitized as a typed placeholder: **`<payment-card: uuid>`** (amber, monospace) — the agent never sees plaintext.

Result card slides up: **"Nimbus Run 2 — $74 · best rated under $80"** with a green **"1 task · 3 services · 1
interface"** strip. Side caption: **"One task-level interface. Cross-app service composition."**

## Scene 5 — Evaluation Highlights (180 frames / 6s)

Dark background, heading: **"Evaluated against stock Android."** Subtitle: *OpenClaw agents · 10 mobile tasks.*

A large hero counter animates **43.3% → 90.0%** task completion (green, with a bounce + glow on landing), labeled
**"Task completion rate"**, with **"vs 43.3% on stock Android"** beneath.

A row of three secondary metric counters count down to their values:
**−65.6% Tool calls · −72.2% Duration · −73.9% Tokens** (each with a small downward arrow, green).

## Scene 6 — Open Source CTA (150 frames / 5s)

Black background, floating particles + subtle grid. **"100% OPEN SOURCE"** label pulses in green. The **AOHP**
wordmark sits center with a spinning/rotating-in GitHub mark beside it. Headline: **"Fork it on GitHub"**.

Monospace URL on a dark card: **`github.com/aohp-os/aohp`** (green/link-blue). Footnote chips:
**"Apache-2.0 · Built on AOSP · AIR, Tsinghua University"**. Final tagline fades up:
*"The OS becomes the environment where agents perceive, plan, act, and enforce user intent."*

---

## Implementation notes

- Composition `AohpFull` at 1080×700, 30fps. Each scene exports a `*_DURATION` constant; `FullVideo` chains them with
  `<Series>` and overlays fading background music via a `<Sequence>`.
- Reusable `PhoneFrame` / `Panel` chrome with rounded corners + green status accent.
- Spring/eased animations (`Easing.out(Easing.cubic)`, `Easing.bezier(0.4,0,0.2,1)`); fade + scale (0.96→1) on
  scene entry. Counters use `interpolate` with clamped extrapolation and tabular-nums.
- Sounds (in `public/`): `whoosh.wav`, `pop.wav`, `typing.wav`, `unscramble.wav`, `background-music.wav`.
