#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT/cv"

build_pdf() {
  local tex_file="$1"

  if command -v pdflatex >/dev/null 2>&1; then
    pdflatex -interaction=nonstopmode "$tex_file"
  elif [ -x "$HOME/.local/bin/tectonic" ]; then
    "$HOME/.local/bin/tectonic" "$tex_file"
  elif command -v tectonic >/dev/null 2>&1; then
    tectonic "$tex_file"
  else
    echo "No LaTeX engine found. Install pdflatex or tectonic." >&2
    exit 127
  fi
}

build_pdf main.en.tex
build_pdf main.es.tex

cp main.en.pdf "$REPO_ROOT/rosewt-arariwa/public/CV.en.pdf"
cp main.es.pdf "$REPO_ROOT/rosewt-arariwa/public/CV.es.pdf"

echo "CVs copiados a rosewt-arariwa/public/"
