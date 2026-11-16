#!/usr/bin/env python3
"""Bölüm 1: zaman çizelgesi -> dudak senkronu verisi (veri01.js) + miks (ses01.wav)."""
import json, re, subprocess
from pathlib import Path
import numpy as np

U = Path(__file__).resolve().parent
SES = U.parent / "ses" / "bolum-01"
SFX = U / "sfx"
CIKTI = U.parent / "cikti"
CIKTI.mkdir(exist_ok=True)
FPS = 24
SURE = 120.0

TAKLIT = "asetrate=44100*0.94,aresample=44100,atempo=1.0638,aecho=0.8:0.6:110|260:0.35|0.2,highpass=f=120"
TELEFON = "highpass=f=320,lowpass=f=3300,acompressor=threshold=0.1:ratio=4"

# (dosya, zaman, kim, efekt, ses, dudak_önde)
REPLIK = [
    ("001_NEVIN_TAKLIT", 1.6, "NEVIN_T", TAKLIT, 1.0, 0),
    ("002_REMZI", 10.0, "REMZI", "", 1.0, 0),
    ("003_ECE", 13.2, "ECE", "", 1.0, 0),
    ("004_REMZI", 18.0, "REMZI", "", 1.0, 0),
    ("005_ECE", 20.5, "ECE", "", 1.0, 0),
    ("006_REMZI", 22.3, "REMZI", "", 1.0, 0),
    ("007_ECE", 46.5, "ECE", "", 1.0, 0),
    ("008_NEVIN", 70.2, "NEVIN", TELEFON, 1.1, 0),
    ("009_ECE", 76.5, "ECE", "", 1.0, 0),
    ("010_NEVIN_TAKLIT", 96.0, "NEVIN_T", TAKLIT, 1.0, 0),
    ("011_ECE", 99.8, "ECE", "", 1.0, 0),
    ("012_NEVIN_TAKLIT", 112.8, "NEVIN_T", TAKLIT, 1.1, 0.5),
]

KNOCK = [114.0, 115.15, 116.3]
# (dosya, zaman, ses, ek filtre, uzunluk sınırı)
EFEKT = [
    ("kalp", 0.0, 0.7, "", 6),
    ("bas", 3.9, 0.9, "", 4),
    ("merdiven", 6.0, 0.6, "", 10),
    ("tesbih", 9.2, 0.45, "", 4),
    ("asansor", 23.8, 0.8, "", 5),
    ("kapi_kapan", 30.6, 0.7, "", 2.5),
    ("sehir", 32.0, 0.4, "aloop=loop=1:size=661500", 26),
    ("koli", 34.6, 0.8, "", 2),
    ("muzik_huzun", 36.0, 0.33, "", 22),
    ("tik", 46.2, 0.5, "", 0.5),
    ("tik", 54.3, 0.5, "", 0.5),
    ("gece", 58.0, 0.45, "aloop=loop=2:size=882000", 59.5),
    ("muzik_gerilim", 63.0, 0.38, "aloop=loop=1:size=1323000", 54.5),
    ("titresim", 61.0, 0.9, "", 2),
    ("bildirim", 69.0, 0.8, "", 1),
    ("tik", 70.0, 0.5, "", 0.5),
    ("cizirti", 70.2, 0.25, "", 3),
    ("cizirti", 73.2, 0.25, "", 3),
    ("bas", 82.3, 0.6, "", 4),
    ("zil", 82.4, 1.0, "", 3),
    ("gicirti", 88.0, 0.8, "", 2),
    ("bas", 95.2, 0.7, "", 4),
    ("anahtar", 103.9, 0.7, "afade=t=out:st=0.8:d=0.3", 1.1),
    ("bildirim", 105.2, 0.9, "", 1),
    ("kalp", 108.0, 0.6, "", 6),
    ("yukselen", 108.0, 0.6, "", 6),
    ("bildirim", 119.0, 0.7, "", 1),
] + [("vurus3", t, 1.0, "atrim=0.45:0.92,asetpts=PTS-STARTPTS", 0.47) for t in KNOCK]


def sure(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                          "-of", "csv=p=0", str(f)]))


def zarf(f):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                         capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(float) / 32768
    n = 16000 // FPS
    e = np.array([np.sqrt((a[i:i + n] ** 2).mean()) for i in range(0, len(a) - n + 1, n)])
    e = np.convolve(e, [0.25, 0.5, 0.25], "same")
    e = np.clip(e / (np.percentile(e, 95) + 1e-6), 0, 1) ** 0.8
    e[e < 0.12] = 0
    return [round(float(x), 3) for x in e]


def altyazi_metni(dosya):
    csv = (SES / "liste.csv").read_text(encoding="utf-8").splitlines()
    sira = int(dosya[:3])
    import csv as c
    satir = list(c.reader(csv))[sira]
    return re.sub(r"\[[^\]]+\]\s*", "", satir[5]).strip()


def main():
    veri = {"fps": FPS, "sure": SURE, "replik": [], "knock": KNOCK}
    for dosya, t, kim, _, _, onde in REPLIK:
        f = SES / f"{dosya}.mp3"
        veri["replik"].append({"t": t, "kim": kim, "sure": sure(f), "zarf": zarf(f),
                               "onde": onde, "metin": altyazi_metni(dosya)})
    (U / "veri01.js").write_text("window.DATA=" + json.dumps(veri, ensure_ascii=False) + ";", encoding="utf-8")

    girdiler, filtre, etiket = [], [], []
    for i, (dosya, t, kim, ef, vol, _) in enumerate(REPLIK):
        girdiler += ["-i", str(SES / f"{dosya}.mp3")]
        zincir = f"[{len(girdiler)//2-1}:a]aresample=44100,aformat=channel_layouts=stereo"
        if ef:
            zincir += "," + ef
        zincir += f",volume={vol},adelay={int(t*1000)}|{int(t*1000)}[r{i}]"
        filtre.append(zincir)
        etiket.append(f"[r{i}]")
    for i, (dosya, t, vol, ek, uz) in enumerate(EFEKT):
        girdiler += ["-i", str(SFX / f"{dosya}.mp3")]
        zincir = f"[{len(girdiler)//2-1}:a]aresample=44100,aformat=channel_layouts=stereo"
        if ek:
            zincir += "," + ek
        fade_in = 1.5 if dosya.startswith(("muzik", "sehir", "gece")) else 0
        zincir += f",atrim=0:{uz},asetpts=PTS-STARTPTS"
        if fade_in:
            zincir += f",afade=t=in:d={fade_in},afade=t=out:st={max(uz-1.5,0)}:d=1.5"
        zincir += f",volume={vol},adelay={int(t*1000)}|{int(t*1000)}[e{i}]"
        filtre.append(zincir)
        etiket.append(f"[e{i}]")
    # amix başlangıcı ilk girişin zamanına kayar; 0. saniyeden başlayan sessiz bir taban ekle
    filtre.append(f"anullsrc=r=44100:cl=stereo,atrim=0:{SURE}[taban]")
    etiket.insert(0, "[taban]")
    filtre.append("".join(etiket) + f"amix=inputs={len(etiket)}:normalize=0,"
                  f"atrim=0:{SURE},alimiter=limit=0.95,loudnorm=I=-14:TP=-1.5:LRA=11[out]")
    cmd = ["ffmpeg", "-y", "-v", "error"] + girdiler + ["-filter_complex", ";".join(filtre),
                                                       "-map", "[out]", "-ar", "48000", str(U / "ses01.wav")]
    subprocess.run(cmd, check=True)
    print("ok", sure(U / "ses01.wav"))


if __name__ == "__main__":
    main()
