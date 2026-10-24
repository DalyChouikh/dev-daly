# Olive motion studies

Two executable studies of the approved Olive portfolio and selected A identity.
Each runs for **8 seconds at 1920 × 1080**: name reveal (0–2s), logo resolve
(2–4s), then the real TapNShow invitation (4–8s). Silent, with no narration.

**Deliverables are source, interactive local previews, and proof stills. No MP4
was requested or rendered.** The existing 43.2-second TapNShow film is untouched.
These independent authoring packages are excluded from the Next.js website build
and deployment. Their dependencies are installed only within this directory.

| Study | Source | Preview |
| --- | --- | --- |
| Hyperframes 0.8.193 / GSAP 3.14.2 | `hyperframes/index.html` | Hyperframes Studio with an 8s seek slider |
| Remotion 4.0.538 / React 19.2.3 | `remotion/src/Composition.tsx` | Remotion Studio, `OliveStudy` composition |

Use Bun 1.4.4 (pinned in both manifests). From the repository checkout, run
either package separately:

```sh
cd docs/motion/olive/hyperframes
bun install --frozen-lockfile
bun run dev
```

```sh
cd docs/motion/olive/remotion
bun install --frozen-lockfile
bun run dev
```

Open the exact Studio URL printed by the command **on the machine running it**.
A hosted coding session's localhost address is not a public review link. The
committed `evidence/` stills can be reviewed without a running server.

In Hyperframes, drag **Seek preview** or the timeline playhead. In Remotion,
choose **OliveStudy**, then drag the time ruler; Space toggles playback and the
arrow controls move one frame. The three Remotion scenes are also registered
separately in the `Scenes` folder for inspection and editing.

## Seeking and reduced motion

Hyperframes registers one paused GSAP timeline under `olive-study`; its clip
windows are explicit. Remotion derives every transform from `useCurrentFrame()`
and the composition frame rate. Neither uses CSS animations, timers, randomness,
or a remote asset request for visual state. Fixed local font/image assets keep
the result reproducible when seeking in either direction.

Both include an explicit reduced-motion mode with static chapter cuts and no
spatial movement. In Hyperframes, set the `reducedMotion` boolean in the
**Variables** panel. In Remotion, choose **OliveReducedMotion**, or set the
`reducedMotion` default prop to `true`. These are explicit authoring modes;
the composition does not infer an operating-system preference at export time.
Previews remain under the viewer's playback control. Any later website
integration should also honor `prefers-reduced-motion` and start paused.

## Verification

```sh
# From hyperframes/
bun run check --snapshots
bun run snapshot
bun audit --json

# From remotion/
bun run lint
bun audit --json
bunx remotion still src/index.ts OliveStudy ../evidence/remotion-product.png --frame=174
```

Hyperframes' full browser check passed with zero runtime, layout, motion, or
contrast errors; all 19 sampled text contrast checks passed. Three advisory
lint warnings recommend extracting the short scene groups into sub-compositions.
The stills confirm the clipping during the name entrance and the off-canvas
product-panel entrance are intentional transient motion. The Bun-launched check
also records two craft suggestions about metadata type size and the short logo
caption hold; neither is a runtime or layout error.

Remotion ESLint and TypeScript checks passed. Actual CLI stills cover frames 40
(name), 90 (logo), 174 (product), and frame 0 of the reduced-motion composition.
Both Studios were opened and their seek controls exercised forward and backward.
See `evidence/verification.json` for the recorded checks and limitations.

Both packages pass `bun audit --json` with no advisories. The raw reports are
`evidence/hyperframes-bun-audit.json` and `evidence/remotion-bun-audit.json`;
their empty JSON objects and exit code 0 indicate no findings. The earlier
`hyperframes-audit.json` and `remotion-audit.json` retain the actual npm audit
evidence from before the Bun migration.

Bun 1.4.4 supports the scoped `zod@>=4.0.0 <4.6.6` override to `4.6.7`; its
version 3 `bun.lock` records the same patched resolution. No override was
broadened. The current graph has no Zod 3 installation, and the selector does
not match dependencies constrained to Zod 3. The pinned Remotion version is
unchanged.
Remotion prints a version warning because it expects exactly Zod 4.5.4; the
patched 4.6.7 dependency passes ESLint, TypeScript, and actual CLI still rendering.

## Assets and scope

Bone `#ecebe7`, olive `#38450f`, local Hanken Grotesk. Logo paths come unchanged
from the selected A assets; the `-olive.svg` variants change their fill and set
explicit intrinsic dimensions for canvas rendering.
TapNShow's invitation is the supplied 486 × 298 product still, so it softens when
enlarged to video dimensions. The supplied Within live still is retained as a
reference asset, not inserted into this short sequence. No fictional metrics
or features were added. The Hyperframes headline-rise timing adapts the installed
`per-word-rise` catalog primitive to this two-line editorial layout.

`node_modules`, build output, thumbnails, caches, exports, and managed preview
history are ignored locally. Each package has its own pinned manifest and lock.
