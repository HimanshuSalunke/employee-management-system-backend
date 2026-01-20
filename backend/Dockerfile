# ---------------------------
# Stage 1: Builder
# ---------------------------
FROM node:24-alpine AS builder

WORKDIR /app

# Install ALL dependencies (including dev tools like Nest CLI) to build the app
COPY package*.json ./
# Force fresh install to avoid stale lockfile issues
RUN npm install

COPY . .

# Build the NestJS application (dist/ folder)
RUN npm run build

# ---------------------------
# Stage 2: Production Runner
# ---------------------------
FROM node:24-alpine

WORKDIR /app

# Security: Upgrade OS packages to fix Alpine CVEs
RUN apk update && apk upgrade

# Security: Update Global NPM to fix 'tar' CVE
RUN npm install -g npm@latest

# Copy only package files to install production deps
COPY package*.json ./

# Install ONLY production dependencies (Removes Jest, Execa, Micromatch, etc.)
RUN npm install --only=production

# Security: Patch production dependencies (fixes 'diff')
RUN npm audit fix --force || true

# Copy the built application from the 'builder' stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/main"]
