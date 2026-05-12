#!/bin/sh
set -e

if [ "$(id -u)" = "0" ]; then
  mkdir -p \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/views \
    /var/www/html/storage/framework/cache/data \
    /var/www/html/storage/logs \
    /var/www/html/bootstrap/cache
  if [ ! -f /var/www/html/vendor/autoload.php ]; then
    COMPOSER_ALLOW_SUPERUSER=1 composer install --no-interaction --prefer-dist --working-dir=/var/www/html
  fi
  chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
  [ -d /var/www/html/vendor ] && chown -R www-data:www-data /var/www/html/vendor
fi

exec docker-php-entrypoint "$@"
