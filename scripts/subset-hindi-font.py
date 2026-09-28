"""Subset the Devanagari display font to the Hindi text actually used in src/.

The full font (assets/fonts/tiro-devanagari-hindi-full.woff2, ~99 KB) is cut
down to only the glyphs the invitation renders (~5 KB), keeping every OpenType
layout feature so matras and conjuncts still shape correctly.

Re-run after adding or changing any Hindi text:
    pip install fonttools brotli && npm run fonts
"""
import pathlib
import re
import subprocess

root = pathlib.Path(__file__).resolve().parent.parent
chars = set()
for path in (root / "src").rglob("*.ts*"):
    for run in re.findall(r"[ऀ-ॿ‌‍]+", path.read_text(encoding="utf-8")):
        chars |= set(run)

subprocess.run(
    [
        "pyftsubset",
        str(root / "assets/fonts/tiro-devanagari-hindi-full.woff2"),
        f"--text={''.join(sorted(chars))}",
        "--layout-features=*",
        "--flavor=woff2",
        f"--output-file={root / 'src/app/fonts/tiro-devanagari-hindi.woff2'}",
    ],
    check=True,
)
print(f"Subset to {len(chars)} characters: {''.join(sorted(chars))}")
