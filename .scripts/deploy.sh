#!/bin/bash
set -e

echo "Deployment started..."

# Check if a rebase is in progress and abort if so
if git rebase --show-current-patch > /dev/null 2>&1; then
  git rebase --abort
fi

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
