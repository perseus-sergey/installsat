#!/bin/bash
set -e

echo "Deployment started..."

# Pull the latest version of the app
git pull origin main
echo "New changes copied to server !"

echo "Removing yarn.lock file..."
rm -f installsat/yarn.lock

echo "Installing Dependencies..."
yarn

echo "Creating Production Build..."
yarn build

echo "PM2 Reload"
pm2 reload 0

echo "Deployment Finished!"
