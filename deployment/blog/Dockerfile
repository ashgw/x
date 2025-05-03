# TODO: add layering later and shit if needed, this just works dawg & fuck vercel, look what they have me doing
ARG NODE_VERSION=20
ARG PORT=3001

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY . .
RUN corepack enable
WORKDIR /app

# Build the application
RUN pnpm --filter @ashgw/blog build

USER node
EXPOSE ${PORT}

# Start exactly like locally
CMD ["pnpm", "--filter", "@ashgw/blog", "start"]