#!/bin/bash
set -e

echo "Deployment started..."

# Cancel any ongoing rebase
git rebase --abort || true

# Reset any local changes
git reset --hard

# Pull the latest version of the app
git pull origin main
echo "New changes copied to server!"

echo "Installing Dependencies..."
yarn

echo "Creating Production Build..."
yarn build

echo "PM2 Reload"
pm2 reload 0

echo "Deployment Finished!"
