# Demo video pipeline

Three narrated cuts of the live app, recorded by script so they can be re-made after any UI change.

| Cut | Length | Use |
| --- | --- | --- |
| `teaser` | about 1 min | LinkedIn, email follow-up, first touch |
| `core` | about 6 min | Buyer and investor first meeting, embedded in the deck |
| `extended` | about 9 min | Technical diligence: architecture, quality gates, economics |

## Run

```bash
npm run build                                    # docs/index.html must match the code being shown
python3 -m http.server 5199 --directory docs &   # the capture reads http://localhost:5199/index.html
export ELEVENLABS_API_KEY=... ELEVEN_VOICE_ID=... # never commit these
python3 video/tts.py teaser core extended        # narration, cached per line
node video/capture.mjs core                      # screen capture paced by the narration
python3 video/assemble.py core                   # final mp4, muted mp4, srt, chapters, report.json
```

`node video/capture.mjs core --dry` runs without audio and saves one screenshot per line in `video/out/core/dry/`.
Run captures on an otherwise idle machine. Under CPU load the browser drops frames and actions overrun their lines.

## How it works

- `cuts.mjs`: every line of narration with the on-screen action it introduces. All spoken numbers were checked against the live app.
- `overlay.js`: presentation layer only. Enlarges the phone, adds the chapter and caption panels, cursor and focus ring. It does not change app data or behaviour.
- `tts.py`: ElevenLabs `eleven_v3`, stability 0.5, similarity 0.75. Takes outside 1.9 to 3.3 words per second are re-rendered. Every clip is slowed to about 0.93x, pitch kept, and capped at 2.85 words per second.
- `capture.mjs`: Chrome DevTools screencast, every frame timestamped. Each action starts with its line and the next line waits for the clip to end.
- `assemble.py`: picks the right frame for every 1/30 s, cuts to the narration windows (persona switches and reloads are dropped), crossfades between beats, holds the last frame 4 s, two-pass loudness to -16 LUFS and -2 dBTP, H.264 Main 1080p30.

## Known limits

- Captions are drawn in the right-hand panel, so the master is already readable muted.
- Every spoken number was checked against the app on the day of recording. Re-check after changing seed data or packs.
