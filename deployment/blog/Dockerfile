ARG NODE_VERSION=20
ARG PORT=3001

# Base stage for shared setup
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .

# Install dependencies for all workspaces
FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the application
FROM deps AS builder
RUN pnpm --filter @ashgw/blog build

# Create public directory if it doesn't exist
RUN mkdir -p /app/apps/blog/public

# Production stage
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=${PORT}

# Copy only the necessary files from the monorepo
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/blog/package.json ./
COPY --from=builder /app/apps/blog/.next ./.next
COPY --from=builder /app/apps/blog/next.config.js ./next.config.js
COPY --from=builder /app/apps/blog/public ./public

# For Next.js standalone mode
COPY --from=builder /app/apps/blog/.next/standalone ./

USER node
EXPOSE ${PORT}

# Start the application
CMD ["node", "server.js"]