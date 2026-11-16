#!/usr/bin/env python3
"""SON GÖRÜLME: bölüm senaryolarındaki replikleri ElevenLabs ile seslendirir.

Senaryoda '>' ile başlayan her satır bir repliktir:
    > ECE (fısıltı) [whispers]: "Nine? Sen misin?"
Parantez içinde TAKLIT geçen satırlar Taklitçi'dir: dosya adına _TAKLIT eklenir.

Kullanım:
    python3 seslendir.py --bolum 1 --kuru   # listele, kredi harcamaz
    python3 seslendir.py --bolum 1          # üret
    python3 seslendir.py --hepsi            # 20 bölüm
    python3 seslendir.py --bolum 3 --sadece BARIŞ   # tek karakter

API anahtarı ELEVENLABS_API_KEY ortam değişkeninden okunur.
"""
import argparse
import csv
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent
SATIR = re.compile(r'^>\s*([A-ZÇĞİÖŞÜ]+)\s*(?:\(([^)]*)\))?\s*((?:\[[^\]]+\]\s*)*):\s*"?(.*?)"?\s*$')
SAHNE = re.compile(r'^##\s*(SAHNE\s*\d+)')


def ascii_ad(s):
    s = s.replace("İ", "I").replace("ı", "i")
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()


def replikler(bolum_no):
    dosya = KOK / "bolumler" / f"bolum-{bolum_no:02d}.md"
    sahne = ""
    out = []
    for satir in dosya.read_text(encoding="utf-8").splitlines():
        m = SAHNE.match(satir)
        if m:
            sahne = m.group(1)
            continue
        m = SATIR.match(satir)
        if not m:
            continue
        kisi, not_, etiketler, metin = m.groups()
        not_ = not_ or ""
        # *(sesli nefes alıyor)* gibi sahne yönergelerini sesten çıkar
        metin = re.sub(r'"\s*\*\([^)]*\)\*\s*"', " ", metin)
        metin = (etiketler or "").strip() + " " + metin.strip().strip('"')
        if re.search(r"(?<![\wçğıöşü])[Nn]ine(?![\wçğıöşü])", metin):
            print(f"  UYARI: tek başına 'Nine' İngilizce 'nayn' okunabiliyor, 'Nineciğim' gibi bir biçim kullan: {metin[:60]}", file=sys.stderr)
        out.append({
            "kisi": kisi,
            "taklit": "TAKLIT" in not_.upper(),
            "not": not_,
            "sahne": sahne,
            "metin": metin.strip(),
        })
    return out


def seslendir(api_key, ayar, kisi_ayar, r, hedef):
    stability = ayar["taklit_stability"] if r["taklit"] else kisi_ayar.get("stability", 0.5)
    govde = {
        "text": r["metin"],
        "model_id": ayar["model_id"],
        "language_code": ayar.get("language_code", "tr"),
        "voice_settings": {"stability": stability},
    }
    url = (f"https://api.elevenlabs.io/v1/text-to-speech/{kisi_ayar['voice_id']}"
           f"?output_format={ayar['output_format']}")
    istek = urllib.request.Request(
        url, data=json.dumps(govde).encode(), method="POST",
        headers={"xi-api-key": api_key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    for deneme in range(4):
        try:
            with urllib.request.urlopen(istek, timeout=120) as yanit:
                hedef.write_bytes(yanit.read())
                return
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and deneme < 3:
                time.sleep(2 ** (deneme + 1))
                continue
            raise SystemExit(f"HATA {e.code} ({r['kisi']}): {e.read().decode(errors='ignore')[:300]}")


def main():
    p = argparse.ArgumentParser()
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--bolum", type=int)
    g.add_argument("--hepsi", action="store_true")
    p.add_argument("--kuru", action="store_true", help="sadece listele")
    p.add_argument("--sadece", help="yalnızca bu karakter")
    p.add_argument("--uzerine-yaz", action="store_true", help="var olan dosyaları yeniden üret")
    a = p.parse_args()

    ayar = json.loads((KOK / "sesler.json").read_text(encoding="utf-8"))
    bolumler = range(1, 21) if a.hepsi else [a.bolum]
    api_key = os.environ.get("ELEVENLABS_API_KEY", "")
    if not a.kuru and not api_key:
        sys.exit("ELEVENLABS_API_KEY tanımlı değil.")

    toplam = 0
    for b in bolumler:
        liste = replikler(b)
        klasor = KOK / "ses" / f"bolum-{b:02d}"
        if not a.kuru:
            klasor.mkdir(parents=True, exist_ok=True)
        karakter = sum(len(r["metin"]) for r in liste)
        toplam += karakter
        print(f"\n== Bölüm {b:02d}: {len(liste)} replik, {karakter} karakter ==")
        satirlar = []
        for i, r in enumerate(liste, 1):
            kisi_ayar = ayar["karakterler"].get(r["kisi"])
            if not kisi_ayar:
                sys.exit(f"sesler.json'da '{r['kisi']}' yok (bölüm {b}).")
            ad = f"{i:03d}_{ascii_ad(r['kisi'])}{'_TAKLIT' if r['taklit'] else ''}.mp3"
            satirlar.append([i, r["kisi"], "evet" if r["taklit"] else "", r["sahne"], r["not"], r["metin"], ad])
            print(f"  {ad:28s} {r['sahne']:9s} {r['metin'][:70]}")
            if a.kuru or (a.sadece and r["kisi"] != a.sadece):
                continue
            hedef = klasor / ad
            if hedef.exists() and not a.uzerine_yaz:
                continue
            seslendir(api_key, ayar, kisi_ayar, r, hedef)
        if not a.kuru:
            with open(klasor / "liste.csv", "w", newline="", encoding="utf-8") as f:
                w = csv.writer(f)
                w.writerow(["sira", "karakter", "taklit", "sahne", "not", "metin", "dosya"])
                w.writerows(satirlar)
    print(f"\nToplam {toplam} karakter.")


if __name__ == "__main__":
    main()
