# V3 build validation (October 23, 2026)

- 14/14 built-in Node tests passed, covering 30 second rules, green-window scoring, sister lines, complete audio files, visual assets, correct controls, and no backend requirement.
- Headless Chromium mobile-sized screen captures were produced at 390×844, including menu, stages, Backyard, Playground, Arena, results, music and settings.
- Browser interaction test: opening STAGES, selecting a stage, and using the physical SHOOT button executed with no JavaScript errors.
- Browser interaction test: forcing a centered green attempt gives exactly 1 bucket; pause/resume controls freeze and resume time, with no JavaScript errors.
- Timer test: advancing the clock beyond 30 seconds shows RESULTS and the exact recorded total.
- All seven WAV files validated with RIFF headers. Both full MP3s SHA-256 matched exactly against the original user-uploaded files.

**Limits of testing:** These are desktop Chromium simulations at a mobile viewport. Actual iOS Safari audio/speech behavior, Stage 2/3 visual parity, full-body animation, and physical-device interaction remain to be validated. The reference pictures are flattened and cannot become fully rigged moving characters without further art. Real child voice recordings are not bundled.
