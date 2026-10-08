# ==============================================================
# Production Dockerfile for Portfolio CMS Admin Dashboard (Vite/React)
# ==============================================================

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build argument for API URL during Vite build
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Nginx runtime stage
FROM nginx:alpine

# Copy custom Nginx SPA configuration
RUN echo 'server {' \
  '  listen 80;' \
  '  server_name localhost;' \
  '  root /usr/share/nginx/html;' \
  '  index index.html;' \
  '  location / {' \
  '    try_files $uri $uri/ /index.html;' \
  '  }' \
  '  error_page 500 502 503 504 /50x.html;' \
  '  location = /50x.html {' \
  '    root /usr/share/nginx/html;' \
  '  }' \
  '}' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
