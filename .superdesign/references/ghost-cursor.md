# GhostCursor reference analysis

## What the component is

`GhostCursor` is a React overlay that renders an organic smoky pointer trail with Three.js. It uses an orthographic full-screen plane, a custom FBM/noise fragment shader, a circular buffer of previous pointer positions, `EffectComposer`, `UnrealBloomPass`, a film-grain `ShaderPass`, and an un-premultiply pass. The canvas is transparent and normally uses `mix-blend-mode: screen`.

The component is absolutely positioned with `inset: 0` and `pointer-events: none`. Its parent must provide a positioning context. Pointer listeners live on the parent. A `ResizeObserver` updates renderer/composer size. Refs hold mouse, velocity, trail buffer, opacity, renderer, materials, and animation-loop state without React re-renders. After the idle fade completes, the RAF loop stops until pointer activity resumes.

## Public API

| Prop | Default | Design implication |
|---|---:|---|
| `color` | `#B19EEF` | Must be remapped to an existing portfolio token; never introduce the default purple. |
| `brightness` | `1` | Keep below or near 1 so text hierarchy remains dominant. |
| `trailLength` | `50` | Longer means denser/more persistent smoke and higher shader cost. |
| `inertia` | `0.5` | Higher creates more lag/fluidity; use moderate values for a controlled feel. |
| `bloomStrength` | `0.1` | Increase only inside a contained surface; global/hero layers stay restrained. |
| `bloomRadius` | `1.0` | Large radii create atmospheric spread and can hurt contrast. |
| `bloomThreshold` | `0.025` | Low thresholds bloom more of the smoke. |
| `grainIntensity` | `0.05` | Current site already has a noise overlay; avoid double-graining. |
| `edgeIntensity` | `0` | Optional edge attenuation; useful for keeping smoke away from text/container edges. |
| `mixBlendMode` | `screen` | Appropriate for the current dark background, but must be tested against warm text. |
| `fadeDelayMs` | `1000` desktop | Shorter delays reduce distraction after movement. |
| `fadeDurationMs` | `1500` desktop | Keep around 800–1200ms for a quick, quiet exit. |
| `zIndex` | `10` | In this site, place below content and sticky navigation; never above focusable UI. |
| `maxDevicePixelRatio` | `0.5` | The supplied implementation aggressively caps resolution for performance. |
| `targetPixels` | `1.3M` desktop / `0.9M` touch | Preserve a pixel budget if implemented. |

## Reference demo configuration

The supplied demo uses a full-viewport dark surface with `color=#B19EEF`, `brightness=1.2`, `trailLength=20`, `inertia=0.4`, `grainIntensity=0.05`, `bloomStrength=0.5`, `bloomRadius=0.7`, `bloomThreshold=0`, `fadeDelayMs=200`, and `fadeDurationMs=1000`. It includes centered "Ghost Cursor" demo copy and a purple/blue gradient.

For the portfolio, retain the motion behavior but discard the demo copy, purple color, blue gradient, and full-screen showcase framing.

## Three placement hypotheses

### 1. Hero-local ambient — recommended

- Parent: homepage hero only, `position: relative; overflow: hidden`.
- Layer: behind hero text and dossier, ending cleanly at the hero boundary.
- Suggested character: warm-neutral smoke, medium trail, low-to-medium bloom, quick idle fade.
- Why: gives the first fold a memorable interaction without paying the readability/performance cost across the full document.

### 2. Dossier-contained instrument

- Parent: `.hero-card` only.
- Layer: replaces the seal/pattern decoration, below the quick-facts content.
- Suggested character: shorter trail, slightly stronger bloom within the bounded card, edge attenuation.
- Why: smallest blast radius and easiest contrast control; visually reads as an interactive systems artifact.

### 3. Restrained viewport overlay

- Parent: a fixed viewport layer covering the page.
- Layer: behind all content and navigation; very low brightness and short trail.
- Suggested character: 8–12 trail positions, low bloom, near-zero extra grain, fast fade.
- Why: most cinematic but highest risk of distraction, GPU cost, and interference with long-form evidence.

## Non-negotiable adaptation requirements

- No WebGL on `prefers-reduced-motion`; render nothing or a static neutral haze.
- Touch/mobile does not require cursor interaction and should default to no effect.
- One renderer maximum; never instantiate one per section or card simultaneously.
- Preserve `pointer-events: none` and content/focus contrast.
- If later implemented in Astro, use a single React island only where selected; adding `@astrojs/react`, React, and Three.js is an implementation decision after design approval, not part of this exploration.
