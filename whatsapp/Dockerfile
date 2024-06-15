# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=18.18.2

FROM node:${NODE_VERSION}-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app/next
COPY package.json package-lock.json* ./
RUN npm ci

WORKDIR /app/formatting
COPY --from=root /formatting/package.json /formatting/package-lock.json* ./
RUN npm ci

WORKDIR /app/db
COPY --from=root /db/package.json /db/package-lock.json* ./
RUN npm ci

WORKDIR /app/whatsapp
COPY --from=root /whatsapp/package.json /whatsapp/package-lock.json* ./
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
FROM base AS runner
WORKDIR /app/whatsapp

# Run the application.
CMD npm start
