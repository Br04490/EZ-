# Soundtrack + voice and sound requirements

## Two ORIGINAL supplied tracks — both are INCLUDED

- `assets/music/ezra-be-hooping-2.mp3` — 1:14.76 — supplied as **Ezra Be Hooping 2.mp3**. High-energy anthem: recommended for Playground + Arena.
- `assets/music/ezra-got-game.mp3` — 2:17.78 — supplied as **Ezra Got Game.mp3**. Relaxed upbeat song: default for Backyard.

Choose **Auto / Ezra Be Hooping 2 / Ezra Got Game** on the separate MUSIC screen. Songs loop as needed. They begin only after a user gesture (Play) to comply with iPhone restrictions. Music volume defaults low so voices and swishes remain audible. The SETTINGS screen provides independent music, sound-effect and voice toggles. Both songs are cached by the service worker for offline reuse after a successful load.

## Included sound files — already wired into game

- `assets/sounds/shot-whoosh.wav`: basketball launches
- `assets/sounds/net-swish.wav`: clean basket at ~430ms after release
- `assets/sounds/green-sparkle.wav`: satisfying green-shot sparkle
- `assets/sounds/ball-bounce.wav`: miss rebound
- `assets/sounds/rim-clang.wav`: miss strikes rim
- `assets/sounds/crowd-cheer.wav`: arcade celebration on big shots
- `assets/sounds/final-buzzer.wav`: buzzer at exactly 0 seconds

A decorative net overlay flexes and a green starburst pops when the shot makes contact; effects respect reduced-motion settings. These are originally synthesized SFX, not borrowed recordings.

## VOICES ARE CHILD CHARACTERS, NOT ADULT COMMENTATORS

**Ezra** — enthusiastic and playful ~3-year-old boy, high young-sounding voice. Said with excitement: “Green!” then “EZ money!” EVERY make; final “I made X buckets! EZ money!” with the real bucket count.

**Lennox** — expressive ~8-year-old big sister, clear and playful girl voice, affectionate teasing; all 15 sister lines, plus a VERY distinct spoken 5–4–3–2–1 countdown. No adult broadcast-anchor voice, no deep male voice, no celebrity imitation.

The current offline web game uses **high-pitched browser speechSynthesis as a child-like approximation**; mobile operating systems differ in voice quality and device TTS **cannot guarantee genuine child timbres**. Never label the existing synthetic voices as recordings of the actual children. For authentic kid voices, get guardian-approved short voice recordings and wire them to `src/voice-clips.mjs` using the paths below. The songs are NOT dialogue recordings.

### Optional recorded voice assets

Add only the clips that actually exist. `src/voice-clips.mjs` supports a map with keys:
- `Ezra['green-ez-money']` → `assets/voices/ezra/green-ez-money.mp3`
- `Ezra['bucket-total-0']` through `bucket-total-50` → result announcements (or leave TTS for exact totals)
- `Lennox['countdown-5']` through `countdown-1` → timed countdown
- `Lennox['sister-01']` through `sister-15` → corresponding lines in `src/engine.mjs`

Never add missing file paths to the map; absent clips automatically use device TTS.
