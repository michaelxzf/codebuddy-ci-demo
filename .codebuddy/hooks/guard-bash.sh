#!/bin/bash
# PreToolUse guard: block destructive shell commands and secret exfiltration.
input=$(cat)
cmd=$(printf '%s' "$input" | /usr/bin/python3 -c 'import sys,json; print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null)
if printf '%s' "$cmd" | grep -Eq 'rm -rf /|rm -rf ~|git push (-f|--force)|curl[^|]*\| *(sh|bash)|printenv|CODEBUDDY_API_KEY'; then
  echo "Blocked by .codebuddy/hooks/guard-bash.sh: '$cmd' violates repo policy (destructive or secret-leaking command)."
  exit 2
fi
exit 0
