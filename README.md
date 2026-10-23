# 🏀 EZRA BE HOOPING — React + Vite Edition

A family-friendly, iPhone-first arcade basketball game rewritten in **React 18 and Vite with TypeScript**, preserving the original approved reference artwork, audio, and gameplay logic.

## 1. Quick Start

Requirements: **Node.js 18+**

```bash
# Install dependencies
npm install

# Start local dev server (port 3000)
npm run dev

# Production build
npm run build
```

Open **http://localhost:3000** in your browser.

## 2. Core Features & Business Logic Ported

| Area | Implementation |
|---|---|
| **Framework** | Modern React 18 SPA built with Vite and TypeScript |
| **Game Rules** | 30-second single-tap arcade basketball across 3 courts: Backyard Buckets, Playground Pop, and Big Stage EZ |
| **Touch Controls** | Large primary "TAP TO SHOOT" button, animated shot timing meter, and full-court tap zone |
| **Little Hooper Mode** | 68% green acceptance band vs 34% normal mode, switchable in Settings |
| **Characters & Voice** | Ezra celebrating made shots ("Green! EZ money!") and announcing final scores; Lennox 15 sisterly commentary lines & 5-second countdown |
| **Audio** | Both complete original user songs (`ezra-be-hooping-2` & `ezra-got-game`) plus 7 authentic court sound effects (shot, swish, rim, bounce, sparkle, cheer, buzzer) |
| **Screens** | Home, Stage Select, Game, Pause Overlay, Results, Music, Settings, High Scores, and Help |
| **Persistence** | LocalStorage for court best scores and settings (no account or external login required) |

## 3. Project Structure

- `index.html` — HTML shell and entry point
- `src/App.tsx` — Root application state, screen router, animation frame game loop, and input handling
- `src/main.tsx` — React entrypoint
- `src/types.ts` — TypeScript interfaces for stages, settings, screens, and audio
- `src/engine.ts` — Pure game mechanics, timing calculation, shot resolution, court configs, and sister lines
- `src/audio.ts` — Audio player managing soundtrack tracks, sound effect pooling, and speech ducking
- `src/voice-clips.ts` — Voice clip registry with browser SpeechSynthesis fallback
- `src/components/` — Individual modular screen components:
  - `HomeScreen.tsx`
  - `StagesScreen.tsx`
  - `GameScreen.tsx`
  - `ResultsScreen.tsx`
  - `MusicScreen.tsx`
  - `SettingsScreen.tsx`
  - `ScoresScreen.tsx`
  - `HelpScreen.tsx`
- `src/styles.css` — Arcade styling, animations, responsive portrait layouts, and visual effects
- `assets/` — Original artwork, audio tracks, and sound effects
