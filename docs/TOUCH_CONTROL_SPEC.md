# Touch Control / Input Contract — Ezra Be Hooping V3

## Main principle

**A 3-year-old must succeed without a tutorial.** No swiping, dragging, aiming, virtual joystick, physics dragging, keyboard, multi-touch gestures, or account sign-in. Large visible orange shoot control, immediate feedback, minimal text, bright green “made” state.

## Interactive hit areas and event routing

| Screen | Control (DOM ID/class) | Hit area | Result |
|---|---|---|---|
| Home | `#play-btn` | Large centered gold button | Starts current court immediately, resets time & score |
| Home | `#stages-btn` | Centered blue button | Opens stage selection |
| Home | `#music-btn` | Purple button | Opens track selector |
| Home | `#settings-btn` | Round gear + label | Opens preferences |
| Home | `#scores-btn` | Round trophy + label | Opens per-stage records |
| Home | `#help-btn` | Round '?' + label | Opens how-to-play |
| Stage select | `.stage-card` (×3) | Entire illustrated card | Picks stage, saves selection, **starts round** |
| Game | `#shoot-btn` | Full-width 59–68 px gold button near bottom | Shoots exactly once if round active / not locked |
| Game | `#shot-meter` | Color band above shoot button | Alternative one-tap shot, not drag-to-aim |
| Game | `#court-tap-zone` | Visible court except top HUD and lower shot controls | Alternative one-tap shot when setting enabled |
| Game | `#pause-btn` | 38×45 px top-left HUD button | Pauses timer and music; freezes scoring |
| Pause | `#resume-btn` | Large gold control | Resume timer from frozen time |
| Pause | `#quit-btn` | Large blue control | Quits round to main menu |
| Results | `#again-btn` | Gold button | Same stage, score reset, full new round |
| Results | `#change-btn` | Blue button | Opens stage selection |
| Results | `#result-home-btn` | Purple button | Back to main menu |
| Music | `.music-choice` (×3) | Entire choice row | Sets automatic / track 1 / track 2 |
| Music | `#music-enabled` | Accessible green on/off switch | Music enable/disable |
| Music | `#volume-slider` | Native range slider | Adjustable soundtrack volume |
| Settings | `#settings-*` inputs | Whole accessible switch rows | Music, effects, voices, toddler, tap court |

### Exact screen touch rules

1. The court zone uses `pointerdown` with `preventDefault` to respond immediately. Only button-independent open court area is covered.
2. The orange shoot button uses its native `click` event, which already supports touch, mouse and keyboard.
3. The meter also uses `pointerdown`, but does **not** drag its pointer. The automatically-moving marker determines shot accuracy.
4. The same touch cannot activate court and button because the hit regions **do not overlap**. The modal pause overlay is above both.
5. Starting from the Home Menu, any tap on the background or illustrated characters does **nothing**; menu buttons are required. Likewise in Stage Selection, only stage cards or back button act.
6. `state.shotLocked` applies for **660 ms** after a valid attempt; additional taps are ignored until the shot finishes.
7. Every accepted shot uses `isMade(state.position, easyMode)`; each make increments `state.score` by **one**, once. Misses do not subtract points.
8. Score changes are displayed immediately; net/swishes and particles trigger about **430 ms** later as the ball contacts the hoop.
9. The timer uses `performance.now`, renders `0:30 ... 0:00` and terminates scoring at zero. A true pause adjusts the start time after resumption to avoid losing seconds.
10. iOS Safari audio playback begins with a deliberate user action (PLAY). There is no automatic background music before the user touches a control.

## Toddler settings

- Little Hooper (default ON): green width **68%** centered at 0.5; standard ON? No, normal mode **34%**.
- Court Tap (default ON): tap empty illustrated court to shoot. OFF keeps only the orange button and meter as shooting controls.
- No vibration assumption: optional vibration requested only where supported.
- Feedback: huge “GREEN!” when made; “ALMOST!” on misses; timer/score always above gameplay art.

## Accessibility and screen adaptation

The orange button must remain reachable above the iPhone Home Bar (`env(safe-area-inset-bottom)`). Support 375×667, 390×844 and 430×932 portrait screens. All important gameplay content is live HTML instead of decorative screenshot text. UI controls have accessible names and strong contrast. The game doesn't assume iPhones expose a specific voice or vibration API.

## Future upgrades

Do not replace working clickable buttons with a flattened PNG. If Phaser is introduced for character animation, keep a semantic HTML HUD/menu/button overlay and map input to the same rules. The image showing a scoreboard with “21” is **concept art**, not a hardcoded score.
