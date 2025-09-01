# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=20
ARG PORT=3001
ARG IS_PREVIEW=false

FROM node:${NODE_VERSION}-alpine
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

# Mount each secret only for this RUN. Nothing persists unless you write it to disk (don’t).
RUN --mount=type=secret,id=DATABASE_URL \
    --mount=type=secret,id=S3_BUCKET_NAME \
    --mount=type=secret,id=S3_BUCKET_REGION \
    --mount=type=secret,id=S3_BUCKET_ACCESS_KEY_ID \
    --mount=type=secret,id=S3_BUCKET_SECRET_KEY \
    --mount=type=secret,id=S3_BUCKET_URL \
    --mount=type=secret,id=KIT_API_KEY \
    --mount=type=secret,id=IP_HASH_SALT \
    --mount=type=secret,id=NEXT_PUBLIC_WWW_URL \
    --mount=type=secret,id=NEXT_PUBLIC_BLOG_URL \
    --mount=type=secret,id=NEXT_PUBLIC_WWW_GOOGLE_ANALYTICS_ID \
    --mount=type=secret,id=NEXT_PUBLIC_BLOG_GOOGLE_ANALYTICS_ID \
    --mount=type=secret,id=NEXT_PUBLIC_SENTRY_DSN \
    --mount=type=secret,id=NEXT_PUBLIC_POSTHOG_KEY \
    --mount=type=secret,id=NEXT_PUBLIC_POSTHOG_HOST <<'EOSH'
set -eu
# helper: export a var if its secret mount exists
exp() { [ -f "/run/secrets/$1" ] && export "$1=$(cat /run/secrets/$1)"; }

exp DATABASE_URL
exp S3_BUCKET_NAME
exp S3_BUCKET_REGION
exp S3_BUCKET_ACCESS_KEY_ID
exp S3_BUCKET_SECRET_KEY
exp S3_BUCKET_URL
exp KIT_API_KEY
exp IP_HASH_SALT
exp NEXT_PUBLIC_WWW_URL
exp NEXT_PUBLIC_BLOG_URL
exp NEXT_PUBLIC_WWW_GOOGLE_ANALYTICS_ID
exp NEXT_PUBLIC_BLOG_GOOGLE_ANALYTICS_ID
exp NEXT_PUBLIC_SENTRY_DSN
exp NEXT_PUBLIC_POSTHOG_KEY
exp NEXT_PUBLIC_POSTHOG_HOST

pnpm install --frozen-lockfile

if [ "$IS_PREVIEW" = "true" ]; then
  pnpm --filter @ashgw/blog build:preview
else
  pnpm --filter @ashgw/blog build
fi
EOSH

USER node
EXPOSE ${PORT}
CMD ["pnpm", "--filter", "@ashgw/blog", "start"]
