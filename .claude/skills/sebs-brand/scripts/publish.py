"""Publica las capas 0 y 1 (tokens.css, chrome.css) al portafolio.

El master vive en assets/ de esta skill. El portafolio sirve la copia en
brand/, que al hacer push queda en https://sebs.mx/brand/. Nunca editar
brand/ a mano.

Uso:  python publish.py [--check]
"""
import filecmp
import shutil
import sys
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
SRC = SKILL / "assets"
DST = Path(r"E:\20_AREAS\sebs\sitio\portfolio\brand")
FILES = ("tokens.css", "chrome.css")


def main() -> int:
    check = "--check" in sys.argv
    DST.mkdir(parents=True, exist_ok=True)
    stale = []
    for name in FILES:
        src, dst = SRC / name, DST / name
        same = dst.exists() and filecmp.cmp(src, dst, shallow=False)
        if same:
            print(f"  = {name}  al dia")
            continue
        stale.append(name)
        if check:
            print(f"  ! {name}  desactualizado en brand/")
        else:
            shutil.copyfile(src, dst)
            print(f"  > {name}  copiado a {dst}")
    if check and stale:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
