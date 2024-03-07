### 🚀 How to Point Domain and Deploy NextJS Project using Github on Nginx Remote Server or VPS

#### 🔗[Original tutorial from](https://github.com/geekyshow1/GeekyShowsNotes/blob/main/nginx/Deploy_NextJS_Nginx.md) 🔗[this Video (Indian)](https://youtu.be/MJ1AtNdvCtY?si=mWZhD63p0_rhbQtR)

- Ubuntu Main command

  - Ubuntu restart

    ```sh
    sudo reboot now
    ```

  - [----- Ubuntu Add New User -----](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)

    ```sh
    adduser perseus
    ```

  - Granting Administrative Privileges

    ```sh
    usermod -aG sudo perseus
    ```

  - logged in to your root account using SSH keys

    ```sh
    rsync --archive --chown=perseus:perseus ~/.ssh /home/perseus
    ```

  - change user

    ```sh
    sudo su - root
    ```

  - After change the ssh-key it may error happens: Host key verification failed. ---> [solution](https://superuser.com/questions/421004/how-to-fix-warning-about-ecdsa-host-key#comment1562582_421024)

    ```sh
    ssh-keyscan -t ecdsa 62.72.32.225 >> ~/.ssh/known_hosts
    ```

- [Firewall install](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-22-04)

  ```sh
  sudo ufw allow ssh
  ```

  ```sh
  sudo ufw allow http
  ```

  ```sh
  sudo ufw allow https
  ```

- [NGINX SETUP](<https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04#step-5-%E2%80%93-setting-up-server-blocks-(recommended)>)

  ```sh
  sudo service nginx restart
  ```

  ```sh
  sudo nano /etc/nginx/sites-available/installsat.fun
  ```

  ```sh
  nano /var/log/nginx/error.log
  ```

- [Encrypt Certificate SSL for nginx](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04)

  ```sh
  sudo certbot --nginx -d installsat.fun -d www.installsat.fun
  ```

- [GIT Server](https://youtu.be/nsGusxzitoc?t=3159)

  ```sh
  ssh-keygen
  ```

  ```sh
  cat .ssh/id_rsa.pub
  ```

- [NODE NVM](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04)

  ```sh
  nvm install --lts
  ```

- [YARN Server](https://phoenixnap.com/kb/how-to-install-yarn-ubuntu)

---

## Do all accordingly this instruction: [PHPMYADMIN install](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-phpmyadmin-with-nginx-on-an-ubuntu-20-04-server)

- **Env setup**

  - go to app Directory

    ```sh
    cd project_folder_name
    ```

  - make env file
    ```sh
    touch .env.local
    nano .env.local
    ```
  - Write credential
    ```sh
    DB_HOST="localhost"
    DB_NAME="db_name"
    DB_PASS="user_password"
    DB_USER="user_name"
    ```

- **Nginx: 413 – Request Entity Too Large Error and Solution**

  ```sh
  sudo nano /etc/nginx/nginx.conf
  ```

  - Add the following line to http or server or location context to increase the size limit in nginx.conf, enter:

    ```sh
    # set client body size to 100 MB #
    client_max_body_size 100M;
    ```

    - Reload Nginx

      ```sh
      service nginx reload
      ```

- **Phpmyadmin: No data was received to import. Either no file name was submitted, or the file size exceeded the maximum size permitted by your PHP configuration.**

  ```sh
  cd ~
  ```

  ```sh
  locate php.ini
  ```

  In all founded php.ini files
  make change to:

  ```
  post_max_size = 500M
  upload_max_filesize = 500M
  max_execution_time = 6000
  max_input_time = 6000
  memory_limit = 300M
  ```

  then:

  ```sh
  systemctl restart php8.1-fpm
  ```

  ```sh
  systemctl restart nginx
  ```

---

## Base setup

- Get Access to Remote Server via SSH

  - **Syntax**
    ```sh
    ssh -p PORT USERNAME@HOSTIP
    ```
  - **Example**
    ```sh
    ssh -p 1034 raj@216.32.44.12
    ```

- Verify that all required softwares are installed

  ```sh
  nginx -v
  node -v
  npm -v
  git --version
  pm2 --version
  ```

- Install Software (If required)

  ```
  sudo apt install nginx
  sudo apt install git
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
  sudo apt-get install -y nodejs
  ```

- Install PM2 (If required)

  ```sh
  sudo npm install -g pm2@latest
  ```

- Add PM2 Process on Startup

  ```sh
  sudo pm2 startup
  ```

- Verify Nginx is Active and Running

  ```sh
  sudo service nginx status
  ```

- Verify Web Server Ports are Open and Allowed through Firewall

  ```sh
  sudo ufw status verbose
  ```

- Exit from Remote Server

  ```sh
  exit
  ```

- Login to Your Domain Provider Website
- Navigate to Manage DNS
- Add Following Records:

  | Type | Host/Name | Value                   |
  | :--: | :-------: | :---------------------- |
  |  A   |     @     | Your Remote Server IP   |
  |  A   |    www    | Your Remote Server IP   |
  | AAAA |     @     | Your Remote Server IPv6 |
  | AAAA |    www    | Your Remote Server IPv6 |

- Copy Project from Local Machine to Remote Server or VPS. There are two ways to do it:-

  1. Using Command Prompt

     - On Local Machine Make Your Project Folder a Zip File
     - Copy Zip File from Mac to Linux Remote Server
       - **Syntax:**
         ```sh
         scp -P Remote_Server_Port Source_File_Path Destination_Path
         ```
       - **Example:**
         ```sh
         scp -P 1034 miniblog.zip raj@216.32.44.12:
         ```
     - Copied Successfully
     - Get Access to Remote Server via SSH
       - **Syntax:**
         ```sh
         ssh -p PORT USERNAME@HOSTIP
         ```
       - **Example:**
         ```sh
         ssh -p 1034 raj@216.32.44.12
         ```
     - Install Unzip into Ubuntu
       ```sh
       sudo apt-get install unzip
       ```
     - Unzip the Copied Project Zip File

       - **Syntax:**

         ```sh
         unzip zip_file_name
         ```

       - **Example:**

         ```sh
         unzip miniblog.zip
         ```

  2. Using Github

     - Open Project on VS Code then add .gitignore file (If needed)
     - Push your Project to Your Github Account as Private Repo
     - Make Connection between Remote Server and Github Repo via SSH Key
     - Generate SSH Keys
       - **Syntax:**
         ```sh
         ssh-keygen -t ed25519 -C "your_email@example.com"
         ```
     - If Permission Denied then Own .ssh then try again to Generate SSH Keys
       - **Syntax:**
         ```sh
         sudo chown -R user_name .ssh
         ```
       - **Example:**
         ```sh
         sudo chown -R raj .ssh
         ```
     - Open Public SSH Keys then copy the key
       ```sh
       cat ~/.ssh/id_ed25519.pub
       ```
     - Go to Your Github Repo
     - Click on Settings Tab
     - Click on Deploy Keys option from sidebar
     - Click on Add Deploy Key Button and Paste Remote Server's Copied SSH Public Key then Click on Add Key
     - Clone Project from your github Repo using SSH Path It requires to setup SSH Key on Github

       - **Syntax**

         ```sh
         git clone ssh_repo_path
         ```

       - **Example**

         ```sh
         git clone git@github.com:geekyshow1/miniblog.git
         ```

- Create Virtual Host File

  - **Syntax:**

    ```sh
    sudo nano /etc/nginx/sites-available/your_domain
    ```

  - **Example:**

    ```sh
    sudo nano /etc/nginx/sites-available/sonamkumari.com
    ```

- Write following Code in Virtual Host File

  ```sh
  server {

          root /var/www/installsat.fun;
          #index index.html index.htm index.php index.nginx-debian.html;

          server_name installsat.fun www.installsat.fun;

          location / {
                  #try_files $uri $uri/ =404;

                  proxy_pass http://localhost:3000;
                  proxy_http_version 1.1;
                  proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection 'upgrade';
                  proxy_set_header Host $host;
                  proxy_cache_bypass $http_upgrade;
          }

          location ^~/tvefir {
                  index index.php;
                  auth_basic "Admin Login";
                  auth_basic_user_file /etc/nginx/pma_pass;

                  location ~ \.php$ {
                          include snippets/fastcgi-php.conf;
                          fastcgi_pass unix:/var/run/php/php-fpm.sock;
                  }
          }

          location ~ /\.ht {
                  deny all;
          }

          listen [::]:443 ssl ipv6only=on; # managed by Certbot
          listen 443 ssl; # managed by Certbot
          ssl_certificate /etc/letsencrypt/live/installsat.fun/fullchain.pem; # managed by Certbot
          ssl_certificate_key /etc/letsencrypt/live/installsat.fun/privkey.pem; # managed by Certbot
          include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
          ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
          }
  server {
      if ($host = www.installsat.fun) {
          return 301 https://$host$request_uri;
      } # managed by Certbot


      if ($host = installsat.fun) {
          return 301 https://$host$request_uri;
      } # managed by Certbot


          listen 80;
          listen [::]:80;

          server_name installsat.fun www.installsat.fun;
      return 404; # managed by Certbot

  }
  ```

- Enable Virtual Host or Create Symbolic Link of Virtual Host File

  - **Syntax:**

    ```sh
    sudo ln -s /etc/nginx/sites-available/virtual_host_file /etc/nginx/sites-enabled/virtual_host_file
    ```

  - **Example:**

    ```sh
    sudo ln -s /etc/nginx/sites-available/sonamkumari.com /etc/nginx/sites-enabled/sonamkumari.com
    ```

- Check Configuration is Correct or Not

  ```sh
  sudo nginx -t
  ```

- Install Dependencies

  ```sh
  cd ~/project_folder_name
  yarn
  ```

  ```sh
  cd ~/project_folder_name
  npm install
  ```

- Create Production Build
  ```sh
  yarn build
  ```
  ```sh
  npm run build
  ```

## PM2

- Create pm2 config File inside project folder
  ```sh
  nano ecosystem.config.js
  ```
- Write below code in ecosystem.config.js file
  ```sh
  module.exports = {
  apps : [
      {
          name: "installsat",
          script: "npm start",
          port: 3000
      }
  ]
  }
  ```
- Restart Nginx

  ```sh
  sudo service nginx restart
  ```

- Start NextJS Application using pm2

  ```sh
  pm2 start ecosystem.config.js
  ```

- Save PM2 Process

  ```sh
  pm2 save
  ```

- Check PM2 Status

  ```sh
  pm2 status
  ```

- Now you can make some changes in your project local development VS Code and Pull it on Remote Server (Only if you have used Github)
- Pull the changes from github repo

  ```sh
  git pull
  ```

  - Create Production Build

  ```sh
  yarn build
  ```

  ```sh
  npm run build
  ```

- Reload using PM2

  ```sh
  pm2 reload app_name/id
  ```

  **Example:**

  ```sh
  pm2 reload 0
  ```

##

## How to Automate NextJS Project Deployment using Github Action

- On Your Local Machine, Open Your Project using VS Code or any Editor
- Create A Folder named .scripts inside your root project folder e.g. .scripts
- Inside .scripts folder Create A file with .sh extension e.g. .scripts/deploy.sh
- Write below script inside the created .sh file

  ```sh
  #!/bin/bash
  set -e

  echo "Deployment started..."

  # Pull the latest version of the app
  git pull origin main
  echo "New changes copied to server !"

  echo "Installing Dependencies..."
  yarn

  echo "Creating Production Build..."
  yarn build

  echo "PM2 Reload"
  pm2 reload 0

  echo "Deployment Finished!"
  ```

- Set File Permission for .sh File

  ```sh
  git update-index --add --chmod=+x .scripts/deploy.sh
  ```

- Create Directory Path named .github/workflows inside your root project folder e.g. .github/workflows
- Inside workflows folder Create A file with .yml extension e.g. .github/workflows/deploy.yml
- Write below script inside the created .yml file

  ```sh
  name: Deploy

  # Trigger the workflow on push and
  # pull request events on the master branch
  on:
  push:
      branches: ["main"]
  pull_request:
      branches: ["main"]

  # Authenticate to the the server via ssh
  # and run our deployment script
  jobs:
  deploy:
      runs-on: ubuntu-latest
      steps:
      - uses: actions/checkout@v4
      - name: Deploy to Server
          uses: appleboy/ssh-action@master
          with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          port: ${{ secrets.PORT }}
          key: ${{ secrets.SSHKEY }}
          script: "cd ~/installsat && ./.scripts/deploy.sh"
  ```

- Go to Your Github Repo Click on Settings
- Click on Secrets and Variables from the Sidebar then choose Actions
- On Secret Tab, Click on New Repository Secret
- Add Four Secrets HOST, PORT, USERNAME and SSHKEY as below

  ```sh
  Name: HOST
  Secret: Your_Server_IP
  ```

  ```sh
  Name: PORT
  Secret: Your_Server_PORT
  ```

  ```sh
  Name: USERNAME
  Secret: Your_Server_User_Name
  ```

- You can get Server User Name by loging into your server via ssh then run below command

  ```sh
  whoami
  ```

- Generate SSH Key for Github Action by Login into Remote Server then run below Command

  ```sh
  cd ~/.ssh
  ```

  - **Syntax:**

    ```sh
    ssh-keygen -f key_path -t ed25519 -C "your_email@example.com"
    ```

  - **Example:**

    ```sh
    ssh-keygen -f gitaction_ed25519 -t ed25519 -C "gitactionautodep"
    ```

- Open Newly Created Public SSH Keys then copy the key

  ```sh
  cat ~/.ssh/gitaction_ed25519.pub
  ```

- Open authorized_keys File which is inside .ssh/authroized_keys then paste the copied key in a new line

  ```sh
  cd .ssh
  nano authorized_keys
  ```

- Open Newly Created Private SSH Keys then copy the key, we will use this key to add New Repository Secret On Github Repo

  ```sh
  cat ~/.ssh/gitaction_ed25519
  ```

  ```sh
  Name: SSHKEY
  Secret: Private_SSH_KEY_Generated_On_Server
  ```

- Commit and Push the change to Your Github Repo
- Get Access to Remote Server via SSH

  - **Syntax:**

    ```sh
    ssh -p PORT USERNAME@HOSTIP
    ```

  - **Example:**

    ```sh
    ssh -p 22 raj@216.32.44.12
    ```

- [Github actions err: bash: line 3: npm: command not found](https://stackoverflow.com/a/67923563/22835451)

  ```sh
  sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
  sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"
  sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/pm2" "/usr/local/bin/pm2"
  sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/yarn" "/usr/local/bin/yarn"
  ```

  ```sh
  cd /usr/local/bin
  ls -l
  ```

- Pull the changes from github just once this time.

  ```sh
  cd ~/project_folder_name
  git pull
  ```

- Git Actions Error: bash: line 1: ./.scripts/deploy.sh: Permission denied

  ```sh
  cd ~/installsat
  rm -rf .scripts
  ```

  ```sh
  git pull
  ```

  ```sh
  chmod +x .scripts/deploy.sh
  ```

- Your Deployment should become automate.
- On Local Machine make some changes in Your Project then Commit and Push to Github Repo It will automatically deployed on Live Server
- You can track your action from Github Actions Tab
- If you get any File Permission error in the action then you have to change file permission accordingly.
- All Done
