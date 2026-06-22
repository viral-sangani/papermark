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

# Pin pnpm to the version that produced pnpm-lock.yaml (v9 lockfile, pnpm 10.x).
# Newer pnpm (11.x, which corepack pulls by default) is stricter and rejects the
# integrity-less xlsx CDN tarball, breaking a frozen install.
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

# Install dependencies against the lockfile.
# Copy .npmrc too so the supply-chain age gate (minimumReleaseAge) is disabled —
# the lockfile is already pinned/vetted, and a fresh build "today" would
# otherwise reject very-recently-published deps.
COPY package.json pnpm-lock.yaml .npmrc ./
COPY prisma ./prisma
# Belt-and-suspenders: also disable the age gate via env in case the .npmrc key
# name differs across pnpm versions.
ENV npm_config_minimum_release_age=0
ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0
# Allow native build scripts (prisma generate runs via postinstall).
RUN pnpm install --frozen-lockfile --prod=false --config.minimumReleaseAge=0

# Copy the rest of the source and build.
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_* values are inlined at build time, so they must be present during
# `next build`. They are public (not secrets), passed as build args from compose.
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_MARKETING_URL
ARG NEXT_PUBLIC_APP_BASE_HOST
ARG NEXT_PUBLIC_WEBHOOK_BASE_URL
ARG NEXT_PUBLIC_WEBHOOK_BASE_HOST
ARG NEXT_PUBLIC_UPLOAD_TRANSPORT
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_MARKETING_URL=$NEXT_PUBLIC_MARKETING_URL \
    NEXT_PUBLIC_APP_BASE_HOST=$NEXT_PUBLIC_APP_BASE_HOST \
    NEXT_PUBLIC_WEBHOOK_BASE_URL=$NEXT_PUBLIC_WEBHOOK_BASE_URL \
    NEXT_PUBLIC_WEBHOOK_BASE_HOST=$NEXT_PUBLIC_WEBHOOK_BASE_HOST \
    NEXT_PUBLIC_UPLOAD_TRANSPORT=$NEXT_PUBLIC_UPLOAD_TRANSPORT

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

# Pin pnpm to the version that produced pnpm-lock.yaml (v9 lockfile, pnpm 10.x).
# Newer pnpm (11.x, which corepack pulls by default) is stricter and rejects the
# integrity-less xlsx CDN tarball, breaking a frozen install.
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

# Bring over the built app and its dependencies.
COPY --from=builder /app ./

EXPOSE 3000
# Bind to all interfaces; the host maps this to an internal port.
CMD ["pnpm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
