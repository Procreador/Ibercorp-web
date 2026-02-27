FROM node:18.20.5-slim

# Install build tools for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm and node-gyp globally
RUN npm install -g corepack@0.24.1 && corepack enable && corepack prepare pnpm@10.4.1 --activate
RUN npm install -g node-gyp

WORKDIR /app

# Cache bust
ARG CACHEBUST=20260228_005

# Copy all files first
COPY . .

# Install dependencies with pnpm (hoisted via .npmrc)
RUN pnpm install --no-frozen-lockfile

# Force rebuild better-sqlite3 from source using npm rebuild
RUN npm rebuild better-sqlite3 --build-from-source

# Verify it works
RUN node -e "const db = require('better-sqlite3')(':memory:'); console.log('better-sqlite3 OK');"

# Build the application
RUN pnpm run build

# Create data directory
RUN mkdir -p /app/data

EXPOSE 3000
CMD ["pnpm", "start"]
