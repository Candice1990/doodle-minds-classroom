"""Generate the Lesson 2 error explanations with en-US-AnaNeural.
Requires edge-tts, ffmpeg, ffprobe and Node. Existing playback stays intact on failure.
"""
import asyncio, json, os, subprocess, tempfile
from pathlib import Path
import edge_tts
import edge_tts.communicate as edge_communicate
from edge_tts.constants import TRUSTED_CLIENT_TOKEN
# Compatibility with Microsoft's October 2026 endpoint migration.
# Matches https://github.com/rany2/edge-tts/pull/491; leave future endpoints alone.
if 'speech.platform.bing.com/' in edge_communicate.WSS_URL:
    edge_communicate.WSS_URL = (
        'wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1'
        '?Ocp-Apim-Subscription-Key=' + TRUSTED_CLIENT_TOKEN
    )
ROOT = Path(__file__).resolve().parents[1]
VOICE = 'en-US-AnaNeural'
async def main():
    clips = json.loads(subprocess.check_output(['node', '-e', "process.stdout.write(JSON.stringify(require(process.argv[1]).clips))", str(ROOT/'error-narration.js')]))
    manifest = {}
    with tempfile.TemporaryDirectory(prefix='pip-ana-errors-') as temp:
        folder = Path(temp)
        for key, text in clips.items():
            source, target = folder/(key+'-raw.mp3'), folder/(key+'.mp3')
            await edge_tts.Communicate(text, VOICE).save(str(source))
            subprocess.run(['ffmpeg','-v','error','-y','-i',str(source),'-af','loudnorm=I=-20:TP=-3:LRA=8','-ar','44100','-ac','1',str(target)],check=True)
            seconds = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(target)]))
            if target.stat().st_size < 1000 or not 1 < seconds < 16:
                raise ValueError('Invalid recording: '+key)
            manifest[key] = {'src':'assets/errors/'+key+'.mp3?v=1','durationMs':round(seconds*1000),'voice':VOICE}
            print(key, round(seconds,2), 'seconds', flush=True)
        destination=ROOT/'assets/errors'
        destination.mkdir(exist_ok=True)
        for key in manifest:
            os.replace(folder/(key+'.mp3'), destination/(key+'.mp3'))
        staged=ROOT/'error-voice-assets.js.tmp'
        staged.write_text("'use strict';\nconst ErrorVoiceAssets=Object.freeze("+json.dumps(manifest,indent=2)+");\n")
        os.replace(staged,ROOT/'error-voice-assets.js')
        print('Published',len(manifest),'verified Ana clips.')
if __name__=='__main__':
    try: asyncio.run(main())
    except Exception as error:
        print('Generation failed; existing voice assets were not replaced:',type(error).__name__,
              'status:',getattr(error,'status','unavailable'))
        raise SystemExit(1)
