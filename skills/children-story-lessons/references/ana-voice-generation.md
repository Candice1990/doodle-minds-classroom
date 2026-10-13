# Ana classroom voice generation

Use this workflow for new English feedback and specific error explanations in Doodle Minds lessons. The user selected `en-US-AnaNeural` (American English female child voice). Keep its default `+0%` rate and `+0Hz` pitch unless the user requests a change; keep classroom playback at `playbackRate = 1`. Preserve the original recorded Pip Hello and approved existing encouragement clips.

## Generate reusable local assets

- Reuse the target lesson’s generator where present. The verified Pumpkin Party example is `pumpkin-party/lesson-01/tools/generate-error-voices.py`; it reads the keyed `clips` exported by `error-narration.js` and writes `assets/errors/*.mp3` plus `error-voice-assets.js`. Resolve these paths relative to the actual project, not a hardcoded home directory.
- Required error feedback is a specific spoken reason, not just “Oops.” Keep each clip to one or two clear sentences, usually about 3–6 seconds. Cover missing instructions, failed actions and actual final goal failures; select each clip from execution state. Match the visible explanation to the spoken text. Do not repeat a generic cue in place of explaining the cause.
- Put new text in a stable key-to-text mapping. Failed-step text describes what happened at that step; final-result text describes the unmet goal in the final state. Select explanations from executed state, preserving valid alternative programs.
- Use an isolated Python virtual environment with `edge-tts`; check `ffmpeg`, `ffprobe`, and Node before using this particular generator. Generation needs network access; the resulting lesson audio must work offline.
- Respect existing authorization to send the selected text to Microsoft’s Edge speech service. A skill update is not blanket authorization for unrelated text, another provider, personal voice cloning, or paid services. Do not ask again for an already authorized operation. If tooling blocks a request, report its actual reason.
- Generate into a staging directory first. Normalize intelligibility consistently; the verified settings are `loudnorm=I=-20:TP=-3:LRA=8`, 44.1 kHz, mono MP3. Record actual duration in milliseconds and voice ID in the manifest.
- Validate every staged clip before publishing: nonempty file, successful complete decode, plausible measured duration, and complete key coverage. The Lesson 1 generator uses a 1–16 second range and minimum 1,000 bytes for its short explanations; adapt limits for intentionally longer narration rather than truncating it.
- Publish assets before switching the manifest, and replace the manifest atomically. Avoid claiming that a multi-file replacement is fully atomic; preserve a recoverable prior set when replacing existing clips. Generation failures before publication must leave the working lesson intact.
- Version changed audio and manifest references so browsers do not reuse stale files. Supply a compact combined MP3 listening sample when introducing or changing a voice. Re-encode concatenated samples if stream copying produces timestamp warnings.

## Edge 403 compatibility: verified 2026-10-12

`edge-tts 7.2.8` could list voices, but synthesis on the legacy Bing host returned `WSServerHandshakeError: 403`. Updating the package or downgrading to 7.0.0 did not fix this run. Switching only the synthesis endpoint to Microsoft’s new host generated all 26 Ana clips successfully. See [upstream proposal #491](https://github.com/rany2/edge-tts/pull/491) and [failure reports #490](https://github.com/rany2/edge-tts/issues/490).

For affected versions, apply this conditional compatibility adjustment before creating `Communicate` instances:

```python
import edge_tts.communicate as edge_communicate
from edge_tts.constants import TRUSTED_CLIENT_TOKEN

if "speech.platform.bing.com/" in edge_communicate.WSS_URL:
    edge_communicate.WSS_URL = (
        "wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1"
        "?Ocp-Apim-Subscription-Key=" + TRUSTED_CLIENT_TOKEN
    )
```

This is a dated compatibility fix using the library’s existing public client constant, not an Azure account credential. Prefer a future upstream release that incorporates the fix. Leave newer endpoints alone; check current upstream code before adapting it. Do not disable TLS checks, invent credentials, or capture private browser tokens.

First test one authorized short sentence. If it works, generate the batch. If it still fails, report exception type and HTTP status, check system/server time and current upstream reports, and stop repeated unchanged retries. Distinguish a proxy CONNECT rejection from a WebSocket 403; voice-list success alone does not prove synthesis works. Never state that all 403s are caused by a proxy, an old package, or clock skew. Use a different provider only with the user’s agreement on voice and necessary setup.

## Playback and verification

- Use manifest-selected local audio for the actual executed error. Keep sound on by default after a user gesture and reduce overlapping effects so speech remains clear.
- Wait for `ended`, with a measured-duration-plus-margin timeout and media-error fallback, before unlocking the program. Lesson 1 uses `durationMs + 2000`; old fixed delays can cut off these 5–8 second explanations.
- Stop, mute, navigation, and replay must cancel current media, effects, timers, and pending completion callbacks. Muted or failed audio must not prevent the visual lesson from continuing.
- Check all text-to-file mappings, voice IDs, complete MP3 decode, and manifest durations. Exercise existing logic and playback tests for completion, Stop, mute, error, timeout, and fallback.
- In the browser, run a representative incorrect program and confirm the failed-step clip loads and advances `currentTime`, the final-result clip matches the final state, and controls unlock after playback. Preserve success feedback and Hello. File existence, waveform checks, and media status do not establish subjective listening quality; offer the sample and disclose if the audio has not been listened to.
