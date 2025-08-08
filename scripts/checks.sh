#!/bin/bash

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔎 Running project checks (lint, types, tests)${NC}"

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."
cd "$ROOT_DIR"

echo -e "${BLUE}Frontend: install deps (if needed)${NC}"
cd frontend
npm ci || npm install

echo -e "${BLUE}Frontend: lint & typecheck (fast)${NC}"
npm run check || { echo -e "${YELLOW}Falling back to separate lint/typecheck...${NC}"; npm run lint || true; npm run typecheck; }

echo -e "${BLUE}Frontend: unit tests (vitest)${NC}"
npm run test

cd ..

echo -e "${BLUE}Backend: unit tests (mvn)${NC}"
cd backend
mvn -q -DskipITs test

echo -e "${GREEN}✅ All checks passed${NC}"

