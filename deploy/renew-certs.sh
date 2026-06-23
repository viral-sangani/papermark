#!/usr/bin/env bash
# Renew ALL Let's Encrypt certs on this host (dataroom/s3 + the existing
# signal/mcp certs — they share one letsencrypt dir) and reload signal-nginx.
#
# certbot reads the renewal/*.conf files and only renews certs within ~30 days
# of expiry, so this is safe to run frequently. Uses the same webroot the
# vhosts serve for the http-01 challenge.
set -euo pipefail

WEBROOT=/opt/signal/infra/certs/webroot
LE=/opt/signal/infra/certs/letsencrypt

logger -t papermark-cert-renew "starting certbot renew"

docker run --rm \
  -v "$WEBROOT:/var/www/certbot" \
  -v "$LE:/etc/letsencrypt" \
  certbot/certbot renew --webroot -w /var/www/certbot --non-interactive --quiet

# Reload nginx so it picks up any renewed cert (no-op if nothing changed).
if docker ps --format '{{.Names}}' | grep -q '^signal-nginx$'; then
  docker exec signal-nginx nginx -s reload 2>/dev/null || true
fi

logger -t papermark-cert-renew "certbot renew finished"
