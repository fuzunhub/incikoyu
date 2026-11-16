#!/usr/bin/env python3
"""Bölüm 2 "Islak İzler": zaman çizelgesi."""
from miks import uret, TAKLIT

KNOCK = [0.25, 1.45, 2.65]
REPLIK = [
    ("001_NEVIN_TAKLIT", 4.3, "NEVIN_T", TAKLIT, 1.0, 0),
    ("002_ECE", 11.3, "ECE", "", 1.0, 0),
    ("003_ECE_TAKLIT", 14.6, "ECE_T", TAKLIT, 1.15, 0),
    ("004_ECE", 36.8, "ECE", "", 1.0, 0),
    ("005_REMZI", 56.2, "REMZI", "", 1.0, 0),
    ("006_ECE", 58.1, "ECE", "", 1.0, 0),
    ("007_REMZI", 61.7, "REMZI", "", 1.0, 0),
    ("008_ECE", 65.0, "ECE", "", 1.0, 0),
]
SWITCH = [28.1, 29.7, 31.3, 32.9, 34.4]
EFEKT = [
    ("kayma", 0.0, 0.8, "", 2.5),
    ("gece", 0.0, 0.45, "aloop=loop=1:size=882000", 34.4),
    ("muzik_gerilim", 0.0, 0.32, "aloop=loop=1:size=1323000", 34.6),
    ("kalp", 3.5, 0.5, "", 6),
    ("kumas", 9.5, 0.7, "", 3),
    ("bas", 14.5, 0.8, "", 4),
    ("yukselen", 10.0, 0.45, "", 6),
    ("gicirti", 16.2, 0.7, "", 2),
    ("yazma", 22.4, 0.7, "", 2),
    ("bildirim", 25.6, 0.9, "", 1),
    ("kosma", 27.3, 0.6, "", 4),
    ("kosma", 31.0, 0.6, "", 3.4),
    ("flore", 31.3, 0.5, "", 2),
    ("muzik_huzun", 36.0, 0.25, "", 6),
    ("zincir", 42.2, 0.8, "", 3),
    ("sessizlik_ton", 42.0, 0.4, "", 15),
    ("damla", 46.0, 0.6, "aloop=loop=2:size=264600", 14),
    ("merdiven", 52.0, 0.45, "", 3),
    ("bas", 56.2, 0.5, "", 4),
    ("tesbih", 67.8, 0.5, "", 4),
    ("merdiven", 68.0, 0.35, "", 4),
    ("muzik_gerilim", 70.0, 0.35, "", 16),
    ("kamera", 72.0, 0.9, "", 0.6),
    ("kalp", 74.0, 0.5, "", 6),
    ("bas", 76.4, 0.6, "", 4),
    ("yukselen", 80.0, 0.55, "", 6),
    ("bas", 84.4, 1.0, "", 4),
    ("bildirim", 88.6, 0.7, "", 1),
] + [("vurus3", t, 0.9, "atrim=0.45:0.92,asetpts=PTS-STARTPTS", 0.47) for t in KNOCK] \
  + [("dugme", t, 0.9, "", 0.6) for t in SWITCH]

if __name__ == "__main__":
    uret(2, 90.0, REPLIK, EFEKT, {"knock": KNOCK, "switch": SWITCH})
