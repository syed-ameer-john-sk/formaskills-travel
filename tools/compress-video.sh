#!/usr/bin/env bash
# Compress a source clip for the website: H.264 MP4 + VP9 WebM (no audio) and a JPEG poster.
#   tools/compress-video.sh <source.mp4> <name>      e.g.  tools/compress-video.sh ~/Downloads/Sete.mp4 sete
# Output: assets/video/<name>.mp4, <name>.webm, <name>-poster.jpg
# Portrait clips are scaled to 1080 px wide (1080x1920), landscape clips to 1920 px wide.
set -euo pipefail
src="$1"; name="$2"; out="$(dirname "$0")/../assets/video"; mkdir -p "$out"
scale="scale='if(gt(iw,ih),min(1920,iw),min(1080,iw))':-2"
ffmpeg -y -loglevel error -i "$src" -an -vf "$scale,fps=30" -c:v libx264 -preset slow -crf 27 -profile:v high -pix_fmt yuv420p -movflags +faststart "$out/$name.mp4"
ffmpeg -y -loglevel error -i "$src" -an -vf "$scale,fps=30" -c:v libvpx-vp9 -b:v 0 -crf 46 -row-mt 1 -deadline good -cpu-used 4 "$out/$name.webm"
ffmpeg -y -loglevel error -ss 1 -i "$src" -frames:v 1 -vf "scale='if(gt(iw,ih),1280,720)':-2" -q:v 4 "$out/$name-poster.jpg"
ls -la "$out/$name".* "$out/$name-poster.jpg"
