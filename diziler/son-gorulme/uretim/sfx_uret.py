#!/usr/bin/env python3
"""Bölüm 1 efekt ve müziklerini ElevenLabs'tan üretir (var olanları atlar)."""
import json, os, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

D = Path(__file__).resolve().parent / "sfx"
D.mkdir(exist_ok=True)
KEY = os.environ.get("ELEVENLABS_API_KEY", "dummy")

SFX = {
    "zil": ("old apartment doorbell ding-dong, single ring, in a quiet dark hallway at night", 3),
    "vurus3": ("three slow heavy knocks on an old wooden apartment door, dry and close, pauses between knocks", 4),
    "merdiven": ("footsteps climbing marble stairs in an echoing old stairwell, slow tired steps, cardboard rustle", 10),
    "tesbih": ("amber prayer beads clicking slowly in a hand, close up", 4),
    "asansor": ("old elevator motor starting, deep mechanical hum from the basement, ominous", 5),
    "sehir": ("distant city ambience through an open window at sunset, Istanbul, seagulls calling", 15),
    "titresim": ("smartphone vibrating on a wooden nightstand in a silent room", 2),
    "bildirim": ("short soft smartphone message notification chime, two gentle tones", 1),
    "tik": ("soft single phone screen tap click", 0.5),
    "gicirti": ("old wooden floorboard creak under a bare foot", 2),
    "gece": ("dead quiet old apartment at night, faint refrigerator hum, room tone", 20),
    "bas": ("deep cinematic horror bass hit boom with long reverb tail", 4),
    "yukselen": ("horror tension riser building up, strings and noise, ending abruptly", 6),
    "cizirti": ("crackling static and distortion of a broken voice message", 3),
    "otomatik": ("stairwell timer light buzzing then clicking off", 3),
    "anahtar": ("key slowly turning in an old door lock, metal scrape, very close", 2),
    "koli": ("two cardboard boxes put down on a wooden floor, dust", 2),
    "kalp": ("slow heavy heartbeat, muffled, horror", 6),
}
MUZIK = {
    "muzik_huzun": ("Melancholic minimal solo piano, slow, sparse notes, grief and nostalgia, soft room reverb, no drums, instrumental", 40000),
    "muzik_gerilim": ("Dark minimal horror underscore, low sustained drones, subtle dissonant strings, slow heartbeat pulse, building dread, instrumental, no melody, no drums", 70000),
}


def post(url, body, out):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST",
                                 headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        out.write_bytes(r.read())
    return out.name


def job(item):
    ad, (metin, sure) = item
    out = D / f"{ad}.mp3"
    if out.exists():
        return ad + " (var)"
    if ad.startswith("muzik"):
        return post("https://api.elevenlabs.io/v1/music",
                    {"prompt": metin, "music_length_ms": sure, "force_instrumental": True}, out)
    return post("https://api.elevenlabs.io/v1/sound-generation",
                {"text": metin, "duration_seconds": sure, "prompt_influence": 0.6}, out)


with ThreadPoolExecutor(4) as ex:
    for r in ex.map(job, list(SFX.items()) + list(MUZIK.items())):
        print("ok", r)
