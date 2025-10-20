# LinkedInScholar Production Docker Configuration

# Multi-stage build for optimal production image
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies for both frontend and backend
FROM base AS deps
RUN apk add --no-cache libc6-compat

# Copy package files
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN cd frontend && npm ci --only=production
RUN cd backend && npm ci --only=production

# Build frontend
FROM base AS frontend-builder
COPY frontend/ ./frontend/
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
WORKDIR /app/frontend
RUN npm run build

# Production backend stage
FROM node:18-alpine AS backend
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 linkedinscholar

# Copy backend dependencies and source
COPY --from=deps /app/backend/node_modules ./node_modules
COPY backend/ ./

# Copy built frontend files to serve statically
COPY --from=frontend-builder /app/frontend/dist ./public

# Set ownership
RUN chown -R linkedinscholar:nodejs /app
USER linkedinscholar

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]