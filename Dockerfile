FROM node:18.20.5-slim

# Install build tools for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g corepack@0.24.1 && corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy package files and npmrc config
COPY package.json pnpm-lock.yaml .npmrc ./
COPY patches ./patches

# Cache bust to force fresh install with new .npmrc (hoisted linker)
ARG CACHEBUST=20260228_002

# Install dependencies - hoisted linker + build from source for native modules
RUN pnpm install --frozen-lockfile

# Verify better-sqlite3 compiled and accessible
RUN node -e "require('better-sqlite3')" && echo 'better-sqlite3 OK'

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Create data directory
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["pnpm", "start"]
