# Stage 1: Dependencies and build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Set DNS options via environment variables
ENV NODE_OPTIONS="--dns-result-order=ipv4first"
ENV npm_config_registry=https://registry.npmjs.org/

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with pnpm
RUN pnpm install --fetch-timeout 600000 || pnpm install --no-frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Create a non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nextjs /app/package.json ./
COPY --from=builder --chown=nextjs:nextjs /app/next.config.ts ./
COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV APP_PORT=3005
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the application port
EXPOSE ${APP_PORT}

# Switch to non-root user
USER nextjs

# Start the application
CMD ["node_modules/.bin/next", "start"]

# Stage 3: Development
FROM node:20-alpine AS development

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Create a non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Set permissions for mounted volumes
RUN mkdir -p /app/node_modules && chown -R nextjs:nextjs /app

# Set environment variables
ENV NODE_ENV=development
ENV APP_PORT=3005
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--dns-result-order=ipv4first"
ENV npm_config_registry=https://registry.npmjs.org/

# Expose the application port
EXPOSE ${APP_PORT}

# Switch to non-root user
USER nextjs

# The actual source code will be mounted at runtime
# Start the application in development mode
CMD ["pnpm", "run", "dev"]
