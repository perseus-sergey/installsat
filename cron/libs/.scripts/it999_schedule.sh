#!/bin/bash

# sleep $[RANDOM % 60]m ; cd /var/www/installsat.tv && yarn ts-node cron/it999_schedule.mjs > /dev/null 2>&1

# 0 8 * * 1 /root/installsat/cron/libs/.scripts/it999_schedule.sh > /dev/null 2>&1
# 0 20 * * 5 /root/installsat/cron/libs/.scripts/it999_schedule.sh > /dev/null 2>&1

# Отримати директорію, в якій знаходиться сам скрипт
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
# Якщо скрипт в cron/libs/.scripts, то корінь проекту на 3 рівні вище
PROJECT_DIR=$(dirname "$(dirname "$(dirname "$SCRIPT_DIR")")")

# Завантаження NVM, якщо воно встановлено для користувача, від імені якого запускається cron
# Це важливо, щоб cron знав, де знаходиться потрібна версія Node.js і pnpm
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh" --no-use # Завантажуємо nvm, але не активуємо версію одразу
  # Якщо у вас є файл .nvmrc в корені проекту, nvm автоматично його підхопить при cd
  # Або можна вказати версію явно: nvm use default (або конкретну версію)
fi

# RANDOM_DELAY_SECONDS=$(( (RANDOM % 90) * 60 )) # Затримка в секундах
# echo "Sleeping for ${RANDOM_DELAY_SECONDS} seconds..."
# sleep ${RANDOM_DELAY_SECONDS}
# Примітка: $[RANDOM % 90]m може не працювати у всіх шелах. Краще так:
sleep "$((RANDOM % 3600))" # 60 хвилин

cd "$PROJECT_DIR"

if pnpm exec ts-node cron/it999_schedule.mjs > /tmp/satellite-news.log 2>&1; then
  echo "cron/libs/.scripts/it999_schedule.sh script executed successfully." >> /tmp/satellite-news.log
else
  echo "cron/libs/.scripts/it999_schedule.sh script failed." >> /tmp/satellite-news.log
fi