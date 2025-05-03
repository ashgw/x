# TODO: add layering later and shit if needed, this just works dawg & fuck vercel
ARG NODE_VERSION=20
ARG PORT=3001

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @ashgw/blog build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=${PORT}

USER node
EXPOSE ${PORT}

# Start exactly like locally
CMD ["pnpm", "--filter", "@ashgw/blog", "start"]