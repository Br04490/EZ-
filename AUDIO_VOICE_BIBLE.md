# EZRA BE HOOPING — SOUND & KID VOICE DIRECTION

This document is authoritative for Google AI Studio / future edits.

## Identity & personality

- Ezra: young Black boy age 3, sweet confident and excitable. Sounds like a playful **little boy**, not a grown man, no adult sports commentator imitation. Favorite call “GREEN! EZ MONEY!”
- Lennox: his approximately 8-year-old older sister, funny and protective, bright **young girl** voice with quick witty intonation and lighthearted sister energy. She appears on the sideline with a microphone and bike.
- Choose original voices. Do not clone recognizable people's voices or claim a placeholder voice recording is of these children.
- Automatic fallback on platforms without convincing kid-style synthesized voices: high-pitched TTS with labeled character bubbles, plus optional guardian-approved recordings.

## Timing/priority

- Both songs loaded locally from `assets/music`; never replace with external stream or API.
- Shots start with a soft whoosh.
- On made shot, after ball approaches rim (~430ms): animated net swish + sound `net-swish.wav`, bright green animation, sparkle chime, optional cheer. Ezra says “Green! EZ money!”. Score +1.
- On missed shot: slight rim clang then ball bounce. Never mock or scold the child.
- Last five seconds: Lennox says “Five! Four! Three! Two! One!” synchronized with the visible always-on countdown; avoid crowd or commentary overpowering the countdown.
- At 0:00: buzzer and displayed results, Ezra announces the **actual** integer amount of buckets scored.
- Keep music at 15-25% and duck it while voice lines play, avoid excessive loudness and large sudden volume jumps.

## Three courts / soundtracks

1. Backyard Buckets: auto chooses `Ezra Got Game` (chill groove).
2. Playground Pop: auto chooses `Ezra Be Hooping 2` (hype anthem).
3. Big Stage EZ: auto chooses `Ezra Be Hooping 2` (big arena energy).

MUSIC screen selection overrides stage mapping. SETTINGS provides independent switches for music, dialogue and sound effects. Songs never autoplay before user presses Play.

## Existing 15 sisterly lines

Keep canonical lines and ordering in `src/engine.mjs`. Display line as a speech bubble every time it triggers. Speak lines only when they don't drown out the countdown. Every dialogue must stay family-friendly.

## Content / privacy

No logins, no server required, no API keys or analytics, all sound is bundled. Do not send voice samples to external services without explicit parent approval. Uploading songs to a **public** GitHub repo makes them downloadable to anyone; if that's undesirable, use a private repository and appropriate hosting instead.
