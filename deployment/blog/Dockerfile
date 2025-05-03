ARG NODE_VERSION=20
ARG PORT=3001

# Base stage for shared setup
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .

# Install dependencies
FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the application
FROM deps AS builder
RUN pnpm --filter @ashgw/blog build

# Production stage
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=${PORT}

# Copy necessary files
COPY --from=builder /app/apps/blog/next.config.js ./
COPY --from=builder /app/apps/blog/package.json ./
COPY --from=builder /app/apps/blog/public ./public
COPY --from=builder /app/apps/blog/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Expose the port
EXPOSE ${PORT}

# Start the application
CMD ["sh", "-c", "node_modules/.bin/next start -p $PORT"]