# Compile code
FROM node AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Deploy with nginx
FROM nginx:alpine
# Expose port 80
EXPOSE 80
# Copy build files from builder stage into nginx
COPY --from=builder /app/dist/auction-web-app/ /usr/share/nginx/html