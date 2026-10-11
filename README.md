<div align="center">

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Ashwick’s Sanctum

### A little spellcraft, drawn in ink and candlelight.

*Draw a sigil. Choose a spell. Watch the lantern answer.*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

</div>

Ashwick is a small, self-contained browser experience built around hand-drawn magic. Sketch freely on the parchment, or ask the unhurried mage to trace one of his sigils for you. Each spell unfolds as an animated illustration, with its own color, particles, and layered sound.

## Enter the sanctum

No build step or package install is needed. Serve this folder locally, then open the address in your browser:

```sh
python3 -m http.server 8000
```

Visit [http://localhost:8000](http://localhost:8000). You can also open `index.html` directly, though a local server is the more reliable way to load the page and its assets.

## How to cast

- **Draw your own:** drag across the parchment with a mouse, finger, or stylus. Pause briefly when you finish; Ashwick will cast the sigil.
- **Choose a sigil:** tap **Choose a sigil** to reveal the spell buttons. Selecting a spell or starting a drawing closes the list. Ashwick traces the design, raises his lantern, and sends a bolt toward it.
- **Follow the magic:** the spell’s effect blooms around the sigil, then fades away.
- **Set the sound:** use the button in the upper-right corner to mute or restore audio. Sound starts at a low level, and your mute choice is remembered in this browser.

## The grimoire

| Sigil | What answers |
| --- | --- |
| **Flame** | A rolling flare, ember crackle, and sudden ignition |
| **Ward** | A rising glassy hum and a protective, expanding dome |
| **Moon** | A quiet constellation of bells beneath a lunar veil |
| **Eye** | A watchful opening, a slow pulse, and a blink |
| **Earth** | Deep rumble, rising stone, and falling grit |
| **Wind** | Circling filtered air with dry leaf whispers |
| **Void** | A descending drone drawn inward to a hollow collapse |
| **Random sigil** | A freshly shaped design paired with a randomly chosen school of magic |

Hand-drawn marks summon a freshly generated spell each time, such as a fire spirit, forked lightning, growing crystal, thorned vines, a turning rift, falling stars, a curling tide, or a star familiar. Spell types cycle in a shuffled order, so a type cannot repeat until the others have appeared. Each cast gets new colors, motion, and details shaped by the drawing, along with a generated name. Named sigils keep their illustrated effects. The Random sigil can also call on frost, bloom, or ink-lightning effects.

## Sound, made for the moment

The soundscape is synthesized in the browser; there are no audio files to download. Scratch follows the pace of a drawn line. A preset gets the same sound as it traces itself, then the mage’s cloth, staff, and lantern mark the cast. Each school adds its own little score, with small variations from one casting to the next.

Audio begins after your first interaction, as browsers require. Use **Sound off** whenever you want a quiet page.

## Project map

```text
.
├── index.html            Page structure and the illustrated mage
├── css/
│   ├── style.css         Parchment, typography, layout, and controls
│   ├── mage.css          Character, lantern, and responsive stage
│   ├── spells.css        Rotating rune ring and spell styling
│   └── canvas.css        Full-screen drawing surface
├── js/
│   ├── app.js            Animation loop, sigil placement, and casting flow
│   ├── canvas.js         Pointer drawing and automatic tracing
│   ├── spells.js         Per-spell visual effects
│   ├── mage.js           Mage gestures and lantern response
│   ├── sound.js          Procedural sound effects and mute control
│   └── particles.js      Ambient particle controller
├── spells/
│   └── presets.js        Local-coordinate preset sigil designs
└── template/
    └── Ashwick.html      Original single-file reference
```

The page uses plain HTML, CSS, and JavaScript. Preset designs live in `spells/presets.js`; visual effects are in `js/spells.js`; sound synthesis and the saved mute setting are in `js/sound.js`.

## A note from the mage

The interface is designed for a full window, including phones and short landscape screens. Drawing works with pointer input, so mouse, touch, and pen all share the same path. The parchment, imperfect ink, slow rune ring, and handmade spell marks are all part of the charm—best enjoyed at your own pace.

The layout accounts for notches, changing mobile browser bars, and narrow or wide screens. Browsers with Pointer Events use them directly; older touch browsers fall back to touch and mouse input. If a browser blocks the hosted fonts or audio features, the page keeps its local cursive font fallbacks and remains usable without sound.

<div align="center">

*May your lines be steady and your lantern kind.*

</div>
