#!/usr/bin/env python3
"""Narration audio for the demo video: one clip per cue, cached by text and settings.

Usage: python3 video/tts.py core teaser [extended]
Env:   ELEVENLABS_API_KEY, ELEVEN_VOICE_ID (required)
       ELEVEN_MODEL (default eleven_v3), ELEVEN_STABILITY (0.5), ELEVEN_SIMILARITY (0.75)
       TTS_ENGINE=kokoro for an offline draft voice (needs kokoro-onnx and its model files)
Output: video/out/audio/<cue>.wav (trimmed, 48 kHz mono) and manifest.json {cue: {file, dur, words}}

A clip is reused only when its text, voice, model and settings all match (cache key).
Each take is checked for pace: 1.9 to 3.3 words per second. Outside that it is re-rendered,
up to 3 takes, keeping the take closest to 2.5 words per second.
"""
import hashlib, json, os, subprocess, sys, time, urllib.request, urllib.error
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / 'out' / 'audio'
CACHE = HERE / 'out' / 'audio-cache'
OUT.mkdir(parents=True, exist_ok=True)
CACHE.mkdir(parents=True, exist_ok=True)

ENGINE = os.environ.get('TTS_ENGINE', 'elevenlabs')
MODEL = os.environ.get('ELEVEN_MODEL', 'eleven_v3')
VOICE = os.environ.get('ELEVEN_VOICE_ID', '')
SETTINGS = {
    'stability': float(os.environ.get('ELEVEN_STABILITY', '0.5')),
    'similarity_boost': float(os.environ.get('ELEVEN_SIMILARITY', '0.75')),
    'use_speaker_boost': True,
}
TARGET_WPS, LO, HI = 2.5, 1.9, 3.3
# Delivery pace: v3 reads near 160 words a minute. Slow every clip slightly (pitch kept),
# and cap any clip at MAX_WPS, so the narration lands near 145 to 150 words a minute.
TEMPO = float(os.environ.get('TTS_TEMPO', '0.93'))
MAX_WPS = float(os.environ.get('TTS_MAX_WPS', '2.85'))


def cues_for(cuts):
    js = ("import('./cuts.mjs').then(m => { const o = []; for (const c of process.argv.slice(1)) "
          "for (const b of m.CUTS[c].beats) for (const q of b.cues) o.push({ id: q.id, text: q.tts || q.text }); "
          "console.log(JSON.stringify(o)); })")
    out = subprocess.run(['node', '--input-type=module', '-e', js, *cuts], cwd=HERE, capture_output=True, text=True, check=True)
    seen, res = set(), []
    for c in json.loads(out.stdout):
        if c['id'] not in seen:
            seen.add(c['id']); res.append(c)
    return res


def probe(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)], capture_output=True, text=True)
    return float(r.stdout.strip())


def trim(src, dst):
    # Remove leading and trailing silence, keep 60 ms of air, 48 kHz mono 16-bit.
    af = ('silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.06,'
          'areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.06,areverse')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-af', af, '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', str(dst)], check=True)


def eleven(text, dst):
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key or not VOICE:
        sys.exit('Set ELEVENLABS_API_KEY and ELEVEN_VOICE_ID.')
    body = json.dumps({'text': text, 'model_id': MODEL, 'voice_settings': SETTINGS}).encode()
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128',
                                 data=body, headers={'xi-api-key': key, 'Content-Type': 'application/json'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                dst.write_bytes(r.read())
            return
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors='ignore')[:300]
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(4 * (attempt + 1)); continue
            sys.exit(f'ElevenLabs HTTP {e.code}: {msg}')


_kokoro = None
def kokoro(text, dst):
    global _kokoro
    import soundfile as sf
    from kokoro_onnx import Kokoro
    if _kokoro is None:
        m = Path(os.environ.get('KOKORO_DIR', '/home/claude/tts-models'))
        _kokoro = Kokoro(str(m / 'kokoro-v1.0.onnx'), str(m / 'voices-v1.0.bin'))
    samples, sr = _kokoro.create(text, voice=os.environ.get('KOKORO_VOICE', 'am_michael'), speed=0.95, lang='en-us')
    sf.write(str(dst), samples, sr)


def render(cue):
    words = len(cue['text'].split())
    ident = {'engine': ENGINE, 'model': MODEL, 'voice': VOICE, 'settings': SETTINGS, 'text': cue['text']} if ENGINE == 'elevenlabs' \
        else {'engine': ENGINE, 'voice': os.environ.get('KOKORO_VOICE', 'am_michael'), 'text': cue['text']}
    h = hashlib.sha1(json.dumps(ident, sort_keys=True).encode()).hexdigest()[:16]
    final = CACHE / f'{h}.wav'
    if final.exists():
        return final, probe(final), words, 'cached'
    best = None
    for take in range(3):
        raw = CACHE / f'{h}.take{take}.{"mp3" if ENGINE == "elevenlabs" else "wav"}'
        (eleven if ENGINE == 'elevenlabs' else kokoro)(cue['text'], raw)
        cand = CACHE / f'{h}.take{take}.trim.wav'
        trim(raw, cand)
        d = probe(cand)
        wps = words / d
        score = abs(wps - TARGET_WPS)
        if best is None or score < best[0]:
            best = (score, cand, d)
        if LO <= wps <= HI or ENGINE != 'elevenlabs':
            break
        print(f'    take {take + 1}: {wps:.2f} words/s, out of range, re-rendering')
    best[1].rename(final)
    return final, best[2], words, 'new'


def main():
    cuts = sys.argv[1:] or ['core']
    cues = cues_for(cuts)
    mpath = OUT / 'manifest.json'
    manifest = json.loads(mpath.read_text()) if mpath.exists() else {}
    total = 0.0
    for c in cues:
        src, d, words, how = render(c)
        dst = OUT / f"{c['id']}.wav"
        tempo = TEMPO
        if words / (d / tempo) > MAX_WPS:
            tempo = max(0.82, MAX_WPS * d / words)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-af', f'atempo={tempo:.4f}', '-ar', '48000', '-ac', '1', str(dst)], check=True)
        d = probe(dst)
        manifest[c['id']] = {'file': dst.name, 'dur': round(d, 3), 'words': words, 'wps': round(words / d, 2), 'engine': ENGINE}
        total += d
        flag = '' if LO <= words / d <= HI else '  CHECK PACE'
        print(f"  {c['id']:<5} {d:6.2f}s {words / d:4.2f} w/s {how}{flag}")
    mpath.write_text(json.dumps(manifest, indent=1))
    print(f'{len(cues)} clips, {total / 60:.1f} min of narration, engine {ENGINE}' + (f', model {MODEL}' if ENGINE == 'elevenlabs' else ''))


if __name__ == '__main__':
    main()
