#!/usr/bin/env python3
"""Builds the final video for one cut from the capture frames, timeline and narration audio.

Usage: python3 video/assemble.py <cut>
Reads:  video/out/<cut>/{frames.json, frames/, timeline.json}, video/out/audio/{manifest.json, *.wav}
Writes: video/out/<cut>/ai-assistor-<cut>.mp4 (master), -muted.mp4, .srt, chapters.txt, report.json

Picture rules: footage is cut to the narration windows, so anything between cues that is marked
`cut` (persona switches, reloads) never appears. Beats are joined with a short crossfade;
the first and last frames of each beat are held (not re-shot) to cover the crossfade.
Audio: each clip is placed at its cue start; final loudness -16 LUFS, true peak -1.5 dBTP.
"""
import json, subprocess, sys, statistics, shutil
from pathlib import Path

HERE = Path(__file__).resolve().parent
cut = sys.argv[1] if len(sys.argv) > 1 else 'core'
D = HERE / 'out' / cut
A = HERE / 'out' / 'audio'
W = D / 'work'
shutil.rmtree(W, ignore_errors=True); W.mkdir(parents=True)

FPS = 30
XF = 0.6 if cut != 'teaser' else 0.35   # crossfade between beats
HEAD = 0.45                              # held first frame before a beat's narration
END_HOLD = 4.0                           # freeze on the last frame
SLATE = 4.0


def run(*a, **k):
    r = subprocess.run([str(x) for x in a], capture_output=True, text=True, **k)
    if r.returncode:
        sys.exit(f"Command failed: {' '.join(map(str, a))[:300]}\n{r.stderr[-1500:]}")
    return r


def dur(p):
    return float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p).stdout.strip())


frames = json.loads((D / 'frames.json').read_text())
tl = json.loads((D / 'timeline.json').read_text())
if tl.get('dry'):
    print('Note: assembling a dry capture (estimated timings).')
cues = tl['timeline']
manifest = json.loads((A / 'manifest.json').read_text())

# Map cue start times (node clock) onto the frame clock.
skew = statistics.median(f['rx'] - f['ts'] for f in frames)
T0 = frames[0]['ts']
vt = lambda node_t: node_t - skew - T0

# 1. Constant frame rate video of the whole capture. For every 1/30 s output frame, take the latest
#    captured frame at or before that instant and pipe it to ffmpeg. Exact; no duration rounding.
import bisect
raw = W / 'raw.mp4'
print('Encoding capture to constant frame rate...')
tss = [f['ts'] for f in frames]
span = tss[-1] - T0 + 0.5
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'mjpeg', '-i', '-',
                        '-vf', 'format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-r', str(FPS), str(raw)],
                       stdin=subprocess.PIPE)
cache_i, cache_b = -1, b''
for k in range(int(span * FPS)):
    i = max(0, bisect.bisect_right(tss, T0 + k / FPS) - 1)
    if i != cache_i:
        cache_i, cache_b = i, (D / 'frames' / frames[i]['f']).read_bytes()
    enc.stdin.write(cache_b)
enc.stdin.close()
if enc.wait():
    sys.exit('Frame encode failed')

# 2. Beats: group cues, cut footage windows, place narration.
beats = {}
for c in cues:
    beats.setdefault(c['beat'], []).append(c)

beat_files, srt, chapters = [], [], []
cut_meta = json.loads(run('node', '--input-type=module', '-e',
    f"import('./cuts.mjs').then(m=>{{const c=m.CUTS['{cut}'];console.log(JSON.stringify({{slate:c.slate,titles:c.beats.map(b=>b.title)}}))}})", cwd=HERE).stdout)

for bi, bc in sorted(beats.items()):
    groups = []
    for c in bc:
        if c['cut'] or not groups:
            groups.append([])
        groups[-1].append(c)
    segs, placements, t = [], [], HEAD
    for gi, g in enumerate(groups):
        s = vt(g[0]['start'])
        e = vt(g[-1]['start']) + g[-1]['dur'] + g[-1]['gap']
        seg = W / f'b{bi}g{gi}.mp4'
        run('ffmpeg', '-v', 'error', '-y', '-ss', f'{s:.3f}', '-i', raw, '-t', f'{e - s:.3f}', '-an',
            '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-r', FPS, seg)
        segs.append(seg)
        for c in g:
            placements.append((c, t + vt(c['start']) - s))
        t += e - s
    body = t - HEAD
    # Picture: held first frame (HEAD), segments, held last frame (XF) for the crossfade.
    vin = []
    for sgm in segs:
        vin += ['-i', sgm]
    n = len(segs)
    fc = ''.join(f'[{i}:v]' for i in range(n)) + f'concat=n={n}:v=1:a=0[c];[c]tpad=start_mode=clone:start_duration={HEAD}:stop_mode=clone:stop_duration={XF}[v]'
    # Audio: each clip delayed to its cue start, mixed, padded to the picture length.
    total = HEAD + body + XF
    ain, amix = [], []
    for k, (c, at) in enumerate(placements):
        ain += ['-i', A / manifest[c['id']]['file']]
        ms = int(round(at * 1000))
        amix.append(f'[{n + k}:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={ms}|{ms}[a{k}]')
    fc += ';' + ';'.join(amix) + ';' + ''.join(f'[a{k}]' for k in range(len(placements))) + \
        f'amix=inputs={len(placements)}:normalize=0:duration=longest,apad=whole_dur={total:.3f},atrim=0:{total:.3f}[a]'
    bf = W / f'beat{bi}.mp4'
    run('ffmpeg', '-v', 'error', '-y', *vin, *ain, '-filter_complex', fc, '-map', '[v]', '-map', '[a]',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-r', FPS, '-c:a', 'pcm_s16le', '-ar', '48000', bf.with_suffix('.mkv'))
    beat_files.append((bf.with_suffix('.mkv'), placements, cut_meta['titles'][bi]))
    print(f'  beat {bi + 1}: {total:.1f}s, {len(groups)} segment(s), {len(placements)} lines')

# 3. Slate (core and extended only).
parts = []
if cut_meta.get('slate'):
    s = cut_meta['slate']
    html = (HERE / 'slate.html').read_text().replace('{{K}}', s['k']).replace('{{T}}', s['t']).replace('{{S}}', s['s'])
    (W / 'slate.html').write_text(html)
    run('node', '--input-type=module', '-e',
        "import('playwright').then(async({chromium})=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});"
        f"await p.goto('file://{(W / 'slate.html').as_posix()}');await p.waitForTimeout(400);await p.screenshot({{path:'{(W / 'slate.png').as_posix()}'}});await b.close();}})",
        cwd=HERE.parent)
    sl = W / 'slate.mkv'
    run('ffmpeg', '-v', 'error', '-y', '-loop', '1', '-t', SLATE + XF, '-i', W / 'slate.png', '-f', 'lavfi', '-t', SLATE + XF, '-i', 'anullsrc=r=48000:cl=stereo',
        '-vf', f'fps={FPS},format=yuv420p,fade=t=in:st=0:d=0.5', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-c:a', 'pcm_s16le', '-shortest', sl)
    parts.append((sl, [], 'Title'))
parts += beat_files

# 4. Join with crossfades; last part gets the end freeze.
inputs, durs = [], []
for p, _, _ in parts:
    inputs += ['-i', p]
    durs.append(dur(p))
fc, vprev, aprev, off = [], '[0:v]', '[0:a]', 0.0
starts = [0.0]
for i in range(1, len(parts)):
    off += durs[i - 1] - XF
    starts.append(off)
    fc.append(f'{vprev}[{i}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}[v{i}]')
    fc.append(f'{aprev}[{i}:a]acrossfade=d={XF}:c1=tri:c2=tri[a{i}]')
    vprev, aprev = f'[v{i}]', f'[a{i}]'
fc.append(f'{vprev}tpad=stop_mode=clone:stop_duration={END_HOLD}[vo]')
fc.append(f'{aprev}apad=pad_dur={END_HOLD}[ao]')
joined = W / 'joined.mkv'
print('Joining beats...')
run('ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(fc), '-map', '[vo]', '-map', '[ao]',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-c:a', 'pcm_s16le', joined)

# 5. Loudness: two-pass loudnorm to -16 LUFS, -1.5 dBTP.
meas = run('ffmpeg', '-hide_banner', '-i', joined, '-vn', '-af', 'loudnorm=I=-16:TP=-2:LRA=11:print_format=json', '-f', 'null', '-').stderr
m = json.loads(meas[meas.rindex('{'):meas.rindex('}') + 1])
ln = (f"loudnorm=I=-16:TP=-2:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")

# 6. Chapters and subtitles from the final timeline.
meta = [';FFMETADATA1']
def ts(x):
    h, r = divmod(x, 3600); mm, ss = divmod(r, 60)
    return f'{int(h):02d}:{int(mm):02d}:{int(ss):02d},{int((ss % 1) * 1000):03d}'
total_len = durs[-1] + starts[-1] + END_HOLD
idx = 1
for i, (p, placements, title) in enumerate(parts):
    end = starts[i + 1] if i + 1 < len(parts) else total_len
    meta += ['[CHAPTER]', 'TIMEBASE=1/1000', f'START={int(starts[i] * 1000)}', f'END={int(end * 1000)}', f'title={title}']
    for c, at in placements:
        a0 = starts[i] + at
        srt.append(f"{idx}\n{ts(a0)} --> {ts(a0 + c['dur'])}\n{c['text']}\n")
        idx += 1
(D / 'chapters.txt').write_text('\n'.join(meta) + '\n')
(D / f'ai-assistor-{cut}.srt').write_text('\n'.join(srt))

# 7. Final encode: H.264 main, 30 fps CFR, yuv420p, AAC 48 kHz stereo, chapters, faststart.
master = D / f'ai-assistor-{cut}.mp4'
print('Final encode...')
run('ffmpeg', '-v', 'error', '-y', '-i', joined, '-i', D / 'chapters.txt', '-map_metadata', '1', '-map_chapters', '1',
    '-map', '0:v', '-map', '0:a', '-af', ln + ',aresample=48000',
    '-c:v', 'libx264', '-profile:v', 'main', '-level', '4.1', '-preset', 'slow', '-crf', '19', '-maxrate', '7M', '-bufsize', '14M',
    '-pix_fmt', 'yuv420p', '-r', FPS, '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', master)
muted = D / f'ai-assistor-{cut}-muted.mp4'
run('ffmpeg', '-v', 'error', '-y', '-i', master, '-map', '0:v', '-c', 'copy', '-an', '-movflags', '+faststart', muted)

# 8. Report.
probe = json.loads(run('ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', master).stdout)
v = next(s for s in probe['streams'] if s['codec_type'] == 'video')
a = next((s for s in probe['streams'] if s['codec_type'] == 'audio'), None)
post = run('ffmpeg', '-hide_banner', '-i', master, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-').stderr
li = [l for l in post.splitlines() if l.strip().startswith(('I:', 'Peak:'))]
report = {
    'file': master.name, 'duration_s': round(float(probe['format']['duration']), 2),
    'size_mb': round(int(probe['format']['size']) / 1e6, 1), 'video': f"{v['codec_name']} {v.get('profile')} {v['width']}x{v['height']} {v['r_frame_rate']} {v['pix_fmt']}",
    'audio': f"{a['codec_name']} {a['sample_rate']} Hz {a['channels']} ch" if a else 'NONE',
    'loudness': [l.strip() for l in li][-2:], 'chapters': [(round(s, 1), t) for s, (_, _, t) in zip(starts, parts)],
    'dry_capture': bool(tl.get('dry')),
}
(D / 'report.json').write_text(json.dumps(report, indent=1))
print(json.dumps(report, indent=1))
