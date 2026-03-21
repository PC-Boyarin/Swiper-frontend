# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Install deps first (better caching)
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

# Copy source
COPY . .

# Build (includes tsc check + vite build)
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]