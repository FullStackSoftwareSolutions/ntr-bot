ARG NODE_VERSION=24.1.0

FROM node:${NODE_VERSION}-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app/whatsapp
COPY package.json package-lock.json* ./
RUN npm ci

WORKDIR /app/formatting
COPY --chown=node --from=root /formatting/package.json /formatting/package-lock.json* ./
RUN npm ci

WORKDIR /app/db
COPY --chown=node --from=root /db/package.json /db/package-lock.json* ./
RUN npm ci

WORKDIR /app/next
COPY --chown=node --from=root /next/package.json /next/package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --chown=node --from=root . .

WORKDIR /app/next
COPY --from=deps /app/next/node_modules ./node_modules
WORKDIR /app/db
COPY --from=deps /app/db/node_modules ./node_modules
WORKDIR /app/formatting
COPY --from=deps /app/formatting/node_modules ./node_modules
WORKDIR /app/whatsapp
COPY --from=deps /app/whatsapp/node_modules ./node_modules

# Use production node environment by default.
ENV NODE_ENV production

# Copy the rest of the source files into the image.
WORKDIR /app/whatsapp

# Run the application.
CMD npm start
