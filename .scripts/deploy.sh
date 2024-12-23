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
sudo systemctl restart mysql
echo "MySQL restarted!"

echo "Installing Dependencies..."
yarn install

# echo "Installing dependencies with frozen lockfile..."
# yarn install --frozen-lockfile

echo "Checking available memory..."
free -m

echo "Checking CPU load..."
uptime

echo "Creating Production Build..."
yarn build

echo "PM2 Reload"
pm2 reload "installsat"

echo "Deployment Finished!"
