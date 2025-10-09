#!/bin/sh
set -e

# Check if BACKEND_URL is set
if [ -z "$BACKEND_URL" ]; then
    echo "ERROR: BACKEND_URL environment variable is not set!"
    echo "Please set BACKEND_URL in Railway Variables"
    exit 1
fi

echo "Using BACKEND_URL: $BACKEND_URL"

# Substitute environment variables in nginx config
envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Nginx configuration generated successfully"
cat /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
