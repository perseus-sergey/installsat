#!/bin/bash
set -e

echo "Deployment started..."

# Перевірка файлів та прав доступу
ls -l ./.scripts/deploy.sh

# Надання дозволів на виконання
chmod +x ./.scripts/deploy.sh

# Reset any local changes
git reset --hard

# Fetch the latest changes from the remote repository
git fetch origin

# Forcefully update the local branch to match the remote branch
git reset --hard origin/main
echo "New changes copied to server!"

echo "Installing Dependencies..."
yarn install

echo "Creating Production Build..."
yarn build

echo "PM2 Reload"
pm2 reload 0

echo "Deployment Finished!"
