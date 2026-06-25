# ==========================================
# 🐳 Production Nginx Dockerfile for Cloud Run
# ==========================================
FROM nginx:alpine

# Copy all static application game assets
COPY index.html /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/

# Copy the custom Nginx server template
# Alpine Nginx base image automatically runs envsubst on files in this directory 
# and writes the result to /etc/nginx/conf.d/default.conf on startup.
COPY gcp/default.conf.template /etc/nginx/templates/default.conf.template

# Cloud Run defaults to exposing port 8080
EXPOSE 8080

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
