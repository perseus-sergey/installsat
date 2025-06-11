#!/bin/bash

# yarn ts-node cron/translate-channels.mjs > /dev/null 2>&1

# 0 10-23 * * * /root/installsat/cron/libs/.scripts/translate-channels.sh > /dev/null 2>&1
# 0 0-7 * * * /root/installsat/cron/libs/.scripts/translate-channels.sh > /dev/null 2>&1

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

cd "$PROJECT_DIR"

if pnpm exec ts-node cron/translate-channels.mjs > /tmp/satellite-news.log 2>&1; then
  echo "cron/libs/.scripts/translate-channels.sh script executed successfully." >> /tmp/satellite-news.log
else
  echo "cron/libs/.scripts/translate-channels.sh script failed." >> /tmp/satellite-news.log
fi