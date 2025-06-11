#!/bin/bash
set -e

echo "--- DIAGNOSTICS START ---"
echo "Running as user: $(whoami)"
echo "HOME directory: $HOME"
echo "NVM_DIR: $NVM_DIR" # Перевірка, чи NVM_DIR встановлено перед нашим блоком
# --- ПОЧАТОК ЗМІН (БЛОК NVM) ---
export NVM_DIR="$HOME/.nvm" # Перевизначаємо для певності
echo "NVM_DIR is now: $NVM_DIR"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  echo "nvm.sh found at $NVM_DIR/nvm.sh. Sourcing it..."
  . "$NVM_DIR/nvm.sh" # Завантажуємо nvm
  echo "Sourced nvm.sh. Current PATH: $PATH"
  if [ -f ".nvmrc" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
    echo "Found .nvmrc. Running nvm use..."
    nvm use # Активує версію з .nvmrc
    echo "nvm use finished. Current Node version: $(node -v)"
    echo "Current npm version: $(npm -v)"
    echo "Location of node: $(which node)"
    echo "Location of pnpm (after nvm use): $(which pnpm || echo 'pnpm still not found')"
  else
    echo ".nvmrc not found or nvm.sh not sourced properly. Trying nvm use default..."
    nvm use default
    echo "nvm use default finished. Current Node version: $(node -v)"
    echo "Current npm version: $(npm -v)"
    echo "Location of node: $(which node)"
    echo "Location of pnpm (after nvm use default): $(which pnpm || echo 'pnpm still not found')"
  fi
else
  echo "nvm.sh NOT found at $NVM_DIR/nvm.sh."
  echo "pnpm will likely not be available."
  # Спробуємо знайти pnpm за допомогою corepack, якщо node є в PATH
  if command -v node &> /dev/null && command -v corepack &> /dev/null; then
    echo "Node and corepack found. Enabling corepack for pnpm..."
    corepack enable pnpm
    corepack prepare pnpm@latest --activate # Переконайтеся, що це не вимагає інтерактивності
    echo "Location of pnpm (after corepack prepare): $(which pnpm || echo 'pnpm still not found after corepack')"
  else
      echo "Node or corepack not found directly in PATH."
  fi
fi
echo "Final PATH: $PATH"
echo "Attempting to run pnpm --version:"
pnpm --version || echo "pnpm --version FAILED"
echo "--- DIAGNOSTICS END ---"
# --- КІНЕЦЬ ЗМІН (БЛОК NVM) ---

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
pm2 startOrReload ecosystem.config.js --env production # Вказуємо середовище, якщо у вас є секція env_production

pm2 save

echo "Deployment Finished!"