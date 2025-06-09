#!/bin/bash
set -e

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
# pnpm install --frozen-lockfile # Аналог yarn install --frozen-lockfile

echo "Checking available memory..."
free -m

echo "Checking CPU load..."
uptime

echo "Creating Production Build..."
pnpm build

echo "PM2 Reload"
pm2 reload "installsat"

echo "Deployment Finished!"