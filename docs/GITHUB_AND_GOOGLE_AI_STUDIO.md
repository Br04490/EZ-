# Upload and import: numbered instructions

1. Download the **V3 Complete ZIP**.
2. Extract to a folder on your computer. You should see `index.html`, `assets`, `src`, `docs`, `tests`, `sw.js`, `manifest.webmanifest`, and `package.json`.
3. Open your already-created GitHub repository in the browser and click **Add file → Upload files**.
4. Drag **ALL the files AND folders INSIDE** the extracted folder into the upload area. Preserve subfolders. Never upload just the ZIP, and never nest the whole folder below an extra directory.
5. Click **Commit changes** to `main`.
6. Confirm root contains `index.html` and `assets/music/` contains both songs (you can open the files to verify).
7. In GitHub repository **Settings → Pages**, set **Deploy from a branch → main → / (root)** and save. Public repos are required for GitHub Pages on GitHub Free.
8. When GitHub Pages reports the website is live, open its URL in a **private/incognito tab** to confirm play without sign-in.
9. Open **https://aistudio.google.com/apps** and choose Build, then **Import from GitHub** (UI labels can change).
10. Authorize the correct GitHub repository for Google AI Studio, import and confirm it uses these existing files. Never ask AI Studio to generate a totally new project from a blank prompt.
11. Paste `AI_STUDIO_PROMPT.md` into AI Studio. Ask for an actual screenshot of the generated *playable* game, not an illustration, and compare it with `assets/approved-art/FINAL-APPROVED-UI.png`.
12. Save changes back to GitHub if the Studio integration supports it. GitHub Pages redeploys changed files automatically after commits to main.
13. Open the site in **iPhone Safari**, test PLAY, STAGES, MUSIC, SETTINGS, short presses, fast taps, green score, swish sound, five-second count and replay.
14. Optionally use Safari **Share → Add to Home Screen** for an icon without the App Store.

**One crucial limitation:** Neither GitHub hosting nor Google AI Studio builds can magically separate animated character poses from one finished picture. The functional V3 game uses the current artwork and notes the exact remaining animation/voice assets in `docs/RECORDING_AND_ART_GAPS.md`.
