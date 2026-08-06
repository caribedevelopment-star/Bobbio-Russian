#!/usr/bin/env python3
"""Audit and migrate public portfolio media exposed by the Carrd page.

Uses only Python's standard library so it can run in CI without adding a package.
It never invents a project association: ambiguous assets remain unclassified.
"""
from __future__ import annotations

import hashlib
import html as html_lib
import json
import mimetypes
import re
import struct
import sys
from dataclasses import dataclass, asdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

PAGE_URL = "https://bobbio-russian.carrd.co/"
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/media/carrd"
DOC = ROOT / "docs/carrd-media-extraction.md"
CONTENT = ROOT / "src/content/media.ts"
SECTIONS = {
    "beyond-rendering": ("beyond rendering", "preciados"),
    "architecture-of-sustenance": ("architecture of sustenance", "sustenance"),
    "bio-design": ("bio-design", "biodesign", "urban ponics"),
    "profile": ("profile", "caracas", "about"),
    "oaya": ("oaya",),
    "homepage": ("hero", "home", "index"),
}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}


class CarrdParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(); self.urls: list[tuple[str, str]] = []; self.external: set[str] = set(); self.context = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = {k.lower(): html_lib.unescape(v or "") for k, v in attrs}
        context = " ".join(filter(None, [data.get("id"), data.get("class"), data.get("alt"), data.get("title"), self.context[-300:]]))
        for key in ("src", "data-src", "poster", "href"):
            value = data.get(key, "").strip()
            if value: self.add(value, context)
        for key in ("srcset", "data-srcset"):
            for candidate in data.get(key, "").split(","):
                if candidate.strip(): self.add(candidate.strip().split()[0], context)
        self.find_css(data.get("style", ""), context)

    def handle_data(self, data: str) -> None:
        self.context = (self.context + " " + data.strip())[-600:]
        self.find_css(data, self.context)
        for match in re.findall(r'https?://[^\s"\'<>\\)]+', data):
            if "vimeo.com" in match or "twinmotion" in match: self.external.add(html_lib.unescape(match))

    def find_css(self, value: str, context: str) -> None:
        for match in re.findall(r"url\(\s*['\"]?([^)'\"]+)", value, flags=re.I): self.add(match, context)

    def add(self, value: str, context: str) -> None:
        absolute = urljoin(PAGE_URL, value)
        host = urlparse(absolute).netloc.lower()
        if "vimeo.com" in host or "twinmotion" in host:
            self.external.add(absolute)
        elif urlparse(absolute).scheme in {"http", "https"}:
            self.urls.append((absolute, context))


@dataclass
class Asset:
    originalUrl: str; localPath: str; originalFilename: str; filename: str
    section: str; fileType: str; width: int; height: int; bytes: int
    appearsCompressed: bool; originalRecommended: bool; confidence: str; intendedUse: str; sha256: str


def fetch(url: str) -> tuple[bytes, str]:
    request = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; PortfolioMediaAudit/1.0)"})
    with urlopen(request, timeout=45) as response:
        return response.read(), response.headers.get_content_type()


def dimensions(data: bytes, kind: str) -> tuple[int, int]:
    try:
        if kind == "png" and data.startswith(b"\x89PNG"): return struct.unpack(">II", data[16:24])
        if kind == "gif": return struct.unpack("<HH", data[6:10])
        if kind == "webp" and data[12:16] == b"VP8X": return (1 + int.from_bytes(data[24:27], "little"), 1 + int.from_bytes(data[27:30], "little"))
        if kind == "jpeg":
            i = 2
            while i + 9 < len(data):
                if data[i] != 0xFF: i += 1; continue
                marker = data[i + 1]; length = int.from_bytes(data[i + 2:i + 4], "big")
                if marker in range(0xC0, 0xC4): return (int.from_bytes(data[i + 7:i + 9], "big"), int.from_bytes(data[i + 5:i + 7], "big"))
                i += 2 + length
    except (IndexError, struct.error): pass
    return 0, 0


def image_kind(data: bytes) -> str:
    if data.startswith(b"\x89PNG\r\n\x1a\n"): return "png"
    if data.startswith((b"GIF87a", b"GIF89a")): return "gif"
    if data.startswith(b"\xff\xd8\xff"): return "jpeg"
    if data.startswith(b"RIFF") and data[8:12] == b"WEBP": return "webp"
    if len(data) > 12 and data[4:12] in {b"ftypavif", b"ftypavis"}: return "avif"
    return ""


def classify(url: str, context: str) -> tuple[str, str]:
    haystack = f"{url} {context}".lower().replace("_", "-")
    hits = [section for section, words in SECTIONS.items() if any(word in haystack for word in words)]
    return (hits[0], "high") if len(hits) == 1 else ("unclassified", "low")


def clean_extension(url: str, kind: str, content_type: str) -> str:
    suffix = Path(urlparse(url).path).suffix.lower()
    if suffix in IMAGE_EXTENSIONS: return ".jpg" if suffix == ".jpeg" else suffix
    return {"jpeg": ".jpg", "png": ".png", "gif": ".gif", "webp": ".webp"}.get(kind, mimetypes.guess_extension(content_type) or ".bin")


def write_outputs(assets: list[Asset], external: list[str], error: str = "") -> None:
    CONTENT.parent.mkdir(parents=True, exist_ok=True)
    payload = [{k: v for k, v in asdict(a).items() if k != "sha256"} for a in assets]
    CONTENT.write_text("""export type MigratedMedia = {\n  originalUrl: string; localPath: string; originalFilename: string; filename: string;\n  section: MediaSection; fileType: string; width: number; height: number; bytes: number;\n  appearsCompressed: boolean; originalRecommended: boolean; confidence: \"high\" | \"low\"; intendedUse: string;\n};\nexport type MediaSection = \"homepage\" | \"beyond-rendering\" | \"profile\" | \"oaya\" | \"architecture-of-sustenance\" | \"bio-design\" | \"unclassified\";\n\nexport const carrdMedia: MigratedMedia[] = """ + json.dumps(payload, indent=2) + ";\n\nexport const externalMedia = " + json.dumps(external, indent=2) + " as const;\n", encoding="utf-8")
    rows = "\n".join(f"| {a.originalUrl} | `{a.localPath}` | {a.originalFilename} | {a.filename} | {a.section} | {a.fileType} | {a.width}×{a.height} | {a.bytes} | {'yes' if a.appearsCompressed else 'unknown'} | {'yes' if a.originalRecommended else 'no'} | {a.confidence} | {a.intendedUse} |" for a in assets) or "| — | — | — | — | — | — | — | — | — | — | — | No assets extracted |"
    external_summary = "- Source HTML was unavailable, so external references could not be audited." if error else ("\n".join(f"- {url}" for url in external) or "- None detected in the fetched HTML.")
    DOC.write_text(f"""# Carrd media extraction\n\nSource: {PAGE_URL}\n\nThis is a reproducible audit of Carrd's publicly exposed **web derivatives**; extracted files must not be described as original-resolution source files. Important project media should be replaced with authorized originals later.\n\n## Extraction status\n\n{error or f'Successfully migrated {len(assets)} unique image assets and recorded {len(external)} external media references.'}\n\n## Assets\n\n| Original Carrd URL | Local path | Original filename | New filename | Detected section | Type | Dimensions | Bytes | Appears compressed | Higher-resolution original recommended | Association confidence | Intended use |\n|---|---|---|---|---|---|---:|---:|---|---|---|---|\n{rows}\n\n## External interactive media\n\n{external_summary}\n""", encoding="utf-8")


def main() -> int:
    try:
        if len(sys.argv) > 1: page = Path(sys.argv[1]).read_bytes(); content_type = "text/html"
        else: page, content_type = fetch(PAGE_URL)
        if "html" not in content_type or b"<html" not in page[:2000].lower(): raise ValueError("Carrd response was not HTML")
    except Exception as exc:
        write_outputs([], [], f"Extraction could not reach Carrd: `{type(exc).__name__}: {exc}`. Re-run `npm run media:extract-carrd` in an environment with public network access; no fabricated records were created.")
        print(f"Carrd extraction failed: {exc}", file=sys.stderr); return 1
    parser = CarrdParser(); parser.feed(page.decode("utf-8", errors="replace"))
    OUTPUT.mkdir(parents=True, exist_ok=True); seen_urls: set[str] = set(); by_hash: dict[str, Asset] = {}; counters: dict[str, int] = {}
    for url, context in parser.urls:
        if url in seen_urls: continue
        seen_urls.add(url)
        try: data, content_type = fetch(url)
        except Exception as exc: print(f"skip {url}: {exc}", file=sys.stderr); continue
        kind = image_kind(data)
        if not kind or len(data) < 1024 or data[:32].lstrip().lower().startswith((b"<html", b"<!doctype")): continue
        width, height = dimensions(data, kind)
        if width and height and width * height <= 4096: continue
        digest = hashlib.sha256(data).hexdigest(); section, confidence = classify(url, context)
        if digest in by_hash: continue
        counters[section] = counters.get(section, 0) + 1; ext = clean_extension(url, kind, content_type)
        filename = f"{section}-carrd-{counters[section]:03d}{ext}"; directory = OUTPUT / ("hero" if section == "homepage" else section); directory.mkdir(parents=True, exist_ok=True)
        target = directory / filename; target.write_bytes(data)
        asset = Asset(url, target.relative_to(ROOT).as_posix(), Path(urlparse(url).path).name, filename, section, kind, width, height, len(data), True, True, confidence, "Project media candidate" if section != "unclassified" else "Manual classification required", digest)
        by_hash[digest] = asset
    write_outputs(list(by_hash.values()), sorted(parser.external)); print(f"Migrated {len(by_hash)} unique assets"); return 0


if __name__ == "__main__": raise SystemExit(main())
