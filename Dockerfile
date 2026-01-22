FROM node:20-slim

# Install OpenSSL (required by Prisma) and global utilities with network resilience
RUN apt-get update -y && apt-get install -y openssl ca-certificates \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 10 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm install -g concurrently typescript

WORKDIR /app

# 1. Install Backend Dependencies
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci

# 2. Install Frontend Dependencies
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci

# 3. Copy Source Code
COPY backend ./backend/
COPY frontend ./frontend/

# 4. Generate Prisma & Build Backend
RUN cd backend && npx prisma generate && npm run build

# 5. Build Frontend
# Note: Pass NEXT_PUBLIC_API_URL as build-arg if you want to bake it in, 
# otherwise it defaults to what's in local .env or current shell if not set.
# For runtime config, Next.js requires rebuild or specialized config.
# We assume standard build here.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Skip static optimization check failures if API is down during build
ENV NEXT_IGNORE_ESLINT=1
ENV NEXT_IGNORE_TYPE_CHECKS=1

RUN cd frontend && npm run build

# 6. Cleanup (Optional: Remove devDependencies to save space, but tricky with monorepo-ish structure without workspaces)
# Keeping simple for now to avoid breaking builds.

# Expose Ports
EXPOSE 3000
EXPOSE 5000

# Start Both Services
CMD concurrently --kill-others-on-fail \
    "cd backend && npm start" \
    "sleep 10 && cd frontend && PORT=3000 npm start"
