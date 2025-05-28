ARG NODE_VERSION=24.1.0

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
COPY --from=root . .

WORKDIR /app/next
COPY --from=deps /app/next/node_modules ./node_modules
WORKDIR /app/db
COPY --from=deps /app/db/node_modules ./node_modules
WORKDIR /app/formatting
COPY --from=deps /app/formatting/node_modules ./node_modules
WORKDIR /app/whatsapp
COPY --from=deps /app/whatsapp/node_modules ./node_modules

WORKDIR /app/next
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app/next

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/next/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/next/.next/static ./.next/static

WORKDIR /app/next

#USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
