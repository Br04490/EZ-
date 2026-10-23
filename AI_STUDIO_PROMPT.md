# COPY EVERYTHING BELOW INTO GOOGLE AI STUDIO AFTER IMPORT

You are refining the existing complete interactive iPhone basketball web game **EZRA BE HOOPING v3.0**. This is an IMPORTED, WORKING project. DO NOT throw away the repository and regenerate from scratch.

## Primary instruction

Read `README.md`, `docs/TOUCH_CONTROL_SPEC.md`, `docs/RECORDING_AND_ART_GAPS.md`, and the source in `index.html`, `src/game.js`, `src/styles.css`, `src/engine.mjs`, `src/audio.mjs`, `src/voice-clips.mjs` before editing.

**VISUAL TARGET LOCKED**: `assets/approved-art/FINAL-APPROVED-UI.png` is the definitive user-approved visual specification (the user wants this exact look). `assets/approved-art/user-confirmed-reference.jpeg` is the screenshot they used to confirm. Preserve premium colorful dimensional cartoon art, shiny pill-shaped buttons, blue HUD, orange/yellow shoot button, green-release text, Ezra #4, and older Lennox on a larger bike commentating through a microphone. No cheap flat SVG characters, blank rectangles or CSS-stick-figure substitutions.

The existing V3 code has REAL buttons and full gameplay screens; preserve this DOM interactivity. Decorative screenshots must not replace actual working controls. The gameplay scoreboard must show live values, not a hardcoded image score.

## Must remain playable

- Three court stages: Backyard Buckets, Playground Pop, Big Stage EZ.
- Timer is always 30 seconds; top HUD shows decreasing time and dynamically scored buckets.
- One-tap orange bottom TAP TO SHOOT button; also allow a tap on the open court to shoot when the setting is ON.
- Shot meter moves by itself; its wide center green region is easier in Little Hooper Mode. A green shot makes **one bucket**, not 2, 3 or auto-perfect each time.
- No sign-in for players, no Gemini API calls, no telemetry, no paid services, no required backend.
- Kids' commentary: 15 Lennox lines, separate 5→1 spoken countdown, Ezra says **“Green! EZ money!”** after each successful shot, and Ezra announces the exact score at the end.
- Keep full original MP3s `assets/music/ezra-be-hooping-2.mp3` and `assets/music/ezra-got-game.mp3` as shipped; keep all 7 WAV sound effects and the sound triggers.
- Keep music/FX/voice toggles, soundtrack selection, volume, Little Hooper, court-tap setting, pause/resume, local highscores and replay.
- Native iPhone Safari / GitHub Pages via static file hosting, no Unreal Engine required.

## Quality and scope priorities

1. Run existing game and compare **real gameplay screenshot** with the approved board in `assets/approved-art/FINAL-APPROVED-UI.png`.
2. Do not invent missing assets or claim exact visual identity. `docs/RECORDING_AND_ART_GAPS.md` itemizes flattened image limitations. Use approved illustrations that exist.
3. Keep the entire unmodified original source and MP3s in version control before upgrades.
4. Use a renderer like Phaser only where it meaningfully improves layered Sprite art. Keep HTML/CSS control surfaces, or preserve their behavior precisely.
5. Finish BackYard visual parity first, then stages 2 and 3. Never reduce the currently polished artwork back to flat SVGs.
6. Test the app at **375×667**, **390×844**, **430×932** (portrait) and on a real iPhone if possible. Verify physical shoot button, court taps, pause and audio.
7. Verify no accidental duplicate shots from overlapping event listeners; verify 30-second clock and 5-second countdown.
8. Do not add auth, an API key, server dependencies, ads, purchases, or user data collection.
9. Report any change to existing game behavior, missing asset, and before/after real browser screenshots.

## Children's voices

Ezra should sound like a playful, confident approximately 3-year-old BOY; Lennox like a spirited approximately 8-year-old GIRL commentator. **Do not misrepresent pitch-adjusted adult browser TTS as genuine children.** Allow optional guardian-approved recording clips in `src/voice-clips.mjs`, and retain text captions and audio fallback. If suitable approved clips are absent, say so explicitly.

## Mobile touch contract

The bottom orange shoot button is primary; an entire open court region above it is a secondary shoot surface, but not the HUD, pause button, or overlay screens. All other decorative elements are pointer-events:none. Accept a maximum of one shot per ~660 ms with a reliable cooldown. Stage artwork is decorative; stage selection cards are actual buttons; the scoreboard is real text. Treat `docs/TOUCH_CONTROL_SPEC.md` as mandatory.

**Deliverable:** A visibly premium, fully functional game—not a screenshot demo. Do not mark any gap resolved until the real implemented gameplay supports it.
