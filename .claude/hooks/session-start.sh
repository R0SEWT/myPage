#!/usr/bin/env bash
# SessionStart: make beads usable, then print its workflow context.
#
# Locally this is just `bd prime`. In a Claude Code cloud session the
# container starts without bd and without the embedded Dolt database (it is
# gitignored), so install bd and clone the database first. The clone reads
# refs/dolt/data over HTTPS through BD_SYNC_REMOTE, leaving the SSH remote in
# .beads/config.yaml untouched. Cloud sessions cannot push refs/dolt/data
# (the git proxy only accepts the session branch), so they close by exporting
# to .beads/issues.jsonl instead — see CLAUDE.md, "Session Completion".
set -u

if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  export BD_SYNC_REMOTE="git+https://github.com/R0SEWT/myPage.git"
  if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
    echo "export BD_SYNC_REMOTE=\"$BD_SYNC_REMOTE\"" >> "$CLAUDE_ENV_FILE"
  fi
  if ! command -v bd >/dev/null 2>&1; then
    npm install -g @beads/bd >/dev/null 2>&1 || echo "beads: npm install failed" >&2
  fi
  if command -v bd >/dev/null 2>&1 && ! bd list >/dev/null 2>&1; then
    chmod 700 .beads 2>/dev/null
    bd bootstrap --yes >/dev/null 2>&1 || echo "beads: bootstrap failed" >&2
    # Bootstrap may rewrite sync.remote to the HTTPS override; keep the SSH one.
    git checkout -- .beads/config.yaml 2>/dev/null
    # Earlier cloud sessions could only record work in the JSONL, so the clone
    # of refs/dolt/data can be behind it. Import only applies newer rows.
    bd import -i .beads/issues.jsonl >/dev/null 2>&1 || echo "beads: JSONL import failed" >&2
  fi
fi

command -v bd >/dev/null 2>&1 && bd prime
exit 0
