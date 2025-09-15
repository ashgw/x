#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/_utils.sh"

# Validate required env vars
require_env "NEXT_PUBLIC_WWW_URL"
require_env "X_API_TOKEN"

# Perform request
echo "→ Purging trash posts from $NEXT_PUBLIC_WWW_URL"
curl -fsSL -X DELETE \
  "$NEXT_PUBLIC_WWW_URL/api/v1/purge-trash-posts" \
  -H "x-api-token: $X_API_TOKEN" \
  --connect-timeout 5 --max-time 30 \
  --retry 3 --retry-delay 2 --retry-connrefused

echo "✅ Trash posts purge completed."

