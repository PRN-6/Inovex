# Inovex Optimization Scripts

This directory contains utility scripts to optimize media assets for the project.

## Scripts

### 1. `compress_images.py`
Recursively walks through `frontend/public/images` and compresses WebP, PNG, and JPEG files using the Pillow library. It also resizes images larger than 1920px width.
**Requirements:** `pip install Pillow`

### 2. `compress_videos.py`
Recursively walks through `frontend/public/videos` and compresses WebM and MP4 files using FFmpeg (via `imageio-ffmpeg`). It strips audio to save additional space for background loops.
**Requirements:** `pip install imageio imageio-ffmpeg`

## Usage
Run from the project root:
```bash
python scripts/compress_images.py
python scripts/compress_videos.py
```

For SVG optimization, `svgo` is installed as a dev dependency in the frontend:
```bash
cd frontend
npx svgo public/images/logo.svg -o public/images/logo.svg
```
