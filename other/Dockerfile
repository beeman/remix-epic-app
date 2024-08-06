# This file is moved to the root directory before building the image

# base node image
FROM node:20-bookworm-slim AS base

# Install pnpm with corepack
RUN corepack enable
RUN corepack prepare pnpm@latest --activate


# Install openssl for Prisma
RUN apt-get update && apt-get install -y fuse3 openssl sqlite3 ca-certificates

# Install all node_modules, including dev dependencies
FROM base AS deps

WORKDIR /myapp

ADD package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Setup production node_modules
FROM base AS production-deps
# set for base and all layer that inherit from it
ENV NODE_ENV=production

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --production

# Build the app
FROM base AS build
# set for base and all layer that inherit from it
ENV NODE_ENV=production
ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA

# Use the following environment variables to configure Sentry
# ENV SENTRY_ORG=
# ENV SENTRY_PROJECT=


WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD prisma prisma
RUN pnpx prisma generate

ADD . .

# Mount the secret and set it as an environment variable and run the build
#RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
#  export SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) && \
#  pnpm run build
RUN pnpm run build

# Finally, build the production image with minimal footprint
FROM base

ENV INTERNAL_PORT="8080"
ENV PORT="8081"
ENV NODE_ENV="production"

WORKDIR /myapp

# Generate random value and save it to .env file which will be loaded by dotenv
RUN INTERNAL_COMMAND_TOKEN=$(openssl rand -hex 32) && \
  echo "INTERNAL_COMMAND_TOKEN=$INTERNAL_COMMAND_TOKEN" > .env

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/server-build /myapp/server-build
COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/prisma /myapp/prisma
COPY --from=build /myapp/app/components/ui/icons /myapp/app/components/ui/icons

ADD . .

