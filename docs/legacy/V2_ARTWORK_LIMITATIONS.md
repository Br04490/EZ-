# Ezra Be Hooping — V2 approved artwork integration

## What is really implemented

- The *actual playable game* now uses three polished scene images from the supplied visual references, rather than the basic SVG scenery and figures. This is an artwork-first upgrade; it is **not** a fully rigged 3D animation.
- Stage 1 uses the full-resolution parent-approved backyard illustration of Ezra and Lennox with her larger bike.
- Stages 2 and 3 use carefully cropped scene renders from the approved three-stage game artwork. They are lower resolution than the Backyard and retain some details baked into the flattened screenshot, including facial expressions and some speech-art. These are *visual temporary assets*.
- Actual time, bucket score, shot-meter pointer, shot button, soundtrack, voice captions, shot arc, green celebration, hoop pulse, and sound effects are DOM elements reacting to real gameplay—not just pictures. Existing 30-second rules and gameplay tests are preserved.
- Both MP3 songs and seven WAV files are included unchanged.

## What is still needed for EXACT moving-character fidelity

- Transparent, animation-ready source sprites or 3D rig models for Ezra and Lennox: ready/throw/celebrate, speaking/cheer/mouth shapes. The flattened illustrations do **not** provide these motion frames.
- Clean high-resolution *background-only* illustrations for Playground and Arena (the cropped originals are composited marketing mockups).
- Separate basketball hoop rim/backboard/net layers to have mesh-like net flexing, rather than the current overlay pulse/net sound.
- Optional guardian-approved recordings of Ezra and Lennox saying the dialogue. Browser voices are a best-effort substitute, not actual kids' voices.

## Best next phase

Recreate the two backgrounds as independently layered game assets, and create 4–6 matching character animation poses in the same polished style, then replace the flattened scene artwork with independent sprites. Use Phaser only if necessary; this static game is intentionally dependency-free and hosts free on GitHub Pages. Do not replace art with placeholder SVGs just to add motion.
