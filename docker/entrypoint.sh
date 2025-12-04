#!/bin/bash

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (be careful with this in production, maybe manual is better)
# php artisan migrate --force

# Start Supervisor
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
