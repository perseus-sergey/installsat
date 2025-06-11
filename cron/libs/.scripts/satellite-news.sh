#!/bin/bash

# 0 5,12 * * * /var/www/installsat.tv/cron/libs/.scripts/satellite-news.sh > /dev/null 2>&1

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
sleep "$((RANDOM % 5400))" # 90 хвилин = 5400 секунд

cd "$PROJECT_DIR"

if pnpm exec ts-node cron/satellite-news.mjs > /tmp/satellite-news.log 2>&1; then
  echo "Satellite news script executed successfully." >> /tmp/satellite-news.log
else
  echo "Satellite news script failed." >> /tmp/satellite-news.log
fi