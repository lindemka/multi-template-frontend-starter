#!/bin/bash

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

usage() {
  cat <<USAGE
Usage: ./scripts/db.sh [command]

Commands:
  up        Start Postgres (docker-compose) and Adminer
  down      Stop and remove containers (data persisted under ./.data/postgres)
  psql      Open psql shell (requires psql client)
  info      Print connection info

USAGE
}

CMD=${1:-}

case "$CMD" in
  up)
    echo -e "${BLUE}Starting Postgres and Adminer...${NC}"
    docker compose up -d db adminer
    echo -e "${GREEN}DB: localhost:5432, user=postgres, db=project1${NC}"
    echo -e "${GREEN}Adminer: http://localhost:8081 (server: db, user: postgres)${NC}"
    ;;
  down)
    echo -e "${BLUE}Stopping Postgres and Adminer...${NC}"
    docker compose down
    ;;
  psql)
    echo -e "${BLUE}Opening psql...${NC}"
    PGPASSWORD=${DB_PASSWORD:-password} psql -h localhost -p 5432 -U postgres -d project1
    ;;
  info)
    echo -e "${GREEN}DB URL:${NC} jdbc:postgresql://localhost:5432/project1"
    echo -e "${GREEN}User:${NC} postgres  ${GREEN}Password:${NC} ${DB_PASSWORD:-password}"
    echo -e "${GREEN}Adminer:${NC} http://localhost:8081"
    ;;
  *)
    usage; exit 1 ;;
esac

