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
# HINDI EXPERIMENT: the translations get their own, lazily loaded font (below),
# so the always-loaded font stays tiny for English visitors.
I18N_TEXT = root / "src/i18n/translations.ts"

chars = set()
all_chars = set()
for path in (root / "src").rglob("*.ts*"):
    for run in re.findall(r"[ऀ-ॿ‌‍]+", path.read_text(encoding="utf-8")):
        all_chars |= set(run)
        if path != I18N_TEXT:
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

# HINDI EXPERIMENT: full-site Hindi font, downloaded only when Hindi is chosen.
if I18N_TEXT.exists():
    subprocess.run(
        [
            "pyftsubset",
            str(root / "assets/fonts/tiro-devanagari-hindi-full.woff2"),
            f"--text={''.join(sorted(all_chars))}",
            "--layout-features=*",
            "--flavor=woff2",
            f"--output-file={root / 'src/i18n/tiro-hindi-i18n.woff2'}",
        ],
        check=True,
    )
    print(f"Hindi-mode font: {len(all_chars)} characters")
