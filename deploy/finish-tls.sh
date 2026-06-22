#!/usr/bin/env bash
# Issue Let's Encrypt certs for dataroom.cesto.co + s3.dataroom.cesto.co and
# activate the full nginx vhost. Run on the server AFTER both A records resolve
# to this host.
#
#   bash /opt/papermark/deploy/finish-tls.sh
#
# Assumes the existing signal-nginx stack: webroot at /opt/signal/infra/certs/webroot
# (mounted to /var/www/certbot in nginx) and certs at /opt/signal/infra/certs/letsencrypt.
set -euo pipefail

WEBROOT=/opt/signal/infra/certs/webroot
LE=/opt/signal/infra/certs/letsencrypt
EMAIL="${CERT_EMAIL:-viral.sangani2011@gmail.com}"
DOMAINS=(dataroom.cesto.co s3.dataroom.cesto.co)

echo "==> Issuing certs via certbot (webroot)"
for d in "${DOMAINS[@]}"; do
  echo "--- $d"
  docker run --rm \
    -v "$WEBROOT:/var/www/certbot" \
    -v "$LE:/etc/letsencrypt" \
    certbot/certbot certonly --webroot -w /var/www/certbot \
    -d "$d" --email "$EMAIL" --agree-tos --no-eff-email --non-interactive || {
      echo "!! certbot failed for $d — check that $d resolves to this server and :80 is reachable"; exit 1; }
done

echo "==> Reloading nginx to pick up the new certs / 443 vhosts"
docker exec signal-nginx nginx -t
docker exec signal-nginx nginx -s reload
echo "==> Done. https://dataroom.cesto.co should now be live."
