FROM php:8.4-fpm-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libzip-dev \
    && docker-php-ext-configure zip \
    && docker-php-ext-install -j$(nproc) pdo_mysql zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY docker/php/entrypoint.sh /usr/local/bin/plutao-php-entrypoint
RUN chmod +x /usr/local/bin/plutao-php-entrypoint

ENTRYPOINT ["plutao-php-entrypoint"]
CMD ["php-fpm"]
