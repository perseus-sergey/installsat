# 🐞 ERRORS BUGS PROBLEMS

## ---=== CLIENT ===---

### [🔗 Jest Testing Set Up](https://nextjs.org/docs/pages/building-your-application/testing/jest)

- [🔗 First, we'll uninstall jest-dom and install a 4.x version:](https://github.com/testing-library/jest-dom/issues/546#issuecomment-1939151181)

  ```sh
  yarn remove @testing-library/jest-dom
  yarn add -D @testing-library/jest-dom@^4.2.4
  ```

- Then, add this to src/setupTests.ts:

  ```sh
  import '@testing-library/jest-dom/extend-expect';
  ```

- Add to "compilerOptions" section:

  ```sh
  "types": ["node", "jest"],
  ```

- Then:

  ```sh
  yarn add -D @types/jest
  ```

- CMD + SHIFT + P:

```
TypeScript: Restart TS Server
```

- If it's need remove node-modules adn yarn.lock
  Then:

  ```sh
  yarn
  ```

- Add scripts to package.jsone

  ```sh
  "test": "jest",
  "test:watch": "jest --watchAll"
  ```

---

## ---=== DEPLOY ===---

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

---

## [Github actions error: Your local changes to the following files would be overwritten by merge:

err: yarn.lock
err: Please commit your changes or stash them before you merge.

### --== Solution ==--

- ssh -> remoto server

  ```sh
  cd project-folder
  ```

  ```sh
  rm yarn.lock
  ```

- Try deploy again.

---
