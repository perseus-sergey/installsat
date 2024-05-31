#!/bin/bash
set -e

echo "Deployment started..."

# Cancel any ongoing rebase
if git rebase --show-current-patch > /dev/null 2>&1; then
  git rebase --abort
fi

# Reset any local changes
git reset --hard

# Pull the latest version of the app without rebase
git fetch origin
git reset --hard origin/main
echo "New changes copied to server!"

echo "Installing Dependencies..."
yarn install

echo "Creating Production Build..."
yarn build

echo "PM2 Reload"
pm2 reload 0

echo "Deployment Finished!"
