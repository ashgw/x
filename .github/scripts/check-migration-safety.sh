#!/bin/bash

# Check if migration file is provided
if [ -z "$1" ]; then
    echo "::error::No migration file provided"
    exit 1
fi

MIGRATION_FILE="$1"

# Function to check for patterns and exit if found
check_pattern() {
    local pattern=$1
    local message=$2
    if grep -i "$pattern" "$MIGRATION_FILE" > /dev/null; then
        echo "::error::$message"
        # Don't expose the actual migration content
        echo "::error::Found unsafe migration pattern. Please review the migration file."
        exit 1
    fi
}

# Function to warn about patterns
warn_pattern() {
    local pattern=$1
    local message=$2
    if grep -i "$pattern" "$MIGRATION_FILE" > /dev/null; then
        echo "::warning::$message"
        # Don't expose the actual migration content
        echo "::warning::Found migration pattern that requires review."
    fi
}

echo "Checking migration safety..."

# Critical checks (will fail the workflow)
check_pattern "DROP COLUMN" "DANGER: Migration contains DROP COLUMN operations!"
check_pattern "DROP TABLE" "DANGER: Migration contains DROP TABLE operations!"
check_pattern "ALTER TABLE.*RENAME" "DANGER: Migration contains RENAME operations!"

# Warning checks (will show warnings but continue)
warn_pattern "ALTER COLUMN.*TYPE" "WARNING: Migration contains column type changes!"
warn_pattern "ALTER TABLE.*DROP CONSTRAINT" "WARNING: Migration drops constraints!"
warn_pattern "CREATE INDEX" "WARNING: New indexes being created!"

# Check for data migration statements
if grep -i "UPDATE.*SET" "$MIGRATION_FILE" > /dev/null; then
    echo "::warning::WARNING: Migration contains data updates!"
    echo "::warning::Please verify data migration strategy!"
fi

echo "Migration safety check completed." 
exit 0