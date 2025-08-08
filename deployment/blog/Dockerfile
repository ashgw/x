# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=20
ARG PORT=3001

############################
# Base image
############################
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app

# Helpful native deps for common Node stacks
RUN apk add --no-cache libc6-compat curl bash

# Enable pnpm via Corepack
RUN corepack enable

############################
# Dependencies layer
# Uses cache mounts so installs are fast and repeatable
############################
FROM base AS deps
# Copy only files that affect dependency resolution first for better caching
# Adjust these if your repo layout differs
COPY pnpm-lock.yaml ./
COPY package.json ./
# Optional: workspace file if present
COPY pnpm-workspace.yaml . 2>/dev/null || true

# Bring in monorepo package manifests for better caching
# If your packages are under /packages and /apps, this helps avoid copying the world before install
COPY packages/**/package.json packages/ 2>/dev/null || true
COPY apps/**/package.json apps/ 2>/dev/null || true

# Fetch store with cache mount, no node_modules yet
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm fetch

############################
# Builder
############################
FROM base AS builder

# Build args from CI. Only promote public ones to ENV below.
ARG NODE_ENV=production
ARG IS_PREVIEW=false

# Private args passed by CI. These are available during build only.
# Do not turn these into ENV unless you want them baked permanently.
ARG IP_HASH_SALT
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_AUTH_TOKEN
ARG DATABASE_URL
ARG S3_BUCKET_NAME
ARG S3_BUCKET_REGION
ARG S3_BUCKET_ACCESS_KEY_ID
ARG S3_BUCKET_SECRET_KEY
ARG S3_BUCKET_URL
ARG KIT_API_KEY

# Public env that Next can inline safely
ARG NEXT_PUBLIC_WWW_URL
ARG NEXT_PUBLIC_BLOG_URL
ARG NEXT_PUBLIC_WWW_GOOGLE_ANALYTICS_ID
ARG NEXT_PUBLIC_BLOG_GOOGLE_ANALYTICS_ID
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST

# Promote only what is safe to bake
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_WWW_URL=$NEXT_PUBLIC_WWW_URL
ENV NEXT_PUBLIC_BLOG_URL=$NEXT_PUBLIC_BLOG_URL
ENV NEXT_PUBLIC_WWW_GOOGLE_ANALYTICS_ID=$NEXT_PUBLIC_WWW_GOOGLE_ANALYTICS_ID
ENV NEXT_PUBLIC_BLOG_GOOGLE_ANALYTICS_ID=$NEXT_PUBLIC_BLOG_GOOGLE_ANALYTICS_ID
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST

# Copy lockfile and manifests first then the rest of the repo
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml 2>/dev/null || true
COPY --from=deps /app/packages ./packages 2>/dev/null || true
COPY --from=deps /app/apps ./apps 2>/dev/null || true

# Now copy the full repo (source, configs, etc.)
COPY . .

# Install deps using the cached store
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Build blog. Toggle preview behavior with IS_PREVIEW
RUN if [ "$IS_PREVIEW" = "true" ]; then \
      pnpm --filter @ashgw/blog build:preview; \
    else \
      pnpm --filter @ashgw/blog build; \
    fi

# Option A: use pnpm deploy to extract a minimal runtime for the blog only
# This requires pnpm 8.7+ and proper package.json "bin" or start scripts.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm deploy --filter @ashgw/blog --prod /out

############################
# Runner
############################
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=${PORT}

# For Node to handle SIGTERM well in containers
RUN apk add --no-cache dumb-init

# Copy the app bundle produced by pnpm deploy
COPY --from=builder /out ./

# Optional OCI labels
LABEL org.opencontainers.image.source="https://github.com/${GITHUB_REPOSITORY}"
LABEL org.opencontainers.image.description="ashgw blog container"

# Drop privileges
USER node

EXPOSE ${PORT}

# Healthcheck is optional. Hit your health endpoint if you have one.
# HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

# Start exactly like locally for the blog package
# The deployed /out has its own node_modules and package with scripts
CMD ["dumb-init", "pnpm", "--filter", "@ashgw/blog", "start"]
