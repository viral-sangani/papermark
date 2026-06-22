# Production image for Papermark (Next.js, Node 24).
# Multi-stage: install deps + build, then a lean runtime that runs `next start`.
#
# Native deps (canvas, sharp, mupdf, better-sqlite3) need build toolchain in the
# builder stage; the runtime stage keeps the built app + production node_modules.

# ---- deps + build ----------------------------------------------------------
FROM node:24-bookworm-slim AS builder
WORKDIR /app

# Toolchain + libs required to compile native modules (node-canvas etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ pkg-config \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

# Install dependencies against the lockfile.
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
# Allow native build scripts (prisma generate runs via postinstall).
RUN pnpm install --frozen-lockfile --prod=false

# Copy the rest of the source and build.
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Prisma client + Next.js production build.
RUN pnpm prisma generate && pnpm build

# ---- runtime ---------------------------------------------------------------
FROM node:24-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Runtime libs for the native modules (no -dev, just the shared libs).
RUN apt-get update && apt-get install -y --no-install-recommends \
    libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libjpeg62-turbo libgif7 librsvg2-2 \
    ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

# Bring over the built app and its dependencies.
COPY --from=builder /app ./

EXPOSE 3000
# Bind to all interfaces; the host maps this to an internal port.
CMD ["pnpm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
