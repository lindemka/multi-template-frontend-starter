#!/bin/bash

# Rapid SQL executor against dev DB endpoints
# Usage:
#   echo "SELECT * FROM users LIMIT 3" | ./scripts/sql.sh
#   ./scripts/sql.sh -f query.sql
#   ./scripts/sql.sh -t dml "UPDATE users SET username='new' WHERE id=1"

set -euo pipefail

TYPE="auto"   # auto|query|ddl|dml|batch
FILE=""

usage() {
  cat <<USAGE
Usage: ./scripts/sql.sh [options] [SQL]

Options:
  -f <file>    Read SQL from file
  -t <type>    query|ddl|dml|batch|auto (default: auto)
  -h           Help

Examples:
  echo "SELECT * FROM users LIMIT 3" | ./scripts/sql.sh
  ./scripts/sql.sh -f schema.sql -t ddl
  ./scripts/sql.sh -t dml "UPDATE users SET enabled=false WHERE id=42"
USAGE
}

while getopts ":f:t:h" opt; do
  case $opt in
    f) FILE="$OPTARG" ;;
    t) TYPE="$OPTARG" ;;
    h) usage; exit 0 ;;
    *) usage; exit 1 ;;
  esac
done
shift $((OPTIND-1))

if [ -n "$FILE" ]; then
  SQL_CONTENT=$(cat "$FILE")
elif [ -p /dev/stdin ]; then
  SQL_CONTENT=$(cat -)
else
  SQL_CONTENT=${1:-}
fi

if [ -z "${SQL_CONTENT}" ]; then
  echo "No SQL provided. See -h for usage." >&2
  exit 1
fi

trimmed=$(echo "$SQL_CONTENT" | sed 's/^\s*//;s/\s*$//')
first_word=$(echo "$trimmed" | awk '{print toupper($1)}')

if [ "$TYPE" = "auto" ]; then
  case "$first_word" in
    SELECT|WITH) TYPE="query" ;;
    INSERT|UPDATE|DELETE) TYPE="dml" ;;
    CREATE|ALTER|DROP|TRUNCATE) TYPE="ddl" ;;
    *) TYPE="query" ;;
  esac
fi

ENCODED=$(jq -Rs . <<< "$SQL_CONTENT")

case "$TYPE" in
  query)
    ENDPOINT="/api/db/query" ;;
  ddl)
    ENDPOINT="/api/db/ddl" ;;
  dml)
    ENDPOINT="/api/db/dml" ;;
  batch)
    # Expect newline-separated statements; convert to JSON array
    JSON_ARRAY=$(printf '%s' "$SQL_CONTENT" | awk 'NF' | jq -R -s 'split("\n") | map(select(length>0))')
    curl -s -X POST http://localhost:8080/api/db/batch \
      -H 'Content-Type: application/json' \
      -d "{\"statements\": ${JSON_ARRAY}}" | jq '.'
    exit $?
    ;;
  *) echo "Unknown type: $TYPE" >&2; exit 1 ;;
esac

curl -s -X POST http://localhost:8080${ENDPOINT} \
  -H 'Content-Type: application/json' \
  -d "{\"sql\": ${ENCODED}}" | jq '.'


