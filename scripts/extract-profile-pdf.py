#!/usr/bin/env python3
"""Create a traceable text audit from the uploaded LinkedIn profile PDF."""
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "Profile.pdf"
OUTPUT = ROOT / "docs/profile-pdf-extraction.md"

if not PDF.is_file():
    OUTPUT.write_text("# Profile PDF extraction\n\n`Profile.pdf` is not present in this checkout.\n", encoding="utf-8")
    print("Profile.pdf is missing", file=sys.stderr)
    raise SystemExit(1)
if not shutil.which("pdftotext"):
    print("pdftotext is required (package: poppler-utils)", file=sys.stderr)
    raise SystemExit(1)

result = subprocess.run(
    ["pdftotext", "-layout", str(PDF), "-"],
    check=True, capture_output=True, text=True,
)
text = "\n".join(line.rstrip() for line in result.stdout.splitlines()).strip()
if len(text) < 100:
    print("Profile.pdf produced insufficient text; OCR may be required", file=sys.stderr)
    raise SystemExit(1)

OUTPUT.write_text(
    "# Profile PDF extraction\n\n"
    "> Source transcription generated from the uploaded `Profile.pdf`. This is an audit source, not website copy. "
    "Professional claims still require contextual review before publication.\n\n"
    "```text\n" + text.replace("```", "` ` `") + "\n```\n",
    encoding="utf-8",
)
print(f"Extracted {len(text)} characters from Profile.pdf")
