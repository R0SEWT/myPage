#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$SCRIPT_DIR"
node generate-cv-projects.mjs

cd "$REPO_ROOT/cv"

if command -v pdflatex >/dev/null 2>&1; then
  pdflatex -interaction=nonstopmode main.tex
elif [ -x "$HOME/.local/bin/tectonic" ]; then
  "$HOME/.local/bin/tectonic" main.tex
elif command -v tectonic >/dev/null 2>&1; then
  tectonic main.tex
else
  echo "No LaTeX engine found. Install pdflatex or tectonic." >&2
  exit 127
fi

cp main.pdf "$REPO_ROOT/rosewt-astro/public/CV.pdf"
