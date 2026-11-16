#!/bin/bash
# Bölüm 1: render + 1 sn kapak + paylaşım sürümü
set -e
cd "$(dirname "$0")"
node render.js
node kapak_render.js
cd ../cikti
ffmpeg -v error -y -i ../uretim/tmp/kapak.mp4 -i ../uretim/sfx/bas.mp3 -i ../uretim/sfx/cizirti.mp3 -i bolum-01.mp4 -filter_complex "[1:a]atrim=0:1,volume=1.2,aresample=48000,aformat=channel_layouts=stereo[b];[2:a]atrim=0:1,volume=0.5,afade=t=out:st=0.6:d=0.4,aresample=48000,aformat=channel_layouts=stereo[c];[b][c]amix=inputs=2:normalize=0,apad,atrim=0:1[ka];[0:v]setsar=1[kv];[3:v]setsar=1[ev];[3:a]aresample=48000,aformat=channel_layouts=stereo[ea];[kv][ka][ev][ea]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart bolum-01-kapakli.mp4
mv bolum-01-kapakli.mp4 bolum-01.mp4
ffmpeg -v error -y -i bolum-01.mp4 -c:v libx264 -preset slow -crf 25 -c:a copy -movflags +faststart bolum-01-paylasim.mp4
echo BITTI
