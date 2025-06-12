#!/bin/bash

# yarn ts-node cron/del-prev-year-trans-news.mjs > /dev/null 2>&1

#20 3 17 7 * /root/installsat/cron/libs/.scripts/del-prev-year-trans-news.sh > /dev/null 2>&1

# Отримати директорію, в якій знаходиться сам скрипт
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
# Якщо скрипт в cron/libs/.scripts, то корінь проекту на 3 рівні вище
PROJECT_DIR=$(dirname "$(dirname "$(dirname "$SCRIPT_DIR")")")

# Завантаження NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Завантажити nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # Завантажити nvm bash_completion

# Активувати потрібну версію Node.js (це також оновить PATH)
if [ -f "$PROJECT_DIR/.nvmrc" ]; then
  echo "Using Node version from .nvmrc" >> /tmp/satellite-news.log
  (cd "$PROJECT_DIR" && nvm use) # Запустити в підшелі з переходом в директорію проекту
else
  echo "Using default Node version" >> /tmp/satellite-news.log
  nvm use default # Або конкретна версія: nvm use lts/iron, nvm use 20, тощо
fi
# Перевірка шляхів після активації NVM (для відладки)
# echo "PATH after NVM: $PATH" >> /tmp/satellite-news.log
# echo "Node version: $(node -v)" >> /tmp/satellite-news.log
# echo "pnpm path: $(which pnpm)" >> /tmp/satellite-news.log


cd "$PROJECT_DIR"

if pnpm exec ts-node cron/del-prev-year-trans-news.mjs > /tmp/satellite-news.log 2>&1; then
  echo "cron/libs/.scripts/del-prev-year-trans-news.sh script executed successfully." >> /tmp/satellite-news.log
else
  echo "cron/libs/.scripts/del-prev-year-trans-news.sh script failed." >> /tmp/satellite-news.log
fi