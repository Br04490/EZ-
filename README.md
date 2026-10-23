# 🏀 EZRA BE HOOPING — GitHub Complete Build v3.0

**A complete, dependency-free, iPhone-first HTML/CSS/JavaScript basketball game** using approved Ezra/Lennox reference artwork and the original full-length MP3s. This is the **playable source project**, not a mockup or AI prompt alone. No registration, paid API, Firebase, Gemini API, or server-side database is required to play.

## 1. Play the game locally

Requirements: **Node.js 18+** (a local browser with a static server also works).

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. For a real iPhone browser check, publish it via GitHub Pages or run it from a device-accessible HTTPS server.

```bash
npm test
```

This runs the bundled rules, audio, asset and UI contract tests. The game uses no `npm install`, `node_modules` or build step.

## 2. What was built

| Area | Working implementation |
|---|---|
| Game | 30-second single-tap arcade basketball; 3 stages |
| Touch | Large orange button; green meter; tap an unobstructed part of the court |
| Toddler mode | 68% green acceptance band, versus 34% regular |
| Points | One made shot = one bucket; live score and time HUD |
| Character dialogue | Ezra: “Green! EZ money!” on makes; announces final total; Lennox: 15 remarks plus 5→1 countdown |
| Audio | Both complete original MP3s + 7 local basketball sound effects |
| Screens | Home, three-court selection, game, pause, results, music, settings, high scores, help |
| Settings | Music on/off, sound effects, voices, Little Hooper, court tap, volume, 2-song selector |
| Persistence | Device-local settings and best score per court (no account) |
| Delivery | Static GitHub Pages deployable web app + manifest + offline service worker |

## 3. THE APPROVED VISUAL SPECIFICATION

See `assets/approved-art/FINAL-APPROVED-UI.png` (clean UI reference) and `assets/approved-art/user-confirmed-reference.jpeg` (user confirmation screenshot). These govern **layout, typography, button feel, HUD, color, stage selection and scene style**.

**Current implementation:** real screens and live touch controls are layered over art scenes from the earlier game builds. The Backyard art is a high-res illustrated scene. Playground/Arena scenes are relatively low-resolution painted crops; they still include some baked-in speech bubbles and visual effects from the flattened concepts. **They are not yet independent animated 3D sprites**. Exact pixel-for-pixel parity with the concept board, skeletal character animation, and authentic child voice acting require additional separated assets. Do NOT claim these missing items are complete.

`assets/characters/*.svg` and `assets/stages/*.svg` are retained solely as historical fallback source assets; the playable game now uses `assets/game-art/*.webp` with its new real HTML/CSS UI. `assets/previews` contains historical screenshot/reference images.

## 4. Buttons and touch targets

Full specification: **`docs/TOUCH_CONTROL_SPEC.md`**. Key behavior:

- Main menu **PLAY** immediately starts a 30-second game on the chosen court.
- **STAGES** opens three large illustrated stage cards. Tapping a card selects its stage AND starts that round.
- Bottom **TAP TO SHOOT** is the large primary controller, independent of the rest of the screen; minimum height 59–68 CSS px depending on screen size.
- The **court tap zone** covers the open gameplay scene beneath the HUD and above the controls, except buttons and overlays. It is enabled by default and can be disabled in Settings.
- **Shot meter** is also a valid shoot target. Green center produces a bucket; orange/red misses. The pointer moves automatically, you do not drag it.
- A short **660 ms shot lock** prevents accidental double shots from one touch/animation.
- HUD **pause** is at upper left; pause/resume preserves game time. The timer also pauses when the app goes to background.
- During results, all gameplay touch zones are disabled. **Play Again**, **Change Stage**, **Main Menu** work normally.

## 5. Audio and voice accuracy

`assets/music/ezra-be-hooping-2.mp3` and `assets/music/ezra-got-game.mp3` are the complete original user-provided songs, not remixes, samples or placeholder audio. Music starts only after a user touches PLAY, per iOS autoplay restrictions. Both are looped during play, and the stage can choose automatically or the player selects one manually.

`assets/sounds/` contains **net swish, bounce, shot whoosh, rim clang, green sparkle, crowd cheer, final buzzer**.

Real, approved Ezra/Lennox spoken dialogue recordings **have not been supplied**. The game uses browser SpeechSynthesis as a fallback and applies separate age-inspired pitch and rate settings. Those are **not guaranteed to sound like real children's voices** on iOS. See `AUDIO_VOICE_BIBLE.md` and `docs/RECORDING_AND_ART_GAPS.md` to replace them with genuine short voice files. The MP3 songs are not treated as voice narration clips.

## 6. Install on GitHub Pages — no sign-in to play

1. Extract this ZIP.
2. Create/open the intended GitHub repository (e.g. `Br04490/ezra-be-hooping`).
3. **Upload the CONTENTS of the extracted folder, not the enclosing folder or ZIP.** `index.html`, `src`, `assets`, `tests`, `docs`, `sw.js` and `manifest.webmanifest` should be at the repo root.
4. Commit the changes to `main`.
5. Go to **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)** and save.
6. On GitHub Free, use a **public** repo for GitHub Pages. The site becomes available at a URL like `https://br04490.github.io/ezra-be-hooping/` after deployment (only if you use that repo name).
7. On iPhone, open the published link in Safari → Share → Add to Home Screen. Players do not need GitHub or Google logins.

The same static project can be imported into [Google AI Studio Build](https://aistudio.google.com/apps). Follow `AI_STUDIO_PROMPT.md` after the repository contains the files.

## 7. Project map

- `index.html` — real accessible screen/button structure
- `src/styles.css` — responsive arcade layout and visual motion effects
- `src/game.js` — full state machine, interaction mapping, timing, score, sound triggers, voices
- `src/engine.mjs` — pure/tested rules for scoring, meter, timer, courts, commentary
- `src/audio.mjs` — MP3 music and WAV effects
- `src/voice-clips.mjs` — optional future child voice recording file paths
- `assets/game-art/` — visible court scenes and decorative net overlay and stage thumbnails
- `assets/approved-art/` — locked look reference assets
- `assets/music/` and `assets/sounds/` — complete audio bundle
- `docs/TOUCH_CONTROL_SPEC.md` — screen-by-screen touch & iOS event contracts
- `docs/RECORDING_AND_ART_GAPS.md` — precise unfinished animation/voice assets
- `docs/GITHUB_AND_GOOGLE_AI_STUDIO.md` — step-by-step deployment/import
- `tests/` — unit tests for rules, audio and asset/UI contracts
- `sw.js` — local PWA caching for repeat visits

## 8. Non-negotiable future edit rules

- Treat V3 existing playable behavior as the foundation. Do **not** replace the game with screenshots that look interactive but aren't.
- Preserve the **exact** two music tracks, seven effects, three stages, 30-second timer, 15 sister lines, 5→1 countdown and accurate live results.
- Keep all major buttons and HUD values as real DOM controls/data, not text baked into static game art.
- Don't deploy secrets/API keys to this public repository. No API key is needed for gameplay.
- Test 375×667, 390×844 and 430×932 portrait sizes; test on real iPhone Safari before publishing it as finished.
