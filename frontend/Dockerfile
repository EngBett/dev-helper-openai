# Install dependencies and build the app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js app (output: standalone recommended)
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only the necessary output (standalone build)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./

# Expose default Next.js port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]