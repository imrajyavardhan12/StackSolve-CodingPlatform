#!/bin/sh
set -e

# Check if BACKEND_URL is set
if [ -z "$BACKEND_URL" ]; then
    echo "ERROR: BACKEND_URL environment variable is not set!"
    echo "Please set BACKEND_URL in Railway Variables"
    exit 1
fi

echo "Using BACKEND_URL: $BACKEND_URL"

# Extract hostname from BACKEND_URL for Host header
# This removes the protocol (http:// or https://) and any trailing paths
export BACKEND_HOST=$(echo "$BACKEND_URL" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
echo "Extracted BACKEND_HOST: $BACKEND_HOST"

# Substitute environment variables in nginx config
envsubst '${BACKEND_URL} ${BACKEND_HOST}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Nginx configuration generated successfully"
cat /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
