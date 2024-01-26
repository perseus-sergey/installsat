#!/bin/bash
set -e

echo "Deployment started..."

# Pull the latest version of the app
git pull origin master
echo "New changes copied to server !"

echo "Installing Dependencies..."
yarn --yes

echo "Creating Production Build..."
yarn build

echo "PM2 Reload"
pm2 reload app_name/id

echo "Deployment Finished!"