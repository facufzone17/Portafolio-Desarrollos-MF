---
name: Trevoo
description: A flat black rack of working screens, lit by one electric blue.
colors:
  bg: "#08080a"
  bg-elev: "#131316"
  bg-alto: "#1c1c20"
  text: "#f4f4f5"
  text-muted: "#8e8e96"
  line: "rgba(255, 255, 255, 0.09)"
  line-alto: "rgba(255, 255, 255, 0.16)"
  azul: "#0099ff"
  azul-hondo: "#0b4da8"
typography:
  display:
    fontFamily: "Inter Tight, Inter, system-ui, sans-serif"
    fontSize: "clamp(2.05rem, 8.2vw, 6rem)"
    fontWeight: 500
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter Tight, Inter, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 3.5rem)"
    fontWeight: 500
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter Tight, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  panel-label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  micro:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "normal"
rounded:
  card: "10px"
  focus: "3px"
spacing:
  gutter: "20px"
  gutter-wide: "32px"
  section-y: "80px"
  section-y-wide: "112px"
  header-h: "64px"
  block-gap: "96px"
  block-gap-wide: "128px"
  container: "1400px"
components:
  button-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
    rounded: "{rounded.card}"
    padding: "0 20px"
    height: "44px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "#ffffff"
  button-primary-lg:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
    rounded: "{rounded.card}"
    padding: "0 24px"
    height: "52px"
  button-secondary:
    backgroundColor: "{colors.bg-elev}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "0 20px"
    height: "44px"
    typography: "{typography.label}"
  button-secondary-hover:
    backgroundColor: "{colors.bg-alto}"
  input-field:
    backgroundColor: "{colors.bg-elev}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "12px 16px"
  card-panel:
    backgroundColor: "{colors.bg-elev}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "28px 28px 0"
  chip-category:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "4px 12px"
    typography: "{typography.label}"
  stage-hero:
    backgroundColor: "{colors.azul}"
    rounded: "{rounded.card}"
    padding: "4.5% 6% 0"
---

# Design System: Trevoo

## Overview

**Creative North Star: "The Lit Rack"**

The page is a rack of screens that already work. Everything in this system exists
to hold up a real screenshot: the ground goes flat black and stays out of the
way, the type goes tight and quiet, and one electric blue is spent — once — as a
lit stage under the strongest capture in the build. Nothing else on the page is
allowed to glow.

The character is dense and workmanlike rather than atmospheric. Panels are grey
steps off a neutral black, hairlines are barely there, and headings sit at weight
500 instead of 600 or 700 because at 600 a headline reads as an advertisement and
at 500 it reads as an interface. There is no ornament layer: no glow behind the
title, no eyebrow above a heading, no order numbers on blocks, no repeated colour
panel per service. The variety comes from layout — a pinned horizontal rail, a
sticky index, a path, a form — not from six different entrance animations or four
tinted boxes.

The system is defined as much by its refusals as its tokens. It is built directly
against the dark-SaaS-landing mould: a radial glow behind the hero, a small label
above every section, numbered blocks, and four identical coloured cards were all
present in an earlier build and were all removed. What replaced them is a single
gesture repeated everywhere (one reveal, one radius, one angle, one accent), so
that the one moment of colour still reads as a moment.

**Key Characteristics:**
- Flat neutral black ground (#08080a), no gradients and no glow outside the one stage
- Exactly one colour on the page, electric blue, at 6.6:1 against the ground
- One radius (10px) on every corner, buttons included — zero pills
- Inter Tight 500 at -0.04em for anything looked at; Inter for anything read
- No eyebrow, no section number, anywhere
- Diagonal edges only at 26deg, the angle of the isotype's stem
- Product screenshots are the only imagery and the only source of light

## Colors

A single-accent palette: four neutral steps from black upward, two white
hairlines, and one blue that is both a surface and a text colour.

### Primary
- **Electric Blue** (`{colors.azul}`): the page's only colour. It is spent as a
  full-bleed stage exactly once, under the hero screenshot, and everywhere else it
  is a thin signal: the focus ring, the selection highlight, the tilted active
  marker in the sticky index, the border of a hovered project card, the focused
  input border, the border of the form's success panel. It clears 6.6:1 on the
  ground, which is why it is one token and not the usual pair of "blue to paint
  with" and "blue to read".
- **Deep Blue** (`{colors.azul-hondo}`): the far end of the stage gradient only.
  It never appears alone and never carries text.

### Neutral
- **Ground Black** (`{colors.bg}`): the page background, on `html` and `body`
  both. Neutral, not blue-black — a blue-black ground under a blue accent is the
  exact combination this system exists to leave behind.
- **Panel** (`{colors.bg-elev}`): the first step up. Service panels, cards, inputs,
  the secondary button, the error and success notices.
- **Raised** (`{colors.bg-alto}`): what sits on top of a panel — the screenshot
  frame's body, the secondary button's hover.
- **Paper White** (`{colors.text}`): all default text at 18.6:1 on the ground, and
  the fill of the primary button (where it inverts to black text).
- **Muted Grey** (`{colors.text-muted}`): subheads, list items, captions, inactive
  index entries, placeholders. Measured at 6.1:1 on the ground, so it clears AA
  for body copy — it is a quiet colour, not a weak one.
- **Hairline** (`{colors.line}`): dividers, list separators, default card and
  button borders. White at 9%.
- **Hairline Strong** (`{colors.line-alto}`): the same edge where it has to
  actually read as an edge — the screenshot frame, chips, hover borders. White at
  16%.

### Named Rules
**The One Colour Rule.** Blue is the only colour in the system. If a new element
needs "its own colour", the answer is a neutral step or a hairline, not a second
hue. Four differently tinted panels is the failure mode this rule exists to
prevent.

**The Stage-Once Rule.** The blue stage (`.escenario`) appears exactly one time in
the document, in the hero. A second one demotes it from a moment to a template.
Everywhere else blue is a line, a border, or a word — never a field.

**The Measured Contrast Rule.** Every text colour in this system has a measured
ratio on the ground: white 18.6:1, muted 6.1:1, blue 6.6:1. A new text colour is
admissible only once it has been measured against `{colors.bg}` and clears 4.5:1.
Do not introduce a "dimmer grey" for de-emphasis; muted is the floor.

## Typography

**Display Font:** Inter Tight (with Inter, system-ui, sans-serif)
**Body Font:** Inter (with system-ui, sans-serif)

Both are self-hosted through `next/font`; there is no third family and no mono.

**Character:** Inter Tight gives headings the density of a product UI rather than
a poster — same skeleton as the body face, just packed tighter, so the page reads
as one voice at two temperatures. Inter carries anything meant to be read in a
paragraph.

### Hierarchy
- **Display** (`{typography.display}`): the hero headline only. Two lines: a muted
  grey "Desarrollando" over the rotating word. The lower bound of 2.05rem is a
  hard floor, not a taste call — the rotating word is locked to a single line, and
  above that size the longest word overflows a 360px screen.
- **Headline** (`{typography.headline}`): section titles, centred, capped at 46ch.
  The projects rail runs a slightly smaller variant (clamp(1.75rem, 3.4vw, 3rem))
  because its heading lives inside the pinned viewport and has to share the height
  with the rail.
- **Title** (`{typography.title}`): the promise line beside each service panel and
  the project name on a card (clamp(1.5rem, 2.6vw, 2.25rem) there).
- **Panel Label** (`{typography.panel-label}`): the rubro name set inside the top
  left of a service panel. It is the one place a name is allowed to sit above
  content, and it is a label for the screenshot, not an eyebrow for a heading.
- **Body** (`{typography.body}`): subheads and paragraphs, 15px rising to 16px at
  the small breakpoint, `leading-relaxed`, capped at 42–46ch. Muted grey by
  default.
- **Label** (`{typography.label}`): buttons, index entries, chips, list items,
  form labels and errors.
- **Micro** (`{typography.micro}`): the filename in a window title bar. Hidden
  below the small breakpoint.

### Named Rules
**The No-Eyebrow Rule.** No small label above any heading, anywhere, and no order
number on any block. A heading that needs a label above it to be understood is a
badly written heading. This is the single most legible tell of a generated page
and the system refuses it outright.

**The 500 Rule.** Headings are weight 500 at -0.04em, never 600 or 700 and never
looser. Bolder reads as advertising; -0.04em is the tracking floor, below which
letters collide on small screens.

**The Balanced Heading Rule.** Headings carry `text-wrap: balance` and a 46ch cap
so a section title never breaks into a one-word orphan line.

## Layout

One container, 1400px max, centred, with 20px gutters that open to 32px at the
small breakpoint. Everything on the page sits inside it — including the hero
stage, which is inset by the same gutter rather than running full-bleed.

Vertical rhythm is coarse and consistent: sections are 80px top and bottom, 112px
from the small breakpoint up. A section heading is followed by 56px (80px wide) of
air before its body. Service blocks are separated by 96px, 128px wide — far more
than the internal spacing of a block, so the blocks read as separate objects
rather than rows of a table. Anchors carry `scroll-mt-24` to clear the sticky
header.

The header is 64px tall (72px wide), sticky, transparent at the top of the page,
and switches to an 80%-opaque ground with a heavy backdrop blur and a hairline
bottom border after 24px of scroll.

Responsive behaviour is structural, not just fluid. The services section is a
12-column grid above `lg`: a 2-column sticky index and a 10-column body, itself a
6/4 split between panel and promise column. Below `lg` the index does not render
at all — a sticky column of four items eats half a phone screen and marks nothing,
because the blocks are full width anyway. The projects section swaps components
outright: a pinned horizontal rail on desktop with motion allowed, a natively
scrolled stacked layout on touch and under `prefers-reduced-motion`. Project cards
carry per-project aspect ratios on desktop to build an asymmetric rail, and all
collapse to 4/3 on mobile.

The rotating word's container reserves the width of the longest entry so the
headline never reflows; CLS in that block is zero by design.

### Named Rules
**The No-Overflow Rule.** `overflow-x: clip` is set on `body` and nothing is
allowed to require horizontal scrolling. A wide element crops or scales; it does
not widen the page.

**The Own-Scroll Rule.** The browser's scroll is the scroll. Smooth scrolling is
Lenis-assisted and reduced-motion turns it off at the root. The one pinned section
is a deliberate, explicitly requested exception, and it is not a pattern to
repeat.

## Elevation & Depth

Flat, with tonal layering. There is no shadow vocabulary: depth is three neutral
steps (`bg` → `bg-elev` → `bg-alto`) plus two white hairline strengths, and that
is the whole system. A panel is a lighter rectangle, not a lifted one.

Exactly one shadow exists in the build, under the hero's screenshot frame, and its
job is to seat that frame on the blue stage — the only place in the system where a
surface floats over a coloured field.

### Shadow Vocabulary
- **Stage Lift** (`box-shadow: 0 40px 90px -30px rgba(0,0,0,0.85)`): the hero
  screenshot frame on the blue stage. Nowhere else.

### Named Rules
**The Flat Ground Rule.** No shadow, no glow, no gradient on the black ground.
Depth off the stage is a tonal step or a hairline. A radial glow behind a heading
is the default gesture of every generated dark page and is banned by name.

**The Crop-Don't-Float Rule.** Screens are cropped by the bottom edge of whatever
contains them, not centred inside a frame with air around them. The crop is what
reads as "this screen continues" and what invites the scroll without drawing an
arrow.

## Shapes

One radius: 10px (`{rounded.card}`), on every rectangle in the system — panels,
cards, buttons, inputs, chips, window frames, the blue stage, notices. The only
smaller radius is the 3px on the focus ring, which follows the outline rather than
a box.

There are no pills. `border-radius: 9999px` is reserved for things that are
actually circles: the three decorative dots in a window title bar and a phone
mock's dynamic island. A pill-shaped button or tag is the single most reliable
signature of a generated dark page and does not exist here.

Borders are hairlines, never more than 1px, in one of the two white alphas. The
only diagonal geometry in the system is 26deg (`--angulo-marca`), taken from the
fall of the isotype's stem — used for the tilted active marker in the sticky index
and for the direction the light enters the blue stage.

### Named Rules
**The One Radius Rule.** 10px on everything, buttons included. If a new element
needs a different corner, it is the wrong element.

**The Brand Angle Rule.** Every diagonal edge, tilt, or directional gradient uses
`var(--angulo-marca)` (26deg). No other angle is admissible, including "nicer"
ones like 15 or 45. The brand's only proprietary geometry becomes a system by
being reused, not by living once in the header.

## Components

### Buttons
- **Shape:** the house radius (10px). Never a pill.
- **Primary:** paper white fill with black text — the highest-contrast object on a
  dark ground (19.9:1), which leaves blue free to be atmosphere. Two sizes: 44px
  tall with 20px side padding, and 52px with 24px. 44px is the touch-target floor
  and no button goes under it.
- **Primary hover / active:** either a lift to pure white or a 1.02 scale, over
  160ms; active settles to 0.99. Never both at once on the same button.
- **Secondary / Ghost:** panel fill with a hairline border and white text. Hover
  raises both a step — border to the strong hairline, fill to raised. Used for
  "Ver proyectos" and for the header's action.
- **WhatsApp CTA:** the primary button with a message-circle icon at 1.15em. The
  WhatsApp green appears nowhere, not even in the icon — the icon inherits the
  button's text colour.
- **Disabled:** 60% opacity, no hover transform, `not-allowed` cursor.

### Chips
- **Style:** transparent fill, strong hairline border, white label text, house
  radius. Used for project categories on a card.
- **State:** static. Chips here are metadata, not filters, and have no selected
  state.

### Cards / Containers
- **Corner Style:** the house radius (10px).
- **Background:** panel (`{colors.bg-elev}`); the raised step for anything sitting
  on top of a panel.
- **Shadow Strategy:** none. See Elevation & Depth.
- **Border:** hairline, or none when a tonal step already separates the surfaces.
- **Internal Padding:** 20–24px on phones, 28–36px above; a panel that crops a
  screenshot drops its bottom padding to zero so the screen can run off the edge.

### Inputs / Fields
- **Style:** panel fill, hairline border, house radius, 12px/16px padding. Always a
  visible label above the field; placeholders are examples, never labels.
- **Focus:** border shifts to blue; the global 2px blue focus ring at 3px offset
  covers keyboard focus everywhere else.
- **Error:** a soft red border and a red message below, wired with `aria-invalid`
  and `aria-describedby`. Validation fires on blur first, then live — a field never
  turns red while it is still being typed into for the first time. Red is a
  functional signal confined to form validation and appears nowhere else in the
  system.
- **Success:** the whole form is replaced by a panel with a blue-tinted border.

### Navigation
- **Header:** logo left (isotype plus wordmark, isotype a touch larger), single
  action right. Transparent at rest, ground-at-80% with backdrop blur after 24px
  of scroll, hairline bottom border only in that scrolled state. One label per
  intent across the whole page: the header action and the hero action both say
  "Hablemos".
- **Sticky index (services):** a desktop-only column of four label-sized entries,
  sticky at 112px. Inactive entries are muted, active is white, and the active one
  carries a 2px blue bar rotated to the brand angle 18px to its left. Colour
  transitions run at 160ms.

### Screen Window
The recurring signature object: a screenshot in a window frame. Raised fill,
strong hairline border, house radius, and a 32–36px dark title bar with three
decorative dots (white at 25/18/12%) and an optional 11px filename. Screenshots
are always `object-top` — these are full-page captures and what identifies the
product is at the top; centring the crop shows the middle of a table. A compact
variant drops the title bar for secondary captures. A cropped variant lets the
window's foot run past the bottom of its panel.

### Blue Stage
The hero's ground: flat blue overlaid by a linear gradient running at
`calc(90deg - var(--angulo-marca))` from a light blue through the accent to deep
blue, soft-light blended with an off-centre radial highlight anchored at the top
left. Off-centre and on the brand angle, not a centred radial — a centred radial
glow is the default gradient of every dark page. It hosts one cropped screen and
occurs once.

### Rotating Word
The hero headline's second line cycles five service names on a vertical mask,
2200ms visible with a 500ms travel. It is driven by CSS transitions, not
framer-motion, and its container reserves the widest word's width. Two properties
are load-bearing and must not be removed: `contain: paint` on the mask, and the
absence of `will-change` on the words. Without containment Chrome promotes the
animating word to its own layer, that layer escapes the ancestor's `overflow:
hidden`, and both the outgoing and incoming words paint over the line above for
roughly 300ms — visible only at device pixel ratio 1 and only in intermediate
frames. Under reduced motion the word does not rotate; one name stays fixed.

### Reveal
One entrance for the whole page: 18px up and a fade, 820ms on a soft ease, staged
by a delay prop. A single IntersectionObserver flips a data attribute and CSS does
the rest. Under reduced motion or without JS everything is visible immediately —
content that only exists after an animation is content that can be lost.

## Do's and Don'ts

### Do:
- **Do** use one radius, 10px, on every rectangle including buttons.
- **Do** keep blue as the page's only colour, and spend it as a full field exactly
  once.
- **Do** let headings stand alone: no label above them, no number beside them.
- **Do** set headings in Inter Tight 500 at -0.04em, and body copy in Inter.
- **Do** use 26deg (`var(--angulo-marca)`) for every diagonal edge or directional
  gradient.
- **Do** crop screenshots against the bottom edge of their container so a screen
  reads as continuing.
- **Do** anchor screenshot crops to the top (`object-top`); the identifying part of
  a full-page capture is at the top.
- **Do** keep every tappable target at 44px minimum.
- **Do** measure a new text colour against the ground before using it; the floor is
  4.5:1 and the muted grey at 6.1:1 is the dimmest tone in the system.
- **Do** switch a service block to its single-column text layout when it has no
  screenshot yet.
- **Do** keep `contain: paint` on the rotating word's mask and keep `will-change`
  off the animating words.
- **Do** give every motion a reduced-motion path that ends with the content
  visible.

### Don't:
- **Don't** use a pill. `rounded-full` belongs to circles only: the window dots and
  a phone mock's island.
- **Don't** put a radial glow behind a heading, or any gradient on the black
  ground.
- **Don't** introduce a second accent hue, or tint panels per section. Four
  identically coloured blocks is a template, not a system.
- **Don't** number blocks 01–04, and don't add an eyebrow above a section title.
- **Don't** set a heading at 600 or 700, and don't track tighter than -0.04em.
- **Don't** draw a dashed empty box where the rest of the page shows product; a
  rubro with no capture changes layout instead.
- **Don't** repeat a name three times down one strip — if the sticky index and the
  panel label already say "Tiendas", the promise column says the promise.
- **Don't** use a blue-black ground. Neutral black under a blue accent is the whole
  point.
- **Don't** put WhatsApp green anywhere, including the icon.
- **Don't** add a second entrance animation. There is one reveal for the page;
  variety comes from layout.
- **Don't** let any element force horizontal scrolling.
