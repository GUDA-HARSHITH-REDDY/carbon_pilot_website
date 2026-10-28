# Multi-stage Dockerfile for Carbon Pilot
# Stage 1: Build the React 19 Frontend
FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install --no-audit --no-fund

COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000

# Copy server engine, data, and compiled frontend assets
COPY package*.json ./
COPY server/ ./server/
COPY tests/ ./tests/
COPY --from=builder /app/dist ./dist

# Create non-root user for cloud-native security best practices
RUN addgroup -S carbonpilot && adduser -S carbonpilot -G carbonpilot
USER carbonpilot

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8000/api/health || exit 1

CMD ["node", "server/server.mjs"]
