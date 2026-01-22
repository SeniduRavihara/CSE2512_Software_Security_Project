#!/bin/bash

# Stop any running containers
docker stop $(docker ps -q) 2>/dev/null

# Read environment variables from .env file
DATABASE_URL=$(grep DATABASE_URL backend/.env | cut -d '=' -f2- | tr -d '"')
JWT_SECRET=$(grep JWT_SECRET backend/.env | cut -d '=' -f2- | tr -d '"')

# Add connection timeout for Neon cold starts
DATABASE_URL="${DATABASE_URL}&connect_timeout=60"

echo "DEBUG: JWT_SECRET length: ${#JWT_SECRET}"
echo "DEBUG: DATABASE_URL starts with: ${DATABASE_URL:0:20}..."

# Run the container
docker run --rm --network host \
  -e DATABASE_URL="$DATABASE_URL" \
  -e JWT_SECRET="$JWT_SECRET" \
  -e PORT=5000 \
  test-app
