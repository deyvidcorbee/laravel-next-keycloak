FROM php:8.2.0

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    openssl \
    libssl-dev \
    procps \
    htop \
    vim \
    wget

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd sockets

WORKDIR /app

COPY . .

# Instala o composer
COPY --from=composer /usr/bin/composer /usr/bin/composer