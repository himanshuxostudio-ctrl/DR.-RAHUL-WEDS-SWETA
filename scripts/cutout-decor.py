"""
Isolate the two decorative couples from their plain paper backgrounds.

Reads assets/originals/decor/*.webp (untouched) and writes lossless,
transparent, tightly trimmed PNGs to assets/decor-cutouts/, which
`npm run images` turns into the public WebP files.

Method: model the (slightly uneven) paper colour, measure each pixel's
difference from it, treat low-difference regions that touch the border —
or are large enclosed gaps, e.g. between arms and garlands — as paper,
then soften the edge and remove the paper tint from edge pixels so no
white halo shows on the maroon page.

    pip install pillow numpy scipy opencv-python-headless
    python3 scripts/cutout-decor.py
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/originals/decor"
OUT = ROOT / "assets/decor-cutouts"

T_BG = 9.0  # max channel difference still counted as paper
HOLE_MIN = 350  # enclosed paper-coloured gaps larger than this (px) are cleared
EDGE_LO, EDGE_HI = 5.0, 26.0  # difference range mapped to the soft edge


def paper_model(img: np.ndarray) -> np.ndarray:
    """Smooth per-pixel estimate of the paper colour."""
    h, w, _ = img.shape
    border = np.concatenate([img[:8].reshape(-1, 3), img[-8:].reshape(-1, 3), img[:, :8].reshape(-1, 3), img[:, -8:].reshape(-1, 3)])
    ref = np.median(border, axis=0)
    rough_fg = (np.abs(img - ref).max(axis=2) > 14).astype(np.uint8)
    s = 8
    small = cv2.resize(img.astype(np.uint8), (w // s, h // s), interpolation=cv2.INTER_AREA)
    m = cv2.resize(rough_fg * 255, (w // s, h // s), interpolation=cv2.INTER_NEAREST)
    m = cv2.dilate(m, np.ones((3, 3), np.uint8))
    filled = cv2.inpaint(small, m, 6, cv2.INPAINT_TELEA)
    filled = cv2.GaussianBlur(filled, (0, 0), 3)
    return cv2.resize(filled, (w, h), interpolation=cv2.INTER_CUBIC).astype(np.float32)


def cutout(path: Path) -> Image.Image:
    img = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    bg = paper_model(img)
    d = np.abs(img - bg).max(axis=2)
    d = cv2.GaussianBlur(d, (0, 0), 0.7)

    cand = d < T_BG
    lab, n = ndi.label(cand)
    sizes = ndi.sum(cand, lab, index=np.arange(1, n + 1))
    edge_labels = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    keep = np.zeros(n + 1, bool)
    for i, sz in enumerate(sizes, start=1):
        if i in edge_labels or sz >= HOLE_MIN:
            keep[i] = True
    paper = keep[lab]

    # soft edge only in a thin band around the paper boundary
    band = ndi.binary_dilation(paper, iterations=2) & ~ndi.binary_erosion(paper, iterations=2)
    soft = np.clip((d - EDGE_LO) / (EDGE_HI - EDGE_LO), 0, 1)
    soft = soft * soft * (3 - 2 * soft)
    alpha = np.where(paper, 0.0, 1.0)
    alpha = np.where(band, np.minimum(np.where(paper, soft * 0.6, 1.0), np.maximum(soft, 0.0)), alpha)
    alpha = cv2.GaussianBlur(alpha.astype(np.float32), (0, 0), 0.6)
    alpha[paper & ~band] = 0
    # pull the edge in ~1px so no paper-lit rim shows on dark backgrounds
    alpha = np.minimum(alpha, cv2.GaussianBlur(cv2.erode(alpha, np.ones((3, 3), np.uint8)), (0, 0), 0.5))
    # drop stray specks (paper grain, dust)
    solid, m = ndi.label(alpha > 0.3)
    if m > 1:
        area = ndi.sum(np.ones_like(alpha), solid, index=np.arange(1, m + 1))
        tiny = np.isin(solid, np.where(area < alpha.size * 0.0005)[0] + 1)
        alpha[ndi.binary_dilation(tiny, iterations=2)] = 0

    # un-mix the paper colour from semi-transparent edge pixels
    a = np.clip(alpha, 1e-3, 1)[..., None]
    fg = np.clip(bg + (img - bg) / a, 0, 255)
    fg = np.where(alpha[..., None] > 0.995, img, fg)

    rgba = np.dstack([fg, np.clip(alpha * 255, 0, 255)]).astype(np.uint8)
    ys, xs = np.where(alpha > 0.02)
    pad = 6
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, rgba.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, rgba.shape[1])
    return Image.fromarray(rgba[y0:y1, x0:x1], "RGBA")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src in sorted(SRC.glob("*.webp")):
        im = cutout(src)
        dst = OUT / f"{src.stem}.png"
        im.save(dst, optimize=True)
        print(f"✓ {dst.relative_to(ROOT)}  {im.width}×{im.height}")


if __name__ == "__main__":
    main()
