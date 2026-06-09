#!/bin/sh
set -e
# Replace known absolute backend URLs with relative /api so the same-origin path is used
# This allows nginx to proxy /api -> backend inside Docker network.
find /usr/share/nginx/html -type f -name "*.js" -o -name "*.html" | xargs -r sed -i \
  -e 's|https://localhost:5001/api|/api|g' \
  -e 's|http://localhost:5001/api|/api|g' \
  -e 's|http://localhost:5137/api|/api|g' \
  -e 's|http://localhost:5095/api|/api|g' \
  -e 's|https://localhost:5137/api|/api|g' || true

# Start nginx in foreground
nginx -g 'daemon off;'
