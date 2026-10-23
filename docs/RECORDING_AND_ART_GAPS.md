# Remaining items for near-exact approved illustration fidelity

**Current game is functional and playable.** The user confirmed the approved screen collage. The images currently supplied are rendered, flattened art. The game uses the best existing scene illustrations as images in the playable scene, and reconstructs all touch controls and live text. Full character animation or literal pixel-perfect parity is not yet technically present.

## Not missing for playing

- Three playable courts; complete source; no API / account requirements.
- Original *Ezra Be Hooping 2* and *Ezra Got Game* songs, both included, complete.
- Seven effect WAV files.
- Timer, scoring, one-tap shot meter, gold shoot button, screen navigation, results, highscores, settings.
- Ezra dialogue text and Lennox's 15 lines and 5-to-1 countdown.

## Visual/art gaps before calling this “exactly like the screenshot”

1. Separate full-resolution **transparent Ezra sprite poses** (standing, preparing, throwing, release follow-through, scoring, cheering, missing, results front-facing). Currently his body is baked into a scenic image.
2. Separate transparent **older Lennox character** with braids, her appropriately sized bike, gold/blue microphone, mouth shapes and several expressions/gestures. Currently a static background detail.
3. Clean **background-only playground** and **background-only arena** illustrations in at least 1080×1920 (prefer 1440×2560) with no duplicated players, floating basketballs, text or speech bubbles burned in. The current assets are resized crops of former art.
4. Independent transparent **hoop, front rim, rear rim, net** artwork for each scene so a ball can pass between layers; current transparent net overlays simulate swish in CSS.
5. Optional frame-based sprite sheets for natural movement at 30–60fps. Static JPG/PNG artwork cannot move limbs by itself.
6. Pixel-accurate UI borders/icons from the approved screenshots if literal rather than stylistic matching is required. Buttons now match colors and silhouette but are HTML/CSS renderings.

## Voice gaps

- Need real, guardian-approved **short** dialogue WAV/MP3 recordings for authentic young-sounding boy/girl voices. Browser text-to-speech pitch ≠ a guaranteed child's voice.
- Optional Ezra audio clips: `lets-hoop`, `green-ez-money`, `bucket-total-0`, `bucket-total-1`, ... through practical score range.
- Optional Lennox audio clips: `sister-01` through `sister-15`, `countdown-5` through `countdown-1`.
- Add actual recording paths to `src/voice-clips.mjs` only after files exist. The code automatically falls back to synthesized speech when clips are missing.
- Voice recordings must be provided/approved by a guardian. The original songs cannot automatically supply isolated per-shot dialogue.

## Future art workflow

Do not request Unreal Engine just to display cartoon scenes: layered Phaser/canvas sprites over HTML controls are sufficient. A 3D engine would be optional for real-time full-body 3D, but would require actual models/rigs, not flattened still screenshots. Start with one clean sprite pose set, integrate in Stage 1, test at 375×667 and 390×844, then reuse characters across stages.
