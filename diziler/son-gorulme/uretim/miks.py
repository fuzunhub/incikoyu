"""Bölümler için ortak: dudak senkronu verisi (vediNN.js) ve miks (sesNN.wav)."""
import csv, json, re, subprocess
from pathlib import Path
import numpy as np

U = Path(__file__).resolve().parent
SFX = U / "sfx"
FPS = 24
TAKLIT = "asetrate=44100*0.94,aresample=44100,atempo=1.0638,aecho=0.8:0.6:110|260:0.35|0.2,highpass=f=120"
TELEFON = "highpass=f=320,lowpass=f=3300,acompressor=threshold=0.1:ratio=4"
SURGULU = ("muzik", "sehir", "gece", "sessizlik")


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


def uret(bolum, sure_sn, replik, efekt, ek_veri=None):
    """replik: (dosya, t, kim, efekt_filtresi, ses, dudak_önde); efekt: (dosya, t, ses, ek_filtre, uzunluk)."""
    ses = U.parent / "ses" / f"bolum-{bolum:02d}"
    satirlar = list(csv.reader((ses / "liste.csv").read_text(encoding="utf-8").splitlines()))
    veri = {"fps": FPS, "sure": sure_sn, "replik": []}
    veri.update(ek_veri or {})
    for dosya, t, kim, _, _, onde in replik:
        f = ses / f"{dosya}.mp3"
        metin = re.sub(r"\[[^\]]+\]\s*", "", satirlar[int(dosya[:3])][5]).strip()
        veri["replik"].append({"t": t, "kim": kim, "sure": sure(f), "zarf": zarf(f), "onde": onde, "metin": metin})
    (U / f"veri{bolum:02d}.js").write_text("window.DATA=" + json.dumps(veri, ensure_ascii=False) + ";", encoding="utf-8")

    girdiler, filtre, etiket = [], [], []
    filtre.append(f"anullsrc=r=44100:cl=stereo,atrim=0:{sure_sn}[taban]")
    etiket.append("[taban]")
    for i, (dosya, t, kim, ef, vol, _) in enumerate(replik):
        girdiler += ["-i", str(ses / f"{dosya}.mp3")]
        z = f"[{len(girdiler)//2-1}:a]aresample=44100,aformat=channel_layouts=stereo"
        z += ("," + ef if ef else "") + f",volume={vol},adelay={int(t*1000)}|{int(t*1000)}[r{i}]"
        filtre.append(z); etiket.append(f"[r{i}]")
    for i, (dosya, t, vol, ek, uz) in enumerate(efekt):
        girdiler += ["-i", str(SFX / f"{dosya}.mp3")]
        z = f"[{len(girdiler)//2-1}:a]aresample=44100,aformat=channel_layouts=stereo"
        z += ("," + ek if ek else "") + f",atrim=0:{uz},asetpts=PTS-STARTPTS"
        if dosya.startswith(SURGULU):
            z += f",afade=t=in:d=1.5,afade=t=out:st={max(uz-1.5,0)}:d=1.5"
        z += f",volume={vol},adelay={int(t*1000)}|{int(t*1000)}[e{i}]"
        filtre.append(z); etiket.append(f"[e{i}]")
    filtre.append("".join(etiket) + f"amix=inputs={len(etiket)}:normalize=0,"
                  f"atrim=0:{sure_sn},alimiter=limit=0.95,loudnorm=I=-14:TP=-1.5:LRA=11[out]")
    subprocess.run(["ffmpeg", "-y", "-v", "error"] + girdiler + ["-filter_complex", ";".join(filtre),
                    "-map", "[out]", "-ar", "48000", str(U / f"ses{bolum:02d}.wav")], check=True)
    print("ok", sure(U / f"ses{bolum:02d}.wav"))
