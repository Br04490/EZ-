# Publish Ezra Be Hooping with BOTH songs — no player login

1. **Extract this ZIP.** It contains project files directly at the ZIP root (`index.html`, `src/`, `assets/`), not a nested folder.
2. **GitHub:** open your existing `ezra-be-hooping` repository. On its `main` branch, use **Add file → Upload files**. Drag/drop the CONTENTS extracted from the ZIP (including complete `assets/music` and `assets/sounds` directories) and commit. If your repo already contains older versions, replace those paths with these updated ones, preserving the nested folder structure. GitHub's UI for overwriting existing files may vary; GitHub Desktop or a VS Code git commit/push is often easiest for replacing many files.
3. **Check on GitHub** the repo root contains `index.html` and there are TWO MP3 files under `assets/music/` and SEVEN WAV files under `assets/sounds/`.
4. **AI Studio:** go to https://aistudio.google.com/apps → Build → import your GitHub repository. Open the project and paste the complete `AI_STUDIO_PROMPT.md` into the chat. In Preview tap Play (browsers suppress music before tapping).
5. **Publish via GitHub Pages:** repository Settings → Pages → source **Deploy from a branch** → branch `main` → `/(root)` → Save. The public address is typically `https://YOURNAME.github.io/REPOSITORY/`. Anyone can play without logging in once the deployment is live. GitHub Pages on a free account generally requires a public repo, so the included music files will be publicly available; confirm you have the rights to share both songs.
6. **iPhone:** visit Pages URL in Safari; test music and swish after tapping Play. Use Share → Add to Home Screen. First load requires network; assets can be cached for repeat offline use if supported.

### IMPORTANT
Google AI Studio Build editing and GitHub repository admin require YOUR account, but people opening the final Pages URL do not. A published GitHub Pages link is not the same as the AI Studio Preview link.
