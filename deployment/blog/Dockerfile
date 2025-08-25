# TODO: add layering later 
ARG NODE_VERSION=20
ARG PORT=3001
ARG IS_PREVIEW=false

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app
COPY --chown=node:node . .

RUN pnpm install --frozen-lockfile
RUN if [ "$IS_PREVIEW" = "true" ]; then \
      pnpm --filter @ashgw/blog build:preview; \
    else \
      pnpm --filter @ashgw/blog build; \
    fi

# remove devDependencies after build
RUN pnpm prune --prod

USER node
EXPOSE ${PORT}

# Basic container healthcheck (uses busybox wget available in alpine)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget --spider -q http://127.0.0.1:${PORT}/ || exit 1

# Start exactly like locally
CMD ["pnpm", "--filter", "@ashgw/blog", "start"]