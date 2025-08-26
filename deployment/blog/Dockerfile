# TODO: add layering later 
ARG NODE_VERSION=20
ARG PORT=3001
ARG IS_PREVIEW=false

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .

RUN pnpm install --frozen-lockfile
RUN if [ "$IS_PREVIEW" = "true" ]; then \
      pnpm --filter @ashgw/blog build:preview; \
    else \
      pnpm --filter @ashgw/blog build; \
    fi

USER node
EXPOSE ${PORT}

# Start exactly like locally
CMD ["pnpm", "--filter", "@ashgw/blog", "start"]