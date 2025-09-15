#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/_utils.sh"

require_env "NEXT_PUBLIC_WWW_URL"
require_env "X_CRON_TOKEN"

echo "→ Purging view window from $NEXT_PUBLIC_WWW_URL"
curl -fsSL -X DELETE \
  "$NEXT_PUBLIC_WWW_URL/api/v1/purge-view-window" \
  -H "x-cron-token: $X_CRON_TOKEN"
  --connect-timeout 5 --max-time 30 \
  --retry 3 --retry-delay 2 --retry-connrefused

echo "✅ View window purge completed."

