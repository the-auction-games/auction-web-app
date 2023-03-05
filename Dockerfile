# Compile code
FROM node:alpine AS builder
WORKDIR /build
COPY . .
RUN npm install
RUN npm run build:prod

# Deploy with nginx
FROM nginx:alpine

# Set environment variables
ENV SIDECAR_PORT=3500

# Expose port 80
EXPOSE 80

# Copy build files from builder stage into nginx
COPY --from=builder /build/dist/auction-web-app/ /usr/share/nginx/html