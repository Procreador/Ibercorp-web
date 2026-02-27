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

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install dependencies - force rebuild of native modules for this exact Node version
RUN CFLAGS="-I/usr/include/python3" npm_config_build_from_source=true pnpm install --frozen-lockfile

# Verify better-sqlite3 compiled
RUN node -e "require('better-sqlite3')" && echo 'better-sqlite3 OK'

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Create data directory
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["pnpm", "start"]
