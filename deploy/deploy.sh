#!/usr/bin/env bash
# Usage: deploy.sh backend|frontend
# Pulls the latest image of one part of the app from ECR and restarts it.
# GitHub Actions runs this on the EC2 server through AWS SSM.
set -euo pipefail
cd "$(dirname "$0")"

case "${1:-}" in
  backend)
    docker compose pull migrate backend
    # Run migrations with the new image first. If they fail, set -e stops
    # the script here and the old backend keeps serving traffic.
    docker compose run --rm migrate
    docker compose up -d --no-deps backend
    ;;
  frontend)
    docker compose pull frontend
    docker compose up -d --no-deps frontend
    ;;
  *)
    echo "usage: $0 backend|frontend" >&2
    exit 1
    ;;
esac

docker image prune -f
docker compose ps -a
