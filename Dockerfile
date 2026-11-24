# Multi-stage production container for AI Assistor Enterprise Platform
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .
RUN node scripts/build.mjs

# Production API Service Stage
FROM node:20-alpine AS api
WORKDIR /app
COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

USER node
CMD ["node", "server/src/server.mjs"]
