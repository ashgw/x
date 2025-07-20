#!/bin/bash

set -euo pipefail

MIGRATION_FILE="$1"
if [[ -z "$MIGRATION_FILE" || ! -f "$MIGRATION_FILE" ]]; then
  echo "::error::Invalid migration file path"
  exit 1
fi

echo "🔍 Inspecting migration SQL for high-risk operations..."

warn_if() {
  local pattern="$1"
  local label="$2"
  if grep -Eiq "$pattern" "$MIGRATION_FILE"; then
    echo "::warning::[$label] Detected: '$pattern' in migration file. Manual review recommended."
  fi
}

fail_if() {
  local pattern="$1"
  local label="$2"
  if grep -Eiq "$pattern" "$MIGRATION_FILE"; then
    echo "::error::[$label] Critical operation detected. Migration blocked. Pattern: '$pattern'"
    exit 1
  fi
}

# === Critical Failures (block the CI) ===

# Renames can break ORMs, downstream queries, cache, etc.
fail_if 'ALTER TABLE.*RENAME (COLUMN|TO)' "Rename Table/Column"

# Dangerous cascading deletions
fail_if 'DROP TABLE .* CASCADE' "Drop Table with CASCADE"

# Overwrites/replaces
fail_if 'CREATE OR REPLACE' "Overwrites Existing Definitions"

# === Warnings (allow but alert) ===

# Type changes can break assumptions in app logic
warn_if 'ALTER TABLE .* ALTER COLUMN .* TYPE' "Column Type Change"

# Constraints dropped = implicit data integrity shift
warn_if 'ALTER TABLE .* DROP CONSTRAINT' "Constraint Dropped"

# Data migrations inside migration file — highlight
warn_if 'UPDATE .* SET' "Data Update"
warn_if 'INSERT INTO' "Bulk Insert"
warn_if 'DELETE FROM' "Delete Operation"

# Indexing changes — just flag
warn_if 'CREATE INDEX' "New Index"
warn_if 'DROP INDEX' "Index Removed"

# Anything with function/procedure
warn_if 'CREATE (FUNCTION|PROCEDURE)' "New Logic Layer"
warn_if 'DROP (FUNCTION|PROCEDURE)' "Logic Layer Removed"

# Column drops — optional fail or warn depending on team policy
warn_if 'DROP COLUMN' "Column Dropped"

echo "✅ Migration inspection complete. No critical issues."
exit 0
