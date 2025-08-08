# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=20
ARG PORT=3001
ARG IS_PREVIEW=false

# --- Base Layer ---
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && apk add --no-cache libc6-compat
WORKDIR /app

# --- Dependencies Layer ---
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
# Copy all package.json files for workspaces so pnpm can resolve deps
COPY packages ./packages
COPY apps/blog/package.json ./apps/blog/package.json
# Install only prod deps for the blog (and its deps in the workspace)
RUN pnpm fetch --filter @ashgw/blog...
RUN pnpm install --frozen-lockfile --filter @ashgw/blog...

# --- Build Layer ---
FROM deps AS build
COPY . .
RUN if [ "$IS_PREVIEW" = "true" ]; then \
      pnpm --filter @ashgw/blog build:preview; \
    else \
      pnpm --filter @ashgw/blog build; \
    fi

# --- Runtime Layer ---
FROM node:${NODE_VERSION}-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy only built output + needed files from build layer
COPY --from=build /app/apps/blog/next.config.js ./apps/blog/next.config.js
COPY --from=build /app/apps/blog/public ./apps/blog/public
COPY --from=build /app/apps/blog/.next ./apps/blog/.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/blog/package.json ./apps/blog/package.json

USER node
EXPOSE ${PORT}
CMD ["pnpm", "--filter", "@ashgw/blog", "start"]
