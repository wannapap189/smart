"""Restore the public SmartGift media bundles into smartgift-site/dist."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import tempfile
import urllib.request
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "smartgift-site" / "dist"
MANIFEST = json.loads((ROOT / "media-manifest.json").read_text(encoding="utf-8"))

def sha256(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()

def install(pack, archives):
    source = archives / pack["name"]
    if not source.exists():
        url = "https://github.com/wannapap189/smart/releases/download/" + MANIFEST["release"] + "/" + pack["name"]
        part = source.with_suffix(".part")
        with urllib.request.urlopen(url, timeout=180) as response, part.open("wb") as target:
            shutil.copyfileobj(response, target, 1024 * 1024)
        if part.stat().st_size != pack["bytes"] or sha256(part) != pack["sha256"]:
            part.unlink(missing_ok=True)
            raise ValueError("Download did not match manifest: " + source.name)
        part.replace(source)
    if source.stat().st_size != pack["bytes"] or sha256(source) != pack["sha256"]:
        raise ValueError("Bundle did not match manifest: " + source.name)
    with ZipFile(source) as bundle:
        entries = bundle.infolist()
        if len(entries) != pack["files"]:
            raise ValueError("Bundle did not match file count: " + source.name)
        for entry in entries:
            relative = PurePosixPath(entry.filename)
            if relative.is_absolute() or ".." in relative.parts or relative.parts[0] not in ("assets", "downloads") or "\\" in entry.filename:
                raise ValueError("Invalid media path")
            dest = DIST.joinpath(*relative.parts).resolve()
            if not dest.is_relative_to(DIST.resolve()):
                raise ValueError("Invalid media destination")
            dest.parent.mkdir(parents=True, exist_ok=True)
            with bundle.open(entry) as incoming, tempfile.NamedTemporaryFile(dir=dest.parent, delete=False) as output:
                temp = Path(output.name)
                try:
                    shutil.copyfileobj(incoming, output, 1024 * 1024)
                except BaseException:
                    output.close()
                    temp.unlink(missing_ok=True)
                    raise
            os.replace(temp, dest)
    print(source.name, pack["files"], "files", flush=True)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archives", type=Path, help="Keep and reuse verified downloaded ZIPs in this directory")
    options = parser.parse_args()
    (ROOT / ".media-cache").mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(dir=ROOT / ".media-cache") as temp:
        archives = options.archives or Path(temp)
        archives.mkdir(parents=True, exist_ok=True)
        for pack in MANIFEST["packs"]:
            install(pack, archives)

if __name__ == "__main__":
    main()

