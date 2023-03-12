# Build stage
FROM node:lts AS builder
# Set working directory
WORKDIR /build
# Copy application source code
COPY . .
# Install dependencies
RUN npm install
# Build application
RUN npm run build:prod

# Production stage: deploy on nginx
FROM nginx:alpine
# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Set environment variables
ENV SIDECAR_PORT=3500
# Expose port 80
EXPOSE 80
# Copy build files from builder stage into nginx
COPY --from=builder /build/dist/auction-web-app/ /usr/share/nginx/html