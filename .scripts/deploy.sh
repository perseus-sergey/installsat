#!/bin/bash
set -e

# Завантаження NVM, якщо воно встановлено для користувача
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh" # Завантажуємо nvm
  # Якщо ви хочете використовувати версію Node.js з файлу .nvmrc в корені проекту:
  if [ -f ".nvmrc" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
    nvm use # Активує версію з .nvmrc
  fi
  # Або якщо ви хочете активувати версію за замовчуванням:
  # nvm use default
else
  echo "NVM not found, pnpm might not be available."
  # Тут можна додати перевірку наявності pnpm іншими шляхами або вийти з помилкою
  # exit 1
fi

echo "Deployment started..."

# Reset any local changes
git reset --hard

# Fetch the latest changes from the remote repository
git fetch origin

# Forcefully update the local branch to match the remote branch
git reset --hard origin/main
echo "New changes copied to server!"

# Restart MySQL to clear any hanging connections
echo "Restarting MySQL..."
sudo /usr/bin/systemctl restart mysql
echo "MySQL restarted!"

echo "Installing Dependencies..."
pnpm install

# Якщо ви хочете бути впевненими, що використовується lock-файл:
# echo "Installing dependencies with frozen lockfile..."
# pnpm install --frozen-lockfile

echo "Checking available memory..."
free -m

echo "Checking CPU load..."
uptime

echo "Creating Production Build..."
pnpm build

echo "Керування PM2 процесом за допомогою ecosystem.config.js..."
# pm2 startOrReload автоматично запустить, якщо не існує, або перезавантажить, якщо існує
pm2 reload installsat

pm2 save

echo "Deployment Finished!"